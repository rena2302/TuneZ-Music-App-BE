# 🎵 TuneZ Music App - Backend

A comprehensive microservices-based music streaming platform backend built with Node.js, TypeScript, Express, gRPC, and Docker.

## 🏗️ Architecture Overview

TuneZ is built using a microservices architecture with 12 specialized services, each handling specific business domains:

### 🚪 API Gateway
- **Port**: 3000
- Central entry point for all client requests
- Handles authentication, routing, and load balancing
- Proxies requests to appropriate microservices
- Features CORS configuration and JWT authentication

### 🎤 Core Services

| Service | Port | gRPC Port | Description |
|---------|------|-----------|-------------|
| **User Service** | 3001 | 50201 | User management, authentication, profiles |
| **Official Artist Service** | 3002 | 50202 | Artist verification and management |
| **Music Service** | 3003 | 50203 | Music upload, storage, and streaming |
| **Album Service** | 3004 | 50204 | Album creation and management |
| **Playlist Service** | 3005 | 50205 | User playlists and collections |
| **Search Service** | 3006 | 50206 | Global search across music, artists, albums |
| **Follow Service** | 3007 | 50207 | User following system |
| **Love Service** | 3008 | 50208 | Like/favorite music functionality |
| **History Service** | 3009 | 50209 | User listening history tracking |
| **Payment Service** | 3010 | 50210 | Payment processing and transactions |
| **Subscription Service** | 3011 | 50211 | Premium subscription management |

## 🛠️ Technology Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Communication**: gRPC for inter-service communication
- **Authentication**: Firebase Admin SDK + JWT
- **Database**: (Environment configured)
- **File Storage**: Cloudinary for media files
- **Containerization**: Docker & Docker Compose
- **Reverse Proxy**: Nginx
- **Dependency Injection**: TSyringe
- **Validation**: Class-validator
- **Email**: Nodemailer

## 📁 Project Structure

```
TuneZ-Music-App-BE/
├── docker/                     # Docker configuration
│   ├── docker-compose.yml     # Main compose file
│   └── docker-compose.override.yml
├── nginx/                      # Nginx reverse proxy config
│   └── nginx.conf
├── src/services/              # Microservices
│   ├── api-gateway/           # Central API gateway
│   ├── user-service/          # User management
│   ├── music-service/         # Music streaming core
│   ├── album-service/         # Album management
│   ├── playlist-service/      # Playlist functionality
│   ├── search-service/        # Search engine
│   ├── follow-service/        # Social following
│   ├── love-service/          # Like/favorite system
│   ├── history-service/       # Listening history
│   ├── payment-service/       # Payment processing
│   ├── subscription-service/  # Premium subscriptions
│   └── official-artist-service/ # Artist verification
├── env/                       # Environment configurations
├── key/                       # SSL certificates and keys
└── tsconfig.json             # TypeScript configuration
```

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose
- Node.js 18+ (for local development)
- TypeScript knowledge

### 1. Clone the Repository

```bash
git clone <repository-url>
cd TuneZ-Music-App-BE
```

### 2. Environment Setup

Create the required environment files in the `env/` directory:

```bash
# Common environment files
env/common/database.env
env/common/storage.env
env/common/grpc.env
env/common/cors.env

# Service-specific environment files
env/services/api-gateway.env
env/services/user.env
env/services/official-artist.env
# ... (one for each service)
```

### 3. SSL Certificates

Place your SSL certificates in the `key/` directory:
- `key.json` - Firebase service account key
- `localhost.pem` - SSL certificate
- `localhost-key.pem` - SSL private key

### 4. Start the Application

```bash
# Build and start all services
docker-compose -f docker/docker-compose.yml up --build

# Or run in detached mode
docker-compose -f docker/docker-compose.yml up -d --build
```

### 5. Access the Application

- **API Gateway**: `http://localhost:3000`
- **Individual Services**: `http://localhost:300X` (where X is service number)

## 🔧 Development

### Local Development Setup

Each service can be run independently for development:

```bash
# Navigate to a service
cd src/services/user-service

# Install dependencies
npm install

# Run in development mode
npm run dev

# Run with debugging
npm run debug
```

### gRPC Proto Generation

For services using gRPC:

```bash
# Generate TypeScript from proto files
npm run generate-proto
```

### Service Architecture

Each service follows a consistent structure:

```
service-name/
├── src/
│   ├── index.ts           # Entry point
│   ├── config/            # Configuration
│   ├── controller/        # HTTP controllers
│   ├── service/           # Business logic
│   ├── dto/               # Data transfer objects
│   ├── interface/         # TypeScript interfaces
│   ├── route/             # Express routes
│   ├── grpc/              # gRPC implementations
│   ├── repository/        # Data access layer
│   └── util/              # Utility functions
├── dockerfile             # Docker configuration
└── package.json           # Dependencies and scripts
```

## 🌐 API Endpoints

The API Gateway exposes RESTful endpoints for each service. All requests should be made through the gateway at `http://localhost:3000`.

### Authentication

Most endpoints require authentication via JWT tokens:

```bash
# Include in headers
Authorization: Bearer <jwt-token>
```

### Service Routing

The API Gateway routes requests based on URL patterns:
- `/api/users/*` → User Service
- `/api/music/*` → Music Service
- `/api/albums/*` → Album Service
- `/api/playlists/*` → Playlist Service
- And so on...

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Firebase Integration**: User management and authentication
- **CORS Configuration**: Controlled cross-origin access
- **SSL/TLS**: HTTPS encryption support
- **Service Isolation**: Each service runs in its own container

## 📊 Monitoring & Debugging

### Container Logs

```bash
# View logs for all services
docker-compose -f docker/docker-compose.yml logs

# View logs for specific service
docker-compose -f docker/docker-compose.yml logs user-service
```

### Debug Mode

Each service supports debug mode with inspection:

```bash
# Debug port is exposed for each service
# Connect your debugger to localhost:9227
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Environment Variables

### Common Variables

- `DATABASE_URL` - Database connection string
- `STORAGE_BUCKET` - Cloud storage configuration
- `GRPC_HOST` - gRPC server host
- `CORS_ORIGINS` - Allowed CORS origins

### Service-Specific Variables

Each service may require additional environment variables. Check the respective service documentation.

## 🔄 Inter-Service Communication

Services communicate via:
- **gRPC**: For internal service-to-service communication
- **HTTP/REST**: For client-facing APIs through the gateway
- **Event-driven**: For asynchronous operations

## 📈 Scalability

The microservices architecture allows for:
- **Horizontal scaling**: Scale individual services based on demand
- **Technology diversity**: Each service can use different technologies
- **Independent deployment**: Deploy services separately
- **Fault isolation**: Service failures don't affect the entire system

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:
- Check the documentation in each service directory
- Review Docker logs for troubleshooting
- Ensure all environment variables are properly configured

---

Built with ❤️ for music lovers everywhere 🎵
