# Aeon RailGuard - Central Brain API v2.1.0

**Status:** Production-ready modular REST API  
**Framework:** Go (Fiber)  
**Auth:** JWT with bcrypt password hashing  
**RBAC:** 3-tier role hierarchy  
**Logging:** Structured JSON logging (logrus)  

---

## 🚀 Quick Start

### Prerequisites
- Go 1.24+ installed
- Port 8080 available

### Running the Server

```bash
cd central-brain
go run main.go
```

Server will start at: `http://localhost:8080`

---

## 📁 Project Structure

```
central-brain/
├── main.go                 # Entry point with routes
├── models/                 # Data structures
│   ├── roles.go           #  Role constants
│   ├── hierarchy.go       # Region/Station/Post/Unit
│   ├── user.go            # User & auth models
│   ├── camera.go          # Camera & detection models
│   └── response.go        # API response formats
├── auth/                   # Authentication
│   ├── jwt.go             # JWT generation & validation
│   └── password.go        # Bcrypt hashing
├── middleware/             # HTTP middlewares
│   ├── auth_middleware.go # JWT validation
│   ├── rbac_middleware.go # Role-based access control
│   ├── logger.go          # Request logging
│   └── error_handler.go   # Error handling & recovery
├── api/                    # HTTP handlers
│   ├── health.go          # Health check
│   ├── auth.go            # Login endpoint
│   ├── hierarchy.go       # Hierarchy (RBAC filtered)
│   ├── cameras.go         # Camera list
│   └── detections.go      # Detection records
└── services/               # Business logic
    ├── user_service.go    # User management
    └── hierarchy_service.go # Hierarchy data & RBAC filtering
```

---

## 🔐 API Endpoints

### Public Endpoints (No Auth)

#### Health Check
```http
GET /api/health
```

**Response:**
```json
{
  "status": "healthy",
  "version": "2.1.0",
  "database": "in-memory",
  "timestamp": "2025-12-10T12:00:00Z"
}
```

#### User Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "id": "JPL-102",
  "password": "123456"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUz...",
  "expires_in": 86400,
  "user": {
    "id": "JPL-102",
    "role": "JPL_OFFICER",
    "name": "Petugas JPL 102"
  }
}
```

---

### Protected Endpoints (JWT Required)

All protected endpoints require `Authorization: Bearer <token>` header.

#### Get Hierarchy (RBAC Filtered)
```http
GET /api/hierarchy
Authorization: Bearer eyJhbGciOiJIUz...
```

**Response (varies by role):**
- **DAOP Admin:** Full region with all stations
- **Station Master:** Only their station
- **JPL Officer:** Only their post

#### Get Cameras
```http
GET /api/cameras?status=online&limit=10
Authorization: Bearer eyJhbGciOiJIUz...
```

#### Get Detections
```http
GET /api/detections?limit=50&severity=critical
Authorization: Bearer eyJhbGciOiJIUz...
```

---

## 👥 Demo Users

All demo users have password: `123456`

| User ID | Role | Access Level |
|---------|------|--------------|
| `DAOP-7` | DAOP_ADMIN | Full region access |
| `STA-JBG` | STATION_MASTER | Stasiun Jombang only |
| `STA-KTS` | STATION_MASTER | Stasiun Kertosono only |
| `JPL-102` | JPL_OFFICER | Pos JPL 102 only (2 cameras) |
| `JPL-105` | JPL_OFFICER | Pos JPL 105 only (1 camera) |
| `JPL-98` | JPL_OFFICER | Pos JPL 98 only (1 camera) |

---

## 🔒 Authentication Flow

1. **Login:** POST `/api/auth/login` with `id` and `password`
2. **Receive JWT:** Server returns `access_token`
3. **Use Token:** Include `Authorization: Bearer <token>` in all requests
4. **Token Expiry:** 24 hours (86400 seconds)

### Example with cURL:

```bash
# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"id":"JPL-102","password":"123456"}'

# Use token
curl -X GET http://localhost:8080/api/hierarchy \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🛡️ RBAC (Role-Based Access Control)

