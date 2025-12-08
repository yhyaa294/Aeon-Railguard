# 🚆 Aeon RailGuard: Integrated Smart City Railway Safety System

<p align="center">
  <img src="https://img.shields.io/badge/🏆_Ekraf_Tech_Summit-2025-gold?style=for-the-badge" alt="Ekraf Tech Summit 2025"/>
  <img src="https://img.shields.io/badge/🇮🇩_Made_in-Jombang-red?style=for-the-badge" alt="Made in Jombang"/>
  <img src="https://img.shields.io/badge/🤖_AI-Powered-blue?style=for-the-badge" alt="AI Powered"/>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Go-1.20+-00ADD8?style=flat-square&logo=go" alt="Go"/>
  <img src="https://img.shields.io/badge/Python-3.9+-3776AB?style=flat-square&logo=python" alt="Python"/>
  <img src="https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js" alt="Next.js"/>
  <img src="https://img.shields.io/badge/YOLOv8-Ultralytics-FF6F00?style=flat-square" alt="YOLOv8"/>
</p>

---

## 📋 Overview

**Aeon RailGuard** is a software-first solution designed to **legalize and secure illegal railway crossings (JPL Liar)** using AI and Smart City integration.

> *"Solving the dilemma between Economic Access vs. Public Safety."*

Di Indonesia, terdapat ribuan perlintasan kereta api ilegal yang dibangun masyarakat untuk akses ekonomi. Menutupnya berarti memutus mata pencaharian. Membiarkannya berarti mempertaruhkan nyawa. **Aeon RailGuard hadir sebagai solusi tengah** — melegalkan akses tersebut dengan pengawasan AI dan integrasi Smart City.

---

## ✨ Key Features

| Module | Feature | Description |
|--------|---------|-------------|
| 👁️ | **The Eye** | Real-time Object Detection using YOLOv8 with **50ms latency** |
| 🧠 | **The Brain** | Central Simulation Core calculating **Time-to-Collision (TTC)** |
| 🏙️ | **City Grid** | Auto-dispatch Ambulance & Traffic Light Override integration |
| 👮 | **Multi-Tier Access** | Role-based dashboards for JPL Officers, Station Masters, and DAOP Command |
| 📡 | **Live WebSocket** | Real-time status broadcasting to all connected clients |
| 🗺️ | **Geospatial Map** | Interactive map showing all camera unit positions |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     DAOP 7 MADIUN (Command Level)               │
│  ┌─────────────────────────┐  ┌─────────────────────────────┐   │
│  │   Stasiun Jombang       │  │   Stasiun Mojoagung         │   │
│  │  ┌─────┐┌─────┐┌─────┐  │  │  ┌─────┐┌─────┐             │   │
│  │  │JPL  ││JPL  ││JPL  │  │  │  │JPL  ││JPL  │             │   │
│  │  │102  ││105  ││110  │  │  │  │201  ││205  │             │   │
│  │  └──┬──┘└──┬──┘└──┬──┘  │  │  └──┬──┘└──┬──┘             │   │
│  │     │      │      │     │  │     │      │                │   │
│  │  [CAM]  [CAM]  [CAM]    │  │  [CAM]  [CAM]               │   │
│  └─────────────────────────┘  └─────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
              ┌───────────────────────────────┐
              │   🧠 CENTRAL BRAIN (Go/Fiber) │
              │   WebSocket + REST API        │
              │   Port: 8080                  │
              └───────────────────────────────┘
                     │              │
          ┌──────────┘              └──────────┐
          ▼                                    ▼
┌─────────────────────┐              ┌─────────────────────┐
│  👁️ AI ENGINE       │              │  💻 DASHBOARD       │
│  Python + YOLOv8    │              │  Next.js 14         │
│  Object Detection   │              │  KAI Enterprise UI  │
└─────────────────────┘              └─────────────────────┘
```

---

## 🔐 Multi-Tier Access Control

Sistem menggunakan **Role-Based Access Control (RBAC)** dengan 3 level:

| Level | Role | Akses | Endpoint |
|-------|------|-------|----------|
| 1 | **JPL Operator** | Hanya 2-4 kamera di pos mereka | `/api/hierarchy?role=jpl` |
| 2 | **Station Master** | Semua JPL di bawah stasiun | `/api/hierarchy?role=station` |
| 3 | **DAOP Command** | Seluruh region + Global Map | `/api/hierarchy?role=daop` |

---

## 🛠️ Tech Stack

### Backend: Central Brain
- **Language**: Go (Golang) 1.20+
- **Framework**: Fiber v2
- **Real-time**: WebSocket (gorilla/websocket)
- **Features**: CORS, Logger Middleware

### AI Engine: The Eye
- **Language**: Python 3.9+
- **Model**: Ultralytics YOLOv8
- **Computer Vision**: OpenCV
- **Detection**: Person, Car, Motorcycle, Truck

### Frontend: Command Dashboard
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Theme**: KAI Enterprise Light Theme
- **Maps**: Leaflet.js
- **Icons**: Lucide React

---

## 🚀 How to Run (Instructions for Judges)

### Prerequisites
```bash
# Required installations
- Go 1.20+
- Python 3.9+ with pip
- Node.js 18+ with npm
```

### Step 1: Start The Brain 🧠
```bash
cd central-brain
go run main.go

