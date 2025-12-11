#!/usr/bin/env python3
"""
AEON RAILGUARD - AI ENGINE (PHASE 3: ADVANCED LOGIC)
Features:
- YOLOv8 Object Tracking (ByteTrack)
- Polygon ROI Filtering
- Time Persistence Check (> 3.0s) to reduce False Positives
- Evidence capture & alert dispatch
"""

import cv2
import numpy as np
import time
import argparse
import requests
import os
import json
from datetime import datetime
from ultralytics import YOLO

# --- CONFIGURATION (can be overridden by ENV) ---
BRAIN_URL = os.getenv("BRAIN_URL", "http://localhost:8080/api/internal/push")
STREAM_URL = os.getenv("STREAM_URL", "http://localhost:8080/api/internal/stream/cam1")
CAMERA_ID = os.getenv("CAMERA_ID", "TITIK_A")
ENABLE_STREAM = os.getenv("ENABLE_STREAM", "true").lower() != "false"
ALERT_THRESHOLD_SECONDS = 3.0
CONFIDENCE_THRESHOLD = 0.40  # Lower threshold to detect more objects including trains (detected as truck/bus)
# Default ByteTrack config bundled with ultralytics
DEFAULT_TRACKER = "bytetrack.yaml"

# ---------------------------------------------------------
# ⚠️ REPLACE THESE COORDINATES WITH YOUR CUSTOM ZONE ⚠️
# Run 'python tools/get_zone.py' to generate this list.
# ---------------------------------------------------------
DANGER_ZONE = [(350, 200), (850, 200), (1000, 600), (200, 600)]
# ---------------------------------------------------------

