# SocialScale API 🚀

A scalable social media API built to demonstrate scaling techniques from 100 to 1 million users. This project showcases various optimization strategies including caching, rate limiting, database optimization, and clean architecture patterns.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Scaling Strategies](#scaling-strategies)
- [Installation](#installation)
- [API Endpoints](#api-endpoints)
- [Performance Optimizations](#performance-optimizations)
- [Monitoring & Observability](#monitoring--observability)
- [Load Testing](#load-testing)
- [Deployment](#deployment)
- [Contributing](#contributing)

## 🎯 Overview

SocialScale is a RESTful API that simulates a social media platform with core features like user authentication, posts, follows, and real-time interactions. The project focuses on demonstrating how to scale an API from handling hundreds of users to millions of concurrent users.

### Key Learning Objectives

- **Horizontal vs Vertical Scaling**
- **Database Optimization & Indexing**
- **Caching Strategies (Redis)**
- **Rate Limiting & DDoS Protection**
- **Load Balancing**
- **Microservices Architecture**
- **Performance Monitoring**

## ✨ Features

### Core Functionality
- 🔐 **User Authentication** (JWT-based)
- 👤 **User Profiles** (Create, Read, Update)
- 📝 **Posts** (CRUD operations)
- 👥 **Social Features** (Follow/Unfollow users)
- 📄 **Pagination** (Cursor-based for better performance)

### Scaling Features
- ⚡ **Redis Caching** (Query result caching)
- 🛡️ **Rate Limiting** (Multiple strategies)
- 📊 **Database Indexing** (Optimized queries)
- 🔄 **Connection Pooling**
- 📈 **Performance Monitoring**

## 🛠 Tech Stack

### Backend
- **Node.js** - Runtime environment
- **TypeScript** - Type safety and better DX
- **Express.js** - Web framework
- **Prisma** - Database ORM with type safety

### Database
- **PostgreSQL** - Primary database
- **Redis** - Caching and session storage

### DevOps & Tools
- **Docker** - Containerization
- **Docker Compose** - Local development environment
- **Biome** - Linting and formatting
- **ts-node-dev** - Development server

### Testing & Monitoring
- **Autocannon** - Load testing
- **Custom logging** - Request/response monitoring

## 🏗 Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Load Balancer │    │   Rate Limiter  │    │   Application   │
│    (Future)     │───▶│    (Redis)      │───▶│    Server       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                        │
                       ┌─────────────────┐             │
                       │   Redis Cache   │◀────────────┤
                       └─────────────────┘             │
                                                        │
                       ┌─────────────────┐             │
                       │   PostgreSQL    │◀────────────┘
                       │   (Primary DB)  │
                       └─────────────────┘
```

### Basic Clean Code Structure
```
src/
├── routes/           # Route handlers by domain
│   ├── auth.routes.ts
│   ├── user.routes.ts
│   ├── post.routes.ts
│   └── health.routes.ts
├── middleware/       # Custom middleware
│   └── logging.middleware.ts
├── utils/           # Utility functions
│   └── createRateLimiter.ts
├── rateLimiters.ts  # Rate limiting configurations
├── auth.ts          # Authentication logic
├── prisma.ts        # Database client
├── redisClient.ts   # Redis client
└── app.ts           # Main application setup
```

## 📈 Scaling Strategies

### 1. **Caching Layer (Redis)**
```typescript
// Query result caching with TTL
const cacheKey = `posts:limit=${limit}${cursor ? `:cursor=${cursor}` : ""}`;
const cached = await redis.get(cacheKey);
if (cached) {
  return JSON.parse(cached);
}
// ... fetch from DB and cache result
await redis.set(cacheKey, JSON.stringify(result), "EX", 10);
```

### 2. **Rate Limiting**
- **Signup**: 1,000 requests/minute
- **Login**: 3,000 requests/minute  
- **Posts**: 6,000 requests/30 seconds
- **General**: 3,000 requests/30 seconds

### 3. **Database Optimization**
```sql
-- Optimized indexes for common queries
CREATE INDEX "Post_createdAt_idx" ON "Post"("createdAt");
CREATE INDEX "Follow_followerId_followingId_idx" ON "Follow"("followerId", "followingId");
```

### 4. **Cursor-based Pagination**
```typescript
// More efficient than OFFSET/LIMIT for large datasets
const queryOptions = {
  orderBy: { createdAt: 'desc' },
  take: limit + 1,
  cursor: cursor ? { id: cursor } : undefined,
  skip: cursor ? 1 : 0
};
```

## 🚀 Installation

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- pnpm (recommended) or npm

### Quick Start

1. **Clone the repository**
```bash
git clone <repository-url>
cd socialscale
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Start infrastructure**
```bash
docker-compose up -d
```

4. **Setup database**
```bash
pnpm prisma:migrate
pnpm seed
```

5. **Start development server**
```bash
pnpm dev
```

The API will be available at `http://localhost:3333`

### Environment Variables
```env
DATABASE_URL="postgresql://socialscale:devpass@localhost:5432/socialscale"
JWT_SECRET="your-super-secret-jwt-key"
REDIS_URL="redis://localhost:6379"
PORT=3333
```

## 🔌 API Endpoints

### Authentication
```http
POST /signup          # Create new user account
POST /login           # Authenticate user
```

### User Management
```http
PUT  /profile         # Update user profile
POST /follow/:id      # Follow a user
GET  /user/:id/posts  # Get user's posts
```

### Posts
```http
POST /posts           # Create new post
GET  /posts           # Get posts (paginated)
```

### Health Check
```http
GET  /health          # API health status
```

### Example Requests

**Create User:**
```bash
curl -X POST http://localhost:3333/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword",
    "username": "johndoe",
    "name": "John Doe"
  }'
```

**Get Posts with Pagination:**
```bash
curl "http://localhost:3333/posts?limit=20&cursor=cm123abc"
```

## ⚡ Performance Optimizations

### Current Optimizations
1. **Redis Caching**: 10-second TTL for post queries
2. **Database Indexing**: Optimized for common query patterns
3. **Rate Limiting**: Prevents abuse and ensures fair usage
4. **Connection Pooling**: Efficient database connections
5. **Cursor Pagination**: Scales better than offset-based pagination

### Planned Optimizations
- [ ] Database read replicas
- [ ] CDN for static assets
- [ ] Horizontal scaling with load balancers
- [ ] Microservices architecture
- [ ] Advanced caching strategies (cache warming, invalidation)

## 📊 Monitoring & Observability

### Current Logging
```typescript
// Request/Response logging
app.use((req, res, next) => {
  res.on("finish", () => {
    console.log(`[${res.statusCode}] ${req.method} ${req.originalUrl}`);
  });
  next();
});
```

### Cache Monitoring
```typescript
// Cache hit/miss tracking
if (cached) {
  console.log(`[CACHE HIT] ${cacheKey}`);
} else {
  console.log(`[CACHE MISS] ${cacheKey}`);
}
```

## 🧪 Load Testing

### Using Autocannon

**Test concurrent connections:**
```bash
# Test with 50 concurrent connections for 30 seconds
autocannon -c 50 -d 30 http://localhost:3333/posts?limit=20
```

**Test with authentication:**
```bash
# Set your JWT token
TOKEN="your-jwt-token-here"
autocannon -c 50 -d 30 -H "Authorization=Bearer $TOKEN" http://localhost:3333/posts
```

### Performance Benchmarks

| Endpoint | Concurrent Users | RPS | Avg Latency | 99th Percentile |
|----------|------------------|-----|-------------|-----------------|
| GET /posts | 50 | ~2,500 | 15ms | 45ms |
| POST /posts | 50 | ~1,800 | 25ms | 80ms |
| GET /health | 100 | ~8,000 | 5ms | 15ms |

## 🐳 Deployment

### Docker Production Build
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3333
CMD ["npm", "start"]
```

### Docker Compose Production
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3333:3333"
    environment:
      - NODE_ENV=production
    depends_on:
      - postgres
      - redis
```

## 📚 Scaling Journey: 100 to 1M Users

### Phase 1: 100-1K Users (Current)
- ✅ Single server deployment
- ✅ Basic caching with Redis
- ✅ Rate limiting
- ✅ Database indexing

### Phase 2: 1K-10K Users
- [ ] Database connection pooling optimization
- [ ] Advanced caching strategies
- [ ] API response compression
- [ ] Database query optimization

### Phase 3: 10K-100K Users
- [ ] Read replicas for database
- [ ] Load balancer implementation
- [ ] CDN for static assets
- [ ] Horizontal scaling

### Phase 4: 100K-1M Users
- [ ] Microservices architecture
- [ ] Message queues (Redis/RabbitMQ)
- [ ] Database sharding
- [ ] Advanced monitoring and alerting
- [ ] Auto-scaling infrastructure

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use Biome for linting and formatting
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built for educational purposes to demonstrate API scaling techniques
- Inspired by real-world social media platform challenges
- Community feedback and contributions welcome

---

**Happy Scaling! 🚀**

*Remember: Premature optimization is the root of all evil, but understanding scaling principles is essential for building robust applications.* 