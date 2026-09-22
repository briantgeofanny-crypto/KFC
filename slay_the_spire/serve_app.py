#!/usr/bin/env python3
"""
============================================================================
SHADOWSPIRE: CHRONICLES OF ASCENSION - APP LAUNCHER & LOCAL SERVER
============================================================================
Menjalankan local HTTP server dengan dukungan Service Worker, PWA caching,
serta membuka game secara otomatis dalam 'App Mode' (tanpa tab/address bar).
Dapat diakses juga dari HP Android / iPhone yang berada di jaringan Wi-Fi sama!
"""

import http.server
import os
import socket
import socketserver
import subprocess
import sys
import threading
import time
import webbrowser

PORT_START = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

def get_local_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(('8.8.8.8', 80))
        ip = s.getsockname()[0]
    except Exception:
        ip = '127.0.0.1'
    finally:
        s.close()
    return ip

def find_free_port(start_port):
    port = start_port
    while port < start_port + 100:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
            if sock.connect_ex(('127.0.0.1', port)) != 0:
                return port
        port += 1
    return start_port

class SpireHTTPHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        # Header untuk mengizinkan Service Worker dan PWA
        self.send_header('Cache-Control', 'no-cache')
        self.send_header('Service-Worker-Allowed', '/')
        super().end_headers()

    extensions_map = http.server.SimpleHTTPRequestHandler.extensions_map.copy()
    extensions_map.update({
        '.js': 'application/javascript; charset=utf-8',
        '.json': 'application/json; charset=utf-8',
        '.webmanifest': 'application/manifest+json; charset=utf-8',
        '.css': 'text/css; charset=utf-8',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.ico': 'image/x-icon',
        '.svg': 'image/svg+xml'
    })

    def log_message(self, format, *args):
        # Hanya log jika bukan static asset ringan agar konsol tetap bersih
        msg = format % args
        if 'GET /icons/' not in msg:
            sys.stdout.write(f"[HTTP] {msg}\n")

def launch_app_window(url):
    time.sleep(0.7)  # Tunggu server siap
    
    # Coba jalankan Edge dalam App Mode (native look & feel)
    edge_paths = [
        os.path.expandvars(r"%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe"),
        os.path.expandvars(r"%ProgramFiles%\Microsoft\Edge\Application\msedge.exe"),
        r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
        r"C:\Program Files\Microsoft\Edge\Application\msedge.exe"
    ]

    chrome_paths = [
        os.path.expandvars(r"%ProgramFiles%\Google\Chrome\Application\chrome.exe"),
        os.path.expandvars(r"%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"),
        os.path.expandvars(r"%LocalAppData%\Google\Chrome\Application\chrome.exe")
    ]

    for p in edge_paths:
        if os.path.exists(p):
            try:
                subprocess.Popen([p, f"--app={url}"])
                print(">> Game dibuka di Microsoft Edge (Standalone App Mode)")
                return
            except Exception:
                pass

    for p in chrome_paths:
        if os.path.exists(p):
            try:
                subprocess.Popen([p, f"--app={url}"])
                print(">> Game dibuka di Google Chrome (Standalone App Mode)")
                return
            except Exception:
                pass

    # Fallback ke browser default
    webbrowser.open(url)
    print(">> Game dibuka di Browser Default")

def main():
    os.chdir(DIRECTORY)
    port = find_free_port(PORT_START)
    local_ip = get_local_ip()
    local_url = f"http://localhost:{port}/index.html"
    network_url = f"http://{local_ip}:{port}/index.html"

    print("=" * 65)
    print("      SHADOWSPIRE: CHRONICLES OF ASCENSION - APP LAUNCHER")
    print("=" * 65)
    print(f" [PC Local]     : {local_url}")
    print(f" [HP / Wi-Fi]   : {network_url}")
    print("-" * 65)
    print(" * Untuk bermain di PC: Game otomatis terbuka di jendela mandiri.")
    print(" * Untuk bermain di HP: Buka alamat [HP / Wi-Fi] di browser HP,")
    print("   lalu ketuk 'Pasang Aplikasi' / 'Tambah ke Layar Utama'.")
    print(" * Tekan Ctrl+C di terminal ini untuk menutup server game.")
    print("=" * 65)

    # Thread pembuka jendela aplikasi
    threading.Thread(target=launch_app_window, args=(local_url,), daemon=True).start()

    with socketserver.TCPServer(("", port), SpireHTTPHandler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n[INFO] Server ShadowSpire dimatikan. Sampai jumpa!")

if __name__ == '__main__':
    main()
