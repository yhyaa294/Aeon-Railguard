# "Fake It Till You Make It" - Live Demo Guide

**Objective:** Execute a flawless live demonstration that simulates a critical safety incident without real danger.

## 1. Preparation (The Setup)
1.  **Hardware:** Gaming Laptop (NVIDIA GPU preferred, but CPU works for YOLOv8 Nano).
2.  **Display:** Connect to the projector via HDMI. Ensure "Extend Display" so you can see your notes.
3.  **The Video File:**
    *   You need a clip named `demo_clip.mp4`.
    *   **Content:** A car driving onto tracks, stopping, and staying there.
    *   **Source:** Search YouTube for "Car stuck on train tracks CCTV" and download a clip. Use an online video cropper/editor to trim it to 60 seconds.

## 2. The Script (Stage Directions)

**[0:00] Intro**
*   **Speaker:** "Good morning. What you are about to see is a live simulation of our 'Aeon Brain' processing a feed from a remote station."
*   *Action:* Launch `streamlit run app.py`. The dashboard loads on the big screen.

**[0:30] The "Thermal" Reveal**
*   **Speaker:** "Visibility is often poor at night. Standard cameras fail. Watch what happens when we enable our enhancement algorithm."
*   *Action:* Click the **"Enable Thermal Vision"** checkbox.
*   *Effect:* The video turns orange/purple (Heatmap).
*   **Speaker:** "We digitally reconstruct the thermal profile, allowing detection in zero-light conditions." (Pause for effect).

**[1:00] The Incident**
*   *Action:* The car in the video drives onto the tracks and stops.
*   **Speaker:** "A vehicle has stalled. Watch the system's reaction."
*   *Screen:* The green box around the car turns **RED**. The timer above it counts: `1.2s`, `2.5s`, `3.8s`.

**[1:10] The Climax**
*   *Screen:* Timer hits 5.0s.
*   *Visual:* The entire dashboard header flashes **"CRITICAL DANGER"**.
*   *Visual:* "TRAIN BRAKING SIGNAL: SENT" appears.
*   *Action:* (Optional) Have a team member's phone plugged into audio play a "Ping" sound (Telegram notification).
*   **Speaker:** "In under 5 seconds, the train was stopped automatically. No human intervention needed. That is the power of Aeon RailGuard."

## 3. Emergency Contingencies
*   **If the code crashes:** Refresh the browser page (`F5`) immediately. Streamlit recovers fast.
*   **If detection fails:** Lower the "Confidence Threshold" slider in the sidebar to 0.25.
*   **If video lags:** Uncheck "Thermal Vision" (it uses extra CPU).
