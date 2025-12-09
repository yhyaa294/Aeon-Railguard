import cv2
import numpy as np

# Path to the video file
VIDEO_PATH = "datasets/videos/VID_20251207_142949636.mp4"

# Global list to store points
points = []

def mouse_callback(event, x, y, flags, param):
    """
    Mouse callback function to capture point clicks.
    """
    if event == cv2.EVENT_LBUTTONDOWN:
        points.append((x, y))
        print(f"Point recorded: ({x}, {y})")

def main():
    global points
    
    # Open the video file
    cap = cv2.VideoCapture(VIDEO_PATH)
    
    if not cap.isOpened():
        print(f"Error: Could not open video file {VIDEO_PATH}")
        print("Please check if the file exists or update VIDEO_PATH in the script.")
        # Try to find any mp4 in the directory to be helpful, or just exit
        return

    # Read the first frame
    ret, frame = cap.read()
    if not ret:
        print("Error: Could not read first frame from video.")
        return

    # Resize frame for easier viewing if it's too large (Optional, but good for UX)
    # scale_percent = 50 
    # width = int(frame.shape[1] * scale_percent / 100)
    # height = int(frame.shape[0] * scale_percent / 100)
    # dim = (width, height)
    # frame = cv2.resize(frame, dim, interpolation = cv2.INTER_AREA)

    # Clone the frame to reset if needed
    clean_frame = frame.copy()

    # Create a window and bind the function to window
    window_name = "Define Danger Zone (Click 4 Points)"
    cv2.namedWindow(window_name)
    cv2.setMouseCallback(window_name, mouse_callback)

    print("INSTRUCTIONS:")
    print("1. Click 4 points on the video frame to define the DANGER ZONE.")
    print("2. Press 'r' to reset points.")
    print("3. Press 'q' or 'ENTER' to finish and print coordinates.")

    while True:
        # Use a copy to draw on, so we don't permanently mark the clean frame until confirmed
        display_frame = clean_frame.copy()

        # Draw the points and lines
        if len(points) > 0:
            # Draw points
            for pt in points:
                cv2.circle(display_frame, pt, 5, (0, 0, 255), -1)
            
            # Draw lines connecting points
            if len(points) > 1:
                cv2.polylines(display_frame, [np.array(points)], isClosed=False, color=(0, 255, 0), thickness=2)
            
            # If we have 4 or more points, draw the closed polygon to show the zone
            if len(points) >= 3:
                 cv2.polylines(display_frame, [np.array(points)], isClosed=True, color=(0, 255, 0), thickness=2)
                 
                 # Fill slightly to visualize area
                 overlay = display_frame.copy()
                 cv2.fillPoly(overlay, [np.array(points)], (0, 255, 0))
                 cv2.addWeighted(overlay, 0.3, display_frame, 0.7, 0, display_frame)

        cv2.imshow(window_name, display_frame)
        
        key = cv2.waitKey(1) & 0xFF

        # Press 'q' or Enter to finish
        if key == ord('q') or key == 13:
            break
        
        # Press 'r' to reset
        if key == ord('r'):
            points = []
            print("Reset points.")

    # Cleanup
    cap.release()
    cv2.destroyAllWindows()

    # Output the result
    print("\n" + "="*40)
    print("COPY THIS LIST INTO app.py:")
    print("="*40)
    print(f"DANGER_ZONE = {points}")
    print("="*40)

if __name__ == "__main__":
    main()
