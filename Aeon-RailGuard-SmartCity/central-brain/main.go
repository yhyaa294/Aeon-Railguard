package main

import (
	"log"
	"sync"
	"time"

	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

// --- Domain Models ---

type AlertPayload struct {
	Type       string  `json:"type"`
	Object     string  `json:"object"`
	Confidence float64 `json:"confidence"`
	Timestamp  float64 `json:"timestamp"`
}

type SystemState struct {
	Status          string  `json:"status"`           // SAFE, WARNING, CRITICAL
	Message         string  `json:"message"`          // Display text
	ActiveAlerts    int     `json:"active_alerts"`    // Count
	TrafficLight    string  `json:"traffic_light"`    // GREEN, RED
	TrainSignal     string  `json:"train_signal"`     // PROCEED, STOP
	EmergencyUnits  string  `json:"emergency_units"`  // IDLE, DISPATCHED
	LastAlertTime   int64   `json:"last_alert_time"`
	EstimatedImpact float64 `json:"estimated_impact"` // Seconds
}

// --- Global State ---

var (
	currentState = SystemState{
		Status:         "SAFE",
		TrafficLight:   "GREEN",
		TrainSignal:    "PROCEED",
		EmergencyUnits: "IDLE",
		Message:        "SYSTEM NORMAL - MONITORING",
	}
	stateMutex sync.RWMutex
	clients    = make(map[*websocket.Conn]bool)
	broadcast  = make(chan SystemState)
)

// --- Business Logic ---

func updateState(alert AlertPayload) {
	stateMutex.Lock()
	defer stateMutex.Unlock()

	currentState.Status = "CRITICAL"
	currentState.Message = "OBSTACLE DETECTED: " + alert.Object
	currentState.ActiveAlerts++
	currentState.TrafficLight = "RED"
	currentState.TrainSignal = "STOP"
	currentState.EmergencyUnits = "DISPATCHED"
	currentState.LastAlertTime = time.Now().Unix()
	currentState.EstimatedImpact = 15.0 // Simulation: 15 seconds to impact

	// Push update
	broadcast <- currentState
}

func revertStateRoutine() {
	ticker := time.NewTicker(2 * time.Second)
	for range ticker.C {
		stateMutex.Lock()
		if currentState.Status == "CRITICAL" {
			// Check idle time
			if time.Now().Unix()-currentState.LastAlertTime > 10 {
				// Revert to Safe
				currentState.Status = "SAFE"
				currentState.Message = "OBSTACLE CLEARED - SYSTEM NORMAL"
				currentState.ActiveAlerts = 0
				currentState.TrafficLight = "GREEN"
				currentState.TrainSignal = "PROCEED"
				currentState.EmergencyUnits = "RETURNING"
				currentState.EstimatedImpact = 0
				
				// Broadcast recovery
				go func(s SystemState) { broadcast <- s }(currentState)
			} else {
				// Decrease simulated time to impact
				if currentState.EstimatedImpact > 0 {
					currentState.EstimatedImpact -= 2
					go func(s SystemState) { broadcast <- s }(currentState)
				}
			}
		}
		stateMutex.Unlock()
	}
}

// --- Broadcaster ---

func broadcasterRoutine() {
	for state := range broadcast {
		for client := range clients {
			if err := client.WriteJSON(state); err != nil {
				log.Printf("Error writing to client: %v", err)
				client.Close()
				delete(clients, client)
			}
		}
	}
}

// --- Main ---

func main() {
	app := fiber.New()

	// Middleware
	app.Use(cors.New())

	// Upgrades endpoints to Websockets
	app.Use("/ws", func(c *fiber.Ctx) error {
		if websocket.IsWebSocketUpgrade(c) {
			c.Locals("allowed", true)
			return c.Next()
		}
		return fiber.ErrUpgradeRequired
	})

	// Routes
	app.Post("/api/alert", func(c *fiber.Ctx) error {
		var payload AlertPayload
		if err := c.BodyParser(&payload); err != nil {
			return c.Status(400).SendString(err.Error())
		}
		
		log.Printf("[ALERT RECEIVED] %s detected!", payload.Object)
		updateState(payload)
		
		return c.SendStatus(200)
	})

	app.Get("/ws", websocket.New(func(c *websocket.Conn) {
		// Register client
		stateMutex.Lock()
		clients[c] = true
		// Send initial state
		c.WriteJSON(currentState)
		stateMutex.Unlock()

		defer func() {
			stateMutex.Lock()
			delete(clients, c)
			stateMutex.Unlock()
			c.Close()
		}()

		// Keep alive loop
		for {
			_, _, err := c.ReadMessage()
			if err != nil {
				break
			}
		}
	}))

	// Background routines
	go revertStateRoutine()
	go broadcasterRoutine()

	log.Fatal(app.Listen(":8080"))
}
