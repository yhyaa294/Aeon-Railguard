"""
Zone Setup Tool for Aeon RailGuard

Usage:
  python zone_setup.py --video assets/demo_simulation.mp4 --output danger_zone.json

- Left click to add polygon points (in order).
- Press 'u' to undo last point.
- Press 'r' to reset all points.
- Press 's' to save to JSON and exit.
- Press 'q' to quit without saving.
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


def main():
    parser = argparse.ArgumentParser(description="Draw polygon danger zone on a video frame.")
    parser.add_argument("--video", "-v", type=str, default="assets/demo_simulation.mp4", help="Video file to sample a frame from")
    parser.add_argument("--output", "-o", type=str, default="danger_zone.json", help="Output JSON file for polygon points")
    args = parser.parse_args()

    if not os.path.isfile(args.video):
        raise FileNotFoundError(f"Video not found: {args.video}")

    cap = cv2.VideoCapture(args.video)
    ok, frame = cap.read()
    cap.release()
    if not ok:
        raise RuntimeError("Could not read the first frame from the video.")

    points = []

    def click_event(event, x, y, flags, param):
        if event == cv2.EVENT_LBUTTONDOWN:
            points.append([int(x), int(y)])

    cv2.namedWindow("Zone Setup")
    cv2.setMouseCallback("Zone Setup", click_event)

    while True:
        canvas = frame.copy()
        if points:
            cv2.polylines(canvas, [np.array(points, dtype=np.int32)], isClosed=len(points) > 2, color=(0, 255, 0), thickness=2)
            for idx, (px, py) in enumerate(points):
                cv2.circle(canvas, (px, py), 4, (0, 0, 255), -1)
                cv2.putText(canvas, str(idx + 1), (px + 5, py - 5), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)

        instructions = "Left click=add | u=undo | r=reset | s=save | q=quit"
        cv2.putText(canvas, instructions, (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
        cv2.imshow("Zone Setup", canvas)
        key = cv2.waitKey(20) & 0xFF

        if key == ord("q"):
            break
        if key == ord("u") and points:
            points.pop()
        if key == ord("r"):
            points.clear()
        if key == ord("s") and len(points) >= 3:
            save_zone(points, args.output)
            break

    cv2.destroyAllWindows()


if __name__ == "__main__":
    main()

