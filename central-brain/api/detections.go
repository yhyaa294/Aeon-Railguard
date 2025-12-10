package api

import (
	"strconv"

	"central-brain/models"
	"central-brain/storage"

	"github.com/gofiber/fiber/v2"
)

// HandleDetections returns list of detection records (DB preferred, fallback to memory).
func HandleDetections(
	history *storage.HistoryStore,
	fetchFn func(limit int) ([]models.DetectionPayload, error),
) fiber.Handler {
	return func(c *fiber.Ctx) error {
		limit := 50
		if q := c.Query("limit"); q != "" {
			if n, err := strconv.Atoi(q); err == nil && n > 0 && n <= 500 {
				limit = n
			}
		}

		var list []models.DetectionPayload
		var err error

		if fetchFn != nil {
			list, err = fetchFn(limit)
			if err != nil {
				// fallback to memory below
				list = nil
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
			"detections": list,
			"total":      len(list),
			"limit":      limit,
			"source":     detectSource(fetchFn != nil, list),
		})
	}
}
