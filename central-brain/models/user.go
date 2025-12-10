package models

// User represents a system user
type User struct {
	ID           string `json:"id"`
	PasswordHash string `json:"-"` // Never expose in JSON
	Role         string `json:"role"`
	Name         string `json:"name"`
	PostID       string `json:"post_id,omitempty"`
	StationID    string `json:"station_id,omitempty"`
}

// LoginRequest represents login credentials
type LoginRequest struct {
	ID       string `json:"id"`
	Password string `json:"password"`
}

// LoginResponse represents successful auth response
type LoginResponse struct {
	AccessToken  string   `json:"access_token"`
	RefreshToken string   `json:"refresh_token,omitempty"`
	ExpiresIn    int      `json:"expires_in"`
	User         UserInfo `json:"user"`
}

// UserInfo represents public user info
type UserInfo struct {
	ID   string `json:"id"`
	Role string `json:"role"`
	Name string `json:"name"`
}
