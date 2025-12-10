// @title Aeon RailGuard API
// @version 2.1.0
// @description REST API for Aeon RailGuard Central Brain with JWT authentication and RBAC
// @contact.name API Support
// @contact.email hello@aeonrailguard.id
// @host localhost:8080
// @BasePath /
// @securityDefinitions.apikey BearerAuth
// @in header
// @name Authorization
package main

import (
	"context"
	"log"
	"os"

	"central-brain/api"
	"central-brain/middleware"
	"central-brain/models"
	"central-brain/realtime"
	"central-brain/storage"
	"central-brain/stream"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/websocket/v2"
)

func main() {
	// Initialize realtime hub and history store
	hub := realtime.NewHub()
	go hub.Run()
	history := storage.NewHistoryStore()
	mjpeg := stream.NewMJPEGHub()
	go mjpeg.Run()

	// Initialize SQLite database (optional, falls back to memory)
	db, err := NewDatabase(os.Getenv("DB_DSN"))
	if err != nil {
		log.Printf("[DB] SQLite disabled, using in-memory only: %v", err)
	} else {
		log.Printf("[DB] SQLite ready")
	}

	// Initialize Fiber app
	app := fiber.New(fiber.Config{
		AppName:      "Aeon RailGuard Central Brain v2.1.0",
		ErrorHandler: middleware.ErrorHandler,
	})

	// Global Middlewares
	app.Use(middleware.Recover()) // Panic recovery
	app.Use(middleware.Logger())  // Request logging
	app.Use(cors.New(cors.Config{ // CORS
		AllowOrigins: "*",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
		AllowMethods: "GET, POST, PUT, DELETE, OPTIONS",
	}))

	// Serve evidence images saved by AI engine (shared folder ../ai-engine/evidence)
	app.Static("/evidence", "../ai-engine/evidence")

	// Root endpoint
	app.Get("/", handleRoot)
	app.Post("/api/internal/push", api.HandleInternalPush(hub, history, func(p models.DetectionPayload) error {
		if db == nil {
			return nil
		}
		return db.InsertDetection(context.Background(), p)
	}))
	app.Post("/api/internal/stream/cam1", stream.IngestFrame(mjpeg))
	app.Get("/api/history", api.HandleHistory(history, func(limit int) ([]models.DetectionPayload, error) {
		if db == nil {
			return nil, nil
		}
		return db.ListDetections(context.Background(), limit)
	}))
	app.Get("/api/detections", api.HandleDetections(history, func(limit int) ([]models.DetectionPayload, error) {
		if db == nil {
			return nil, nil
		}
		return db.ListDetections(context.Background(), limit)
	}))

	// Public endpoints (no auth required)
	app.Post("/api/auth/login", api.HandleLogin)
	app.Get("/api/health", api.HandleHealth)
	app.All("/api/config/ai", api.HandleAIConfig(func(ctx context.Context, key string) (string, error) {
		if db == nil {
			return "", nil
		}
		return db.GetSetting(ctx, key)
	}, func(ctx context.Context, key, value string) error {
		if db == nil {
			return fiber.ErrNotImplemented
		}
		return db.UpsertSetting(ctx, key, value)
	}))

	// Websocket endpoint (no auth for demo)
	app.Use("/ws", func(c *fiber.Ctx) error {
		if websocket.IsWebSocketUpgrade(c) {
			return c.Next()
		}
		return fiber.ErrUpgradeRequired
	})
	app.Get("/ws", websocket.New(realtime.WSHandler(hub)))

	// MJPEG stream endpoint
	app.Get("/stream/cam1", stream.StreamMJPEG(mjpeg))

	// Protected endpoints (JWT required)
	protected := app.Group("/api")
	protected.Use(middleware.AuthRequired())

	// Hierarchy (RBAC filtered)
	protected.Get("/hierarchy", api.HandleGetHierarchy)

	// Cameras (requires JPL_OFFICER or higher)
	protected.Get("/cameras", middleware.RequireRole(models.RoleJPLOfficer), api.HandleGetCameras)

	// Detections (requires JPL_OFFICER or higher)
	protected.Get("/detections", middleware.RequireRole(models.RoleJPLOfficer), api.HandleDetections(history, func(limit int) ([]models.DetectionPayload, error) {
		if db == nil {
			return nil, nil
		}
		return db.ListDetections(context.Background(), limit)
	}))

	// ============================================
	// HACKATHON FASE 1: JPL Camera Endpoints
	// ============================================
	// Public endpoints (no auth for demo purposes)
	app.Get("/api/jpl", api.HandleGetAllJPLs)
	app.Get("/api/jpl/:jpl_id/cameras", api.HandleGetJPLCameras)

	// Swagger documentation
	// Uncomment after running: go install github.com/swaggo/swag/cmd/swag@latest && swag init
	// app.Get("/api/docs/*", swagger.HandlerDefault)

	// Print banner
	printBanner()

	// Start server
	log.Fatal(app.Listen(":8080"))
}

func handleRoot(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{
		"service": "Aeon RailGuard - Central Brain",
		"version": "2.1.0",
		"status":  "ONLINE",
		"features": []string{
			"JWT Authentication",
			"Role-Based Access Control (RBAC)",
			"Structured Logging",
			"Error Handling",
			"API Documentation",
		},
		"endpoints": fiber.Map{
			"health":      "GET /api/health",
			"login":       "POST /api/auth/login",
			"hierarchy":   "GET /api/hierarchy (Protected)",
			"cameras":     "GET /api/cameras (Protected)",
			"detections":  "GET /api/detections (Protected)",
			"jpl_list":    "GET /api/jpl (Public)",
			"jpl_cameras": "GET /api/jpl/:jpl_id/cameras (Public)",
		},
	})
}

func printBanner() {
	log.Println("╔══════════════════════════════════════════════════════════╗")
	log.Println("║     AEON RAILGUARD - CENTRAL BRAIN v2.1.0                ║")
	log.Println("║     REST API with JWT Auth & RBAC                        ║")
	log.Println("╠══════════════════════════════════════════════════════════╣")
	log.Println("║  HTTP Server  : http://localhost:8080                    ║")
	log.Println("║  API Docs     : http://localhost:8080/api/docs           ║")
	log.Println("╠══════════════════════════════════════════════════════════╣")
	log.Println("║  POST /api/auth/login    - User authentication           ║")
	log.Println("║  GET  /api/health        - Health check                  ║")
	log.Println("║  GET  /api/hierarchy     - Organization hierarchy (RBAC) ║")
	log.Println("║  GET  /api/cameras       - Camera list                   ║")
	log.Println("║  GET  /api/detections    - Detection records             ║")
	log.Println("╠══════════════════════════════════════════════════════════╣")
	log.Println("║  Demo Credentials:                                       ║")
	log.Println("║    ID: DAOP-7    Password: 123456 (DAOP Admin)           ║")
	log.Println("║    ID: STA-JBG   Password: 123456 (Station Master)       ║")
	log.Println("║    ID: JPL-102   Password: 123456 (JPL Officer)          ║")
	log.Println("╚══════════════════════════════════════════════════════════╝")
}
