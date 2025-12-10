package realtime

import (
	"encoding/json"
	"log"

	"github.com/gofiber/websocket/v2"
)

// Hub manages websocket clients and broadcasts detection events.
type Hub struct {
	clients    map[*websocket.Conn]bool
	register   chan *websocket.Conn
	unregister chan *websocket.Conn
	broadcast  chan []byte
}

// NewHub creates a hub instance.
func NewHub() *Hub {
	return &Hub{
		clients:    make(map[*websocket.Conn]bool),
		register:   make(chan *websocket.Conn),
		unregister: make(chan *websocket.Conn),
		broadcast:  make(chan []byte, 32),
	}
}

// Run listens for register/unregister/broadcast events.
func (h *Hub) Run() {
	for {
		select {
		case conn := <-h.register:
			h.clients[conn] = true
		case conn := <-h.unregister:
			if _, ok := h.clients[conn]; ok {
				delete(h.clients, conn)
				_ = conn.Close()
			}
		case msg := <-h.broadcast:
			for conn := range h.clients {
				if err := conn.WriteMessage(websocket.TextMessage, msg); err != nil {
					log.Printf("[WS] write error: %v", err)
					delete(h.clients, conn)
					_ = conn.Close()
				}
			}
		}
	}
}

// BroadcastJSON marshals payload to JSON and sends to all clients.
func (h *Hub) BroadcastJSON(v interface{}) {
	if h == nil {
		return
	}
	data, err := json.Marshal(v)
	if err != nil {
		log.Printf("[WS] marshal error: %v", err)
		return
	}
	h.broadcast <- data
}


