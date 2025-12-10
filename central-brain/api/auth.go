package api

import (
	"central-brain/auth"
	"central-brain/models"
	"central-brain/services"

	"github.com/gofiber/fiber/v2"
)

// HandleLogin authenticates user and returns JWT token
// @Summary User Login
// @Description Authenticate user with ID and password
// @Tags auth
// @Accept json
// @Produce json
// @Param credentials body models.LoginRequest true "Login Credentials"
// @Success 200 {object} models.LoginResponse
// @Failure 400 {object} models.ErrorInfo
// @Failure 401 {object} models.ErrorInfo
// @Router /api/auth/login [post]
func HandleLogin(c *fiber.Ctx) error {
	var req models.LoginRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error":   "bad_request",
			"message": "Invalid request body",
		})
	}

	// Validate credentials
	user, err := services.ValidateLogin(req.ID, req.Password)
	if err != nil {
		return c.Status(401).JSON(fiber.Map{
			"error":   "unauthorized",
			"message": "Invalid credentials",
		})
	}

	// Generate JWT token
	token, err := auth.GenerateToken(user.ID, user.Role, user.PostID, user.StationID)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error":   "server_error",
			"message": "Failed to generate token",
		})
	}

	// Return success response
	return c.JSON(models.LoginResponse{
		AccessToken: token,
		ExpiresIn:   86400, // 24 hours
		User: models.UserInfo{
			ID:   user.ID,
			Role: user.Role,
			Name: user.Name,
		},
	})
}