class AIEngine:
    def __init__(
        self,
        source: str,
        model_path: str = "yolov8n.pt",
        zone_path: str = "danger_zone.json",
        evidence_dir: str = "evidence",
        tracker_config: str | None = DEFAULT_TRACKER,
        enable_stream: bool = ENABLE_STREAM,
    ):
        self.source = source
        self.enable_display = False
        self.enable_stream = enable_stream
        print(f"[INIT] Loading YOLO model: {model_path}")
        self.model = YOLO(model_path)
        self.tracker_config = tracker_config
        self.zone_path = zone_path
        self.evidence_dir = evidence_dir
        os.makedirs(self.evidence_dir, exist_ok=True)
        self.zone = self._load_zone(zone_path)
        
        # State tracking
        # Dictionary: {track_id: start_time_in_zone}
        self.tracked_objects = {}
        
        # Dictionary: {track_id: last_alert_time} to prevent spam
        self.alert_cooldowns = {}
        self.last_frame_push = 0.0
        # Optimized for smoother streaming (~30 FPS default for low lag). Tune via env FRAME_PUSH_INTERVAL.
        # Lower interval = more FPS = smoother but more bandwidth
        self.frame_push_interval = float(os.getenv("FRAME_PUSH_INTERVAL", "0.033"))
        
        # Danger classes (COCO indices)
        # 0: person, 1: bicycle, 2: car, 3: motorcycle, 5: bus, 7: truck
        # Note: YOLOv8 default doesn't have "train" class, but we detect all vehicles
        self.danger_classes = [0, 1, 2, 3, 5, 7]
        # Use model-provided names for accuracy
        self.class_names = self.model.names if hasattr(self.model, "names") else {}
        print(f"[INIT] Model classes: {self.class_names}")
        print(f"[INIT] Monitoring classes: {[self.class_names.get(i, f'class_{i}') for i in self.danger_classes]}")

    def _load_zone(self, zone_path: str):
        """Load polygon from json if available, otherwise fallback to default constant."""
        if zone_path and os.path.isfile(zone_path):
            try:
                with open(zone_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                # Expect list of [x, y]
                zone = [(int(p[0]), int(p[1])) for p in data]
                print(f"[ZONE] Loaded {len(zone)} points from {zone_path}")
                return zone
            except Exception as e:
                print(f"[ZONE] Failed to load {zone_path}, using default. Error: {e}")
        print("[ZONE] Using default hardcoded danger zone.")
        return DANGER_ZONE

    def is_point_in_polygon(self, point, polygon):
        """
        Check if a point (x, y) is inside the polygon.
        Returns True if inside, False otherwise.
        """
        # cv2.pointPolygonTest returns positive if inside, negative if outside, 0 on edge
        result = cv2.pointPolygonTest(np.array(polygon, dtype=np.int32), point, False)
        return result >= 0

    def save_evidence(self, frame, bbox, obj_id, class_name, confidence, duration):
        """Save annotated frame to evidence directory."""
        x1, y1, x2, y2 = bbox
        annotated = frame.copy()
        cv2.rectangle(annotated, (x1, y1), (x2, y2), (0, 0, 255), 2)
        cv2.putText(
            annotated,
            f"{class_name} {confidence:.2f} {duration:.1f}s",
            (x1, max(20, y1 - 10)),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.7,
            (0, 0, 255),
            2,
        )

        ts = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{ts}_id{obj_id}_{class_name}.jpg"
        path = os.path.join(self.evidence_dir, filename)
        cv2.imwrite(path, annotated)
        print(f"[EVIDENCE] Saved to {path}")
        return filename

    def send_alert(self, obj_id, class_name, confidence, duration, frame, bbox):
        """Send HTTP POST alert to Central Brain."""
        # Check cooldown (avoid spamming same alert every frame)
        current_time = time.time()
        last_alert = self.alert_cooldowns.get(obj_id, 0)
        
        if current_time - last_alert < 5.0:  # 5 seconds cooldown per object
            return

        print(f"🚨 ALERT TRIGGERED! Object {obj_id} ({class_name}) stuck in zone!")
        
        payload = {
            "type": "OBSTACLE_STUCK",
            "object_class": class_name,
            "confidence": float(confidence),
            "in_roi": True,
            "object_id": int(obj_id),
            "duration_seconds": float(duration),
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "camera_id": os.getenv("CAMERA_ID", CAMERA_ID),
        }
        
        # Save evidence regardless of network status
        evidence_filename = self.save_evidence(frame, bbox, obj_id, class_name, confidence, duration)
        evidence_url = os.getenv("EVIDENCE_BASE_URL", "http://localhost:8080/evidence")
        payload["image_url"] = f"{evidence_url}/{evidence_filename}"
        self.alert_cooldowns[obj_id] = current_time

        try:
            requests.post(BRAIN_URL, json=payload, timeout=2)
        except Exception as e:
            print(f"[ERROR] Failed to send alert: {e}")

    def push_frame_stream(self, frame):
        """Send JPEG frame to Go MJPEG endpoint (throttled)."""
        if not self.enable_stream:
            return
        now = time.time()
        if now - self.last_frame_push < self.frame_push_interval:
            return
        self.last_frame_push = now
        try:
            # Optimized quality for smoother streaming (default 70 for better quality). Override via JPEG_QUALITY env.
            # Balance between quality and bandwidth
            jpeg_quality = int(os.getenv("JPEG_QUALITY", "70"))
            ok, buffer = cv2.imencode(".jpg", frame, [cv2.IMWRITE_JPEG_QUALITY, jpeg_quality])
            if not ok:
                print(f"[STREAM] Failed to encode frame for {STREAM_URL}")
                return
            # Increased timeout to avoid blocking when backend down
            response = requests.post(
                STREAM_URL,
                data=buffer.tobytes(),
                headers={"Content-Type": "image/jpeg"},
                timeout=1.0,  # Increased from 0.5 to 1.0
            )
            if response.status_code != 202:
                print(f"[STREAM] Warning: Backend returned {response.status_code} for {STREAM_URL}")
            # Log success occasionally for debugging
            elif int(time.time()) % 10 == 0:  # Log once every 10 seconds
                print(f"[STREAM] ✓ Frame sent to {STREAM_URL} ({len(buffer)} bytes)")
        except requests.exceptions.RequestException as e:
            # Log network errors occasionally
            if int(time.time()) % 5 == 0:  # Log once every 5 seconds
                print(f"[STREAM] Network error: {e}")
        except Exception as e:
            # Log other errors occasionally
            if int(time.time()) % 5 == 0:  # Log once every 5 seconds
                print(f"[STREAM] Error: {e}")

    def run(self):
        print(f"[RUN] Starting AI Engine on source: {self.source}")
        print(f"[INFO] Stream URL: {STREAM_URL}")
        print(f"[INFO] Camera ID: {os.getenv('CAMERA_ID', CAMERA_ID)}")
        print(f"[INFO] Alert Threshold: {ALERT_THRESHOLD_SECONDS} seconds")
        print(f"[INFO] Confidence Threshold: {CONFIDENCE_THRESHOLD}")
        print(f"[INFO] Tracker: {self.tracker_config or 'default'}")
        print(f"[INFO] Zone file: {self.zone_path}")
        print(f"[INFO] Evidence dir: {self.evidence_dir}")
        print(f"[INFO] Enable stream: {self.enable_stream}")

        # Handle image files - convert to video loop
        is_image = False
        img = None
        src = None
        cap = None
        
        if self.source.lower().endswith(('.jpg', '.jpeg', '.png', '.bmp')):
            print(f"[INFO] Detected image file, converting to video loop")
            # Convert to absolute path
            if not os.path.isabs(self.source):
                img_path = os.path.abspath(self.source)
            else:
                img_path = self.source
            print(f"[INFO] Loading image: {img_path}")
            if not os.path.exists(img_path):
                print(f"[ERROR] Image file not found: {img_path}")
                print(f"[ERROR] Current working directory: {os.getcwd()}")
                return
            img = cv2.imread(img_path)
            if img is None:
                print(f"[ERROR] Could not load image: {img_path}")
                return
            print(f"[INFO] Image loaded: {img.shape[1]}x{img.shape[0]}")
            is_image = True
        else:
            # Open video source (handle int for webcam)
            if self.source.isdigit():
                src = int(self.source)
                print(f"[INFO] Opening webcam: {src}")
            else:
                # Convert to absolute path for video files
                if not os.path.isabs(self.source):
                    src = os.path.abspath(self.source)
                else:
                    src = self.source
                print(f"[INFO] Opening video file: {src}")
                if not os.path.exists(src):
                    print(f"[ERROR] Video file not found: {src}")
                    print(f"[ERROR] Current working directory: {os.getcwd()}")
                    return
            
            cap = cv2.VideoCapture(src)
            
            if not cap.isOpened():
                print(f"[ERROR] Could not open video source: {src}")
                if isinstance(src, str):
                    print(f"[ERROR] File exists: {os.path.exists(src)}")
                return
            
            # Get video properties for logging
            if isinstance(src, str):
                fps = cap.get(cv2.CAP_PROP_FPS)
                frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
                width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
                height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
                print(f"[INFO] Video properties: {width}x{height}, {fps} FPS, {frame_count} frames")

        # Loop through frames
        frame_count = 0
        print(f"[INFO] Starting frame processing loop...")
        while True:
            if is_image:
                frame = img.copy()
                time.sleep(0.033)  # ~30 FPS for image loop
            else:
                ret, frame = cap.read()
                if not ret:
                    if isinstance(src, str): # Loop video file
                        print(f"[INFO] Video ended, looping from start...")
                        cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
                        continue
                    else:
                        print(f"[ERROR] Cannot read frame from webcam")
                        break
            
            frame_count += 1
            if frame_count % 100 == 0:  # Log every 100 frames
                print(f"[INFO] Processed {frame_count} frames")

            # 1. Run YOLO Tracking
            # persist=True is crucial for ID tracking across frames
            # Lower confidence for static images/videos to catch more objects
            detection_conf = float(os.getenv("DETECTION_CONFIDENCE", str(CONFIDENCE_THRESHOLD)))
            results = self.model.track(
                frame,
                persist=True,
                verbose=False,
                conf=detection_conf,
                classes=self.danger_classes,
                tracker=self.tracker_config,
            )
            
            # Current time for this frame
            frame_time = time.time()
            
            # Log detections occasionally for debugging
            if int(frame_time) % 10 == 0:  # Log every 10 seconds
                if results[0].boxes.id is not None:
                    detections = len(results[0].boxes.id)
                    print(f"[DETECT] Found {detections} tracked objects")
                else:
                    print(f"[DETECT] No objects detected (confidence threshold: {detection_conf})")
            
            # Reset zone status for visualization
            zone_color = (0, 255, 0) # Green (Safe)
            
            if results[0].boxes.id is not None:
                boxes = results[0].boxes.xywh.cpu()
                track_ids = results[0].boxes.id.int().cpu().tolist()
                classes = results[0].boxes.cls.int().cpu().tolist()
                confs = results[0].boxes.conf.float().cpu().tolist()

                # List of IDs currently in zone to handle exits
                current_ids_in_zone = []

                for box, track_id, cls, conf in zip(boxes, track_ids, classes, confs):
                    x, y, w, h = box
                    center_point = (int(x), int(y))
                    
                    # 2. Check logic: Is center in DANGER_ZONE?
                    in_zone = self.is_point_in_polygon(center_point, self.zone)
                    
                    if in_zone:
                        current_ids_in_zone.append(track_id)
                        
                        # 3. Persistence Logic
                        if track_id not in self.tracked_objects:
                            # New entry
                            self.tracked_objects[track_id] = frame_time
                        
                        # Calculate duration
                        duration = frame_time - self.tracked_objects[track_id]
                        
                        # 4. Visualization & Alert
                        label_color = (0, 255, 255) # Yellow (Warning)
                        class_name = self.class_names.get(cls, f"class_{cls}")

                        # Only trigger alert for person class
                        if class_name == "person" and duration > ALERT_THRESHOLD_SECONDS:
                            zone_color = (0, 0, 255) # Red (Critical)
                            label_color = (0, 0, 255)
                            
                            # TRIGGER ALERT + EVIDENCE
                            self.send_alert(
                                track_id,
                                class_name,
                                conf,
                                duration,
                                frame,
                                (int(x - w/2), int(y - h/2), int(x + w/2), int(y + h/2)),
                            )
                            
                        # Draw bounding box and timer
                        x1, y1 = int(x - w/2), int(y - h/2)
                        x2, y2 = int(x + w/2), int(y + h/2)
                        
                        cv2.rectangle(frame, (x1, y1), (x2, y2), label_color, 2)
                        cv2.putText(frame, f"{class_name} {duration:.1f}s", (x1, y1 - 10), 
                                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, label_color, 2)
                        
                    else:
                        # Object detected but NOT in zone
                        # If it was in tracked_objects, remove it (it left the zone)
                        if track_id in self.tracked_objects:
                            del self.tracked_objects[track_id]

                # Cleanup: Remove IDs that are no longer detected or left the zone
                # (Simple approach: Filter tracked_objects by current_ids_in_zone)
                # Note: We only want to remove IDs that are tracked but NOT in the current frame's zone list
                # However, YOLO might miss a frame. A better robust approach uses a "missed" counter, 
                # but for simplicity, we'll assume if it's not in 'current_ids_in_zone', it's out.
                # To be safer against flickering detection, we could use a grace period, 
                # but the prompt asks for "If object moves OUT of zone: Remove from dictionary".
                keys_to_remove = [k for k in self.tracked_objects if k not in current_ids_in_zone]
                for k in keys_to_remove:
                    del self.tracked_objects[k]
            
            else:
                # No objects detected at all
                self.tracked_objects.clear()

            # DRAW POLYGON ZONE
            cv2.polylines(frame, [np.array(self.zone, dtype=np.int32)], isClosed=True, color=zone_color, thickness=2)
            
            # Fill polygon semi-transparent
            overlay = frame.copy()
            cv2.fillPoly(overlay, [np.array(self.zone, dtype=np.int32)], zone_color)
            cv2.addWeighted(overlay, 0.3, frame, 0.7, 0, frame)

            # Stream frame to backend (throttled)
            self.push_frame_stream(frame)

            # Display Status (optional, avoid crash if no GUI backend)
            if self.enable_display:
                try:
                    cv2.imshow("Aeon RailGuard - Phase 3 Logic", frame)
                    if cv2.waitKey(1) & 0xFF == ord('q'):
                        break
                except Exception as e:
                    print(f"[WARN] Display disabled (no GUI backend): {e}")
                    self.enable_display = False

        cap.release()
        if self.enable_display:
            try:
                cv2.destroyAllWindows()
            except Exception:
                pass

def main():
    parser = argparse.ArgumentParser(description="Aeon RailGuard AI Engine")
    parser.add_argument("--source", "-s", type=str, default="datasets/videos/training_video.mp4", help="Video source path or webcam ID")
    parser.add_argument("--model", "-m", type=str, default="yolov8n.pt", help="YOLOv8 model path")
    parser.add_argument("--zone-file", "-z", type=str, default="danger_zone.json", help="Path to saved danger zone polygon (json list of [x, y])")
    parser.add_argument("--evidence-dir", "-e", type=str, default="evidence", help="Directory to store evidence snapshots")
    parser.add_argument("--tracker", "-t", type=str, default=DEFAULT_TRACKER, help="Tracker config file for ByteTrack")
    parser.add_argument("--display", action="store_true", help="Show OpenCV window (requires GUI support)")
    parser.add_argument("--no-stream", action="store_true", help="Disable MJPEG streaming to backend")
    args = parser.parse_args()

    engine = AIEngine(
        source=args.source,
        model_path=args.model,
        zone_path=args.zone_file,
        evidence_dir=args.evidence_dir,
        tracker_config=args.tracker,
        enable_stream=not args.no_stream,
    )
    # Flag to enable/disable OpenCV imshow to avoid errors on headless/CLI envs
    engine.enable_display = args.display
    engine.run()

if __name__ == "__main__":
    main()
