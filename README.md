[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=22139577&assignment_repo_type=AssignmentRepo)

# News Aggregator API

A RESTful API for a personalized news aggregation service. Users can sign up, set their preferred news categories, and receive personalized news feeds. This is built using a test driven approach.

## Features

- **User Authentication**: JWT-based authentication system with signup and login
- **User Preferences**: Users can set preferred news categories (e.g., movies, comics, games, sports, health, technology)
- **Personalized News**: Fetches news articles based on user preferences from NewsAPI
- **Rate Limiting**: Built-in rate limiting for API protection
- **MongoDB Integration**: Persistent user data storage with MongoDB

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type-safe JavaScript
- **MongoDB** - Database
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **NewsAPI** - External news source

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# JWT secret for token generation
JWT_SECRET=your_jwt_secret_here

# NewsAPI key for fetching news articles
# Get your free API key at: https://newsapi.org/
NEWS_API_KEY=your_newsapi_key_here

# MongoDB connection string
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
```

### Getting Environment Variables

#### NEWS_API_KEY

1. Visit [NewsAPI.org](https://newsapi.org/)
2. Sign up for a free account
3. Navigate to API Key section
4. Copy your API key to the `.env` file

#### JWT_SECRET

Generate a secure random string for JWT token signing:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### MONGO_URI

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Add a database user
4. Whitelist your IP address (or use `0.0.0.0/0` for development)
5. Copy the connection string

## Installation

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Run tests
npm test

# Start production server
npm start

# Start development server with auto-reload
npm run dev
```

## API Endpoints

### Authentication

#### POST /api/auth/register

Register a new user account.

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "preferences": ["technology", "sports"]
}
```

**Response:** `200 OK`

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### POST /api/auth/login

Login with email and password.

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** `200 OK`

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### User Preferences

#### GET /api/users/preferences

Get user's preferred news categories.

**Headers:**

```
Authorization: Bearer {token}
```

**Response:** `200 OK`

```json
{
  "preferences": ["technology", "sports"]
}
```

#### PUT /api/users/preferences

Update user's preferred news categories.

**Headers:**

```
Authorization: Bearer {token}
```

**Request Body:**

```json
{
  "preferences": ["movies", "comics", "games"]
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "preferences": ["movies", "comics", "games"]
}
```

### News

#### GET /api/news

Get personalized news based on user preferences.

**Headers:**

```
Authorization: Bearer {token}
```

**Query Parameters:**

- `page` (optional): Page number for pagination (default: 1)
- `q` (optional): Search query for specific topics

**Response:** `200 OK`

```json
{
  "news": [
    {
      "source": { "id": null, "name": "TechCrunch" },
      "author": "John Doe",
      "title": "Article Title",
      "description": "Article description...",
      "url": "https://example.com/article",
      "urlToImage": "https://example.com/image.jpg",
      "publishedAt": "2026-01-15T10:00:00Z",
      "content": "Article content..."
    }
  ]
}
```

## Testing

The project uses TAP for testing. Run tests with:

```bash
npm test
```

Test file: `test/server.test.js`

## API Usage Examples

### Signup (Register)

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "preferences": ["technology", "sports"]
  }'
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Get User Preferences

```bash
curl -X GET http://localhost:5000/api/users/preferences \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Response:**
```json
{
  "preferences": ["technology", "sports"]
}
```

### Update User Preferences

```bash
curl -X PUT http://localhost:5000/api/users/preferences \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "preferences": ["movies", "comics", "games"]
  }'
```

**Response:**
```json
{
  "success": true,
  "preferences": ["movies", "comics", "games"]
}
```

### Get Personalized News

```bash
# Get news based on user preferences
curl -X GET http://localhost:5000/api/news \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Get news with pagination
curl -X GET "http://localhost:5000/api/news?page=2" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Search for specific topics
curl -X GET "http://localhost:5000/api/news?q=artificial%20intelligence" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Response:**
```json
{
  "news": [
    {
      "source": { "id": null, "name": "TechCrunch" },
      "author": "John Doe",
      "title": "Article Title",
      "description": "Article description...",
      "url": "https://example.com/article",
      "urlToImage": "https://example.com/image.jpg",
      "publishedAt": "2026-01-15T10:00:00Z",
      "content": "Article content..."
    }
  ]
}
```
