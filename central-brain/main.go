package main

import (
	"encoding/json"
	"log"
	"math/rand"
	"sync"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/websocket/v2"
)

// --- ACTION 1: REDEFINE STRUCTS (Golang) ---

// Unit (Leaf Node - CCTV/Sensor)
type Unit struct {
	ID     string  `json:"id"`
	Name   string  `json:"name"`
	Type   string  `json:"type"`
	Status string  `json:"status"`
	Lat    float64 `json:"lat"`
	Long   float64 `json:"long"`
}

// Post (JPL Node)
type Post struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	GeoLocation string `json:"geo_location"` // e.g., "-7.5456, 112.2134"
	Units       []Unit `json:"units"`
}

// Station (District Node)
type Station struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	HeadOfficer string `json:"head_officer"`
	Posts       []Post `json:"posts"`
}

// Region (Root Node - DAOP)
type Region struct {
	ID       string    `json:"id"`
	Name     string    `json:"name"`
	Code     string    `json:"code"`
	Stations []Station `json:"stations"`
}

// SystemState represents the real-time train and city status
type SystemState struct {
	TrainID    string  `json:"train_id"`
	Speed      float64 `json:"speed"`
	Distance   float64 `json:"distance"`
	Status     string  `json:"status"`
	CityAction string  `json:"city_action"`
	Timestamp  string  `json:"timestamp"`
}

// UnitStatusUpdate represents a live status update for a unit
type UnitStatusUpdate struct {
	UnitID    string `json:"unit_id"`
	Status    string `json:"status"`
	Timestamp string `json:"timestamp"`
}

// IncidentPayload represents incoming AI detection alerts
type IncidentPayload struct {
	Type        string  `json:"type"`
	ObjectClass string  `json:"object_class"`
	Confidence  float64 `json:"confidence"`
	InROI       bool    `json:"in_roi"`
}

// --- SMART CITY STATE MACHINE ---

// CityStatus represents the Smart City response state
type CityStatus struct {
	TrafficLight    string `json:"traffic_light"`    // "NORMAL", "GREEN_WAVE", "RED_LOCK"
	Ambulance       string `json:"ambulance"`        // "STANDBY", "DISPATCHED"
	Police          string `json:"police"`           // "STANDBY", "DISPATCHED"
	EvacuationRoute string `json:"evacuation_route"` // "OPEN", "CLOSED"
	Siren           string `json:"siren"`            // "OFF", "WARNING", "CRITICAL"
	RailCrossing    string `json:"rail_crossing"`    // "OPEN", "CLOSING", "CLOSED"
	LastUpdate      string `json:"last_update"`
}

// CityState constants
const (
	// Distance thresholds (in km)
	DISTANCE_SAFE     = 5.0
	DISTANCE_CAUTION  = 3.0
	DISTANCE_WARNING  = 1.5
	DISTANCE_CRITICAL = 0.5
)

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

	// Hierarchy Root
	regionData Region

	// Unit status map for live updates
	unitStatuses    = make(map[string]string)
	unitStatusMutex sync.RWMutex

	// Mutex for thread-safe state access
	stateMutex sync.RWMutex

	// WebSocket clients
	wsClients    = make(map[*websocket.Conn]bool)
	wsClientsMux sync.Mutex

	// Incident flag
	incidentActive = false

	// Smart City Status
	cityStatus = CityStatus{
		TrafficLight:    "NORMAL",
		Ambulance:       "STANDBY",
		Police:          "STANDBY",
		EvacuationRoute: "OPEN",
		Siren:           "OFF",
		RailCrossing:    "OPEN",
		LastUpdate:      time.Now().Format("15:04:05"),
	}
	cityStatusMutex sync.RWMutex
)

func init() {
	rand.Seed(time.Now().UnixNano())
	initHierarchyData()
}

