package api

import (
	"github.com/gofiber/fiber/v2"
)

// HandleGetDetections returns list of detection records
// @Summary Get Detections
// @Description Get list of AI detection records
// @Tags detections
// @Security BearerAuth
// @Produce json
// @Param limit query int false "Limit results" default(50)
// @Param severity query string false "Filter by severity"
// @Success 200 {object} models.PaginatedResponse
// @Failure 401 {object} models.ErrorInfo
// @Router /api/detections [get]
func HandleGetDetections(c *fiber.Ctx) error {
	// TODO: Implement detection history from database
	// For now, return mock data
	return c.JSON(fiber.Map{
		"detections": []fiber.Map{
			{
				"id":           "DET-123456",
				"camera_id":    "CCTV-JBG-01",
				"object_class": "person",
				"confidence":   0.95,
				"severity":     "warning",
				"timestamp":    "2025-12-10T12:30:45Z",
			},
		},
		"total":  1,
		"limit":  50,
		"offset": 0,
	})
}
