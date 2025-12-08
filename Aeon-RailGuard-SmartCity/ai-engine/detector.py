import cv2
import time
import requests
import json
from ultralytics import YOLO
from zones import ZoneManager

# Configuration
BACKEND_URL = "http://localhost:8080/api/alert"
VIDEO_SOURCE = "dummy_video.mp4"  # Or 0 for webcam
CONFIDENCE_THRESHOLD = 0.5
ALERT_COOLDOWN = 5  # Seconds between alerts

class AiEngine:
    def __init__(self):
        print("Initializing AEON RAILGUARD - THE EYE...")
        self.model = YOLO("yolov8n.pt")  # Load nano model for speed
        self.zones = ZoneManager()
        self.last_alert_time = 0
        self.alert_active = False

    def send_alert(self, object_type, confidence, frame_id):
        current_time = time.time()
        if current_time - self.last_alert_time < ALERT_COOLDOWN:
            return

        payload = {
            "type": "CRITICAL_OBSTACLE",
            "object": object_type,
            "confidence": float(confidence),
            "timestamp": current_time
        }
        
        try:
            # In a real scenario, this would post to the Go backend
            # response = requests.post(BACKEND_URL, json=payload, timeout=1)
            print(f"[ALERT SENT] Obstacle detected: {object_type}")
            self.last_alert_time = current_time
        except Exception as e:
            print(f"[ERROR] Failed to send alert: {e}")

    def run(self):
        cap = cv2.VideoCapture(VIDEO_SOURCE)
        if not cap.isOpened():
            print(f"Error: Could not open video source {VIDEO_SOURCE}. Using webcam 0 instead.")
            cap = cv2.VideoCapture(0)

        print(f"Surveillance active on {VIDEO_SOURCE}")

        while True:
            ret, frame = cap.read()
            if not ret:
                print("Video stream ended. Restarting...")
                cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
                continue

            height, width = frame.shape[:2]
            
            # 1. Detect Objects
            results = self.model(frame, stream=True, verbose=False)

            # 2. Draw Zones
            zone_polys = self.zones.get_zone_pixels(width, height)
            for poly in zone_polys:
                cv2.polylines(frame, [poly], True, (0, 0, 255), 2)
                # Add "DANGER ZONE" label
                cv2.putText(frame, "RESTRICTED AREA", (poly[0][0], poly[0][1]-10), 
                           cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 2)

            danger_detected = False

            for r in results:
                boxes = r.boxes
                for box in boxes:
                    # Bounding Box
                    x1, y1, x2, y2 = box.xyxy[0]
                    x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2)
                    
                    # Bottom center point of the object (feet)
                    feet_x = int((x1 + x2) / 2)
                    feet_y = int(y2)

                    # Class Name
                    cls = int(box.cls[0])
                    conf = float(box.conf[0])
                    label = self.model.names[cls]

                    # Filter for relevant objects
                    if label in ['person', 'car', 'truck', 'bus', 'motorcycle'] and conf > CONFIDENCE_THRESHOLD:
                        # Check if "feet" are in zone
                        if self.zones.is_point_in_zone((feet_x, feet_y), width, height):
                            danger_detected = True
                            color = (0, 0, 255) # Red for danger
                            self.send_alert(label, conf, 0)
                            cv2.putText(frame, f"CRITICAL: {label}", (x1, y1 - 10), 
                                       cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)
                        else:
                            color = (0, 255, 0) # Green for safe

                        cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)

            # Dashboard Status Overlay
            status_color = (0, 0, 255) if danger_detected else (0, 255, 0)
            status_text = "STATUS: CRITICAL" if danger_detected else "STATUS: SECURE"
            cv2.rectangle(frame, (10, 10), (300, 50), (0,0,0), -1)
            cv2.putText(frame, status_text, (20, 40), cv2.FONT_HERSHEY_SIMPLEX, 0.8, status_color, 2)

            # Show Feed
            cv2.imshow('Aeon RailGuard - The Eye', frame)

            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

        cap.release()
        cv2.destroyAllWindows()

if __name__ == "__main__":
    engine = AiEngine()
    engine.run()
