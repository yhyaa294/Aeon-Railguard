import cv2
import numpy as np

class ImageEnhancer:
    @staticmethod
    def apply_clahe(frame: np.ndarray, clip_limit: float = 2.0, tile_grid_size: tuple = (8, 8)) -> np.ndarray:
        """
        Applies Contrast Limited Adaptive Histogram Equalization (CLAHE) to enhance clarity.
        Converts to LAB color space to preserve color information while enhancing lightness.
        """
        try:
            # Convert to LAB color space
            lab = cv2.cvtColor(frame, cv2.COLOR_BGR2LAB)
            l, a, b = cv2.split(lab)

            # Apply CLAHE to L-channel
            clahe = cv2.createCLAHE(clipLimit=clip_limit, tileGridSize=tile_grid_size)
            cl = clahe.apply(l)

            # Merge channels
            limg = cv2.merge((cl, a, b))

            # Convert back to BGR
            enhanced_frame = cv2.cvtColor(limg, cv2.COLOR_LAB2BGR)
            return enhanced_frame
        except Exception as e:
            print(f"Error in CLAHE: {e}")
            return frame