// --- ACTION 2: POPULATE MOCK DATA (Hardcode this Topology) ---
func initHierarchyData() {
	// Initialize Units
	// Station 1 -> Post A
	unitJBG01 := Unit{ID: "CCTV-JBG-01", Name: "CCTV-JBG-01 (Arah Timur)", Type: "CCTV", Status: "ONLINE", Lat: -7.5456, Long: 112.2134}
	unitJBG02 := Unit{ID: "CCTV-JBG-02", Name: "CCTV-JBG-02 (Arah Barat)", Type: "CCTV", Status: "ONLINE", Lat: -7.5456, Long: 112.2134}

	// Station 1 -> Post B
	unitPTR01 := Unit{ID: "CCTV-PTR-01", Name: "CCTV-PTR-01 (Flyover)", Type: "CCTV", Status: "ONLINE", Lat: -7.5478, Long: 112.2156}

	// Station 2 -> Post C
	unitBRN01 := Unit{ID: "CCTV-BRN-01", Name: "CCTV-BRN-01", Type: "CCTV", Status: "ONLINE", Lat: -7.6012, Long: 112.1000}

	// Initialize Posts
	postA := Post{
		ID:          "JPL-102",
		Name:        "Pos JPL 102 (Jombang Kota)",
		GeoLocation: "-7.5456, 112.2134",
		Units:       []Unit{unitJBG01, unitJBG02},
	}

	postB := Post{
		ID:          "JPL-105",
		Name:        "Pos JPL 105 (Peterongan)",
		GeoLocation: "-7.5478, 112.2156",
		Units:       []Unit{unitPTR01},
	}

	postC := Post{
		ID:          "JPL-98",
		Name:        "Pos JPL 98 (Baron)",
		GeoLocation: "-7.6012, 112.1000",
		Units:       []Unit{unitBRN01},
	}

	// Initialize Stations
	station1 := Station{
		ID:          "STA-JBG",
		Name:        "Stasiun Jombang",
		HeadOfficer: "Bpk. Sutrisno",
		Posts:       []Post{postA, postB},
	}

	station2 := Station{
		ID:          "STA-KTS",
		Name:        "Stasiun Kertosono",
		HeadOfficer: "Bpk. Hartono",
		Posts:       []Post{postC},
	}

	// Initialize Region (Root)
	regionData = Region{
		ID:       "DAOP-7",
		Name:     "DAOP 7 MADIUN",
		Code:     "D7",
		Stations: []Station{station1, station2},
	}

	// Initialize Unit Status Map
	unitStatuses["CCTV-JBG-01"] = "ONLINE"
	unitStatuses["CCTV-JBG-02"] = "ONLINE"
	unitStatuses["CCTV-PTR-01"] = "ONLINE"
	unitStatuses["CCTV-BRN-01"] = "ONLINE"
}

func main() {
	// Initialize Fiber
	app := fiber.New(fiber.Config{
		AppName: "Aeon RailGuard - Central Brain v2.0 (Refactored)",
	})

	// Middleware
	app.Use(logger.New(logger.Config{
		Format:     "[${time}] ${status} - ${method} ${path} (${latency})\n",
		TimeFormat: "15:04:05",
	}))

	// CORS
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowHeaders: "Origin, Content-Type, Accept",
		AllowMethods: "GET, POST, OPTIONS",
	}))

	// Routes
	app.Get("/", handleRoot)
	app.Get("/api/status", handleGetStatus)
	app.Get("/api/hierarchy", handleGetHierarchy)
	app.Get("/api/city-status", handleGetCityStatus)
	app.Post("/api/incident", handleIncident)
	app.Post("/api/reset", handleReset)

	// WebSocket
	app.Use("/ws", func(c *fiber.Ctx) error {
		if websocket.IsWebSocketUpgrade(c) {
			return c.Next()
		}
		return fiber.ErrUpgradeRequired
	})
	app.Get("/ws", websocket.New(handleWebSocket))

	// Background Tasks
	go simulationEngine()
	go cityStateMachine()
	go wsBroadcaster()
	go unitStatusSimulator()

	// Banner
	printBanner()

	// Start
	log.Fatal(app.Listen(":8080"))
}

