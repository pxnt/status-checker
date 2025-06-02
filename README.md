# Status Monitor Platform

A comprehensive real-time status monitoring platform built with microservices architecture, implementing enterprise-grade security and multi-tenant SaaS capabilities.

## 🚀 Key Features

### 🔐 Security & Access Control
- **RBAC (Role-Based Access Control)**: Granular permission system with organizational roles
- **OAuth 2.0/OIDC Authentication**: Secure authentication via Clerk.dev
- **Multi-tenant Architecture**: Organization-based data isolation
- **JWT Token Validation**: Server-side token verification

### ⚡ Real-time Capabilities
- **WebSocket Communication**: Live status updates via Socket.IO
- **Event-driven Architecture**: Real-time incident and component notifications
- **Cross-origin Support**: CORS-enabled real-time connections
- **Auto-reconnection**: Client-side connection resilience

### 🏗️ Enterprise Architecture
- **Microservices Design**: Decoupled frontend and backend services
- **Repository Pattern**: Clean data access layer
- **Dependency Injection**: IoC container for service management
- **Layered Architecture**: Separation of concerns

### 📊 Monitoring Features
- **Component Status Tracking**: Operational, Performance, Partial, Major, Unknown
- **Incident Management**: Full lifecycle from reported to fixed
- **Public Status Pages**: Customer-facing status information
- **Historical Data**: Incident tracking and reporting

## 🏛️ System Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Vue.js SPA    │────│  Express.js API  │────│   Supabase DB   │
│  (Frontend)     │    │   (Backend)      │    │  (PostgreSQL)   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                        │
         └──────WebSocket─────────┘
              (Socket.IO)
```

## 🛠️ Tech Stack

- **Frontend**: Vue.js 3 + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express.js + ES6 modules
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Clerk (OAuth 2.0/OIDC)
- **Real-time**: Socket.IO WebSocket
- **State Management**: Pinia
- **Validation**: Joi schema validation
- **Package Manager**: pnpm

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0.0
- pnpm >= 8.0.0
- Git

### 1. Clone Repository
```bash
git clone <repository-url>
cd status-checker
```

### 2. Environment Setup

#### Backend Environment
```bash
cd be
cp .env.example .env
# Edit .env with your configuration:
# - SUPABASE_URL=your_supabase_url
# - SUPABASE_ANON_KEY=your_supabase_anon_key
# - CLERK_SECRET_KEY=your_clerk_secret_key
# - CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

#### Frontend Environment
```bash
cd ../fe
cp .env.example .env
# Edit .env with your configuration:
# - VITE_API_BASE_URL=http://localhost:3001
# - VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
# - VITE_SOCKET_URL=http://localhost:3001
```

### 3. Installation & Development

#### Terminal 1 - Backend
```bash
cd be
pnpm install
pnpm run dev
```

#### Terminal 2 - Frontend
```bash
cd fe
pnpm install
pnpm run dev
```

### 4. Access Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Public Status Page**: http://localhost:5173/status

## 🔐 RBAC Implementation

### Organizational Roles
```javascript
ORG_ROLES = {
  ADMIN: 'org:admin',    // Full CRUD permissions
  MEMBER: 'org:member'   // Read-only access
}
```

### Permission Matrix
| Endpoint | Anonymous | Member | Admin |
|----------|-----------|---------|-------|
| Public Status Pages | ✓ | ✓ | ✓ |
| Component Groups | ✗ | ✓ | ✓ |
| Create/Update Components | ✗ | ✗ | ✓ |
| Incident Management | ✗ | ✗ | ✓ |

## 📁 Project Structure

```
status-checker/
├── be/                 # Backend (Express.js API)
│   ├── src/
│   │   ├── controllers/    # Business logic
│   │   ├── repositories/   # Data access layer
│   │   ├── middlewares/    # Auth & validation
│   │   ├── routes/         # API endpoints
│   │   └── config/         # Configuration
│   └── package.json
├── fe/                 # Frontend (Vue.js SPA)
│   ├── src/
│   │   ├── views/          # Page components
│   │   ├── components/     # Reusable components
│   │   ├── stores/         # State management
│   │   └── services/       # API clients
│   └── package.json
└── README.md
```

## 🚀 Production Deployment

### Environment Variables (Production)
- Rotate all API keys and secrets
- Restrict CORS origins to production domains
- Enable database connection pooling
- Implement structured logging

### Performance Optimizations
- Frontend: Static asset optimization, code splitting
- Backend: Response compression, caching headers
- Database: Query optimization, indexing strategy
- CDN: Static asset delivery optimization

## 📚 Documentation

- [Backend Architecture](./be/README.md)
- [Frontend Architecture](./fe/README.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

---

Built with ❤️ using modern web technologies and enterprise-grade security practices.
