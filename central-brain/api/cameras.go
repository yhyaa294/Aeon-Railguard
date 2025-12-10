package api

import (
	"github.com/gofiber/fiber/v2"
)

// HandleGetCameras returns list of cameras
// @Summary Get Cameras
// @Description Get list of cameras accessible to user
// @Tags cameras
// @Security BearerAuth
// @Produce json
// @Param status query string false "Filter by status"
// @Param limit query int false "Limit results" default(10)
// @Success 200 {object} models.PaginatedResponse
// @Failure 401 {object} models.ErrorInfo
// @Router /api/cameras [get]
func HandleGetCameras(c *fiber.Ctx) error {
	// TODO: Implement camera listing based on user role
	// For now, return mock data
	return c.JSON(fiber.Map{
		"cameras": []fiber.Map{
			{
				"id":     "CCTV-JBG-01",
				"name":   "CCTV-JBG-01 (Arah Timur)",
				"type":   "CCTV",
				"status": "ONLINE",
				"location": fiber.Map{
					"lat":  -7.5456,
					"long": 112.2134,
				},
				"post_id": "JPL-102",
			},
		},
		"total":  1,
		"limit":  10,
		"offset": 0,
	})
}