func printBanner() {
	log.Println("╔══════════════════════════════════════════════════════════╗")
	log.Println("║     AEON RAILGUARD - CENTRAL BRAIN v3.0                  ║")
	log.Println("║     Smart City State Machine Edition                     ║")
	log.Println("╠══════════════════════════════════════════════════════════╣")
	log.Println("║  HTTP Server  : http://localhost:8080                    ║")
	log.Println("║  WebSocket    : ws://localhost:8080/ws                   ║")
	log.Println("╠══════════════════════════════════════════════════════════╣")
	log.Println("║  GET  /api/hierarchy   - Nested JSON Tree (RBAC)         ║")
	log.Println("║  GET  /api/status      - Train & system status           ║")
	log.Println("║  GET  /api/city-status - Smart City state machine        ║")
	log.Println("╚══════════════════════════════════════════════════════════╝")
}

func handleRoot(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{
		"service": "Aeon RailGuard - Central Brain",
		"version": "2.1.0-nested",
		"status":  "ONLINE",
		"endpoints": fiber.Map{
			"hierarchy": "GET /api/hierarchy",
			"status":    "GET /api/status",
		},
	})
}

func handleGetStatus(c *fiber.Ctx) error {
	stateMutex.RLock()
	defer stateMutex.RUnlock()
	return c.JSON(state)
}

func handleGetCityStatus(c *fiber.Ctx) error {
	cityStatusMutex.RLock()
	defer cityStatusMutex.RUnlock()
	return c.JSON(cityStatus)
}

// --- ACTION 3: UPDATE API ENDPOINT WITH RBAC ---
func handleGetHierarchy(c *fiber.Ctx) error {
	// Parse the role query parameter
	role := c.Query("role")

	// Lock for reading unit statuses
	unitStatusMutex.RLock()
	defer unitStatusMutex.RUnlock()

	// Helper function to update unit statuses in a slice
	updateUnitStatuses := func(units []Unit) []Unit {
		updatedUnits := make([]Unit, len(units))
		copy(updatedUnits, units)
		for i := range updatedUnits {
			if val, ok := unitStatuses[updatedUnits[i].ID]; ok {
				updatedUnits[i].Status = val
			}
		}
		return updatedUnits
	}

	// Helper function to update post with current unit statuses
	updatePostStatuses := func(post Post) Post {
		post.Units = updateUnitStatuses(post.Units)
		return post
	}

	// Helper function to update station with current unit statuses
	updateStationStatuses := func(station Station) Station {
		updatedPosts := make([]Post, len(station.Posts))
		for i, post := range station.Posts {
			updatedPosts[i] = updatePostStatuses(post)
		}
		station.Posts = updatedPosts
		return station
	}

	// Switch based on role
	switch role {

	case "station":
		// SIMULATION: User is "Kepala Stasiun Jombang"
		// Return ONLY Stasiun Jombang
		for _, station := range regionData.Stations {
			if station.Name == "Stasiun Jombang" {
				return c.JSON(updateStationStatuses(station))
			}
		}
		return c.Status(404).JSON(fiber.Map{
			"error":   "Station not found",
			"message": "Stasiun Jombang not found in hierarchy",
		})

	case "jpl":
		// SIMULATION: User is "Petugas JPL 102"
		// Return ONLY Pos JPL 102
		for _, station := range regionData.Stations {
			for _, post := range station.Posts {
				if post.ID == "JPL-102" {
					return c.JSON(updatePostStatuses(post))
				}
			}
		}
		return c.Status(404).JSON(fiber.Map{
			"error":   "Post not found",
			"message": "Pos JPL 102 not found in hierarchy",
		})

	case "daop":
		fallthrough
	default:
		// DAOP View: Return full Region hierarchy
		response := Region{
			ID:       regionData.ID,
			Name:     regionData.Name,
			Code:     regionData.Code,
			Stations: make([]Station, len(regionData.Stations)),
		}

		for i, station := range regionData.Stations {
			response.Stations[i] = updateStationStatuses(station)
		}

		return c.JSON(response)
	}
}

