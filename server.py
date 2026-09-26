#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
JIZURA 字面 — 本地 Python 极速 Web 服务器
支持 WebCodecs 高性能硬件编码 (COOP/COEP 跨域隔离安全头)
自动打开默认浏览器，优雅处理端口冲突与快速重载
"""
import http.server
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

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path in ('', '/'):
            self.path = '/index.html'
        elif parsed.path == '/favicon.ico':
            self.send_response(204)
            self.end_headers()
            return
        return super().do_GET()

    def log_message(self, format, *args):
        # 仅在非静态资源或发生错误时输出详细日志，保持控制台整洁
        if len(args) > 1 and str(args[1]) not in ('200', '304'):
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

    # 允许多线程与地址复用
    socketserver.TCPServer.allow_reuse_address = True
    server_class = getattr(http.server, 'ThreadingHTTPServer', socketserver.ThreadingTCPServer)
    
    try:
        with server_class((HOST, PORT), JizuraRequestHandler) as httpd:
            print("=" * 67)
            print(f"  JIZURA 字面 — 文字PV动力学引擎 (中日双语版)")
            print(f"  本地极速服务已启动: {target_url}")
            print(f"  正在打开浏览器，请勿关闭此窗口（关闭即停止服务）")
            print("=" * 67)
            
            # 异步打开浏览器
            threading.Thread(target=open_browser, args=(target_url,), daemon=True).start()
            
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n[JIZURA] 本地服务已安全停止。")
    except Exception as e:
        print(f"[JIZURA 错误] 启动服务失败: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()
