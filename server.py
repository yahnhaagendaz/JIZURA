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
        if not title:
            try:
                with open(pjson, 'r', encoding='utf-8') as f:
                    pj = json.load(f)
                    title = pj.get('title', name)
                    artist = pj.get('artist', '')
                    bpm = pj.get('timing', {}).get('bpm', 0)
            except Exception:
                title = name
        projects.append({
            'id': name,
            'title': title or name,
            'artist': artist or '',
            'bpm': bpm or 0,
            'active': (name == active_id),
            'hasAudio': os.path.exists(os.path.join(pdir, 'audio.mp3'))
        })
    return projects

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
            return os.path.normpath(os.path.join(PROJECTS_DIR, rel))
        if clean_path == '/api/audio':
            qs = urllib.parse.parse_qs(parsed.query)
            pid = qs.get('id', [get_active_project_id()])[0]
            audio_path = os.path.join(PROJECTS_DIR, pid, 'audio.mp3')
            if os.path.exists(audio_path):
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
            audio_path = os.path.join(PROJECTS_DIR, pid, 'audio.mp3')
            if not os.path.exists(audio_path):
                self.send_response(404)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.end_headers()
                self.wfile.write(json.dumps({'error': 'Audio file missing', 'projectId': pid}).encode('utf-8'))
                return

        return super().do_GET()

    def do_POST(self):
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
            if new_id:
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
            if body:
                proj_dir = os.path.join(PROJECTS_DIR, pid)
                os.makedirs(proj_dir, exist_ok=True)
                proj_file = os.path.join(proj_dir, 'project.json')
                with open(proj_file, 'wb') as f:
                    f.write(body)
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
            if body and len(body) > 100:
                proj_dir = os.path.join(PROJECTS_DIR, pid)
                os.makedirs(proj_dir, exist_ok=True)
                audio_path = os.path.join(proj_dir, 'audio.mp3')
                with open(audio_path, 'wb') as f:
                    f.write(body)
                resp = json.dumps({'ok': True, 'projectId': pid, 'size': len(body)}).encode('utf-8')
                self.send_response(200)
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
            threading.Thread(target=open_browser, args=(target_url,), daemon=True).start()
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n[JIZURA] 本地服务已安全停止。")
    except Exception as e:
        print(f"[JIZURA 错误] 启动服务失败: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()
