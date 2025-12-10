package api

import (
	"log"
	"strconv"

	"central-brain/models"
	"central-brain/storage"

	"github.com/gofiber/fiber/v2"
)

// HandleHistory exposes detection history for UI.
// If fetchFn is provided, it will be used as the primary source (e.g., DB).
// In-memory history is used as a fallback or when fetchFn is nil.
func HandleHistory(history *storage.HistoryStore, fetchFn func(limit int) ([]models.DetectionPayload, error)) fiber.Handler {
	return func(c *fiber.Ctx) error {
		limit := 100
		if q := c.Query("limit"); q != "" {
			if n, err := strconv.Atoi(q); err == nil && n > 0 && n <= 500 {
				limit = n
			}
		}

		var (
			list []models.DetectionPayload
			err  error
		)

		if fetchFn != nil {
			list, err = fetchFn(limit)
			if err != nil {
				log.Printf("[DB] failed to fetch history, fallback to memory: %v", err)
			}
		}

		if list == nil && history != nil {
			memList := history.List()
			if len(memList) > limit {
				list = memList[len(memList)-limit:]
			} else {
				list = memList
			}
		}

		if list == nil {
			list = []models.DetectionPayload{}
		}

		return c.JSON(fiber.Map{
			"history": list,
			"total":   len(list),
			"source":  detectSource(fetchFn != nil, list),
		})
	}
}

func detectSource(hasDB bool, list []models.DetectionPayload) string {
	if hasDB && len(list) >= 0 {
		return "db"
	}
	return "memory"
}

// DetectSource is re-used by detection handler.
func DetectSource(hasDB bool, list []models.DetectionPayload) string {
	return detectSource(hasDB, list)
}

