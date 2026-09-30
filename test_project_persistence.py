"""Real HTTP tests, using a temporary project root; never touch user projects."""
import concurrent.futures
import http.server
import importlib.util
import json
from pathlib import Path
import tempfile
import threading
import unittest
import urllib.error
import urllib.request

spec = importlib.util.spec_from_file_location('jizura_server', Path(__file__).with_name('server.py'))
server = importlib.util.module_from_spec(spec)
spec.loader.exec_module(server)

class PersistenceTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.temp = tempfile.TemporaryDirectory(prefix='jizura-http-')
        server.PROJECTS_DIR = cls.temp.name
        cls.http = http.server.ThreadingHTTPServer(('127.0.0.1',0),server.JizuraRequestHandler)
        cls.base = 'http://127.0.0.1:'+str(cls.http.server_port)
        threading.Thread(target=cls.http.serve_forever,daemon=True).start()
    @classmethod
    def tearDownClass(cls):
        cls.http.shutdown(); cls.http.server_close(); cls.temp.cleanup()
    def request(self,path,data=None,raw=None):
        body = raw if raw is not None else json.dumps(data).encode() if data is not None else None
        req = urllib.request.Request(self.base+path,data=body,headers={'Content-Type':'application/json'})
        with urllib.request.urlopen(req) as r: return r.status,r.read()
    def project(self,pid,title='Test'):
        return {'id':pid,'title':title,'artist':'Artist','lyrics':'[00:00.00]Test','timing':{'bpm':120},'overrides':{'0':{'cuts':{'0':{'enter':'spin','lock':True}}}}}
    def test_save_reload_metadata_and_backups(self):
        p=self.project('roundtrip');self.request('/api/project?id=roundtrip',p)
        p['title']='Updated';self.request('/api/project?id=roundtrip',p)
        self.assertEqual(json.loads(self.request('/api/project?id=roundtrip')[1]),p)
        root=Path(server.PROJECTS_DIR)/'roundtrip'
        self.assertEqual(json.loads((root/'project.json.bak.1').read_text())['title'],'Test')
        self.assertEqual(json.loads((root/'meta.json').read_text())['title'],'Updated')
        (root/'meta.json').write_text(json.dumps({'title':'Stale title','bpm':10}))
        listed = next(item for item in server.list_projects() if item['id']=='roundtrip')
        self.assertEqual(listed['title'],'Updated')
        self.assertEqual(listed['bpm'],120)
    def test_reject_wrong_project_and_invalid_json_without_damage(self):
        p=self.project('safe');self.request('/api/project?id=safe',p)
        for payload in [b'{invalid',json.dumps(self.project('different')).encode(),b'[]']:
            with self.assertRaises(urllib.error.HTTPError) as cm: self.request('/api/project?id=safe',raw=payload)
            self.assertEqual(cm.exception.code,400)
        self.assertEqual(json.loads(self.request('/api/project?id=safe')[1]),p)
    def test_save_as_copies_bound_mp4_and_prevents_overwrite(self):
        p=self.project('media');p['audioMeta']={'file':'audio.mp4'}
        self.request('/api/project?id=media',p)
        media=Path(server.PROJECTS_DIR)/'media'/'audio.mp4';media.write_bytes(b'fixture-mp4')
        payload={'fromId':'media','newId':'media_copy','title':'Copy','project':p,'copyAudio':True}
        self.request('/api/save_as',payload)
        target=Path(server.PROJECTS_DIR)/'media_copy'
        self.assertEqual((target/'audio.mp4').read_bytes(),media.read_bytes())
        self.assertEqual(json.loads((target/'project.json').read_text())['id'],'media_copy')
        with self.assertRaises(urllib.error.HTTPError) as cm:self.request('/api/save_as',payload)
        self.assertEqual(cm.exception.code,409)
        self.assertEqual(json.loads((target/'project.json').read_text())['title'],'Copy')
    def test_concurrent_saves_leave_valid_project_and_five_backups(self):
        self.request('/api/project?id=parallel',self.project('parallel'))
        with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
            list(pool.map(lambda n:self.request('/api/project?id=parallel',self.project('parallel',str(n))),range(12)))
        root=Path(server.PROJECTS_DIR)/'parallel'
        for p in [root/'project.json',*root.glob('*.bak.*')]:self.assertEqual(json.loads(p.read_text())['id'],'parallel')
        self.assertEqual(len(list(root.glob('*.bak.*'))),5)
    def test_unknown_active_id_is_rejected(self):
        with self.assertRaises(urllib.error.HTTPError) as cm:self.request('/api/active?id=does_not_exist',{})
        self.assertEqual(cm.exception.code,400)

if __name__=='__main__':unittest.main(verbosity=2)
