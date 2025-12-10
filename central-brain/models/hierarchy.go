package models

// Unit represents a CCTV camera or sensor
type Unit struct {
	ID     string  `json:"id"`
	Name   string  `json:"name"`
	Type   string  `json:"type"`
	Status string  `json:"status"`
	Lat    float64 `json:"lat"`
	Long   float64 `json:"long"`
}

// Post represents a JPL checkpoint
type Post struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	GeoLocation string `json:"geo_location"`
	Units       []Unit `json:"units"`
}

// Station represents a railway station
type Station struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	HeadOfficer string `json:"head_officer"`
	Posts       []Post `json:"posts"`
}

// Region represents a DAOP area
type Region struct {
	ID       string    `json:"id"`
	Name     string    `json:"name"`
	Code     string    `json:"code"`
	Stations []Station `json:"stations"`
}
