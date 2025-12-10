package middleware

import (
	"github.com/gofiber/fiber/v2"
)

// ErrorHandler is a centralized error handler
func ErrorHandler(c *fiber.Ctx, err error) error {
	code := fiber.StatusInternalServerError
	message := "Internal server error"

	// Check if it's a Fiber error
	if e, ok := err.(*fiber.Error); ok {
		code = e.Code
		message = e.Message
	}

	// Log the error
	log.WithFields(map[string]interface{}{
		"error":  err.Error(),
		"path":   c.Path(),
		"method": c.Method(),
	}).Error("Request Error")

	// Return error response
	return c.Status(code).JSON(fiber.Map{
		"error":   "server_error",
		"message": message,
		"code":    code,
	})
}

// Recover middleware for panic recovery
func Recover() fiber.Handler {
	return func(c *fiber.Ctx) error {
		defer func() {
			if r := recover(); r != nil {
				log.WithFields(map[string]interface{}{
					"panic":  r,
					"path":   c.Path(),
					"method": c.Method(),
				}).Error("Panic Recovered")

				c.Status(500).JSON(fiber.Map{
					"error":   "server_panic",
					"message": "Internal server error - panic recovered",
				})
			}
		}()
		return c.Next()
	}
}
