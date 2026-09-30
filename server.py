#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
JIZURA 字面 — 本地 Python 极速 Web 服务器
支持 WebCodecs 高性能硬件编码 (COOP/COEP 跨域隔离安全头)
支持工程持久化 (Project Persistence) RESTful API 与多工程无缝切换
"""
import http.server
import json
import os
import re
import shutil
import socket
import socketserver
import sys
import threading
import time
import urllib.parse
import webbrowser

PORT = int(os.environ.get('PORT', 8520))
HOST = '127.0.0.1'
ROOT = os.path.dirname(os.path.abspath(__file__))
PROJECTS_DIR = os.path.abspath(os.path.join(ROOT, '..', 'projects'))
if not os.path.isdir(PROJECTS_DIR):
    PROJECTS_DIR = os.path.abspath(os.path.join(ROOT, 'projects'))

PROJECTS_DIR = os.path.abspath(os.environ.get('JIZURA_PROJECTS_DIR', PROJECTS_DIR))
WRITE_LOCK = threading.RLock()

MIME_MAP = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.mp4': 'video/mp4',
    '.mp3': 'audio/mpeg',
    '.wav': 'audio/wav',
    '.m4a': 'audio/mp4',
    '.flac': 'audio/flac',
    '.aac': 'audio/aac',
    '.ogg': 'audio/ogg',
    '.webm': 'video/webm',
    '.mov': 'video/quicktime',
    '.wasm': 'application/wasm',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.otf': 'font/otf',
}

def get_active_project_id():
    active_file = os.path.join(PROJECTS_DIR, 'active.json')
    if os.path.exists(active_file):
        try:
            with open(active_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
                return data.get('active', '')
        except Exception:
            pass
    if os.path.isdir(PROJECTS_DIR):
        dirs = [d for d in sorted(os.listdir(PROJECTS_DIR)) if os.path.isdir(os.path.join(PROJECTS_DIR, d))]
        if dirs:
            return dirs[0]
    return ''

def set_active_project_id(project_id):
    os.makedirs(PROJECTS_DIR, exist_ok=True)
    active_file = os.path.join(PROJECTS_DIR, 'active.json')
    with open(active_file, 'w', encoding='utf-8') as f:
        json.dump({'active': project_id}, f, ensure_ascii=False, indent=2)

def list_projects():
    projects = []
    active_id = get_active_project_id()
    if not os.path.exists(PROJECTS_DIR):
        return projects
    for name in sorted(os.listdir(PROJECTS_DIR)):
        pdir = os.path.join(PROJECTS_DIR, name)
        if not os.path.isdir(pdir):
            continue
        pjson = os.path.join(pdir, 'project.json')
        pmeta = os.path.join(pdir, 'meta.json')
        if not os.path.exists(pjson):
            continue
        meta = {}
        if os.path.exists(pmeta):
            try:
                with open(pmeta, 'r', encoding='utf-8') as f:
                    meta = json.load(f)
            except Exception:
                pass
        title = meta.get('title')
        artist = meta.get('artist')
        bpm = meta.get('bpm')
        try:
            with open(pjson, 'r', encoding='utf-8') as f:
                pj = json.load(f)
                title = pj.get('title', title or name)
                artist = pj.get('artist', artist or '')
                bpm = pj.get('timing', {}).get('bpm', bpm or 0)
        except Exception:
            title = title or name
        projects.append({
            'id': name,
            'title': title or name,
            'artist': artist or '',
            'bpm': bpm or 0,
            'active': (name == active_id),
            'hasAudio': bool(get_project_audio_path(name))
        })
    return projects

def get_project_audio_path(pid):
    pid = re.sub(r'[^a-zA-Z0-9_\-]', '_', pid) if pid else get_active_project_id()
    proj_dir = os.path.join(PROJECTS_DIR, pid)
    proj_json = os.path.join(proj_dir, 'project.json')
    if os.path.exists(proj_json):
        try:
            with open(proj_json, 'r', encoding='utf-8') as f:
                pj = json.load(f)
                meta_file = (pj.get('audioMeta') or {}).get('file')
                if meta_file:
                    target = os.path.join(proj_dir, meta_file)
                    if os.path.exists(target):
                        return target
        except Exception:
            pass
    for ext in ('.mp3', '.wav', '.m4a', '.flac', '.aac', '.ogg', '.mp4', '.mov', '.webm'):
        p = os.path.join(proj_dir, f'audio{ext}')
        if os.path.exists(p):
            return p
    default_p = os.path.join(proj_dir, 'audio.mp3')
    return default_p if os.path.exists(default_p) else None

class JizuraRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def guess_type(self, path):
        ext = os.path.splitext(path)[1].lower()
        if ext in MIME_MAP:
            return MIME_MAP[ext]
        return super().guess_type(path)

    def end_headers(self):
        # 启用 Chrome / Edge WebCodecs 与 SharedArrayBuffer 必需的跨域隔离策略
        self.send_header('Cross-Origin-Opener-Policy', 'same-origin')
        self.send_header('Cross-Origin-Embedder-Policy', 'require-corp')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def translate_path(self, path):
        parsed = urllib.parse.urlparse(path)
        clean_path = parsed.path
        if clean_path.startswith('/projects/'):
            rel = clean_path[len('/projects/'):].lstrip('/')
            target = os.path.normpath(os.path.join(PROJECTS_DIR, rel))
            if os.path.commonpath([PROJECTS_DIR, target]) == PROJECTS_DIR:
                return target
            return os.path.join(ROOT, '__blocked__')
        if clean_path == '/api/audio':
            qs = urllib.parse.parse_qs(parsed.query)
            pid = qs.get('id', [get_active_project_id()])[0]
            audio_path = get_project_audio_path(pid)
            if audio_path and os.path.exists(audio_path):
                return audio_path
            return os.path.join(ROOT, '__missing_audio__')
        return super().translate_path(path)

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        clean_path = parsed.path
        qs = urllib.parse.parse_qs(parsed.query)

        if clean_path in ('', '/'):
            self.path = '/index.html'
        elif clean_path == '/favicon.ico':
            self.send_response(204)
            self.end_headers()
            return
        elif clean_path == '/api/projects':
            projects = list_projects()
            data = json.dumps(projects, ensure_ascii=False, indent=2).encode('utf-8')
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Content-Length', str(len(data)))
            self.end_headers()
            self.wfile.write(data)
            return
        elif clean_path == '/api/active':
            active_id = get_active_project_id()
            data = json.dumps({'active': active_id}, ensure_ascii=False).encode('utf-8')
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Content-Length', str(len(data)))
            self.end_headers()
            self.wfile.write(data)
            return
        elif clean_path == '/api/project':
            pid = qs.get('id', [get_active_project_id()])[0]
            pid = re.sub(r'[^a-zA-Z0-9_\-]', '_', pid) if pid else get_active_project_id()
            proj_file = os.path.join(PROJECTS_DIR, pid, 'project.json')
            if not os.path.exists(proj_file):
                self.send_response(404)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.end_headers()
                self.wfile.write(b'{"error": "Project not found"}')
                return
            with open(proj_file, 'r', encoding='utf-8') as f:
                proj_data = json.load(f)
            proj_data['id'] = pid
            content = json.dumps(proj_data, ensure_ascii=False, indent=2).encode('utf-8')
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Content-Length', str(len(content)))
            self.end_headers()
            self.wfile.write(content)
            return
        elif clean_path == '/api/audio':
            pid = qs.get('id', [get_active_project_id()])[0]
            audio_path = get_project_audio_path(pid)
            if not audio_path or not os.path.exists(audio_path):
                self.send_response(404)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.end_headers()
                self.wfile.write(json.dumps({'error': 'Audio file missing', 'projectId': pid}).encode('utf-8'))
                return

        return super().do_GET()

    def do_POST(self):
        with WRITE_LOCK:
            self.handle_post()

    def handle_post(self):
        parsed = urllib.parse.urlparse(self.path)
        clean_path = parsed.path
        qs = urllib.parse.parse_qs(parsed.query)

        length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(length) if length > 0 else b''

        if clean_path == '/api/active':
            new_id = qs.get('id', [None])[0]
            if not new_id and body:
                try:
                    new_id = json.loads(body.decode('utf-8')).get('id')
                except Exception:
                    pass
            if new_id and re.fullmatch(r'[a-zA-Z0-9_\-]+', new_id) and os.path.isfile(os.path.join(PROJECTS_DIR,new_id,'project.json')):
                set_active_project_id(new_id)
                resp = json.dumps({'ok': True, 'active': new_id}).encode('utf-8')
                self.send_response(200)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.send_header('Content-Length', str(len(resp)))
                self.end_headers()
                self.wfile.write(resp)
                return
            self.send_response(400)
            self.end_headers()
            return

        elif clean_path == '/api/project':
            pid = qs.get('id', [get_active_project_id()])[0]
            pid = re.sub(r'[^a-zA-Z0-9_\-]', '_', pid) if pid else get_active_project_id()
            if body:
                try:
                    project_data = json.loads(body.decode('utf-8'))
                    if not isinstance(project_data,dict) or not isinstance(project_data.get('lyrics'),str):
                        raise ValueError('Expected a project object with lyrics')
                    if project_data.get('id') and project_data['id'] != pid:
                        raise ValueError('Project ID mismatch; save as a new project instead')
                    project_data['id'] = pid
                    body = json.dumps(project_data,ensure_ascii=False,indent=2).encode('utf-8')
                except (ValueError,UnicodeDecodeError) as err:
                    self.send_error(400,str(err)); return
                proj_dir = os.path.join(PROJECTS_DIR, pid)
                os.makedirs(proj_dir, exist_ok=True)
                proj_file = os.path.join(proj_dir, 'project.json')

                # 滚动历史备份：保留最多 5 份历史快照 (.bak.1 ~ .bak.5)
                if os.path.exists(proj_file):
                    try:
                        for b_idx in range(4, 0, -1):
                            src_bak = os.path.join(proj_dir, f'project.json.bak.{b_idx}')
                            dst_bak = os.path.join(proj_dir, f'project.json.bak.{b_idx + 1}')
                            if os.path.exists(src_bak):
                                shutil.copy2(src_bak, dst_bak)
                        shutil.copy2(proj_file, os.path.join(proj_dir, 'project.json.bak.1'))
                    except Exception as bak_err:
                        sys.stderr.write(f"[BACKUP_WARN] {bak_err}\n")

                # 原子写入：先写入临时文件，再原子替换，防止断电损坏 (附带Windows防锁重试机制)
                tmp_file = os.path.join(proj_dir, 'project.json.tmp')
                with open(tmp_file, 'wb') as f:
                    f.write(body)
                replaced = False
                for attempt in range(4):
                    try:
                        if os.path.exists(proj_file):
                            os.replace(tmp_file, proj_file)
                        else:
                            os.rename(tmp_file, proj_file)
                        replaced = True
                        break
                    except (PermissionError, OSError):
                        time.sleep(0.05)
                if not replaced:
                    shutil.copy2(tmp_file, proj_file)
                    try:
                        os.remove(tmp_file)
                    except Exception:
                        pass

                meta_file = os.path.join(proj_dir,'meta.json')
                try:
                    with open(meta_file,encoding='utf-8') as f: meta = json.load(f)
                except (OSError,ValueError): meta = {}
                meta.update(id=pid,title=project_data.get('title',pid),artist=project_data.get('artist',''),bpm=project_data.get('timing',{}).get('bpm',0))
                with open(meta_file+'.tmp','w',encoding='utf-8') as f: json.dump(meta,f,ensure_ascii=False,indent=2)
                os.replace(meta_file+'.tmp',meta_file)
                resp = json.dumps({'ok': True, 'id': pid, 'size': len(body)}).encode('utf-8')
                self.send_response(200)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.send_header('Content-Length', str(len(resp)))
                self.end_headers()
                self.wfile.write(resp)
                return
            self.send_response(400)
            self.end_headers()
            return

        elif clean_path == '/api/upload_audio':
            pid = qs.get('id', [get_active_project_id()])[0]
            pid = re.sub(r'[^a-zA-Z0-9_\-]', '_', pid) if pid else get_active_project_id()
            filename = qs.get('filename', ['audio.mp3'])[0]
            ext = os.path.splitext(filename)[1].lower()
            if ext not in ('.mp3', '.wav', '.m4a', '.flac', '.aac', '.ogg', '.mp4', '.mov', '.webm'):
                ext = '.mp3'
            if body and len(body) > 100:
                proj_dir = os.path.join(PROJECTS_DIR, pid)
                os.makedirs(proj_dir, exist_ok=True)
                audio_filename = f'audio{ext}'
                audio_path = os.path.join(proj_dir, audio_filename)
                with open(audio_path, 'wb') as f:
                    f.write(body)
                resp = json.dumps({'ok': True, 'projectId': pid, 'filename': audio_filename, 'size': len(body)}).encode('utf-8')
                self.send_response(200)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.send_header('Content-Length', str(len(resp)))
                self.end_headers()
                self.wfile.write(resp)
                return
        elif clean_path in ('/api/save_as', '/api/create_project'):
            if body:
                try:
                    payload = json.loads(body.decode('utf-8'))
                    from_id = payload.get('fromId')
                    new_id = payload.get('newId', '').strip()
                    new_title = payload.get('title', '').strip()
                    new_artist = payload.get('artist', '').strip()
                    copy_audio = payload.get('copyAudio', True)
                    proj_content = payload.get('project')

                    if not new_id:
                        self.send_response(400)
                        self.end_headers()
                        self.wfile.write(b'{"error": "Missing newId"}')
                        return

                    new_id = re.sub(r'[^a-zA-Z0-9_\-]', '_', new_id).lower()
                    new_dir = os.path.join(PROJECTS_DIR, new_id)
                    if os.path.exists(new_dir):
                        self.send_error(409,'Project ID already exists; choose a different ID'); return
                    if from_id and not re.fullmatch(r'[a-zA-Z0-9_\-]+',from_id):
                        self.send_error(400,'Invalid source project ID'); return
                    if not isinstance(proj_content,dict) and not from_id:
                        self.send_error(400,'Missing project'); return
                    os.makedirs(new_dir)

                    if proj_content:
                        if isinstance(proj_content, dict):
                            if new_title:
                                proj_content['title'] = new_title
                            proj_content['id'] = new_id
                            proj_str = json.dumps(proj_content, ensure_ascii=False, indent=2)
                        else:
                            proj_str = str(proj_content)
                        with open(os.path.join(new_dir, 'project.json'), 'w', encoding='utf-8') as f:
                            f.write(proj_str)
                    elif from_id and os.path.exists(os.path.join(PROJECTS_DIR, from_id, 'project.json')):
                        src_pjson = os.path.join(PROJECTS_DIR, from_id, 'project.json')
                        dst_pjson = os.path.join(new_dir, 'project.json')
                        shutil.copy2(src_pjson, dst_pjson)
                        try:
                            with open(dst_pjson, 'r', encoding='utf-8') as f:
                                pj_copied = json.load(f)
                            if new_title:
                                pj_copied['title'] = new_title
                            pj_copied['id'] = new_id
                            with open(dst_pjson, 'w', encoding='utf-8') as f:
                                json.dump(pj_copied, f, ensure_ascii=False, indent=2)
                        except Exception:
                            pass

                    from_audio = get_project_audio_path(from_id) if from_id else None
                    if copy_audio and from_audio and os.path.exists(from_audio):
                        shutil.copy2(from_audio, os.path.join(new_dir, os.path.basename(from_audio)))

                    from_meta = os.path.join(PROJECTS_DIR, from_id, 'meta.json') if from_id else None
                    meta_data = {}
                    if from_meta and os.path.exists(from_meta):
                        try:
                            with open(from_meta, 'r', encoding='utf-8') as f:
                                meta_data = json.load(f)
                        except Exception:
                            pass
                    meta_data['id'] = new_id
                    if new_title:
                        meta_data['title'] = new_title
                    if new_artist:
                        meta_data['artist'] = new_artist
                    with open(os.path.join(new_dir, 'meta.json'), 'w', encoding='utf-8') as f:
                        json.dump(meta_data, f, ensure_ascii=False, indent=2)

                    set_active_project_id(new_id)

                    resp = json.dumps({'ok': True, 'id': new_id, 'title': new_title or new_id}).encode('utf-8')
                    self.send_response(200)
                    self.send_header('Content-Type', 'application/json; charset=utf-8')
                    self.send_header('Content-Length', str(len(resp)))
                    self.end_headers()
                    self.wfile.write(resp)
                    return
                except Exception as err:
                    resp = json.dumps({'error': str(err)}).encode('utf-8')
                    self.send_response(500)
                    self.send_header('Content-Type', 'application/json; charset=utf-8')
                    self.send_header('Content-Length', str(len(resp)))
                    self.end_headers()
                    self.wfile.write(resp)
                    return
            self.send_response(400)
            self.end_headers()
            return

        self.send_response(404)
        self.end_headers()

    def log_message(self, format, *args):
        # 仅在发生错误或特定非200时输出
        if len(args) > 1 and str(args[1]) not in ('200', '204', '206', '304'):
            sys.stderr.write(f"[{self.log_date_time_string()}] {format % args}\n")

def is_port_in_use(host, port):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.settimeout(0.5)
        return s.connect_ex((host, port)) == 0

def open_browser(url):
    time.sleep(0.8)
    try:
        webbrowser.open(url)
    except Exception:
        pass

def main():
    target_url = f"http://localhost:{PORT}/"
    if is_port_in_use(HOST, PORT):
        print("=" * 67)
        print(f"  [提示] JIZURA 本地服务已在 {target_url} 运行中。")
        print(f"  正在自动拉起浏览器，请稍候...")
        print("=" * 67)
        open_browser(target_url)
        return

    socketserver.TCPServer.allow_reuse_address = True
    server_class = getattr(http.server, 'ThreadingHTTPServer', socketserver.ThreadingTCPServer)

    try:
        with server_class((HOST, PORT), JizuraRequestHandler) as httpd:
            print("=" * 67)
            print(f"  JIZURA 字面 — 文字PV动力学引擎 (工程持久化版)")
            print(f"  本地极速服务已启动: {target_url}")
            print(f"  工程目录: {PROJECTS_DIR}")
            print("=" * 67)
            if os.environ.get('JIZURA_NO_BROWSER') != '1':
                threading.Thread(target=open_browser, args=(target_url,), daemon=True).start()
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n[JIZURA] 本地服务已安全停止。")
    except Exception as e:
        print(f"[JIZURA 错误] 启动服务失败: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()
