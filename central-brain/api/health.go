package api

import (
	"time"

	"github.com/gofiber/fiber/v2"
)

// HandleHealth returns API health status
// @Summary Health Check
// @Description Get API health and database status
// @Tags system
// @Produce json
// @Success 200 {object} models.HealthResponse
// @Router /api/health [get]
func HandleHealth(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{
		"status":    "healthy",
		"version":   "2.1.0",
		"database":  "in-memory", // Change to "connected" when using real DB
		"timestamp": time.Now().Format(time.RFC3339),
	})
}
