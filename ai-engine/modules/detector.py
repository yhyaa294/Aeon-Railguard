from ultralytics import YOLO
import cv2
import numpy as np
from dataclasses import dataclass
from typing import List, Tuple

@dataclass
class DetectionResult:
    frame: np.ndarray
    is_danger: bool
    detections_in_roi: int

class RailDetector:
    def __init__(self, model_path: str = "models/yolov8n.pt"):
        # Load YOLOv8 Nano model
        # If local model doesn't exist, it will auto-download to current dir
        # In a real scenario, ensure 'models/' exists and is writable
        self.model = YOLO("yolov8n.pt") 
        self.danger_classes = [0, 1, 2, 3, 5, 7] # Person, bicycle, car, motorcycle, bus, truck
        
        # State for persistence logic
        self.roi_persistence_counter = 0
        self.PERSISTENCE_THRESHOLD = 15 # frames

    def get_roi_polygon(self, width: int, height: int) -> np.ndarray:
        """
        Defines a fixed ROI polygon in the center of the frame.
        """
        # Trapezoid shape
        p1 = (int(width * 0.30), int(height * 0.30))
        p2 = (int(width * 0.70), int(height * 0.30))
        p3 = (int(width * 0.90), int(height * 0.95))
        p4 = (int(width * 0.10), int(height * 0.95))
        return np.array([p1, p2, p3, p4], np.int32)

    def process_frame(self, frame: np.ndarray, conf_threshold: float = 0.45) -> DetectionResult:
        height, width = frame.shape[:2]
        roi_poly = self.get_roi_polygon(width, height)
        
        # Run Inference
        results = self.model.predict(frame, conf=conf_threshold, classes=self.danger_classes, verbose=False)[0]
        
        detections_in_roi = 0
        
        # Draw ROI (Default Green)
        roi_color = (0, 255, 0) 

        # Process Detections
        for box in results.boxes:
            x1, y1, x2, y2 = map(int, box.xyxy[0])
            cls = int(box.cls[0])
            label = self.model.names[cls]
            
            cx, cy = (x1 + x2) // 2, (y1 + y2) // 2
            
            # Check if center point is in ROI
            in_roi = cv2.pointPolygonTest(roi_poly, (cx, cy), False) >= 0
            
            if in_roi:
                detections_in_roi += 1
                box_color = (0, 0, 255) # Red
            else:
                box_color = (0, 255, 255) # Yellow/Cyan
            
            # Draw Bounding Box & Label
            cv2.rectangle(frame, (x1, y1), (x2, y2), box_color, 2)
            cv2.putText(frame, f"{label}", (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, box_color, 2)
            cv2.circle(frame, (cx, cy), 4, box_color, -1)

        # Persistence Logic
        if detections_in_roi > 0:
            self.roi_persistence_counter += 1
            roi_color = (0, 0, 255) # Red ROI if occupied
        else:
            # Hysteresis: slowly decay or instant reset? 
            # Instant reset is safer to avoid false positives persisting, 
            # but slow decay prevents flickering. Let's do instant for MVP.
            self.roi_persistence_counter = 0

        # Trigger Danger
        is_danger = self.roi_persistence_counter > self.PERSISTENCE_THRESHOLD

        # Draw ROI Polygon
        cv2.polylines(frame, [roi_poly], isClosed=True, color=roi_color, thickness=2)
        
        # If danger, add big overlay text
        if is_danger:
            cv2.putText(frame, "DANGER: STOP TRAIN", (50, 100), cv2.FONT_HERSHEY_SIMPLEX, 1.5, (0, 0, 255), 4)

        return DetectionResult(frame=frame, is_danger=is_danger, detections_in_roi=detections_in_roi)
