package storage

import (
	"central-brain/models"
	"sync"
)

// HistoryStore keeps detection events in memory for quick demo/history API.
type HistoryStore struct {
	mu    sync.RWMutex
	items []models.DetectionPayload
}

func NewHistoryStore() *HistoryStore {
	return &HistoryStore{
		items: make([]models.DetectionPayload, 0, 128),
	}
}

func (h *HistoryStore) Append(item models.DetectionPayload) {
	h.mu.Lock()
	defer h.mu.Unlock()
	h.items = append(h.items, item)
	// keep last 500 items to avoid runaway memory use
	if len(h.items) > 500 {
		h.items = h.items[len(h.items)-500:]
	}
}

func (h *HistoryStore) List() []models.DetectionPayload {
	h.mu.RLock()
	defer h.mu.RUnlock()
	result := make([]models.DetectionPayload, len(h.items))
	copy(result, h.items)
	return result
}

