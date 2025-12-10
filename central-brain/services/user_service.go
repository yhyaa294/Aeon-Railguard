package services

import (
	"central-brain/auth"
	"central-brain/models"
	"errors"
	"sync"
)

// In-memory user data (replace with database in production)
var (
	users      = make(map[string]*models.User)
	usersMutex sync.RWMutex
)

func init() {
	// Initialize demo users with hashed passwords
	password := "123456" // Demo password
	hash, _ := auth.HashPassword(password)

	// DAOP Admin
	users["DAOP-7"] = &models.User{
		ID:           "DAOP-7",
		PasswordHash: hash,
		Role:         models.RoleDAOPAdmin,
		Name:         "Admin DAOP 7 Madiun",
	}

	// Station Masters
	users["STA-JBG"] = &models.User{
		ID:           "STA-JBG",
		PasswordHash: hash,
		Role:         models.RoleStationMaster,
		Name:         "Kepala Stasiun Jombang",
		StationID:    "STA-JBG",
	}

	users["STA-KTS"] = &models.User{
		ID:           "STA-KTS",
		PasswordHash: hash,
		Role:         models.RoleStationMaster,
		Name:         "Kepala Stasiun Kertosono",
		StationID:    "STA-KTS",
	}

	// JPL Officers
	users["JPL-102"] = &models.User{
		ID:           "JPL-102",
		PasswordHash: hash,
		Role:         models.RoleJPLOfficer,
		Name:         "Petugas JPL 102",
		PostID:       "JPL-102",
		StationID:    "STA-JBG",
	}

	users["JPL-105"] = &models.User{
		ID:           "JPL-105",
		PasswordHash: hash,
		Role:         models.RoleJPLOfficer,
		Name:         "Petugas JPL 105",
		PostID:       "JPL-105",
		StationID:    "STA-JBG",
	}

	users["JPL-98"] = &models.User{
		ID:           "JPL-98",
		PasswordHash: hash,
		Role:         models.RoleJPLOfficer,
		Name:         "Petugas JPL 98",
		PostID:       "JPL-98",
		StationID:    "STA-KTS",
	}
}

// GetUserByID retrieves a user by ID
func GetUserByID(id string) (*models.User, error) {
	usersMutex.RLock()
	defer usersMutex.RUnlock()

	user, exists := users[id]
	if !exists {
		return nil, errors.New("user not found")
	}

	return user, nil
}

// ValidateLogin checks credentials and returns user
func ValidateLogin(id, password string) (*models.User, error) {
	user, err := GetUserByID(id)
	if err != nil {
		return nil, err
	}

	err = auth.CheckPassword(user.PasswordHash, password)
	if err != nil {
		return nil, errors.New("invalid password")
	}

	return user, nil
}
