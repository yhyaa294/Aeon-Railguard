package middleware

import (
	"strings"

	"central-brain/auth"

	"github.com/gofiber/fiber/v2"
)

// AuthRequired validates JWT token from Authorization header
func AuthRequired() fiber.Handler {
	return func(c *fiber.Ctx) error {
		authHeader := c.Get("Authorization")
		if authHeader == "" {
			return c.Status(401).JSON(fiber.Map{
				"error":   "unauthorized",
				"message": "Missing authorization header",
			})
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			return c.Status(401).JSON(fiber.Map{
				"error":   "unauthorized",
				"message": "Invalid authorization format. Expected: Bearer <token>",
			})
		}

		tokenString := parts[1]
		claims, err := auth.ValidateToken(tokenString)
		if err != nil {
			return c.Status(401).JSON(fiber.Map{
				"error":   "unauthorized",
				"message": "Invalid or expired token",
			})
		}

		// Store claims in context for use in handlers
		c.Locals("user_id", claims.UserID)
		c.Locals("role", claims.Role)
		c.Locals("post_id", claims.PostID)
		c.Locals("station_id", claims.StationID)

		return c.Next()
	}
}
