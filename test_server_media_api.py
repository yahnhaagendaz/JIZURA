import urllib.request
import urllib.parse
import json
import os
import shutil

import sys
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

BASE = "http://127.0.0.1:8520"
TEST_PID = "test_media_sandbox"

print("[TEST] Testing Server Media API on", BASE, "with sandbox project:", TEST_PID)

try:
    # 1. Test uploading mock MP4 audio payload
    mock_payload = b"ftypisom" + b"\x00" * 300 # dummy audio bytes > 100 bytes
    upload_url = f"{BASE}/api/upload_audio?id={TEST_PID}&filename=screen_recording.mp4"
    req = urllib.request.Request(upload_url, data=mock_payload, headers={'Content-Type': 'application/octet-stream'})

    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode('utf-8'))
        print("✔ Upload MP4 response:", data)
        assert data.get('ok') is True
        assert data.get('filename') == 'audio.mp4'

    # 2. Test GET /api/audio?id=test_media_sandbox
    audio_url = f"{BASE}/api/audio?id={TEST_PID}"
    with urllib.request.urlopen(audio_url) as resp:
        content_type = resp.headers.get('Content-Type')
        content_length = resp.headers.get('Content-Length')
        print(f"✔ GET /api/audio response: status={resp.status}, Content-Type={content_type}, length={content_length}")
        assert resp.status == 200
        assert 'video/mp4' in content_type or 'audio/' in content_type

    print("🎉 Server Media API Test Passed Successfully!")
finally:
    # Cleanup sandbox directory
    sandbox_dir = os.path.join(os.path.dirname(__file__), '..', 'projects', TEST_PID)
    if os.path.exists(sandbox_dir):
        shutil.rmtree(sandbox_dir, ignore_errors=True)
        print("✔ Cleaned up sandbox directory:", sandbox_dir)
