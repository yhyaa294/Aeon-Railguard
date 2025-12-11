#!/usr/bin/env python3
"""
Multi-Source AI Engine Runner
Runs multiple AI Engine instances for different sources simultaneously
"""

import subprocess
import sys
import os
import signal
import time

# Configuration for 4 sources
SOURCES = [
    {
        "id": "cam1",
        "source": "0",  # Webcam
        "camera_id": "TITIK_A",
        "stream_url": "http://localhost:8080/api/internal/stream/cam1",
    },
    {
        "id": "cam2",
        "source": "datasets/sorted_data/IMG_20251207_143825040.jpg",
        "camera_id": "TITIK_B",
        "stream_url": "http://localhost:8080/api/internal/stream/cam2",
    },
    {
        "id": "cam3",
        "source": "datasets/sorted_data/IMG_20251207_143034721.jpg",
        "camera_id": "TITIK_C",
        "stream_url": "http://localhost:8080/api/internal/stream/cam3",
    },
    {
        "id": "cam4",
        "source": "datasets/videos/VID_20251207_142949636.mp4",
        "camera_id": "TITIK_D",
        "stream_url": "http://localhost:8080/api/internal/stream/cam4",
    },
]

processes = []

def signal_handler(sig, frame):
    """Handle Ctrl+C gracefully"""
    print("\n[SHUTDOWN] Stopping all AI Engine instances...")
    for proc in processes:
        if proc.poll() is None:  # Still running
            proc.terminate()
    time.sleep(2)
    for proc in processes:
        if proc.poll() is None:  # Still running
            proc.kill()
    sys.exit(0)

def main():
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)
    
    print("=" * 60)
    print("AEON RAILGUARD - Multi-Source AI Engine")
    print("=" * 60)
    print(f"Starting {len(SOURCES)} AI Engine instances...\n")
    
    for config in SOURCES:
        print(f"[{config['id'].upper()}] Starting AI Engine")
        print(f"  Source: {config['source']}")
        print(f"  Camera ID: {config['camera_id']}")
        print(f"  Stream URL: {config['stream_url']}")
        
        # Set environment variables for this instance
        env = os.environ.copy()
        env["STREAM_URL"] = config["stream_url"]
        env["CAMERA_ID"] = config["camera_id"]
        
        # Start AI Engine process
        cmd = [sys.executable, "app.py", "--source", config["source"]]
        print(f"  [INFO] Command: {' '.join(cmd)}")
        print(f"  [INFO] Working directory: {os.getcwd()}")
        
        proc = subprocess.Popen(
            cmd,
            env=env,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            bufsize=1,
        )
        
        processes.append(proc)
        print(f"  [OK] Process started (PID: {proc.pid})")
        
        # Start thread to print output in real-time
        def print_output(proc, cam_id):
            try:
                for line in iter(proc.stdout.readline, ''):
                    if line:
                        print(f"[{cam_id.upper()}] {line.rstrip()}")
            except Exception as e:
                print(f"[{cam_id.upper()}] Output thread error: {e}")
        
        import threading
        thread = threading.Thread(target=print_output, args=(proc, config["id"]), daemon=True)
        thread.start()
        print()
        
        # Give process time to start
        time.sleep(1)
    
    print("=" * 60)
    print("All AI Engine instances are running!")
    print("Press Ctrl+C to stop all instances")
    print("=" * 60)
    
    # Monitor processes
    try:
        while True:
            for i, proc in enumerate(processes):
                if proc.poll() is not None:
                    print(f"\n[WARNING] Process {SOURCES[i]['id']} (PID: {proc.pid}) has stopped!")
                    # Optionally restart here
            time.sleep(5)
    except KeyboardInterrupt:
        signal_handler(None, None)

if __name__ == "__main__":
    main()

