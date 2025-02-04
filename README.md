# HyperUser

A professional full-stack application built with Node.js, Express, MongoDB, Redis, RabbitMQ, and React. This project demonstrates best practices in building scalable microservices with modern technologies.

## Features

- RESTful API for user management (CRUD operations)
- MongoDB for persistent storage
- Redis for caching
- RabbitMQ for event-driven architecture
- Real-time event monitoring dashboard
  - Live WebSocket updates
  - API endpoint tracking
  - Request/Response monitoring
  - Color-coded event types
- Docker Compose for easy deployment
- Comprehensive test suite
- Error handling and logging

## Tech Stack

### Backend
- Node.js & Express.js
- MongoDB (Database)
- Redis (Caching)
- RabbitMQ (Message Queue)
- Socket.IO (Real-time WebSocket)
- Docker & Docker Compose
- Jest & Supertest (Testing)
- Winston (Logging)

### Frontend
- React
- Material-UI (MUI)
- Socket.IO Client
- React Router
- Axios

## Prerequisites

- Docker and Docker Compose
- Node.js (v18 or later)
- npm or yarn

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd hyperuser
```

2. Copy the environment files:
```bash
# Backend
cp api/.env.example api/.env

# Frontend
cp frontend/.env.example frontend/.env
```

3. Start all services using Docker Compose:
```bash
docker-compose up -d
```

The API will be available at `http://localhost:3000`.
The frontend will be available at `http://localhost:3001`.

## API Endpoints

### Users

- **POST /api/users**
  - Create a new user
  - Body: `{ "name": "string", "email": "string", "password": "string" }`

- **GET /api/users**
  - Get all users
  - Response includes cached results (5 minutes TTL)

- **GET /api/users/:id**
  - Get user by ID
  - Response includes cached results (5 minutes TTL)

- **PUT /api/users/:id**
  - Update user
  - Body: `{ "name": "string", "email": "string" }`

- **DELETE /api/users/:id**
  - Delete user

## Event System

### WebSocket Events
The application provides real-time monitoring of system events through WebSocket connections. Events are displayed in a live dashboard showing:

- Event Type
- HTTP Method
- API Endpoint
- Request Payload
- Response Data
- Timestamp

### Event Types
All events are color-coded for better visibility:
- `user.created` (Green) - When a new user is created
- `user.updated` (Yellow) - When a user is updated
- `user.deleted` (Red) - When a user is deleted

### Message Queue Events
RabbitMQ handles the following events:
- `user.created`: When a new user is created
- `user.updated`: When a user is updated
- `user.deleted`: When a user is deleted

## Caching Strategy

Redis is used to cache:
- List of all users (5 minutes TTL)
- Individual user details (5 minutes TTL)

Cache is automatically invalidated on user updates and deletions.

## Testing

Run the test suites:

```bash
# Backend tests
cd api
npm test

# Frontend tests
cd frontend
npm test
```

## Development

1. Install dependencies:
```bash
# Backend
cd api
npm install

# Frontend
cd frontend
npm install
```

2. Start development servers:
```bash
# Backend
cd api
npm run dev

# Frontend
cd frontend
npm start
```

## Production Deployment

1. Build and start all services:
```bash
docker-compose up -d
```

## Project Structure

```
.
├── api/                  # Backend application
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Utilities and helpers
│   │   │   ├── messageQueue.js    # RabbitMQ integration
│   │   │   ├── websocket.js      # socket.IO setup
│   │   │   └── logger.js         # logger w/ Winston
│   │   ├── middleware/     # Express middleware
│   │   └── __tests__/      # Test files
│   ├── package.json
│   └── Dockerfile.api
├── frontend/            # Frontend application
│   ├── src/
│   │   ├── components/     # React components
│   │   │   └── EventsDisplay.js  # Real-time event monitor
│   │   ├── pages/         # Page components
│   │   ├── services/      # API and WebSocket services
│   │   └── App.js         # Main application
│   ├── package.json
│   └── Dockerfile
└── docker-compose.yml   # Docker services configuration
```

## License

MIT 