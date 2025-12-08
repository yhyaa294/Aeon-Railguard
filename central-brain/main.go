package main

import (
	"encoding/json"
	"fmt"
	"log"
	"sync"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/websocket/v2"
)

// BroadcastState is the simplified JSON sent to frontend
type BroadcastState struct {
	Distance     float64 `json:"distance"`
	Status       string  `json:"status"`
	CityResponse string  `json:"city_response"`
	Speed        float64 `json:"speed"`
	ETA          float64 `json:"eta"`
}

// Incident represents an AI-detected hazard
type Incident struct {
	ID          string    `json:"id"`
	Type        string    `json:"type"`
	Confidence  float64   `json:"confidence"`
	Timestamp   time.Time `json:"timestamp"`
	ObjectClass string    `json:"object_class"`
	InROI       bool      `json:"in_roi"`
}

var (
	distance        float64 = 10.0
	status          string  = "SAFE"
	cityResponse    string  = "TRAFFIC_NORMAL"
	speed           float64 = 80.0
	activeIncident  bool    = false
	
	stateMutex      sync.RWMutex
	wsClients       = make(map[*websocket.Conn]bool)
	wsClientsMux    sync.Mutex
	incidentChan    = make(chan Incident, 10)
)

func main() {
	app := fiber.New(fiber.Config{
		AppName: "Aeon RailGuard Central Brain v2.0",
	})

	app.Use(logger.New(logger.Config{
		Format: "[BRAIN] ${time} | ${status} | ${method} ${path}\n",
	}))
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowHeaders: "Origin, Content-Type, Accept",
	}))

	// Routes
	app.Get("/", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"service": "Aeon RailGuard - Central Brain",
			"version": "2.0.0",
			"status":  "ONLINE",
		})
	})

	app.Get("/api/state", getSystemState)
	app.Post("/api/incident", handleIncident)
	app.Post("/api/train/reset", resetTrain)

	// WebSocket
	app.Use("/ws", func(c *fiber.Ctx) error {
		if websocket.IsWebSocketUpgrade(c) {
			return c.Next()
		}
		return fiber.ErrUpgradeRequired
	})
	app.Get("/ws", websocket.New(handleWebSocket))

	// Start goroutines
	go simulationLoop()
	go incidentProcessor()

	log.Println("============================================")
	log.Println("  AEON RAILGUARD - CENTRAL BRAIN v2.0")
	log.Println("  Smart City Emergency Response Platform")
	log.Println("============================================")
	log.Println("[BRAIN] Starting on http://localhost:8080")
	log.Println("[BRAIN] WebSocket: ws://localhost:8080/ws")
	log.Println("[BRAIN] Simulation: 0.1 km/sec decrement")
	log.Println("============================================")
	
	log.Fatal(app.Listen(":8080"))
}

func getSystemState(c *fiber.Ctx) error {
	stateMutex.RLock()
	defer stateMutex.RUnlock()
	
	return c.JSON(BroadcastState{
		Distance:     distance,
		Status:       status,
		CityResponse: cityResponse,
		Speed:        speed,
		ETA:          calculateETA(),
	})
}

func handleIncident(c *fiber.Ctx) error {
	var incident Incident
	if err := c.BodyParser(&incident); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid payload"})
	}

	incident.Timestamp = time.Now()
	if incident.ID == "" {
		incident.ID = fmt.Sprintf("INC-%d", time.Now().UnixNano())
	}

	log.Println("============================================")
	log.Printf("[ALERT] INCIDENT RECEIVED FROM AI ENGINE")
	log.Printf("[ALERT] Type: %s | Object: %s", incident.Type, incident.ObjectClass)
	log.Printf("[ALERT] Confidence: %.1f%% | In ROI: %v", incident.Confidence*100, incident.InROI)
	log.Println("============================================")

	incidentChan <- incident

	return c.Status(201).JSON(fiber.Map{
		"status":      "ALERT_PROCESSED",
		"incident_id": incident.ID,
		"action":      "EMERGENCY_PROTOCOL_INITIATED",
	})
}

func resetTrain(c *fiber.Ctx) error {
	stateMutex.Lock()
	distance = 10.0
	status = "SAFE"
	cityResponse = "TRAFFIC_NORMAL"
	speed = 80.0
	activeIncident = false
	stateMutex.Unlock()

	log.Println("[BRAIN] Simulation reset to initial state")
	broadcastState()

	return c.JSON(fiber.Map{"status": "RESET_COMPLETE", "distance": 10.0})
}