func handleIncident(c *fiber.Ctx) error {
	var payload IncidentPayload
	if err := c.BodyParser(&payload); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid payload"})
	}

	log.Printf("[INCIDENT] %s detected (%s) - Confidence: %.1f%%\n", payload.Type, payload.ObjectClass, payload.Confidence*100)

	stateMutex.Lock()
	incidentActive = true
	state.Status = "CRITICAL"
	state.CityAction = "DISPATCHING POLICE & AMBULANCE"
	stateMutex.Unlock()

	go func() {
		time.Sleep(8 * time.Second)
		stateMutex.Lock()
		incidentActive = false
		state.Distance = 10.0
		state.Speed = 120.0
		log.Println("[SYSTEM] Incident cleared - Simulation reset")
		stateMutex.Unlock()
	}()

	return c.Status(201).JSON(fiber.Map{"status": "ALERT_RECEIVED"})
}

func handleReset(c *fiber.Ctx) error {
	stateMutex.Lock()
	state.Distance = 10.0
	state.Speed = 120.0
	state.Status = "SAFE"
	state.CityAction = "MONITORING"
	incidentActive = false
	stateMutex.Unlock()

	cityStatusMutex.Lock()
	cityStatus.TrafficLight = "NORMAL"
	cityStatus.Ambulance = "STANDBY"
	cityStatus.Police = "STANDBY"
	cityStatus.EvacuationRoute = "OPEN"
	cityStatus.Siren = "OFF"
	cityStatus.RailCrossing = "OPEN"
	cityStatus.LastUpdate = time.Now().Format("15:04:05")
	cityStatusMutex.Unlock()

	log.Println("[SYSTEM] Full reset - Train & City status restored")
	return c.JSON(fiber.Map{"status": "RESET_COMPLETE"})
}

func handleWebSocket(c *websocket.Conn) {
	wsClientsMux.Lock()
	wsClients[c] = true
	wsClientsMux.Unlock()

	stateMutex.RLock()
	initialData, _ := json.Marshal(state)
	stateMutex.RUnlock()
	c.WriteMessage(websocket.TextMessage, initialData)

	defer func() {
		wsClientsMux.Lock()
		delete(wsClients, c)
		wsClientsMux.Unlock()
		c.Close()
	}()

	for {
		if _, _, err := c.ReadMessage(); err != nil {
			break
		}
	}
}

func simulationEngine() {
	ticker := time.NewTicker(1 * time.Second)
	defer ticker.Stop()

	for range ticker.C {
		stateMutex.Lock()
		state.Timestamp = time.Now().Format("15:04:05")

		if incidentActive {
			if state.Speed > 0 {
				state.Speed -= 20.0
				if state.Speed < 0 {
					state.Speed = 0
				}
			}
		} else {
			state.Distance -= 0.2
			if state.Distance < 0 {
				state.Distance = 0
			}

			if state.Distance < 1.0 {
				state.Status = "CRITICAL"
				state.CityAction = "DISPATCHING POLICE & AMBULANCE"
			} else if state.Distance < 3.0 {
				state.Status = "WARNING"
				state.CityAction = "TRAFFIC CAUTION ACTIVATED"
			} else {
				state.Status = "SAFE"
				state.CityAction = "MONITORING"
			}

			if state.Distance <= 0 {
				state.Distance = 10.0
				state.Speed = 120.0
				state.Status = "SAFE"
				state.CityAction = "MONITORING"
			}
		}
		stateMutex.Unlock()
	}
}

