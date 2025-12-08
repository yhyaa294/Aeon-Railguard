package main

import (
	"encoding/json"
	"log"
	"sync"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/websocket/v2"
)

// SystemState represents the real-time train and city status
type SystemState struct {
	TrainID    string  `json:"train_id"`
	Speed      float64 `json:"speed"`
	Distance   float64 `json:"distance"`
	Status     string  `json:"status"`
	CityAction string  `json:"city_action"`
	Timestamp  string  `json:"timestamp"`
}

// IncidentPayload represents incoming AI detection alerts
type IncidentPayload struct {
	Type        string  `json:"type"`
	ObjectClass string  `json:"object_class"`
	Confidence  float64 `json:"confidence"`
	InROI       bool    `json:"in_roi"`
}

var (
	// Current system state
	state = SystemState{
		TrainID:    "KA-2045",
		Speed:      120.0,
		Distance:   10.0,
		Status:     "SAFE",
		CityAction: "MONITORING",
		Timestamp:  time.Now().Format("15:04:05"),
	}

	// Mutex for thread-safe state access
	stateMutex sync.RWMutex

	// WebSocket clients
	wsClients    = make(map[*websocket.Conn]bool)
	wsClientsMux sync.Mutex

	// Incident flag
	incidentActive = false
)

func main() {
	// Initialize Fiber
	app := fiber.New(fiber.Config{
		AppName: "Aeon RailGuard - Central Brain v2.0",
	})

	// Middleware
	app.Use(logger.New(logger.Config{
		Format:     "[${time}] ${status} - ${method} ${path} (${latency})\n",
		TimeFormat: "15:04:05",
	}))

	// CORS - Allow all origins for demo
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowHeaders: "Origin, Content-Type, Accept",
		AllowMethods: "GET, POST, OPTIONS",
	}))

	// Routes
	app.Get("/", handleRoot)
	app.Get("/api/status", handleGetStatus)
	app.Post("/api/incident", handleIncident)
	app.Post("/api/reset", handleReset)

	// WebSocket upgrade middleware
	app.Use("/ws", func(c *fiber.Ctx) error {
		if websocket.IsWebSocketUpgrade(c) {
			return c.Next()
		}
		return fiber.ErrUpgradeRequired
	})

	// WebSocket endpoint
	app.Get("/ws", websocket.New(handleWebSocket))

	// Start simulation engine
	go simulationEngine()

	// Start WebSocket broadcaster
	go wsBroadcaster()

	// Print startup banner
	printBanner()

	// Start server
	log.Fatal(app.Listen(":8080"))
}

func printBanner() {
	log.Println("╔══════════════════════════════════════════════════════════╗")
	log.Println("║     AEON RAILGUARD - CENTRAL BRAIN v2.0                  ║")
	log.Println("║     Smart City Emergency Response Platform               ║")
	log.Println("╠══════════════════════════════════════════════════════════╣")
	log.Println("║  HTTP Server  : http://localhost:8080                    ║")
	log.Println("║  WebSocket    : ws://localhost:8080/ws                   ║")
	log.Println("║  API Status   : GET  /api/status                         ║")
	log.Println("║  AI Incident  : POST /api/incident                       ║")
	log.Println("║  Reset Sim    : POST /api/reset                          ║")
	log.Println("╠══════════════════════════════════════════════════════════╣")
	log.Println("║  Simulation   : Distance decreases 0.2 km/sec            ║")
	log.Println("║  Status Logic : >3km=SAFE, <3km=WARNING, <1km=CRITICAL   ║")
	log.Println("╚══════════════════════════════════════════════════════════╝")
}

// handleRoot returns service info
func handleRoot(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{
		"service": "Aeon RailGuard - Central Brain",
		"version": "2.0.0",
		"status":  "ONLINE",
		"endpoints": fiber.Map{
			"status":   "GET /api/status",
			"incident": "POST /api/incident",
			"reset":    "POST /api/reset",
			"websocket": "WS /ws",
		},
	})
}

// handleGetStatus returns current system state
func handleGetStatus(c *fiber.Ctx) error {
	stateMutex.RLock()
	defer stateMutex.RUnlock()
	return c.JSON(state)
}