# Output:
# ╔══════════════════════════════════════════════════════════╗
# ║     AEON RAILGUARD - CENTRAL BRAIN v2.0                  ║
# ║     Multi-Tier Access Control System                     ║
# ╚══════════════════════════════════════════════════════════╝
# Server running on http://localhost:8080
```

### Step 2: Launch The Eye 👁️
```bash
cd ai-engine
pip install -r requirements.txt
python app.py

# AI Detection active on port 5000
```

### Step 3: Open The Dashboard 💻
```bash
cd command-dashboard
npm install
npm run dev

# Dashboard live at http://localhost:3000
```

### Step 4: Test the API
```bash
# JPL Operator View (Limited)
curl http://localhost:8080/api/hierarchy?role=jpl

# Station Master View
curl http://localhost:8080/api/hierarchy?role=station

# DAOP Command View (Full Access)
curl http://localhost:8080/api/hierarchy?role=daop
```

---

## 📁 Project Structure

```
Aeon-Railguard/
├── central-brain/          # Go Backend (The Brain)
│   ├── main.go             # Main server with WebSocket & REST API
│   └── go.mod              # Go dependencies
│
├── ai-engine/              # Python AI (The Eye)
│   ├── app.py              # YOLOv8 detection server
│   └── requirements.txt    # Python dependencies
│
├── command-dashboard/      # Next.js Frontend (The Face)
│   ├── app/
│   │   ├── page.tsx        # Landing page (7 sections)
│   │   ├── login/          # Secure login page
│   │   └── dashboard/      # Enterprise dashboard
│   ├── components/         # Reusable components
│   └── public/images/      # Static assets
│
└── README.md               # You are here!
```

---

## 🎯 Demo Scenarios

### Scenario 1: Normal Monitoring
- Semua kamera ONLINE (hijau)
- Train distance > 3km = STATUS SAFE
- City Action: MONITORING

### Scenario 2: Warning State
- Train approaching < 3km
- Dashboard turns YELLOW
- City Action: TRAFFIC CAUTION ACTIVATED

### Scenario 3: Critical Emergency
- Object detected in ROI + Train < 1km
- Dashboard turns RED with alarm
- City Action: DISPATCHING POLICE & AMBULANCE
- Traffic lights override to RED

---

## 📂 External Resources (Dataset & Media)

Karena keterbatasan GitHub (max 100MB/file), dataset dan media disimpan di Google Drive:

| Resource | Link | Keterangan |
|----------|------|------------|
| 📽️ **Video Training** | [Google Drive](https://drive.google.com/drive/folders/1ORK_rs61H6-Bvjnoo3fjQgpnP0WlgIPf?usp=sharing) | Video perlintasan kereta untuk demo AI |
| 📸 **Dataset Gambar** | [Google Drive](https://drive.google.com/drive/folders/1ORK_rs61H6-Bvjnoo3fjQgpnP0WlgIPf?usp=sharing) | Sorted training images (motor, mobil, orang, kereta) |
| 🎨 **Presentasi** | [Canva](https://www.canva.com/design/DAG6zLVFxrs/oU-DA0C1e9cb53sBO8eTug/edit) | Slide presentasi project |

### Setup Dataset:
```bash
# Download dari Google Drive, lalu extract ke:
ai-engine/datasets/sorted_data/
ai-engine/datasets/videos/
```

---

## 🏆 Team

<p align="center">
  <strong>Developed with Pride by</strong><br/>
  <h2 align="center">🚀 Team GenZ AI Jombang 🚀</h2>
</p>

<p align="center">
  <em>Dikembangkan dengan Bangga di Jombang, Indonesia</em><br/>
  <strong>Ekraf Tech Summit 2025</strong>
</p>

---

## 📜 License

This project is built for **Ekraf Tech Summit 2025** competition.

---

<p align="center">
  <strong>🇮🇩 100% Karya Anak Bangsa 🇮🇩</strong><br/>
  <em>Solving Real Problems with Real Technology</em>
</p>
