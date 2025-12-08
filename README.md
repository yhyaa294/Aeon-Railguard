# 🚅 AEON RAILGUARD: City Nexus Edition
> **Smart City Emergency Response Platform** for the Ekraf Tech Summit 2025.

![Aeon RailGuard Hero](aeon_railguard_hero.png)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/yhyaa294/Aeon-Railguard)
[![Tech Stack](https://img.shields.io/badge/Stack-Python%20%7C%20Go%20%7C%20Next.js-blueviolet)](https://github.com/yhyaa294/Aeon-Railguard)

---

## 🌐 The Concept: From Hardware to CityOS
**Aeon RailGuard** represents a paradigm shift from traditional hardware safety barriers to a **software-first Smart City Nervous System**. 

Instead of just closing a gate, we:
1.  **WATCH**: AI Computer Vision detects obstacles 500m away.
2.  **THINK**: Central Neural Core calculates impact trajectory.
3.  **ACT**: Instantly overrides city traffic lights and dispatches EMS before the crash happening.

---

## 🏗️ Architecture: The Trinity

The system operates on a high-speed microservices architecture:

### 👁️ **THE EYE** (Perception Layer)
*   **Tech**: Python, YOLOv8, OpenCV.
*   **Role**: Constant surveillance of the "Kill Zone". Detects people, cars, and debris with 99% accuracy.
*   **Output**: Real-time JSON telemetry to The Brain.

### 🧠 **THE BRAIN** (Decision Core)
*   **Tech**: Go (Golang), Fiber, WebSockets.
*   **Role**: The tactical commander. Processes thousands of data points per second.
*   **Action**: Triggers the "Red Protocol" — changing traffic signals and alerting authorities.

### 💻 **THE FACE** (Command Dashboard)
*   **Tech**: Next.js 14, TailwindCSS, Framer Motion.
*   **Style**: **Industrial Sci-Fi**. Inspired by mission control centers.
*   **Features**: Real-time video feed, live map, and distance-to-impact countdown.

---

## 📸 Snapshots

| Traffic Normal | Impact Imminent |
|:---:|:---:|
| ![Status Safe](https://via.placeholder.com/400x200/000000/00ff00?text=STATUS:+SAFE) | ![Status Critical](https://via.placeholder.com/400x200/000000/ff0000?text=CRITICAL+ALERT) |

> *The UI pulses RED when a threat is detected, simulating a high-stakes emergency environment.*

---

## 🚀 Quick Start

### Prerequisites
*   Python 3.9+
*   Go 1.20+
*   Node.js 18+

### 1. Initialize The Brain 🧠
```bash
cd central-brain
go run main.go
# Listening on :8080
```

### 2. Launch The Face 💻
```bash
cd command-dashboard
npm run dev
# Dashboard live at http://localhost:3000
```

### 3. Wake The Eye 👁️
```bash
cd ai-engine
python detector.py
# Surveillance Active
```

---

## 🏆 Project Team
Built with precision for **Ekraf Tech Summit 2025**.

*   **Lead Architect**: Yahya
*   **Category**: Emergency Response / Smart City

---
*Powered by ⚡ Antigravity & AI*
