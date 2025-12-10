package api

import (
	"central-brain/middleware"
	"central-brain/services"

	"github.com/gofiber/fiber/v2"
)

// HandleGetHierarchy returns organization hierarchy based on user role
// @Summary Get Hierarchy
// @Description Get organization hierarchy filtered by user's role (RBAC)
// @Tags hierarchy
// @Security BearerAuth
// @Produce json
// @Success 200 {object} models.Region
// @Failure 401 {object} models.ErrorInfo
// @Failure 404 {object} models.ErrorInfo
// @Router /api/hierarchy [get]
func HandleGetHierarchy(c *fiber.Ctx) error {
	role := middleware.GetUserRole(c)
	postID := middleware.GetPostID(c)
	stationID := middleware.GetStationID(c)

	data := services.GetHierarchyForRole(role, postID, stationID)

	if data == nil {
		return c.Status(404).JSON(fiber.Map{
			"error":   "not_found",
			"message": "Data not found for user role",
		})
	}

	return c.JSON(data)
}
