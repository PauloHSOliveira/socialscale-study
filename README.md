# SocialScale API 🚀

A scalable social media API built with **Hexagonal Architecture** to demonstrate scaling techniques from 100 to 1 million users. This project showcases clean architecture patterns, dependency injection, advanced caching strategies, and enterprise-grade scaling techniques.

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [API Endpoints](#api-endpoints)
- [Performance & Load Testing](#performance--load-testing)
- [Scaling Journey](#scaling-journey)
- [Deployment](#deployment)
- [Contributing](#contributing)

## 🎯 Overview

SocialScale is a production-ready RESTful API built with **Hexagonal Architecture** (Ports & Adapters) that simulates a social media platform. The project demonstrates how to scale from hundreds to millions of users using clean architecture principles, dependency injection, and advanced optimization techniques.

### Key Learning Objectives

- **Hexagonal Architecture Implementation**
- **Clean Code & SOLID Principles**
- **Dependency Injection & IoC**
- **Domain-Driven Design (DDD)**
- **Advanced Caching Strategies**
- **Enterprise Rate Limiting**
- **Database Optimization & Scaling**
- **Performance Monitoring & Observability**

## 🏗 Architecture

### Hexagonal Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    HEXAGONAL ARCHITECTURE                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐    ┌─────────────────┐    ┌─────────────┐  │
│  │   HTTP      │    │   APPLICATION   │    │  DATABASE   │  │
│  │  ADAPTERS   │───▶│     LAYER       │───▶│  ADAPTERS   │  │
│  │ (Express)   │    │  (Use Cases)    │    │  (Prisma)   │  │
│  └─────────────┘    └─────────────────┘    └─────────────┘  │
│         │                     │                     │       │
│         │            ┌─────────────────┐            │       │
│         │            │   DOMAIN LAYER  │            │       │
│         │            │   (Entities &   │            │       │
│         │            │  Repositories)  │            │       │
│         │            └─────────────────┘            │       │
│         │                     │                     │       │
│  ┌─────────────┐    ┌─────────────────┐    ┌─────────────┐  │
│  │   RATE      │    │ INFRASTRUCTURE  │    │   CACHE     │  │
│  │ LIMITERS    │    │     LAYER       │    │  ADAPTERS   │  │
│  │ (Redis)     │    │ (Config, DI)    │    │  (Redis)    │  │
│  └─────────────┘    └─────────────────┘    └─────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## ✨ Features

### Core Functionality
- 🔐 **JWT Authentication** (Secure token-based auth)
- 👤 **User Management** (CRUD with validation)
- 📝 **Post System** (Create, read with pagination)
- 👥 **Social Features** (Follow/unfollow system)
- 🔍 **Advanced Pagination** (Cursor-based for performance)

### Enterprise Features
- 🏗️ **Hexagonal Architecture** (Clean separation of concerns)
- 💉 **Dependency Injection** (IoC container)
- ⚡ **Multi-tier Caching** (Redis with intelligent invalidation)
- 🛡️ **Advanced Rate Limiting** (Multiple algorithms & strategies)
- 📊 **Database Optimization** (Indexes, connection pooling)
- 🔄 **Graceful Shutdown** (Proper resource cleanup)
- 📈 **Health Monitoring** (Comprehensive health checks)
- 🎯 **Error Handling** (Structured error responses)

## 🛠 Tech Stack

### Backend Core
- **Node.js 18+** - Runtime with clustering support
- **TypeScript 5.8** - Full type safety
- **Express.js 5** - Web framework with middleware
- **Prisma 6** - Type-safe ORM with migrations

### Architecture & Patterns
- **Hexagonal Architecture** - Clean separation of concerns
- **Dependency Injection** - Custom IoC container
- **Domain-Driven Design** - Rich domain models
- **SOLID Principles** - Clean code practices

### Database & Caching
- **PostgreSQL** - Primary database with optimizations
- **Redis** - Multi-purpose (cache, rate limiting, sessions)

### DevOps & Quality
- **Docker & Compose** - Containerization
- **Biome** - Fast linting and formatting
- **Zod** - Runtime type validation
- **Custom Logging** - Structured logging system

### Testing & Performance
- **k6** - Modern load testing tool
- **Custom Metrics** - Performance monitoring

## 📁 Project Structure

```
src/
├── main/                    # Application entry points
│   ├── app.ts              # Express app composition
│   ├── server.ts           # Single server instance
│   ├── cluster.ts          # Multi-core clustering
│   └── index.ts            # Main entry point
│
├── domain/                  # Domain Layer (Business Logic)
│   ├── entities/           # Domain entities
│   │   ├── User.ts
│   │   ├── Post.ts
│   │   └── Follow.ts
│   ├── repositories/       # Repository interfaces
│   │   ├── UserRepository.ts
│   │   ├── PostRepository.ts
│   │   └── FollowRepository.ts
│   └── services/           # Domain service interfaces
│       ├── AuthService.ts
│       ├── CacheService.ts
│       └── RateLimitService.ts
│
├── application/             # Application Layer (Use Cases)
│   └── use-cases/
│       ├── auth/           # Authentication use cases
│       │   ├── SignupUseCase.ts
│       │   └── LoginUseCase.ts
│       ├── users/          # User management use cases
│       │   ├── UpdateProfileUseCase.ts
│       │   └── FollowUserUseCase.ts
│       └── posts/          # Post management use cases
│           ├── CreatePostUseCase.ts
│           ├── GetPostsUseCase.ts
│           └── GetUserPostsUseCase.ts
│
├── adapters/                # Adapters Layer (External Interfaces)
│   ├── http/               # HTTP adapters
│   │   ├── controllers/    # Request handlers
│   │   ├── routes/         # Route definitions
│   │   └── middleware/     # Express middleware
│   ├── db/                 # Database adapters
│   │   ├── PrismaUserRepository.ts
│   │   ├── PrismaPostRepository.ts
│   │   └── PrismaFollowRepository.ts
│   └── cache/              # Cache adapters
│       └── RedisCacheService.ts
│
├── infrastructure/          # Infrastructure Layer
│   ├── auth/               # Authentication implementation
│   │   └── BcryptAuthService.ts
│   ├── cache/              # Cache client
│   │   └── RedisClient.ts
│   ├── database/           # Database client
│   │   └── PrismaClient.ts
│   ├── config/             # Configuration
│   │   └── Environment.ts
│   ├── di/                 # Dependency injection
│   │   ├── Container.ts
│   │   └── ServiceRegistration.ts
│   └── rate-limit/         # Rate limiting services
│       └── RedisRateLimitService.ts
│
└── shared/                  # Shared utilities
    ├── errors/             # Custom error classes
    │   ├── BaseError.ts
    │   ├── ValidationError.ts
    │   ├── UnauthorizedError.ts
    │   └── ConflictError.ts
    └── types/              # Shared type definitions
        └── AuthRequest.ts
```

## 🚀 Installation

### Prerequisites
- **Node.js 18+**
- **PostgreSQL 14+**
- **Redis 7+**
- **Docker & Docker Compose** (optional)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/socialscale-api.git
   cd socialscale-api
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start services with Docker**
   ```bash
   docker-compose up -d postgres redis
   ```

5. **Run database migrations**
   ```bash
   pnpm prisma:migrate
   pnpm seed
   ```

6. **Start the development server**
   ```bash
   # Single instance
   pnpm dev

   # Clustered (production-like)
   pnpm dev:cluster
   ```

### Environment Configuration

```bash
# Database
DATABASE_URL="postgresql://socialscale:devpass@localhost:5432/socialscale?connection_limit=50&pool_timeout=10000&statement_timeout=30000"

# Or use individual DB config
DB_CONNECTION_LIMIT=50
DB_POOL_TIMEOUT=10000
DB_STATEMENT_TIMEOUT=30000

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Rate Limiting (Configurable for different environments)
RATE_LIMIT_GENERAL=15000    # 15K requests per 30s (load testing)
RATE_LIMIT_POST=10000       # 10K requests per 30s
RATE_LIMIT_LOGIN=5000       # 5K requests per minute
RATE_LIMIT_SIGNUP=2000      # 2K requests per minute

# Production (lower limits)
# RATE_LIMIT_GENERAL=3000
# RATE_LIMIT_POST=6000

# Application
PORT=3000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-in-production
LOG_LEVEL=info
```

## 📡 API Endpoints

### Authentication
```http
POST /signup              # Create new user account
POST /login               # Authenticate user
```

### User Management
```http
PUT  /user/profile        # Update user profile
POST /user/follow/:id     # Follow another user
GET  /user/:id/posts      # Get user's posts
```

### Posts
```http
POST /posts               # Create new post
GET  /posts               # Get posts feed (paginated)
GET  /posts?limit=20      # Get posts with limit
GET  /posts?cursor=xyz    # Get posts with cursor pagination
```

### System
```http
GET  /health              # Health check
GET  /health/readiness    # Readiness check
GET  /health/liveness     # Liveness check
```

## 📊 Performance & Load Testing

### Load Testing with k6

Our comprehensive k6 load test simulates realistic user behavior across all endpoints:

```javascript
// k6-tests/loadtest.js - Real Production Load Test
import { check, sleep } from "k6";
import http from "k6/http";

export const options = {
  stages: [
    { duration: "1m", target: 100 },    // Ramp up to 100 VUs
    { duration: "2m", target: 500 },    // Scale to 500 VUs  
    { duration: "3m", target: 1000 },   // Peak at 1000 VUs
    { duration: "2m", target: 500 },    // Scale back down
    { duration: "1m", target: 0 },      // Ramp down to 0
  ],
  thresholds: {
    http_req_duration: [{ threshold: "p(95)<3000", abortOnFail: false }],
    http_req_failed: ["rate<0.05"],
  },
};

const BASE_URL = "http://localhost:3000";
const state = new Map(); // VU state management

function generateUniqueId() {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 6);
  return `${timestamp}${random}`;
}

function createUser(vuId, userIndex) {
  const uniqueId = generateUniqueId();
  const shortId = `${vuId}${userIndex}${uniqueId}`.substring(0, 8);

  return {
    email: `test.user.${shortId}@loadtest.dev`,
    username: `user${shortId}`.substring(0, 20),
    password: "password123",
    name: `Test User ${shortId}`,
  };
}

export default function () {
  const vu = __VU;
  const iteration = __ITER;
  const headers = { "Content-Type": "application/json" };

  if (!state.has(vu)) {
    // Create two unique users for testing
    const user1 = createUser(vu, 1);
    const user2 = createUser(vu, 2);

    // Health Check
    const health = http.get(`${BASE_URL}/health`);
    check(health, { "health check 200": (r) => r.status === 200 });

    // User Registration & Authentication Flow
    const signup1 = http.post(`${BASE_URL}/signup`, JSON.stringify(user1), { headers });
    check(signup1, {
      "user1 signup success": (r) => r.status === 201,
      "user1 signup has token": (r) => r.json("token") !== undefined,
    });

    if (signup1.status === 201) {
      const responseBody = signup1.json();
      user1.token = responseBody.token;
      user1.id = responseBody.user.id;
    }

    const signup2 = http.post(`${BASE_URL}/signup`, JSON.stringify(user2), { headers });
    check(signup2, {
      "user2 signup success": (r) => r.status === 201,
      "user2 signup has token": (r) => r.json("token") !== undefined,
    });

    if (signup2.status === 201) {
      const responseBody = signup2.json();
      user2.token = responseBody.token;
      user2.id = responseBody.user.id;
    }

    // Login verification
    const login1 = http.post(
      `${BASE_URL}/login`,
      JSON.stringify({ email: user1.email, password: user1.password }),
      { headers }
    );
    check(login1, {
      "user1 login success": (r) => r.status === 200,
      "user1 login has token": (r) => r.json("token") !== undefined,
    });

    state.set(vu, { user1, user2, followed: false, postsCreated: 0 });
  }

  const vuState = state.get(vu);
  const { user1, user2, followed } = vuState;

  if (!user1.token || !user2.token) {
    return; // Skip if authentication failed
  }

  // Create Post (unique content per iteration)
  const postContent = `Post #${vuState.postsCreated + 1} by ${user1.username} at ${new Date().toISOString()}`;
  const createPost = http.post(`${BASE_URL}/posts`, JSON.stringify({ content: postContent }), {
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${user1.token}` },
  });
  check(createPost, {
    "create post success": (r) => r.status === 201,
    "create post has id": (r) => r.json("id") !== undefined,
  });

  if (createPost.status === 201) {
    vuState.postsCreated++;
  }

  // Follow User (once per VU)
  if (!followed) {
    const followUser = http.post(`${BASE_URL}/user/follow/${user1.id}`, null, {
      headers: { Authorization: `Bearer ${user2.token}` },
    });
    check(followUser, {
      "follow user success": (r) => r.status === 201 || r.status === 409,
    });
    if (followUser.status === 201 || followUser.status === 409) {
      vuState.followed = true;
    }
  }

  // Get Posts (Public Feed) - Critical endpoint
  const getPosts = http.get(`${BASE_URL}/posts?limit=20`);
  check(getPosts, {
    "get posts success": (r) => r.status === 200,
    "get posts has data": (r) => r.json("posts") !== undefined,
  });

  // Get User Posts
  const getUserPosts = http.get(`${BASE_URL}/user/${user1.id}/posts`, {
    headers: { Authorization: `Bearer ${user2.token}` },
  });
  check(getUserPosts, { "get user posts success": (r) => r.status === 200 });

  // Update Profile (occasionally)
  if (iteration % 5 === 0) {
    const updateProfile = http.put(
      `${BASE_URL}/user/profile`,
      JSON.stringify({
        name: `Updated ${user1.name} #${iteration}`,
        bio: `Bio updated at ${new Date().toISOString()}`,
      }),
      {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${user1.token}` },
      }
    );
    check(updateProfile, { "update profile success": (r) => r.status === 200 });
  }

  sleep(Math.random() * 2 + 0.5); // Random sleep 0.5-2.5s
}

export function setup() {
  console.log("🚀 Starting SocialScale load test...");
  const healthCheck = http.get(`${BASE_URL}/health`);
  if (healthCheck.status !== 200) {
    throw new Error(`❌ Server not available. Health check failed: ${healthCheck.status}`);
  }
  console.log("✅ Server is healthy, starting test execution...");
  return {};
}

export function teardown(data) {
  console.log("✅ Load test completed!");
}
```

### Running Load Tests

```bash
# Run the comprehensive load test
k6 run k6-tests/loadtest.js

# Run with output to file
k6 run --out json=results.json k6-tests/loadtest.js

# Run with cloud output (k6 Cloud)
k6 run --out cloud k6-tests/loadtest.js
```

### Performance Results

📈 **See detailed performance results and analysis:**
- [Phase 1 Results (100-1K VUs)](./docs/performance/phase1-results.md)
- [Load Test Screenshots](./docs/performance/screenshots/)
- [Performance Analysis](./docs/performance/analysis.md)

## 🐳 Deployment

### Production Docker Build
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

FROM node:18-alpine AS runtime
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
RUN npm run build
EXPOSE 3000
USER node
CMD ["npm", "start"]
```

### Docker Compose Production
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_HOST=redis
    depends_on:
      - postgres
      - redis
    restart: unless-stopped
    
  postgres:
    image: postgres:14-alpine
    environment:
      POSTGRES_DB: socialscale
      POSTGRES_USER: socialscale
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped
    
  redis:
    image: redis:7-alpine
    restart: unless-stopped
    
volumes:
  postgres_data:
```

## 📚 Scaling Journey

### Phase 1: 100-1K Users ✅ **COMPLETED**
- ✅ Hexagonal architecture foundation
- ✅ Dependency injection container  
- ✅ Multi-tier caching with Redis
- ✅ Advanced rate limiting strategies
- ✅ Database optimization & indexing
- ✅ Clustering for multi-core utilization
- ✅ Comprehensive health monitoring
- ✅ **k6 load testing - 0% failure rate at 1000 VUs**
- ✅ **Performance optimization - Sub-500ms p95 response times**

### Phase 2: 1K-10K Users 🚧 **NEXT**
- [ ] Database connection pool optimization
- [ ] Advanced caching strategies (cache warming)
- [ ] API response compression (gzip/brotli)
- [ ] Database query optimization & monitoring
- [ ] Structured logging with correlation IDs
- [ ] Basic metrics collection (Prometheus)
- [ ] Advanced k6 testing scenarios

### Phase 3: 10K-100K Users 📋 **PLANNED**
- [ ] Database read replicas
- [ ] Load balancer implementation (Nginx/HAProxy)
- [ ] CDN integration for static assets
- [ ] Message queues for async processing
- [ ] Advanced monitoring (Prometheus/Grafana)
- [ ] Auto-scaling policies
- [ ] Continuous load testing with k6

### Phase 4: 100K-1M Users 🎯 **FUTURE**
- [ ] Microservices architecture decomposition
- [ ] Database sharding strategies
- [ ] Event-driven architecture
- [ ] Advanced caching (Redis Cluster)
- [ ] Service mesh implementation
- [ ] Chaos engineering practices
- [ ] Production load testing with k6 Cloud

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Development Setup
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Follow the hexagonal architecture patterns
4. Write tests for new features
5. Update documentation
6. Submit a pull request

### Code Standards
- **Architecture**: Follow hexagonal architecture principles
- **TypeScript**: Use strict type checking
- **SOLID Principles**: Maintain clean code practices
- **Testing**: Write unit and integration tests
- **Load Testing**: Include k6 performance tests
- **Documentation**: Update README and code comments
- **Linting**: Use Biome for consistent formatting

---

**Happy Scaling with Clean Architecture! 🚀**

*"Architecture is about the important stuff. Whatever that is." - Ralph Johnson* 