package auth

import (
	"time"

	"github.com/golang-jwt/jwt/v5"
)

// Change this in production!
var jwtSecret = []byte("aeon-railguard-secret-key-change-in-production")

// Claims represents JWT claims
type Claims struct {
	UserID    string `json:"user_id"`
	Role      string `json:"role"`
	PostID    string `json:"post_id,omitempty"`
	StationID string `json:"station_id,omitempty"`
	jwt.RegisteredClaims
}

// GenerateToken creates a new JWT token
func GenerateToken(userID, role, postID, stationID string) (string, error) {
	claims := Claims{
		UserID:    userID,
		Role:      role,
		PostID:    postID,
		StationID: stationID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			Issuer:    "aeon-railguard",
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtSecret)
}

// ValidateToken validates JWT and returns claims
func ValidateToken(tokenString string) (*Claims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		return jwtSecret, nil
	})

	if err != nil {
		return nil, err
	}

	if claims, ok := token.Claims.(*Claims); ok && token.Valid {
		return claims, nil
	}

	return nil, jwt.ErrSignatureInvalid
}
