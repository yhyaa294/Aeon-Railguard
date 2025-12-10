package realtime

import (
	"time"

	"github.com/gofiber/websocket/v2"
)

// WSHandler upgrades client connection and registers to hub.
func WSHandler(hub *Hub) func(*websocket.Conn) {
	return func(c *websocket.Conn) {
		hub.register <- c
		defer func() {
			hub.unregister <- c
		}()

		// Send initial hello payload
		type helloPayload struct {
			Type      string    `json:"type"`
			Timestamp time.Time `json:"timestamp"`
			Message   string    `json:"message"`
		}

		_ = c.WriteJSON(helloPayload{
			Type:      "welcome",
			Timestamp: time.Now().UTC(),
			Message:   "Connected to Aeon RailGuard WS",
		})

		// Keep connection alive; discard incoming frames
		for {
			if _, _, err := c.ReadMessage(); err != nil {
				break
			}
		}
	}
}


