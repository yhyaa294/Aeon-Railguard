package middleware

import (
	"central-brain/models"

	"github.com/gofiber/fiber/v2"
)

// RequireRole checks if user has minimum required role level
func RequireRole(minRole string) fiber.Handler {
	return func(c *fiber.Ctx) error {
		userRole, ok := c.Locals("role").(string)
		if !ok {
			return c.Status(401).JSON(fiber.Map{
				"error":   "unauthorized",
				"message": "User role not found in context",
			})
		}

		userLevel := models.RoleHierarchy[userRole]
		minLevel := models.RoleHierarchy[minRole]

		if userLevel < minLevel {
			return c.Status(403).JSON(fiber.Map{
				"error":   "forbidden",
				"message": "Insufficient permissions. Required role: " + minRole,
			})
		}

		return c.Next()
	}
}

// GetUserRole retrieves the user's role from context
func GetUserRole(c *fiber.Ctx) string {
	role, ok := c.Locals("role").(string)
	if !ok {
		return ""
	}
	return role
}

// GetUserID retrieves the user's ID from context
func GetUserID(c *fiber.Ctx) string {
	userID, ok := c.Locals("user_id").(string)
	if !ok {
		return ""
	}
	return userID
}

// GetPostID retrieves the user's post ID from context
func GetPostID(c *fiber.Ctx) string {
	postID, ok := c.Locals("post_id").(string)
	if !ok {
		return ""
	}
	return postID
}

// GetStationID retrieves the user's station ID from context
func GetStationID(c *fiber.Ctx) string {
	stationID, ok := c.Locals("station_id").(string)
	if !ok {
		return ""
	}
	return stationID
}
