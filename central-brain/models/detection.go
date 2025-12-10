package models

import "time"

// DetectionPayload represents data sent from AI engine.
type DetectionPayload struct {
	Type             string    `json:"type"`
	ObjectClass      string    `json:"object_class"`
	Confidence       float64   `json:"confidence"`
	InROI            bool      `json:"in_roi"`
	ObjectID         int       `json:"object_id"`
	DurationSeconds  float64   `json:"duration_seconds"`
	Timestamp        time.Time `json:"timestamp"`
	CameraID         string    `json:"camera_id,omitempty"`
	AdditionalDetail string    `json:"detail,omitempty"`
	ImageURL         string    `json:"image_url,omitempty"`
}

