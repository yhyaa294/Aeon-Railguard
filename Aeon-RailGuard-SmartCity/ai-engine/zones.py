import cv2
import numpy as np

class ZoneManager:
    def __init__(self):
        # Define a default 4-point polygon for the "Danger Zone" (Rail Tracks)
        # This will need to be calibrated to the actual camera view.
        # Format: List of [x, y] normalized coordinates (0.0 to 1.0) or pixels? 
        # Let's use relative coordinates (0-1) to be resolution independent initially, 
        # then scale to frame size.
        self.default_zone = np.array([
            [0.2, 0.4], # Top Left
            [0.8, 0.4], # Top Right
            [0.3, 0.9], # Bottom Right (Trapezoid perspective)
            [0.2, 0.9]  # Bottom Left
        ], dtype=np.float32)
        
        self.zones = [self.default_zone]

    def get_zone_pixels(self, frame_width, frame_height):
        """Convert relative coordinates to pixel coordinates for drawing/checking"""
        pixel_zones = []
        for zone in self.zones:
            scaled = zone.copy()
            scaled[:, 0] *= frame_width
            scaled[:, 1] *= frame_height
            pixel_zones.append(scaled.astype(np.int32))
        return pixel_zones

    def is_point_in_zone(self, point, frame_width, frame_height):
        """Check if a point (x, y) is inside any danger zone"""
        pixel_zones = self.get_zone_pixels(frame_width, frame_height)
        
        for poly in pixel_zones:
            # cv2.pointPolygonTest returns >0 if inside, 0 if on edge, <0 if outside
            dist = cv2.pointPolygonTest(poly, point, False)
            if dist >= 0:
                return True
        return False
