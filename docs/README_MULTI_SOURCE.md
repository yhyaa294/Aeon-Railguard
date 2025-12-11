# Multi-Source AI Engine - Cara Menjalankan

## Cara 1: Menggunakan run_multi_source.py (Recommended)

```bash
cd ai-engine
python run_multi_source.py
```

Script ini akan menjalankan 4 AI Engine instances sekaligus:
- **CAM1**: Webcam (TITIK_A)
- **CAM2**: IMG_20251207_143825040.jpg (TITIK_B)
- **CAM3**: IMG_20251207_143034721.jpg (TITIK_C)
- **CAM4**: VID_20251207_142949636.mp4 (TITIK_D)

**Perhatikan output di terminal** untuk melihat:
- Apakah semua process start dengan benar
- Apakah ada error saat load file
- Apakah frame dikirim ke backend (lihat log `[STREAM]`)

## Cara 2: Menggunakan start_all.bat (Windows)

Double-click `start_all.bat` atau jalankan di CMD:
```cmd
cd ai-engine
start_all.bat
```

Ini akan membuka 4 window terpisah, satu untuk setiap camera. Lebih mudah untuk debug karena bisa lihat log masing-masing.

## Troubleshooting

### Video tidak muncul di dashboard?

1. **Cek apakah backend berjalan:**
   ```bash
   # Di terminal lain, cek backend
   curl http://localhost:8080/api/health
   ```

2. **Cek apakah frame dikirim:**
   - Lihat log di terminal `run_multi_source.py`
   - Cari log `[STREAM] ✓ Frame sent to ...`
   - Jika tidak ada, berarti AI Engine tidak mengirim frame

3. **Test manual satu camera:**
   ```bash
   cd ai-engine
   python test_single_cam.py
   ```
   Ini akan test cam4 dan mengirim 30 frame ke backend.

4. **Cek browser console (F12):**
   - Buka Network tab
   - Filter: `/stream/cam`
   - Lihat apakah request ke `/stream/cam2/latest`, `/stream/cam3/latest`, `/stream/cam4/latest` berhasil
   - Status harus 200, bukan 404 atau error

5. **Cek apakah file ada:**
   ```bash
   cd ai-engine
   python test_sources.py
   ```

### Frame tidak dikirim?

- Pastikan `STREAM_URL` environment variable benar
- Pastikan backend berjalan di `http://localhost:8080`
- Cek log error di terminal

### Video tidak terdeteksi?

- YOLOv8 default tidak punya class "train"
- Kereta biasanya terdeteksi sebagai "truck" atau "bus"
- Confidence threshold sudah diturunkan ke 0.40 untuk lebih sensitif

## Manual Start (untuk debug)

Jika ingin start manual satu per satu untuk debug:

**CAM1 (Webcam):**
```bash
cd ai-engine
set STREAM_URL=http://localhost:8080/api/internal/stream/cam1
set CAMERA_ID=TITIK_A
python app.py --source 0
```

**CAM2 (Image):**
```bash
cd ai-engine
set STREAM_URL=http://localhost:8080/api/internal/stream/cam2
set CAMERA_ID=TITIK_B
python app.py --source datasets/sorted_data/IMG_20251207_143825040.jpg
```

**CAM3 (Image):**
```bash
cd ai-engine
set STREAM_URL=http://localhost:8080/api/internal/stream/cam3
set CAMERA_ID=TITIK_C
python app.py --source datasets/sorted_data/IMG_20251207_143034721.jpg
```

**CAM4 (Video):**
```bash
cd ai-engine
set STREAM_URL=http://localhost:8080/api/internal/stream/cam4
set CAMERA_ID=TITIK_D
python app.py --source datasets/videos/VID_20251207_142949636.mp4
```