// handleIncident processes AI detection alerts
func handleIncident(c *fiber.Ctx) error {
	var payload IncidentPayload
	if err := c.BodyParser(&payload); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid payload"})
	}

	log.Println("╔══════════════════════════════════════════════════════════╗")
	log.Println("║  🚨 INCIDENT ALERT RECEIVED FROM AI ENGINE               ║")
	log.Println("╠══════════════════════════════════════════════════════════╣")
	log.Printf("║  Type       : %s\n", payload.Type)
	log.Printf("║  Object     : %s\n", payload.ObjectClass)
	log.Printf("║  Confidence : %.1f%%\n", payload.Confidence*100)
	log.Printf("║  In ROI     : %v\n", payload.InROI)
	log.Println("╠══════════════════════════════════════════════════════════╣")
	log.Println("║  ACTION: TRIGGERING EMERGENCY PROTOCOL                   ║")
	log.Println("║  → Dispatching Police Unit                               ║")
	log.Println("║  → Dispatching Ambulance                                 ║")
	log.Println("║  → Setting Traffic Lights to RED                         ║")
	log.Println("║  → Sending STOP signal to Train                          ║")
	log.Println("╚══════════════════════════════════════════════════════════╝")

	// Activate incident mode
	stateMutex.Lock()
	incidentActive = true
	state.Status = "CRITICAL"
	state.CityAction = "DISPATCHING POLICE & AMBULANCE"
	stateMutex.Unlock()

	// Auto-clear incident after 8 seconds (for demo loop)
	go func() {
		time.Sleep(8 * time.Second)
		stateMutex.Lock()
		incidentActive = false
		state.Distance = 10.0
		state.Speed = 120.0
		log.Println("[SYSTEM] Incident cleared - Simulation reset")
		stateMutex.Unlock()
	}()

	return c.Status(201).JSON(fiber.Map{
		"status":  "ALERT_RECEIVED",
		"action":  "EMERGENCY_PROTOCOL_ACTIVATED",
		"message": "Police and Ambulance dispatched",
	})
}

// handleReset resets the simulation
func handleReset(c *fiber.Ctx) error {
	stateMutex.Lock()
	state.Distance = 10.0
	state.Speed = 120.0
	state.Status = "SAFE"
	state.CityAction = "MONITORING"
	incidentActive = false
	stateMutex.Unlock()

	log.Println("[SYSTEM] Simulation manually reset to initial state")

	return c.JSON(fiber.Map{
		"status":   "RESET_COMPLETE",
		"distance": 10.0,
	})
}

// handleWebSocket manages WebSocket connections
func handleWebSocket(c *websocket.Conn) {
	// Register client
	wsClientsMux.Lock()
	wsClients[c] = true
	clientCount := len(wsClients)
	wsClientsMux.Unlock()

	log.Printf("[WS] Client connected (Total: %d)\n", clientCount)

	// Send initial state
	stateMutex.RLock()
	initialData, _ := json.Marshal(state)
	stateMutex.RUnlock()
	c.WriteMessage(websocket.TextMessage, initialData)

	// Cleanup on disconnect
	defer func() {
		wsClientsMux.Lock()
		delete(wsClients, c)
		remaining := len(wsClients)
		wsClientsMux.Unlock()
		c.Close()
		log.Printf("[WS] Client disconnected (Remaining: %d)\n", remaining)
	}()

	// Keep connection alive (read messages but ignore them)
	for {
		_, _, err := c.ReadMessage()
		if err != nil {
			break
		}
	}
}

// simulationEngine runs the train distance simulation
func simulationEngine() {
	ticker := time.NewTicker(1 * time.Second)
	defer ticker.Stop()

	log.Println("[SIM] Simulation engine started")

	for range ticker.C {
		stateMutex.Lock()

		// Update timestamp
		state.Timestamp = time.Now().Format("15:04:05")

		// Skip distance update if incident is active (train is braking)
		if incidentActive {
			// Simulate emergency braking
			if state.Speed > 0 {
				state.Speed -= 20.0
				if state.Speed < 0 {
					state.Speed = 0
				}
			}
			stateMutex.Unlock()
			continue
		}

		// Decrease distance by 0.2 km per second
		state.Distance -= 0.2
		if state.Distance < 0 {
			state.Distance = 0
		}

		// Status logic based on distance
		switch {
		case state.Distance < 1.0:
			state.Status = "CRITICAL"
			state.CityAction = "DISPATCHING POLICE & AMBULANCE"
		case state.Distance < 3.0:
			state.Status = "WARNING"
			state.CityAction = "TRAFFIC CAUTION ACTIVATED"
		default:
			state.Status = "SAFE"
			state.CityAction = "MONITORING"
		}

		// Reset simulation when train "passes" the crossing
		if state.Distance <= 0 {
			log.Println("[SIM] Train passed crossing - Resetting simulation")
			state.Distance = 10.0
			state.Speed = 120.0
			state.Status = "SAFE"
			state.CityAction = "MONITORING"
		}

		stateMutex.Unlock()
	}
}

// wsBroadcaster sends state updates to all connected WebSocket clients
func wsBroadcaster() {
	ticker := time.NewTicker(1 * time.Second)
	defer ticker.Stop()

	for range ticker.C {
		stateMutex.RLock()
		data, err := json.Marshal(state)
		stateMutex.RUnlock()

		if err != nil {
			continue
		}

		wsClientsMux.Lock()
		for client := range wsClients {
			if err := client.WriteMessage(websocket.TextMessage, data); err != nil {
				// Client disconnected, will be cleaned up in handleWebSocket
				client.Close()
				delete(wsClients, client)
			}
		}
		wsClientsMux.Unlock()
	}
}
