# TestSprite API Integration Guide

## Setup

TestSprite is used for automated API testing.

### 1. Install TestSprite MCP

Add to your MCP config (`.gemini/mcp_config.json` or similar):

```json
{
  "mcpServers": {
    "TestSprite": {
      "command": "npx",
      "args": [
        "@testsprite/testsprite-mcp@latest"
      ],
      "env": {
        "API_KEY": "sk-user-4KwtiNgeGY5kwaiPL94gwy9EOWHehGtWUgccE6P9Vr8ss-zOyfXHngvQ1-r47R1vBjijh368tTERenZ7JyvGNh50q5KgFb6dkbqYipFyqw_UqzdkpoCipSGqa2oy_CJRogM"
      }
    }
  }
}
```

### 2. Test Endpoints to Validate

Create test cases for:

#### Public Endpoints
- `GET /api/health` - Should return 200
- `POST /api/auth/login` - Should return JWT token

#### Protected Endpoints (Requires Auth)
- `GET /api/hierarchy` - Should return 401 without token, 200 with valid token
- `GET /api/cameras` - Should require JPL_OFFICER role or higher
- `GET /api/detections` - Should require JPL_OFFICER role or higher

### 3. Sample Test Script

```javascript
// test-api.js
const API_BASE = 'http://localhost:8080';

// Test 1: Health Check
async function testHealth() {
  const response = await fetch(`${API_BASE}/api/health`);
  const data = await response.json();
  console.assert(response.status === 200, 'Health check should return 200');
  console.assert(data.status === 'healthy', 'Status should be healthy');
}

// Test 2: Login
async function testLogin() {
  const response = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: 'JPL-102', password: '123456' })
  });
  const data = await response.json();
  console.assert(response.status === 200, 'Login should return 200');
  console.assert(data.access_token, 'Should return access token');
  return data.access_token;
}

// Test 3: Protected Endpoint
async function testProtectedEndpoint(token) {
  const response = await fetch(`${API_BASE}/api/hierarchy`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  console.assert(response.status === 200, 'Should access protected endpoint');
}

// Test 4: Unauthorized Access
async function testUnauthorized() {
  const response = await fetch(`${API_BASE}/api/hierarchy`);
  console.assert(response.status === 401, 'Should return 401 without token');
}

// Run all tests
(async () => {
  await testHealth();
  const token = await testLogin();
  await testProtectedEndpoint(token);
  await testUnauthorized();
  console.log('All tests passed!');
})();
```

### 4. Run Tests

```bash
# Start the server first
go run main.go

# In another terminal, run tests
node test-api.js
```

### 5. Expected Results

- ✅ All endpoints respond correctly
- ✅ JWT authentication works
- ✅ RBAC filters data properly
- ✅ Error responses are consistent
- ✅ Logging captures all requests

### 6. TestSprite Automation

For automated CI/CD testing with TestSprite, create `.testsprite.yml`:

```yaml
version: 1
tests:
  - name: Health Check
    request:
      method: GET
      url: http://localhost:8080/api/health
    expect:
      status: 200
      body:
        status: healthy

  - name: Login Success
    request:
      method: POST
      url: http://localhost:8080/api/auth/login
      json:
        id: JPL-102
        password: "123456"
    expect:
      status: 200
      body:
        access_token: !exists

  - name: Protected Endpoint Without Auth
    request:
      method: GET
      url: http://localhost:8080/api/hierarchy
    expect:
      status: 401
```

---

**Note:** Keep API keys secure. Never commit them to public repositories.
