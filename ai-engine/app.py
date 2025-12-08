#!/usr/bin/env python3
"""
AEON RAILGUARD - AI ENGINE (PHASE 3: ADVANCED LOGIC)
Features:
- YOLOv8 Object Tracking
- Polygon ROI Filtering
- Time Persistence Check (> 3.0s) to reduce False Positives
"""

import cv2
import numpy as np
import time
import argparse
import requests
from ultralytics import YOLO

# --- CONFIGURATION ---
BRAIN_URL = "http://localhost:8080/api/incident"
ALERT_THRESHOLD_SECONDS = 3.0
CONFIDENCE_THRESHOLD = 0.45

# ---------------------------------------------------------
# ⚠️ REPLACE THESE COORDINATES WITH YOUR CUSTOM ZONE ⚠️
# Run 'python tools/get_zone.py' to generate this list.
# ---------------------------------------------------------
DANGER_ZONE = [(350, 200), (850, 200), (1000, 600), (200, 600)]
# ---------------------------------------------------------

class AIEngine:
    def __init__(self, source: str, model_path: str = "yolov8n.pt"):
        self.source = source
        print(f"[INIT] Loading YOLO model: {model_path}")
        self.model = YOLO(model_path)
        
        # State tracking
        # Dictionary: {track_id: start_time_in_zone}
        self.tracked_objects = {}
        
        # Dictionary: {track_id: last_alert_time} to prevent spam
        self.alert_cooldowns = {}
        
        # Danger classes (COCO indices)
        # 0: person, 1: bicycle, 2: car, 3: motorcycle, 5: bus, 7: truck
        self.danger_classes = [0, 1, 2, 3, 5, 7]
        self.class_names = {0: 'person', 1: 'bicycle', 2: 'car', 3: 'motorcycle', 5: 'bus', 7: 'truck'}

    def is_point_in_polygon(self, point, polygon):
        """
        Check if a point (x, y) is inside the polygon.
        Returns True if inside, False otherwise.
        """
        # cv2.pointPolygonTest returns positive if inside, negative if outside, 0 on edge
        result = cv2.pointPolygonTest(np.array(polygon, dtype=np.int32), point, False)
        return result >= 0

    def send_alert(self, obj_id, class_name, confidence):
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
            "in_roi": True
        }
        
        try:
            requests.post(BRAIN_URL, json=payload, timeout=2)
            self.alert_cooldowns[obj_id] = current_time
        except Exception as e:
            print(f"[ERROR] Failed to send alert: {e}")

    def run(self):
        print(f"[RUN] Starting AI Engine on source: {self.source}")
        print(f"[INFO] Alert Threshold: {ALERT_THRESHOLD_SECONDS} seconds")
        
        # Open video source (handle int for webcam)
        src = int(self.source) if self.source.isdigit() else self.source
        cap = cv2.VideoCapture(src)
        
        if not cap.isOpened():
            print(f"[ERROR] Could not open video source: {src}")
            return

        # Loop through frames
        while True:
            ret, frame = cap.read()
            if not ret:
                if isinstance(src, str): # Loop video file
                    cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
                    continue
                else:
                    break

            # 1. Run YOLO Tracking
            # persist=True is crucial for ID tracking across frames
            results = self.model.track(frame, persist=True, verbose=False, conf=CONFIDENCE_THRESHOLD, classes=self.danger_classes)
            
            # Current time for this frame
            frame_time = time.time()
            
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
                    in_zone = self.is_point_in_polygon(center_point, DANGER_ZONE)
                    
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
                        
                        if duration > ALERT_THRESHOLD_SECONDS:
                            zone_color = (0, 0, 255) # Red (Critical)
                            label_color = (0, 0, 255)
                            
                            # TRIGGER ALERT
                            self.send_alert(track_id, self.class_names.get(cls, 'unknown'), conf)
                            
                        # Draw bounding box and timer
                        x1, y1 = int(x - w/2), int(y - h/2)
                        x2, y2 = int(x + w/2), int(y + h/2)
                        
                        cv2.rectangle(frame, (x1, y1), (x2, y2), label_color, 2)
                        cv2.putText(frame, f"Stuck: {duration:.1f}s", (x1, y1 - 10), 
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
            cv2.polylines(frame, [np.array(DANGER_ZONE, dtype=np.int32)], isClosed=True, color=zone_color, thickness=2)
            
            # Fill polygon semi-transparent
            overlay = frame.copy()
            cv2.fillPoly(overlay, [np.array(DANGER_ZONE, dtype=np.int32)], zone_color)
            cv2.addWeighted(overlay, 0.3, frame, 0.7, 0, frame)

            # Display Status
            cv2.imshow("Aeon RailGuard - Phase 3 Logic", frame)

            # Quit on 'q'
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

        cap.release()
        cv2.destroyAllWindows()

def main():
    parser = argparse.ArgumentParser(description="Aeon RailGuard AI Engine")
    parser.add_argument("--source", "-s", type=str, default="datasets/videos/training_video.mp4", help="Video source path or webcam ID")
    parser.add_argument("--model", "-m", type=str, default="yolov8n.pt", help="YOLOv8 model path")
    args = parser.parse_args()

    engine = AIEngine(source=args.source, model_path=args.model)
    engine.run()

if __name__ == "__main__":
    main()
