package api

import (
	"time"

	"github.com/gofiber/fiber/v2"
)

// JPLCamera represents a camera at a JPL checkpoint
type JPLCamera struct {
	ID          int       `json:"id"`
	Name        string    `json:"name"`
	Type        string    `json:"type"`
	Status      string    `json:"status"`
	Resolution  string    `json:"resolution"`
	FPS         int       `json:"fps"`
	LastPing    time.Time `json:"last_ping"`
	StreamURL   string    `json:"stream_url"`
	ThermalMode bool      `json:"thermal_mode"`
}

// In-memory camera data for JPL-102
var jplCameras = map[string][]JPLCamera{
	"102": {
		{
			ID:          1,
			Name:        "CAM-01 Arah Timur",
			Type:        "RGB",
			Status:      "ONLINE",
			Resolution:  "1920x1080",
			FPS:         30,
			LastPing:    time.Now(),
			StreamURL:   "http://localhost:8080/stream/cam1",
			ThermalMode: false,
		},
		{
			ID:          2,
			Name:        "CAM-02 Arah Barat",
			Type:        "RGB",
			Status:      "ONLINE",
			Resolution:  "1920x1080",
			FPS:         30,
			LastPing:    time.Now(),
			StreamURL:   "http://localhost:8080/stream/cam2",
			ThermalMode: false,
		},
		{
			ID:          3,
			Name:        "CAM-03 Thermal Utara",
			Type:        "THERMAL",
			Status:      "ONLINE",
			Resolution:  "640x480",
			FPS:         15,
			LastPing:    time.Now(),
			StreamURL:   "http://localhost:8080/stream/cam3",
			ThermalMode: true,
		},
		{
			ID:          4,
			Name:        "CAM-04 Thermal Selatan",
			Type:        "THERMAL",
			Status:      "ONLINE",
			Resolution:  "640x480",
			FPS:         15,
			LastPing:    time.Now(),
			StreamURL:   "http://localhost:8080/stream/cam4",
			ThermalMode: true,
		},
	},
	"105": {
		{
			ID:          1,
			Name:        "CAM-01 Peterongan Main",
			Type:        "RGB",
			Status:      "ONLINE",
			Resolution:  "1920x1080",
			FPS:         30,
			LastPing:    time.Now(),
			StreamURL:   "http://localhost:8080/stream/peterongan-cam1",
			ThermalMode: false,
		},
	},
}

// HandleGetJPLCameras returns cameras for a specific JPL post
// @Summary Get JPL Cameras
// @Description Get list of cameras for a specific JPL checkpoint
// @Tags jpl
// @Produce json
// @Param jpl_id path string true "JPL ID (e.g., 102, 105)"
// @Success 200 {array} JPLCamera
// @Failure 404 {object} fiber.Map
// @Router /api/jpl/{jpl_id}/cameras [get]
func HandleGetJPLCameras(c *fiber.Ctx) error {
	jplID := c.Params("jpl_id")

	cameras, exists := jplCameras[jplID]
	if !exists {
		return c.Status(404).JSON(fiber.Map{
			"error":   "not_found",
			"message": "JPL " + jplID + " tidak ditemukan",
		})
	}

	// Update last ping time
	for i := range cameras {
		cameras[i].LastPing = time.Now()
	}

	return c.JSON(fiber.Map{
		"jpl_id":       "JPL-" + jplID,
		"total":        len(cameras),
		"cameras":      cameras,
		"last_updated": time.Now().Format(time.RFC3339),
	})
}

// HandleGetAllJPLs returns list of all JPL checkpoints
func HandleGetAllJPLs(c *fiber.Ctx) error {
	jpls := []fiber.Map{}
	for id, cameras := range jplCameras {
		online := 0
		for _, cam := range cameras {
			if cam.Status == "ONLINE" {
				online++
			}
		}
		jpls = append(jpls, fiber.Map{
			"id":            "JPL-" + id,
			"total_cameras": len(cameras),
			"online":        online,
			"offline":       len(cameras) - online,
		})
	}

	return c.JSON(fiber.Map{
		"total": len(jpls),
		"jpls":  jpls,
	})
}