func handleWebSocket(c *websocket.Conn) {
	wsClientsMux.Lock()
	wsClients[c] = true
	wsClientsMux.Unlock()

	log.Println("[WS] Frontend client connected")

	// Send initial state
	broadcastToClient(c)

	defer func() {
		wsClientsMux.Lock()
		delete(wsClients, c)
		wsClientsMux.Unlock()
		c.Close()
		log.Println("[WS] Frontend client disconnected")
	}()

	for {
		_, _, err := c.ReadMessage()
		if err != nil {
			break
		}
	}
}

func broadcastToClient(c *websocket.Conn) {
	stateMutex.RLock()
	state := BroadcastState{
		Distance:     distance,
		Status:       status,
		CityResponse: cityResponse,
		Speed:        speed,
		ETA:          calculateETA(),
	}
	stateMutex.RUnlock()

	data, _ := json.Marshal(state)
	c.WriteMessage(websocket.TextMessage, data)
}

func broadcastState() {
	stateMutex.RLock()
	state := BroadcastState{
		Distance:     distance,
		Status:       status,
		CityResponse: cityResponse,
		Speed:        speed,
		ETA:          calculateETA(),
	}
	stateMutex.RUnlock()

	data, _ := json.Marshal(state)

	wsClientsMux.Lock()
	defer wsClientsMux.Unlock()

	for client := range wsClients {
		if err := client.WriteMessage(websocket.TextMessage, data); err != nil {
			client.Close()
			delete(wsClients, client)
		}
	}
}

func calculateETA() float64 {
	if speed <= 0 || distance <= 0 {
		return 0
	}
	return (distance / speed) * 3600 // seconds
}

func simulationLoop() {
	ticker := time.NewTicker(1 * time.Second)
	defer ticker.Stop()

	log.Println("[SIM] Simulation loop started - Train approaching crossing")

	for range ticker.C {
		stateMutex.Lock()

		// Decrease distance by 0.1 km every second
		if distance > 0 && !activeIncident {
			distance -= 0.1
			if distance < 0 {
				distance = 0
			}
		}

		// Emergency brake if incident active
		if activeIncident && speed > 0 {
			speed -= 15.0
			if speed < 0 {
				speed = 0
			}
		}

		// Status logic based on distance and incident
		previousStatus := status
		
		switch {
		case activeIncident || distance < 1.0:
			status = "CRITICAL"
			cityResponse = "EMERGENCY_DISPATCH"
		case distance < 3.0:
			status = "WARNING"
			cityResponse = "TRAFFIC_CAUTION"
		default:
			status = "SAFE"
			cityResponse = "TRAFFIC_NORMAL"
		}

		// Log status changes
		if status != previousStatus {
			log.Printf("[SIM] Status changed: %s -> %s (Distance: %.1f km)", previousStatus, status, distance)
			
			if status == "CRITICAL" {
				log.Println("============================================")
				log.Println("[CITY] DISPATCHING AMBULANCE & POLICE")
				log.Println("[CITY] Traffic lights: FORCE RED")
				log.Println("[CITY] Rail signal: EMERGENCY STOP")
				log.Println("============================================")
			}
		}

		// Reset simulation when train passes crossing
		if distance <= 0 && !activeIncident {
			log.Println("[SIM] Train passed crossing - Resetting simulation")
			distance = 10.0
			speed = 80.0
			status = "SAFE"
			cityResponse = "TRAFFIC_NORMAL"
		}

		stateMutex.Unlock()
		broadcastState()
	}
}

func incidentProcessor() {
	for incident := range incidentChan {
		stateMutex.Lock()
		
		activeIncident = true
		status = "CRITICAL"
		cityResponse = "EMERGENCY_DISPATCH"

		log.Println("============================================")
		log.Println("[EMERGENCY] PROTOCOL ACTIVATED")
		log.Println("[CITY] DISPATCHING AMBULANCE & POLICE")
		log.Printf("[CITY] Incident: %s detected at crossing", incident.ObjectClass)
		log.Println("[CITY] Traffic Override: ALL RED")
		log.Println("[CITY] Train Signal: EMERGENCY BRAKE")
		log.Println("============================================")

		stateMutex.Unlock()
		broadcastState()

		// Auto-clear incident after 10 seconds (for demo purposes)
		go func() {
			time.Sleep(10 * time.Second)
			stateMutex.Lock()
			activeIncident = false
			distance = 10.0
			speed = 80.0
			log.Println("[SIM] Incident cleared - Simulation reset")
			stateMutex.Unlock()
			broadcastState()
		}()
	}
}
