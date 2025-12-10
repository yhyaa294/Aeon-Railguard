package stream

import (
	"bufio"
	"strconv"
	"sync"

	"github.com/gofiber/fiber/v2"
)

// MJPEGHub stores the latest frame and broadcasts to subscribers.
type MJPEGHub struct {
	mu           sync.RWMutex
	latestFrame  []byte
	subscribers  map[chan []byte]struct{}
	subscribe    chan chan []byte
	unsubscribe  chan chan []byte
	broadcastReq chan []byte
}

// NewMJPEGHub initializes hub.
func NewMJPEGHub() *MJPEGHub {
	return &MJPEGHub{
		subscribers:  make(map[chan []byte]struct{}),
		subscribe:    make(chan chan []byte),
		unsubscribe:  make(chan chan []byte),
		broadcastReq: make(chan []byte, 8),
	}
}

// Run processes subscriptions and frame broadcasts.
func (h *MJPEGHub) Run() {
	for {
		select {
		case sub := <-h.subscribe:
			h.subscribers[sub] = struct{}{}
			// Send latest frame immediately if exists
			if frame := h.Latest(); len(frame) > 0 {
				sub <- frame
			}
		case sub := <-h.unsubscribe:
			if _, ok := h.subscribers[sub]; ok {
				delete(h.subscribers, sub)
				close(sub)
			}
		case frame := <-h.broadcastReq:
			h.mu.Lock()
			h.latestFrame = frame
			h.mu.Unlock()
			for ch := range h.subscribers {
				select {
				case ch <- frame:
				default:
				}
			}
		}
	}
}

// SetFrame updates the latest frame and broadcasts.
func (h *MJPEGHub) SetFrame(frame []byte) {
	if frame == nil {
		return
	}
	copyFrame := make([]byte, len(frame))
	copy(copyFrame, frame)
	h.broadcastReq <- copyFrame
}

// Latest returns a copy of latest frame.
func (h *MJPEGHub) Latest() []byte {
	h.mu.RLock()
	defer h.mu.RUnlock()
	if h.latestFrame == nil {
		return nil
	}
	out := make([]byte, len(h.latestFrame))
	copy(out, h.latestFrame)
	return out
}

// IngestFrame handles POST /api/internal/stream/cam1 with raw JPEG.
func IngestFrame(hub *MJPEGHub) fiber.Handler {
	return func(c *fiber.Ctx) error {
		body := c.Body()
		if len(body) == 0 {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error":   "bad_request",
				"message": "empty body",
			})
		}
		hub.SetFrame(body)
		return c.SendStatus(fiber.StatusAccepted)
	}
}

// StreamMJPEG serves multipart/x-mixed-replace for latest frames.
func StreamMJPEG(hub *MJPEGHub) fiber.Handler {
	return func(c *fiber.Ctx) error {
		c.Set("Content-Type", "multipart/x-mixed-replace; boundary=frame")
		c.Set("Cache-Control", "no-cache, no-store, must-revalidate")
		c.Set("Pragma", "no-cache")
		c.Set("Connection", "keep-alive")

		subscriber := make(chan []byte, 4)
		hub.subscribe <- subscriber
		defer func() {
			hub.unsubscribe <- subscriber
		}()

		c.Context().SetBodyStreamWriter(func(w *bufio.Writer) {
			for frame := range subscriber {
				if len(frame) == 0 {
					continue
				}
				w.WriteString("--frame\r\n")
				w.WriteString("Content-Type: image/jpeg\r\n")
				w.WriteString("Content-Length: ")
				w.WriteString(strconv.Itoa(len(frame)))
				w.WriteString("\r\n\r\n")
				w.Write(frame)
				w.WriteString("\r\n")
				w.Flush()
			}
		})
		return nil
	}
}

