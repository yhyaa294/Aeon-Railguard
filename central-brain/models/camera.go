package models

import "time"

// Camera represents a CCTV camera
type Camera struct {
	ID       string   `json:"id"`
	Name     string   `json:"name"`
	Type     string   `json:"type"`
	Status   string   `json:"status"`
	Location Location `json:"location"`
	PostID   string   `json:"post_id"`
}

// Location represents GPS coordinates
type Location struct {
	Lat  float64 `json:"lat"`
	Long float64 `json:"long"`
}

// Detection represents an AI detection event
type Detection struct {
	ID          string    `json:"id"`
	CameraID    string    `json:"camera_id"`
	ObjectClass string    `json:"object_class"`
	Confidence  float64   `json:"confidence"`
	Severity    string    `json:"severity"`
	Timestamp   time.Time `json:"timestamp"`
	ImageURL    string    `json:"image_url,omitempty"`
}
