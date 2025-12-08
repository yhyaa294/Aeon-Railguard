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

// Unit represents a single camera/sensor unit
type Unit struct {
	ID       string  `json:"id"`
	Name     string  `json:"name"`
	Lat      float64 `json:"lat"`
	Long     float64 `json:"long"`
	Status   string  `json:"status"`
	RTSPUrl  string  `json:"rtsp_url"`
}

// Post represents a guard post (JPL) that manages multiple units
type Post struct {
	ID    string `json:"id"`
	Name  string `json:"name"`
	Units []Unit `json:"units"`
}

// Station represents a station that manages multiple JPL posts
type Station struct {
	ID           string   `json:"id"`
	Name         string   `json:"name"`
	Type         string   `json:"type"`
	Subordinates []Post   `json:"subordinates"`
}

// DAOPRegion represents the DAOP level with all stations
type DAOPRegion struct {
	ID        string    `json:"id"`
	Name      string    `json:"name"`
	Type      string    `json:"type"`
	Stations  []Station `json:"stations"`
	Timestamp string    `json:"timestamp"`
}

// JPLResponse is the limited view for JPL operators
type JPLResponse struct {
	Name      string `json:"name"`
	Type      string `json:"type"`
	Units     []Unit `json:"units"`
	Timestamp string `json:"timestamp"`
}

// StationResponse is the view for Station Masters
type StationResponse struct {
	Name         string   `json:"name"`
	Type         string   `json:"type"`
	Subordinates []string `json:"subordinates"`
	Posts        []Post   `json:"posts"`
	Timestamp    string   `json:"timestamp"`
}

// SystemData represents the full regional hierarchy (legacy, kept for compatibility)
type SystemData struct {
	Region    string `json:"region"`
	Posts     []Post `json:"posts"`
	Timestamp string `json:"timestamp"`
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

	// Regional hierarchy data (multi-tier)
	hierarchyData   SystemData
	daopData        DAOPRegion
	stationData     Station
	jplData         Post

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
)

func init() {
	rand.Seed(time.Now().UnixNano())
	initHierarchyData()
}

func initHierarchyData() {
	// Define all JPL Posts
	jpl102 := Post{
		ID:   "JPL-102",
		Name: "Pos JPL 102",
		Units: []Unit{
			{ID: "CAM-01", Name: "Cam-01 (Pasar Peterongan)", Lat: -7.5456, Long: 112.2134, Status: "ONLINE", RTSPUrl: "rtsp://192.168.1.101:554/stream1"},
			{ID: "CAM-02", Name: "Cam-02 (Flyover)", Lat: -7.5478, Long: 112.2156, Status: "ONLINE", RTSPUrl: "rtsp://192.168.1.102:554/stream1"},
		},
	}

	jpl105 := Post{
		ID:   "JPL-105",
		Name: "Pos JPL 105",
		Units: []Unit{
			{ID: "CAM-03", Name: "Cam-03 (Sawah Timur)", Lat: -7.5512, Long: 112.2245, Status: "ONLINE", RTSPUrl: "rtsp://192.168.1.103:554/stream1"},
			{ID: "CAM-04", Name: "Cam-04 (Desa Kepuh)", Lat: -7.5534, Long: 112.2267, Status: "ONLINE", RTSPUrl: "rtsp://192.168.1.104:554/stream1"},
		},
	}

	jpl110 := Post{
		ID:   "JPL-110",
		Name: "Pos JPL 110",
		Units: []Unit{
			{ID: "CAM-05", Name: "Cam-05 (Perbatasan)", Lat: -7.5567, Long: 112.2312, Status: "ONLINE", RTSPUrl: "rtsp://192.168.1.105:554/stream1"},
			{ID: "CAM-06", Name: "Cam-06 (Jalan Tikus)", Lat: -7.5423, Long: 112.2098, Status: "ONLINE", RTSPUrl: "rtsp://192.168.1.106:554/stream1"},
		},
	}

	jpl201 := Post{
		ID:   "JPL-201",
		Name: "Pos JPL 201",
		Units: []Unit{
			{ID: "CAM-07", Name: "Cam-07 (Stasiun Utara)", Lat: -7.5589, Long: 112.2345, Status: "ONLINE", RTSPUrl: "rtsp://192.168.1.201:554/stream1"},
			{ID: "CAM-08", Name: "Cam-08 (Alun-alun)", Lat: -7.5601, Long: 112.2378, Status: "ONLINE", RTSPUrl: "rtsp://192.168.1.202:554/stream1"},
		},
	}

	jpl205 := Post{
		ID:   "JPL-205",
		Name: "Pos JPL 205",
		Units: []Unit{
			{ID: "CAM-09", Name: "Cam-09 (Pasar Kota)", Lat: -7.5545, Long: 112.2289, Status: "ONLINE", RTSPUrl: "rtsp://192.168.1.203:554/stream1"},
			{ID: "CAM-10", Name: "Cam-10 (Terminal)", Lat: -7.5612, Long: 112.2401, Status: "ONLINE", RTSPUrl: "rtsp://192.168.1.204:554/stream1"},
		},
	}

	// Define Stations
	stasiunJombang := Station{
		ID:           "STA-JMB",
		Name:         "Stasiun Jombang",
		Type:         "STATION",
		Subordinates: []Post{jpl102, jpl105, jpl110},
	}

	stasiunMojoAgung := Station{
		ID:           "STA-MJA",
		Name:         "Stasiun Mojoagung",
		Type:         "STATION",
		Subordinates: []Post{jpl201, jpl205},
	}

	// DAOP Level (Full hierarchy)
	daopData = DAOPRegion{
		ID:        "DAOP-7",
		Name:      "DAOP 7 Madiun",
		Type:      "DAOP",
		Stations:  []Station{stasiunJombang, stasiunMojoAgung},
		Timestamp: time.Now().Format("2006-01-02 15:04:05"),
	}

	// Station Level (for Station Master demo - defaults to Jombang)
	stationData = stasiunJombang

	// JPL Level (for JPL Operator demo - defaults to JPL 102)
	jplData = jpl102

	// Legacy format (backward compatibility)
	allPosts := []Post{jpl102, jpl105, jpl110, jpl201, jpl205}
	hierarchyData = SystemData{
		Region:    "DAOP 7 Madiun",
		Timestamp: time.Now().Format("2006-01-02 15:04:05"),
		Posts:     allPosts,
	}

	// Initialize unit statuses for ALL units
	for _, station := range daopData.Stations {
		for _, post := range station.Subordinates {
			for _, unit := range post.Units {
				unitStatuses[unit.ID] = "ONLINE"
			}
		}
	}
}

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
	app.Get("/api/hierarchy", handleGetHierarchy)
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

	// Start unit status simulator
	go unitStatusSimulator()

	// Print startup banner
	printBanner()

	// Start server
	log.Fatal(app.Listen(":8080"))
}