### Role Hierarchy:
```
DAOP_ADMIN (Level 3)
  ├── Full access to all endpoints
  ├── Can view entire region hierarchy
  └── Can manage all cameras and detections
      ↓
STATION_MASTER (Level 2)
  ├── Access to station-level data
  ├── Can view all posts under their station
  └── Can see all cameras in their station
      ↓
JPL_OFFICER (Level 1)
  ├── Access to post-level data only
  ├── Can view only their assigned post
  └── Can see only cameras at their post (2-4 cameras)
```

### Middleware Usage:

```go
// Require any authenticated user
protected.Use(middleware.AuthRequired())

// Require specific role or higher
protected.Get("/admin/stats", middleware.RequireRole(models.RoleDAOPAdmin), handler)
```

---

## 📊 Logging

All requests are logged in JSON format:

```json
{
  "level": "info",
  "method": "GET",
  "path": "/api/hierarchy",
  "status": 200,
  "duration": 5,
  "ip": "127.0.0.1",
  "user_id": "JPL-102",
  "role": "JPL_OFFICER",
  "time": "2025-12-10 12:00:00"
}
```

Log levels:
- **INFO:** Successful requests (2xx-3xx)
- **WARN:** Client errors (4xx)
- **ERROR:** Server errors (5xx)

---

## 🧪 Testing

### Manual Testing with cURL:

```bash
# Health check
curl http://localhost:8080/api/health

# Login as DAOP Admin
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"id":"DAOP-7","password":"123456"}' \
  | jq -r '.access_token')

# Get full hierarchy (DAOP Admin)
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8080/api/hierarchy

# Login as JPL Officer
TOKEN_JPL=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"id":"JPL-102","password":"123456"}' \
  | jq -r '.access_token')

# Get filtered hierarchy (JPL Officer - only sees their post)
curl -H "Authorization: Bearer $TOKEN_JPL" \
  http://localhost:8080/api/hierarchy
```

### Testing RBAC:

```bash
# Try to access with expired/invalid token (should get 401)
curl -H "Authorization: Bearer invalid_token" \
  http://localhost:8080/api/hierarchy

# Try to access without token (should get 401)
curl http://localhost:8080/api/hierarchy
```

---

## 🔧 Configuration

### JWT Secret Key
**⚠️ IMPORTANT:** Change the JWT secret in `auth/jwt.go` before production:

```go
var jwtSecret = []byte("YOUR_SECRET_KEY_CHANGE_THIS")
```

### Token Expiry
Default: 24 hours. Modify in `auth/jwt.go`:

```go
ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
```

---

## 📦 Dependencies

```bash
# Core framework
github.com/gofiber/fiber/v2

# JWT
github.com/golang-jwt/jwt/v5

# Password hashing
golang.org/x/crypto/bcrypt

# Logging
github.com/sirupsen/logrus

# Swagger (optional)
github.com/swaggo/fiber-swagger
github.com/swaggo/files
github.com/swaggo/swag/cmd/swag
```

Install all:
```bash
go mod tidy
```

---

## 🚀 Production Deployment

### Security Checklist:
- [ ] Change JWT secret key
- [ ] Use environment variables for secrets
- [ ] Enable HTTPS/TLS
- [ ] Set up rate limiting
- [ ] Configure CORS properly
- [ ] Use PostgreSQL instead of in-memory data
- [ ] Set up reverse proxy (Nginx)
- [ ] Configure firewall rules

### Environment Variables:
```bash
export JWT_SECRET="your-production-secret-key"
export PORT=8080
export DATABASE_URL="postgres://user:pass@host:5432/db"
```

---

## 📝 Next Steps

1. **Database Integration:** Replace in-memory data with PostgreSQL
2. **Swagger Docs:** Run `swag init` to generate API documentation
3. **Unit Tests:** Add tests for handlers and services
4. **WebSocket:** Add real-time updates for camera feeds
5. **AI Integration:** Connect to YOLOv8 detection engine

---

##  Troubleshooting

### Port Already in Use
```bash
# Windows: Find and kill process on port 8080
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

### Module Import Errors
```bash
go mod tidy
go clean -modcache
```

### Build Errors
```bash
# Ensure Go 1.24+
go version

# Clean and rebuild
go clean
go build -o central-brain.exe .
```

---

**Built with ❤️ for Aeon RailGuard**  
**Version:** 2.1.0 | **Last Updated:** 2025-12-10
