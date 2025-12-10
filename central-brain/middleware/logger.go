package middleware

import (
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/sirupsen/logrus"
)

var log = logrus.New()

func init() {
	// Configure logrus
	log.SetFormatter(&logrus.JSONFormatter{
		TimestampFormat: "2006-01-02 15:04:05",
	})
	log.SetLevel(logrus.InfoLevel)
}

// Logger middleware logs all HTTP requests
func Logger() fiber.Handler {
	return func(c *fiber.Ctx) error {
		start := time.Now()

		// Process request
		err := c.Next()

		// Log after response
		duration := time.Since(start)
		statusCode := c.Response().StatusCode()

		fields := logrus.Fields{
			"method":     c.Method(),
			"path":       c.Path(),
			"status":     statusCode,
			"duration":   duration.Milliseconds(),
			"ip":         c.IP(),
			"user_agent": c.Get("User-Agent"),
		}

		// Add user info if available
		if userID := c.Locals("user_id"); userID != nil {
			fields["user_id"] = userID
		}
		if role := c.Locals("role"); role != nil {
			fields["role"] = role
		}

		if statusCode >= 500 {
			log.WithFields(fields).Error("Server Error")
		} else if statusCode >= 400 {
			log.WithFields(fields).Warn("Client Error")
		} else {
			log.WithFields(fields).Info("HTTP Request")
		}

		return err
	}
}

// GetLogger returns the configured logrus instance
func GetLogger() *logrus.Logger {
	return log
}
