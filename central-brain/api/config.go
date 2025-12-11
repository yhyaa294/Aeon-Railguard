package api

import (
	"context"
	"encoding/json"

	"github.com/gofiber/fiber/v2"
)

// HandleAIConfig returns/updates AI config (ROI + threshold + toggles) stored as JSON string in DB.
func HandleAIConfig(
	getFn func(ctx context.Context, key string) (string, error),
	setFn func(ctx context.Context, key, value string) error,
) fiber.Handler {
	return func(c *fiber.Ctx) error {
		switch c.Method() {
		case fiber.MethodGet:
			if getFn == nil {
				return c.JSON(fiber.Map{"config": fiber.Map{}})
			}
			val, err := getFn(c.Context(), "ai_config")
			if err != nil {
				return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "db_error"})
			}
			if val == "" {
				return c.JSON(fiber.Map{"config": fiber.Map{}})
			}
			var cfg map[string]interface{}
			if err := json.Unmarshal([]byte(val), &cfg); err != nil {
				return c.JSON(fiber.Map{"config": fiber.Map{}})
			}
			return c.JSON(fiber.Map{"config": cfg})

		case fiber.MethodPost, fiber.MethodPut:
			if setFn == nil {
				return c.Status(fiber.StatusNotImplemented).JSON(fiber.Map{"error": "db_disabled"})
			}
			var body map[string]interface{}
			if err := c.BodyParser(&body); err != nil {
				return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "bad_request"})
			}
			raw, err := json.Marshal(body)
			if err != nil {
				return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "bad_request"})
			}
			if err := setFn(c.Context(), "ai_config", string(raw)); err != nil {
				return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "db_error"})
			}
			return c.JSON(fiber.Map{"status": "saved"})
		default:
			return c.SendStatus(fiber.StatusMethodNotAllowed)
		}
	}
}