func printBanner() {
	log.Println("╔══════════════════════════════════════════════════════════╗")
	log.Println("║     AEON RAILGUARD - CENTRAL BRAIN v2.0                  ║")
	log.Println("║     Multi-Tier Access Control System                     ║")
	log.Println("╠══════════════════════════════════════════════════════════╣")
	log.Println("║  HTTP Server  : http://localhost:8080                    ║")
	log.Println("║  WebSocket    : ws://localhost:8080/ws                   ║")
	log.Println("╠══════════════════════════════════════════════════════════╣")
	log.Println("║  GET  /api/status              - Train & system status   ║")
	log.Println("║  GET  /api/hierarchy?role=jpl  - JPL Operator view       ║")
	log.Println("║  GET  /api/hierarchy?role=station - Station Master view  ║")
	log.Println("║  GET  /api/hierarchy?role=daop - DAOP Command view       ║")
	log.Println("║  POST /api/incident            - AI detection alerts     ║")
	log.Println("║  POST /api/reset               - Reset simulation        ║")
	log.Println("╠══════════════════════════════════════════════════════════╣")
	log.Println("║  DAOP: DAOP 7 Madiun | Stations: 2 | JPLs: 5 | Cams: 10  ║")
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

// handleGetHierarchy returns hierarchy data based on user role
// Query params: ?role=jpl|station|daop (default: daop)
func handleGetHierarchy(c *fiber.Ctx) error {
	role := c.Query("role", "daop")
	unitStatusMutex.RLock()
	defer unitStatusMutex.RUnlock()

	timestamp := time.Now().Format("2006-01-02 15:04:05")

	switch role {
	case "jpl":
		// LEVEL 1: JPL Operator - Only sees their assigned JPL with 2 cameras
		units := make([]Unit, len(jplData.Units))
		for i, unit := range jplData.Units {
			units[i] = Unit{
				ID:      unit.ID,
				Name:    unit.Name,
				Lat:     unit.Lat,
				Long:    unit.Long,
				Status:  unitStatuses[unit.ID],
				RTSPUrl: unit.RTSPUrl,
			}
		}
		return c.JSON(JPLResponse{
			Name:      jplData.Name,
			Type:      "JPL",
			Units:     units,
			Timestamp: timestamp,
		})

	case "station":
		// LEVEL 2: Station Master - Sees all JPLs under their station
		subordinateNames := make([]string, len(stationData.Subordinates))
		posts := make([]Post, len(stationData.Subordinates))
		for i, post := range stationData.Subordinates {
			subordinateNames[i] = post.Name
			units := make([]Unit, len(post.Units))
			for j, unit := range post.Units {
				units[j] = Unit{
					ID:      unit.ID,
					Name:    unit.Name,
					Lat:     unit.Lat,
					Long:    unit.Long,
					Status:  unitStatuses[unit.ID],
					RTSPUrl: unit.RTSPUrl,
				}
			}
			posts[i] = Post{
				ID:    post.ID,
				Name:  post.Name,
				Units: units,
			}
		}
		return c.JSON(StationResponse{
			Name:         stationData.Name,
			Type:         "STATION",
			Subordinates: subordinateNames,
			Posts:        posts,
			Timestamp:    timestamp,
		})

	default:
		// LEVEL 3: DAOP Command - Full hierarchy with all stations and JPLs
		stations := make([]Station, len(daopData.Stations))
		for i, station := range daopData.Stations {
			posts := make([]Post, len(station.Subordinates))
			for j, post := range station.Subordinates {
				units := make([]Unit, len(post.Units))
				for k, unit := range post.Units {
					units[k] = Unit{
						ID:      unit.ID,
						Name:    unit.Name,
						Lat:     unit.Lat,
						Long:    unit.Long,
						Status:  unitStatuses[unit.ID],
						RTSPUrl: unit.RTSPUrl,
					}
				}
				posts[j] = Post{
					ID:    post.ID,
					Name:  post.Name,
					Units: units,
				}
			}
			stations[i] = Station{
				ID:           station.ID,
				Name:         station.Name,
				Type:         station.Type,
				Subordinates: posts,
			}
		}
		return c.JSON(DAOPRegion{
			ID:        daopData.ID,
			Name:      daopData.Name,
			Type:      "DAOP",
			Stations:  stations,
			Timestamp: timestamp,
		})
	}
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
		// Send train state
		stateMutex.RLock()
		trainData, _ := json.Marshal(fiber.Map{
			"type": "train_status",
			"data": state,
		})
		stateMutex.RUnlock()

		// Send unit statuses
		unitStatusMutex.RLock()
		var unitUpdates []UnitStatusUpdate
		for id, status := range unitStatuses {
			unitUpdates = append(unitUpdates, UnitStatusUpdate{
				UnitID:    id,
				Status:    status,
				Timestamp: time.Now().Format("15:04:05"),
			})
		}
		unitData, _ := json.Marshal(fiber.Map{
			"type": "unit_status",
			"data": unitUpdates,
		})
		unitStatusMutex.RUnlock()

		wsClientsMux.Lock()
		for client := range wsClients {
			// Send train status
			if err := client.WriteMessage(websocket.TextMessage, trainData); err != nil {
				client.Close()
				delete(wsClients, client)
				continue
			}
			// Send unit status
			if err := client.WriteMessage(websocket.TextMessage, unitData); err != nil {
				client.Close()
				delete(wsClients, client)
			}
		}
		wsClientsMux.Unlock()
	}
}

// unitStatusSimulator randomly changes unit statuses for demo purposes
func unitStatusSimulator() {
	ticker := time.NewTicker(5 * time.Second)
	defer ticker.Stop()

	statuses := []string{"ONLINE", "ONLINE", "ONLINE", "WARNING", "OFFLINE"}
	unitIDs := []string{
		"CAM-01", "CAM-02", "CAM-03", "CAM-04", "CAM-05",
		"CAM-06", "CAM-07", "CAM-08", "CAM-09", "CAM-10",
	}

	log.Println("[SIM] Unit status simulator started (10 cameras)")

	for range ticker.C {
		unitStatusMutex.Lock()

		// Randomly pick a unit and change its status
		randomUnit := unitIDs[rand.Intn(len(unitIDs))]
		newStatus := statuses[rand.Intn(len(statuses))]
		oldStatus := unitStatuses[randomUnit]

		if oldStatus != newStatus {
			unitStatuses[randomUnit] = newStatus
			log.Printf("[UNIT] %s: %s -> %s\n", randomUnit, oldStatus, newStatus)
		}

		unitStatusMutex.Unlock()
	}
}
