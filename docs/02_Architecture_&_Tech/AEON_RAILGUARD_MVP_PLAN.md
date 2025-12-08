# Aeon RailGuard: Software-Only MVP Strategy & Architecture

## 1. Product Concept Reframing

**The Pivot:**
Move away from "We build smart cameras" to "We make *existing* dumb cameras smart."

**New Definition:**
Aeon RailGuard is a **hardware-agnostic Intelligent Video Analytics (IVA) Platform** that retrofits existing railway CCTV infrastructure with military-grade threat detection capabilities using Edge AI.

**The "Elevator Pitch" (For the Judges):**
> "There are thousands of railway crossings globally, but upgrading them with new sensors costs billions. Aeon RailGuard is a software-only solution that turns *any* existing CCTV camera into an intelligent safety device. We don't sell hardware; we provide the 'AI Brain' that connects to legacy infrastructure, detecting stalled vehicles and pedestrians in real-time to stop trains before impact. We are the Windows for Railway Safety."

---

## 2. System Architecture (The Logic)

This architecture is designed for speed of implementation and stability during a demo.

**Flow:** `Input Source` -> `AI Processing Engine` -> `Business Logic` -> `Dashboard/Alerts`

1.  **Input Layer:**
    *   **Primary:** RTSP Stream (Real-world scenario).
    *   **Demo Fallback:** Pre-recorded Video File injection (guarantees a successful demo).

2.  **Core AI Engine:**
    *   **Model:** YOLOv8 (Nano or Small version for speed on laptop CPU/GPU).
    *   **Classes:** `Car`, `Truck`, `Bus`, `Person`, `Motorcycle`.
    *   **Library:** Ultralytics YOLO.

3.  **Logic Module (The "Secret Sauce"):**
    *   **ROI (Region of Interest):** A user-defined polygon drawn over the tracks. Detections outside this box are ignored.
    *   **Stuck Detection Algorithm:**
        *   Assign ID to object.
        *   If `Object_Center` is inside `ROI` AND `Velocity` < `Threshold` for `> 5 seconds` -> **TRIGGER ALARM**.
    *   **Crowd Density:** Count total `Person` centroids within the ROI.

4.  **Output Layer:**
    *   **Frontend:** Web-based Dashboard showing the live video with bounding boxes + Status Indicators.
    *   **Notifications:** Telegram Bot API (Instant push notification to "Station Master's" phone).

---

## 3. MVP Features for Demo (The 3-Day Sprint)

Do not overbuild. Build only what shows up on the big screen.

1.  **The "Live" Danger Dashboard:**
    *   A video player showing the feed.
    *   A massive status indicator: **SAFE** (Green) vs **CRITICAL DANGER** (Flashing Red).
    *   **Simulated Train Braking Signal:** A simple toggle UI element that says "AUTO-BRAKE SIGNAL SENT" when danger is detected.

2.  **Software-Simulated "Thermal Vision" (The Wow Factor):**
    *   **The Problem:** Thermal cameras are expensive.
    *   **The Hack:** Use Image Processing to "fake" it.
    *   **Implementation:** Convert the standard RGB frame to Grayscale, then apply an OpenCV Colormap (`cv2.COLORMAP_JET` or `cv2.COLORMAP_INFERNO`).
    *   **The Pitch:** "Our Night-Vision Mode enhances contrast for low-light conditions using pixel-intensity mapping." (Technically true, sounds fancy).

3.  **Telegram Integration:**
    *   When the system detects a "Stuck Car," it sends a screenshot to a Telegram group. The judges will love seeing their phones buzz in real-time.

---

## 4. Tech Stack Recommendation (Fastest to Build)

Do not use React or Laravel. You will spend too much time connecting the backend to the frontend.

**Recommended Stack: Streamlit (Python)**

*   **Why?**
    *   It builds the UI *and* runs the Python ML code in the same script.
    *   Zero HTML/CSS knowledge required.
    *   Native support for dataframes (logs) and charts (heatmaps).
    *   Updates in real-time.

**The Stack:**
*   **Language:** Python 3.9+
*   **UI Framework:** Streamlit
*   **Computer Vision:** OpenCV (`headless` version if on server, standard if local) + Ultralytics YOLOv8.
*   **Alerts:** `python-telegram-bot`.
*   **Environment:** Run locally on a gaming laptop (with NVIDIA GPU) for the presentation.

---

## 5. The "Fake It Till You Make It" Demo Strategy

Live demos with real webcams are risky. Lighting changes, people don't move how you want them to. Control the environment.

**Step-by-Step Execution:**

1.  **The "Perfect" Dataset:**
    *   Find or film a video of a car driving over tracks and stopping.
    *   Find a separate video of a train moving.
    *   **Editing:** Splice them together if needed. You need a 60-second clip where:
        *   0-10s: Empty tracks.
        *   10-30s: Car drives onto tracks and "stalls".
        *   30-40s: System goes RED.
        *   40-50s: Train approaches (but stops because you "signaled" it).

2.  **The "Digital Twin" Narrative:**
    *   Tell the judges: *"We are injecting a pre-recorded feed from our partner station to simulate a real-world collision scenario, as we cannot derail a real train for this demo."* (This makes the video file usage legitimate).

3.  **The Interaction:**
    *   Run the Streamlit app.
    *   Select "Source: Station Cam 1" (which loads your video file).
    *   While the video plays, click a checkbox labeled **"Enable Night Vision Algorithm"**.
    *   *Action:* The code instantly applies the OpenCV Colormap. The video turns into a "Heatmap/Thermal" look.
    *   *Result:* Judges are impressed by the dynamic image processing.

4.  **The Climax:**
    *   As the car in the video sits there, your "Stuck Timer" on screen counts up: 1s... 2s... 5s...
    *   **ALARM TRIGGERS:**
        *   Dashboard turns Red.
        *   "BRAKE SIGNAL SENT" text appears.
        *   **Sound Effect:** Play a subtle alarm sound from the laptop.
        *   **Phone Buzz:** Show the judges the Telegram alert with the photo of the stuck car.

**Final CTO Tip:**
Code capability is important, but the **story** sells the product. Focus on the *User Interface* and the *Alerts*. The AI just needs to be "good enough" to draw a box around a car.
