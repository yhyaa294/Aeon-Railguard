package api

import (
	"log"
	"time"

	"central-brain/models"
	"central-brain/realtime"
	"central-brain/storage"

	"github.com/gofiber/fiber/v2"
)

// HandleInternalPush ingests detection data from Python and broadcasts to all WS clients.
// Optional saveFn persists payloads to a database when provided.
func HandleInternalPush(
	hub *realtime.Hub,
	history *storage.HistoryStore,
	saveFn func(models.DetectionPayload) error,
) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var payload models.DetectionPayload
		if err := c.BodyParser(&payload); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error":   "bad_request",
				"message": "Invalid JSON payload",
			})
		}

		// Enforce defaults
		if payload.Type == "" {
			payload.Type = "detection"
		}
		if payload.Timestamp.IsZero() {
			payload.Timestamp = time.Now().UTC()
		}

		// Store history in-memory
		if history != nil {
			history.Append(payload)
		}

		// Persist to DB when available
		if saveFn != nil {
			if err := saveFn(payload); err != nil {
				log.Printf("[DB] failed to persist detection: %v", err)
			}
		}

		// Broadcast to websocket clients
		if hub != nil {
			hub.BroadcastJSON(payload)
		}

		return c.JSON(fiber.Map{
			"status":    "ok",
			"received":  payload.Type,
			"timestamp": payload.Timestamp,
		})
	}
}

