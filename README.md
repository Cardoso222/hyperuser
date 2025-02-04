# HyperUser

A professional backend service built with Node.js, Express, MongoDB, Redis, and RabbitMQ. This project demonstrates best practices in building scalable microservices with modern technologies.

## Features

- RESTful API for user management (CRUD operations)
- MongoDB for persistent storage
- Redis for caching
- RabbitMQ for event-driven architecture
- Docker Compose for easy deployment
- Comprehensive test suite
- Error handling and logging

## Tech Stack

- Node.js & Express.js
- MongoDB (Database)
- Redis (Caching)
- RabbitMQ (Message Queue)
- Docker & Docker Compose
- Jest & Supertest (Testing)
- Winston (Logging)

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

2. Copy the environment file:
```bash
cp .env.example .env
```

3. Start the services using Docker Compose:
```bash
docker-compose up -d
```

The API will be available at `http://localhost:3000`.

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

## Event Publishing

The service publishes the following events to RabbitMQ:

- `user.created`: When a new user is created
- `user.updated`: When a user is updated
- `user.deleted`: When a user is deleted

## Caching Strategy

Redis is used to cache:
- List of all users (5 minutes TTL)
- Individual user details (5 minutes TTL)

Cache is automatically invalidated on user updates and deletions.

## Testing

Run the test suite:

```bash
npm test
```

This will run unit tests and integration tests using Jest.

## Development

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

## Production Deployment

1. Build the Docker image:
```bash
docker-compose build
```

2. Start the services:
```bash
docker-compose -f docker-compose.yml up -d
```

## Project Structure

```
.
├── src/
│   ├── controllers/     # Request handlers
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   ├── utils/          # Utilities and helpers
│   ├── middleware/     # Express middleware
│   └── __tests__/      # Test files
├── docker-compose.yml
├── Dockerfile
└── package.json
```


## License

MIT 