"""
Zone Setup Tool for Aeon RailGuard - Supports Webcam & Video File

Usage:
  python zone_setup.py --video 0 --output danger_zone.json
  python zone_setup.py --video assets/demo.mp4 --output danger_zone.json
"""

import argparse
import json
import cv2
import os
import numpy as np


def save_zone(points, output_path):
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(points, f)
    print(f"[SAVED] {len(points)} points -> {output_path}")


def load_first_frame(source):
    # Jika source angka → webcam
    if source.isdigit():
        cam_index = int(source)
        cap = cv2.VideoCapture(cam_index)
    else:
        # Jika path file video
        if not os.path.isfile(source):
            raise FileNotFoundError(f"Video not found: {source}")
        cap = cv2.VideoCapture(source)

    ok, frame = cap.read()
    cap.release()

    if not ok or frame is None:
        raise RuntimeError("Could not read frame from source!")

    return frame


def main():
    parser = argparse.ArgumentParser(description="Draw polygon danger zone on a video frame.")
    parser.add_argument("--video", "-v", type=str, default="0", help="Video path or camera index")
    parser.add_argument("--output", "-o", type=str, default="danger_zone.json", help="Output JSON file")
    args = parser.parse_args()

    print("[INFO] Loading source:", args.video)

    frame = load_first_frame(args.video)
    points = []

    def click_event(event, x, y, flags, param):
        if event == cv2.EVENT_LBUTTONDOWN:
            points.append([int(x), int(y)])

    cv2.namedWindow("Zone Setup")
    cv2.setMouseCallback("Zone Setup", click_event)

    while True:
        canvas = frame.copy()

        if points:
            cv2.polylines(canvas, [np.array(points, dtype=np.int32)],
                          isClosed=len(points) > 2, color=(0, 255, 0), thickness=2)

            for idx, (px, py) in enumerate(points):
                cv2.circle(canvas, (px, py), 4, (0, 0, 255), -1)
                cv2.putText(canvas, str(idx + 1), (px + 5, py - 5),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)

        instructions = "Left click=add | u=undo | r=reset | s=save | q=quit"
        cv2.putText(canvas, instructions, (10, 30),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)

        cv2.imshow("Zone Setup", canvas)
        key = cv2.waitKey(20) & 0xFF

        if key == ord('q'):
            break
        if key == ord('u') and points:
            points.pop()
        if key == ord('r'):
            points.clear()
        if key == ord('s') and len(points) >= 3:
            save_zone(points, args.output)
            break

    cv2.destroyAllWindows()


if __name__ == "__main__":
    main()
