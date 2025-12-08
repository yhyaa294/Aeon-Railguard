#!/usr/bin/env python3
"""
AEON RAILGUARD - AI ENGINE (THE EYE)
Headless object detection service that sends alerts to Central Brain.
Triggers alert when person/car detected in ROI for > 2 seconds.
"""

import cv2
import time
import argparse
import requests
from modules.detector import RailDetector
from modules.image_enhancer import ImageEnhancer

BRAIN_URL = "http://localhost:8080/api/incident"
DANGER_CLASSES = ["person", "car", "truck", "motorcycle", "bus", "bicycle"]
DETECTION_THRESHOLD_SECONDS = 2.0

class AIEngine:
    def __init__(self, source: str, conf_threshold: float = 0.45, enable_clahe: bool = False):
        self.source = source
        self.conf_threshold = conf_threshold
        self.enable_clahe = enable_clahe
        self.detector = RailDetector()
        
        # Detection timing
        self.detection_start_time = None
        self.last_alert_time = 0
        self.alert_cooldown = 5.0
        self.is_object_in_roi = False
        self.detected_class = None
        
    def send_incident(self, object_class: str, confidence: float):
        """Send incident data to Central Brain via HTTP POST."""
        current_time = time.time()
        
        if current_time - self.last_alert_time < self.alert_cooldown:
            return False
            
        payload = {
            "type": "OBSTACLE_DETECTED",
            "object_class": object_class,
            "confidence": confidence,
            "in_roi": True
        }
        
        try:
            response = requests.post(BRAIN_URL, json=payload, timeout=2)
            if response.status_code == 201:
                print("")
                print("=" * 50)
                print("🚨 DANGER DETECTED - ALERT SENT")
                print(f"🎯 Object: {object_class.upper()}")
                print(f"📡 Brain Response: HTTP 201 OK")
                print("=" * 50)
                print("")
                self.last_alert_time = current_time
                return True
            else:
                print(f"[ALERT ERR] Brain returned status {response.status_code}")
                return False
        except requests.exceptions.ConnectionError:
            print("[ALERT ERR] Cannot connect to Central Brain - is it running?")
            return False
        except requests.exceptions.RequestException as e:
            print(f"[ALERT ERR] Request failed: {e}")
            return False

    def run(self):
        """Main detection loop with 2-second trigger."""
        print("")
        print("=" * 50)
        print("  AEON RAILGUARD - THE EYE (AI ENGINE)")
        print("  Smart City Object Detection System")
        print("=" * 50)
        print(f"  Source: {self.source}")
        print(f"  Confidence: {self.conf_threshold}")
        print(f"  CLAHE: {'ON' if self.enable_clahe else 'OFF'}")
        print(f"  Brain URL: {BRAIN_URL}")
        print(f"  Trigger: {DETECTION_THRESHOLD_SECONDS}s detection")
        print("=" * 50)
        print("")
        
        # Open video source
        if self.source.isdigit():
            cap = cv2.VideoCapture(int(self.source))
        else:
            cap = cv2.VideoCapture(self.source)
        
        if not cap.isOpened():
            print(f"[ERROR] Cannot open video source: {self.source}")
            return
        
        print("[AI-ENGINE] Video stream opened. Press 'q' to quit, 't' for test alert")
        print("-" * 50)
        
        frame_count = 0
        fps_start_time = time.time()
        
        try:
            while True:
                ret, frame = cap.read()
                if not ret:
                    if not self.source.isdigit():
                        # Loop video for demo
                        cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
                        continue
                    else:
                        print("[AI-ENGINE] Stream ended")
                        break
                
                # Apply CLAHE if enabled
                if self.enable_clahe:
                    frame = ImageEnhancer.apply_clahe(frame)
                
                # Run detection
                result = self.detector.process_frame(frame, self.conf_threshold)
                
                # Track objects in ROI over time
                current_time = time.time()
                
                if result.detections_in_roi > 0:
                    if not self.is_object_in_roi:
                        # Object just entered ROI
                        self.detection_start_time = current_time
                        self.is_object_in_roi = True
                        self.detected_class = "obstacle"
                        print(f"[DETECT] Object entered ROI - starting {DETECTION_THRESHOLD_SECONDS}s timer...")
                    else:
                        # Object still in ROI - check duration
                        detection_duration = current_time - self.detection_start_time
                        
                        if detection_duration >= DETECTION_THRESHOLD_SECONDS:
                            # Trigger alert!
                            if self.send_incident(self.detected_class, self.conf_threshold):
                                # Reset timer after successful alert
                                self.detection_start_time = current_time
                else:
                    if self.is_object_in_roi:
                        print("[DETECT] Object left ROI - timer reset")
                    self.is_object_in_roi = False
                    self.detection_start_time = None
                    self.detected_class = None
                
                # FPS and status display
                frame_count += 1
                if frame_count % 30 == 0:
                    elapsed = current_time - fps_start_time
                    fps = frame_count / elapsed if elapsed > 0 else 0
                    
                    status = "🔴 DANGER" if result.is_danger else "🟢 SAFE"
                    timer_info = ""
                    if self.detection_start_time:
                        remaining = DETECTION_THRESHOLD_SECONDS - (current_time - self.detection_start_time)
                        if remaining > 0:
                            timer_info = f" | Timer: {remaining:.1f}s"
                    
                    print(f"[STATUS] FPS: {fps:.1f} | ROI: {result.detections_in_roi} | {status}{timer_info}")
                
                # Draw timer on frame if detecting
                if self.detection_start_time:
                    duration = current_time - self.detection_start_time
                    remaining = max(0, DETECTION_THRESHOLD_SECONDS - duration)
                    
                    color = (0, 0, 255) if remaining < 0.5 else (0, 165, 255)
                    cv2.putText(
                        result.frame, 
                        f"ALERT IN: {remaining:.1f}s", 
                        (10, 30), 
                        cv2.FONT_HERSHEY_SIMPLEX, 
                        0.8, 
                        color, 
                        2
                    )
                
                # Show frame
                cv2.imshow("AEON RAILGUARD - THE EYE", result.frame)
                
                # Handle keyboard input
                key = cv2.waitKey(1) & 0xFF
                if key == ord('q'):
                    print("\n[AI-ENGINE] Quit signal received")
                    break
                elif key == ord('t'):
                    print("\n[TEST] Sending manual test alert...")
                    self.send_incident("test_object", 0.99)
                elif key == ord('r'):
                    # Reset detection timer
                    self.detection_start_time = None
                    self.is_object_in_roi = False
                    print("[AI-ENGINE] Detection timer reset")
                    
        except KeyboardInterrupt:
            print("\n[AI-ENGINE] Interrupted by user")
        finally:
            cap.release()
            cv2.destroyAllWindows()
            print("[AI-ENGINE] Shutdown complete")


def main():
    parser = argparse.ArgumentParser(
        description="AEON RAILGUARD AI Engine - Smart City Object Detection",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python app.py                      # Use webcam
  python app.py -s video.mp4         # Use video file
  python app.py -s 0 -c 0.5 --clahe  # Webcam with options
  
Controls:
  q - Quit
  t - Send test alert
  r - Reset detection timer
        """
    )
    parser.add_argument(
        "--source", "-s",
        type=str,
        default="0",
        help="Video source: 0 for webcam, or path to video file"
    )
    parser.add_argument(
        "--confidence", "-c",
        type=float,
        default=0.45,
        help="Detection confidence threshold (0.0-1.0)"
    )
    parser.add_argument(
        "--clahe",
        action="store_true",
        help="Enable CLAHE image enhancement"
    )
    parser.add_argument(
        "--brain-url",
        type=str,
        default="http://localhost:8080/api/incident",
        help="Central Brain incident endpoint URL"
    )
    
    args = parser.parse_args()
    
    global BRAIN_URL
    BRAIN_URL = args.brain_url
    
    engine = AIEngine(
        source=args.source,
        conf_threshold=args.confidence,
        enable_clahe=args.clahe
    )
    engine.run()


if __name__ == "__main__":
    main()