// --- SMART CITY STATE MACHINE GOROUTINE ---
func cityStateMachine() {
	ticker := time.NewTicker(500 * time.Millisecond)
	defer ticker.Stop()

	for range ticker.C {
		stateMutex.RLock()
		distance := state.Distance
		isIncident := incidentActive
		stateMutex.RUnlock()

		cityStatusMutex.Lock()
		cityStatus.LastUpdate = time.Now().Format("15:04:05")

		if isIncident {
			// INCIDENT ACTIVE: Maximum alert state
			cityStatus.TrafficLight = "RED_LOCK"
			cityStatus.Ambulance = "DISPATCHED"
			cityStatus.Police = "DISPATCHED"
			cityStatus.EvacuationRoute = "CLOSED"
			cityStatus.Siren = "CRITICAL"
			cityStatus.RailCrossing = "CLOSED"
			log.Println("[CITY] STATE: INCIDENT ACTIVE - All emergency services dispatched")
		} else {
			// Distance-based state machine
			switch {
			case distance <= DISTANCE_CRITICAL:
				// CRITICAL: Train very close, full lockdown
				cityStatus.TrafficLight = "RED_LOCK"
				cityStatus.Ambulance = "DISPATCHED"
				cityStatus.Police = "DISPATCHED"
				cityStatus.EvacuationRoute = "CLOSED"
				cityStatus.Siren = "CRITICAL"
				cityStatus.RailCrossing = "CLOSED"

			case distance <= DISTANCE_WARNING:
				// WARNING: Train approaching, prepare emergency
				cityStatus.TrafficLight = "RED_LOCK"
				cityStatus.Ambulance = "STANDBY"
				cityStatus.Police = "DISPATCHED"
				cityStatus.EvacuationRoute = "OPEN"
				cityStatus.Siren = "WARNING"
				cityStatus.RailCrossing = "CLOSED"

			case distance <= DISTANCE_CAUTION:
				// CAUTION: Clear the path for train
				cityStatus.TrafficLight = "GREEN_WAVE"
				cityStatus.Ambulance = "STANDBY"
				cityStatus.Police = "STANDBY"
				cityStatus.EvacuationRoute = "OPEN"
				cityStatus.Siren = "WARNING"
				cityStatus.RailCrossing = "CLOSING"

			case distance <= DISTANCE_SAFE:
				// SAFE but monitoring
				cityStatus.TrafficLight = "NORMAL"
				cityStatus.Ambulance = "STANDBY"
				cityStatus.Police = "STANDBY"
				cityStatus.EvacuationRoute = "OPEN"
				cityStatus.Siren = "OFF"
				cityStatus.RailCrossing = "OPEN"

			default:
				// DEFAULT: All clear
				cityStatus.TrafficLight = "NORMAL"
				cityStatus.Ambulance = "STANDBY"
				cityStatus.Police = "STANDBY"
				cityStatus.EvacuationRoute = "OPEN"
				cityStatus.Siren = "OFF"
				cityStatus.RailCrossing = "OPEN"
			}
		}
		cityStatusMutex.Unlock()
	}
}

func wsBroadcaster() {
	ticker := time.NewTicker(1 * time.Second)
	defer ticker.Stop()

	for range ticker.C {
		stateMutex.RLock()
		trainData, _ := json.Marshal(fiber.Map{"type": "train_status", "data": state})
		stateMutex.RUnlock()

		cityStatusMutex.RLock()
		cityData, _ := json.Marshal(fiber.Map{"type": "city_status", "data": cityStatus})
		cityStatusMutex.RUnlock()

		unitStatusMutex.RLock()
		var unitUpdates []UnitStatusUpdate
		for id, status := range unitStatuses {
			unitUpdates = append(unitUpdates, UnitStatusUpdate{
				UnitID:    id,
				Status:    status,
				Timestamp: time.Now().Format("15:04:05"),
			})
		}
		unitData, _ := json.Marshal(fiber.Map{"type": "unit_status", "data": unitUpdates})
		unitStatusMutex.RUnlock()

		wsClientsMux.Lock()
		for client := range wsClients {
			client.WriteMessage(websocket.TextMessage, trainData)
			client.WriteMessage(websocket.TextMessage, cityData)
			client.WriteMessage(websocket.TextMessage, unitData)
		}
		wsClientsMux.Unlock()
	}
}

func unitStatusSimulator() {
	ticker := time.NewTicker(5 * time.Second)
	defer ticker.Stop()

	statuses := []string{"ONLINE", "ONLINE", "ONLINE", "WARNING", "OFFLINE"}
	// Update with NEW IDs
	unitIDs := []string{
		"CCTV-JBG-01", "CCTV-JBG-02", "CCTV-PTR-01", "CCTV-BRN-01",
	}

	for range ticker.C {
		unitStatusMutex.Lock()
		randomUnit := unitIDs[rand.Intn(len(unitIDs))]
		newStatus := statuses[rand.Intn(len(statuses))]

		if _, ok := unitStatuses[randomUnit]; ok {
			unitStatuses[randomUnit] = newStatus
		}
		unitStatusMutex.Unlock()
	}
}
