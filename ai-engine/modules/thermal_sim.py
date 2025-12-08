import cv2
import numpy as np

class ThermalSimulator:
    @staticmethod
    def apply_thermal_vision(frame: np.ndarray) -> np.ndarray:
        """
        Simulates thermal vision using Grayscale conversion and INFERNO colormap.
        Gives a high-tech/heat-signature look.
        """
        try:
            # Convert to grayscale
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            # Apply Inferno colormap (Black -> Red -> Yellow)
            thermal = cv2.applyColorMap(gray, cv2.COLORMAP_INFERNO)
            return thermal
        except Exception as e:
            print(f"Error in Thermal Sim: {e}")
            return frame
