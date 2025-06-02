# Backend Architecture - Status Monitor API

Enterprise-grade Node.js backend implementing RBAC, real-time WebSocket communication, and multi-tenant SaaS architecture.

## 🏗️ Architecture Overview

### Layered Architecture Pattern
```
├── Controllers/     # Business logic & request handling
├── Repositories/    # Data access layer (Repository Pattern)
├── Middlewares/     # Cross-cutting concerns (Auth, CORS, etc.)
├── Routes/          # API endpoint definitions
├── Helpers/         # Utility functions & common operations
├── Config/          # Environment & application configuration
└── Boot/            # Application initialization & dependency injection
```

### Tech Stack
- **Runtime**: Node.js 18+ with ES6 modules
- **Framework**: Express.js with middleware stack
- **Database**: Supabase (PostgreSQL) with connection pooling
- **Authentication**: Clerk SDK for JWT validation
- **Real-time**: Socket.IO WebSocket server
- **Validation**: Joi schema validation
- **Security**: Helmet, CORS, compression middleware

## 🔐 Security & RBAC Implementation

### Authentication Flow
```javascript
// Middleware Stack
app.use(ClerkExpressWithAuth())  // JWT validation
app.use(isLoggedin)              // Authentication check
app.use(isAdmin)                 // Role-based authorization
```

### Role-Based Access Control
```javascript
// Organizational Roles
export const ORG_ROLES = {
  ADMIN: 'org:admin',    // Full CRUD permissions
  MEMBER: 'org:member'   // Read-only access
}
```

### Authorization Middleware

#### `isLoggedin` Middleware
```javascript
export function isLoggedin(req, res, next) {
  if (!req.auth) {
    return res.status(401).json({ 
      error: 'Unauthorized', 
      message: 'You are not authorized to perform this action' 
    });
  }
  next();
}
```

#### `isAdmin` Middleware
```javascript
export function isAdmin(req, res, next) {
  if (req.auth?.orgRole && req.auth?.orgRole !== ORG_ROLES.ADMIN) {
    return res.status(403).json({ 
      error: 'Forbidden', 
      message: 'You are not authorized to perform this action' 
    });
  }
  next();
}
```

### Multi-tenant Data Isolation
```javascript
// User-level isolation
const userComponents = await getComponentGroupsForUser(userId);

// Organization-level isolation
const orgComponents = await getComponentGroupsForOrg(orgId);
```

## 🏛️ API Architecture

### RESTful Endpoint Design

#### Component Groups API
```javascript
POST   /component-groups/create        [isLoggedin, isAdmin]
GET    /component-groups               [isLoggedin]
PUT    /component-groups/:id           [isLoggedin, isAdmin]
GET    /component-groups/public        [public]
```

#### Components API
```javascript
POST   /components/create              [isLoggedin, isAdmin]
PUT    /components/:id                 [isLoggedin, isAdmin]
```

#### Incidents API
```javascript
GET    /incidents                      [isLoggedin, isAdmin]
POST   /incidents/create               [isLoggedin, isAdmin]
PUT    /incidents/:id                  [isLoggedin, isAdmin]
DELETE /incidents/:id                  [isLoggedin, isAdmin]
GET    /incidents/public               [public]
```

### Request/Response Format
```javascript
// Standard Response Structure
{
  "data": { ... },           // Success payload
  "error": "string",         // Error type
  "message": "string"        // Human-readable message
}
```

## 🗄️ Repository Pattern Implementation

### Data Access Layer
```javascript
// Repository Pattern Example
export async function createComponentGroup({ name, user_id, org_id, visible }) {
  const supabase = container.get('supabase');
  const { data, error } = await supabase
    .from('component_groups')
    .insert({ name, user_id, org_id, visible })
    .select();
    
  if (error) throw new Error(error);
  return data;
}
```

### Multi-tenant Queries
```javascript
// User-scoped data access
export async function getComponentGroupsForUser(userId) {
  const { data, error } = await supabase
    .from('component_groups')
    .select('*, components (*)')
    .eq('user_id', userId)
    .eq('org_id', null);
}

// Organization-scoped data access
export async function getComponentGroupsForOrg(orgId) {
  const { data, error } = await supabase
    .from('component_groups')
    .select('*, components (*)')
    .eq('org_id', orgId);
}
```

## ⚡ Real-time WebSocket Implementation

### Socket.IO Server Setup
```javascript
// WebSocket Server Initialization
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Event Broadcasting
export async function emitPublicComponentGroupsUpdate({ componentGroup }) {
  const io = container.get('io');
  io.emit('publicComponentGroupsUpdate', { componentGroup });
}
```

### Real-time Event Types
```javascript
// Component status updates
socket.emit('publicComponentGroupsUpdate', { componentGroup });

// Incident notifications
socket.emit('publicIncidentsUpdate', { incident, action: 'created|updated|deleted' });
```

## 🔧 Dependency Injection Container

### IoC Container Implementation
```javascript
// Service Registration
class Container {
  constructor() {
    this.services = new Map();
  }
  
  add(name, service) {
    this.services.set(name, service);
  }
  
  get(name) {
    return this.services.get(name);
  }
}

// Service Bootstrap
container.add('supabase', supabaseClient);
container.add('io', socketIOServer);
```

## 📊 Data Models & Constants

### Component Status Types
```javascript
export const COMPONENT_STATUS = {
  Operational: 'operational',    // Service running normally
  Performance: 'performance',    // Performance degradation
  Partial: 'partial',           // Partial service disruption
  Major: 'major',               // Major outage
  Unknown: 'unknown'            // Status unknown
}
```

### Incident Lifecycle States
```javascript
const INCIDENT_STATUSES = [
  'reported',      // Initial incident report
  'investigating', // Team investigating
  'identified',    // Root cause identified
  'watching',      // Monitoring fix
  'fixed'          // Issue resolved
];
```

## 🛡️ Security Middleware Stack

### Express.js Security Configuration
```javascript
// CORS Configuration
app.use(cors({
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
}));

// Security Headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Request Processing
app.use(compression());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(cookieParser());
```

## 🔍 Validation & Error Handling

### Joi Schema Validation
```javascript
// Request Validation Example
export const createComponentGroup = control({
  validate: (req) => {
    const bodySchema = joi.object({
      name: joi.string().required(),
      visible: joi.boolean().default(true),
    });
    return validateJoi(bodySchema, req.body);
  },
  exec: async (req, res) => {
    // Business logic implementation
  }
});
```

### Centralized Error Handling
```javascript
// Controller Wrapper
export function control({ validate, exec }) {
  return async (req, res) => {
    try {
      const validationResult = validate(req);
      if (validationResult.error) {
        return res.status(400).json({
          error: 'Validation Error',
          message: validationResult.error.details[0].message
        });
      }
      
      const result = await exec(req, res);
      res.json(result);
    } catch (error) {
      res.status(500).json({
        error: 'Internal Server Error',
        message: error.message
      });
    }
  };
}
```

## 🚀 Development Setup

### Environment Variables
```bash
NODE_ENV=development
PORT=3001
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

### Development Scripts
```bash
pnpm run dev     # Development mode with nodemon
pnpm run prod    # Production mode
```

### Project Structure
```
be/
├── src/
│   ├── boot/
│   │   ├── app.js              # Express app initialization
│   │   ├── resources.js        # Database connections
│   │   └── sockets.js          # WebSocket setup
│   ├── config/
│   │   ├── index.js            # Environment configuration
│   │   └── constants.js        # Application constants
│   ├── controllers/
│   │   ├── component-groups.js # Component group business logic
│   │   ├── components.js       # Component management
│   │   └── incidents.js        # Incident management
│   ├── helpers/
│   │   ├── controller.js       # Controller utilities
│   │   └── socketEvents.js     # WebSocket event helpers
│   ├── middlewares/
│   │   ├── isAdmin.js          # Admin authorization
│   │   └── isLoggedin.js       # Authentication check
│   ├── repositories/
│   │   ├── component-groups.js # Component group data access
│   │   ├── component.js        # Component data access
│   │   └── incident.js         # Incident data access
│   ├── routes/
│   │   ├── index.js            # Route aggregation
│   │   ├── component-groups.js # Component group routes
│   │   ├── components.js       # Component routes
│   │   └── incidents.js        # Incident routes
│   ├── container.js            # Dependency injection
│   └── index.js                # Application entry point
├── package.json
├── nodemon.json
└── .nvmrc
```

## 🔄 Real-time Event Flow

### Component Status Updates
```javascript
// 1. Admin updates component status
PUT /components/:id { status: 'major' }

// 2. Repository updates database
await updateComponent(id, { status: 'major' });

// 3. WebSocket broadcasts to all clients
await emitPublicComponentGroupsUpdate({ component });

// 4. Frontend receives real-time update
socket.on('publicComponentGroupsUpdate', (data) => {
  // Update UI immediately
});
```

## 📈 Performance Optimizations

### Database Optimization
- Connection pooling via Supabase
- Indexed queries on user_id and org_id
- Selective field projection in queries
- Batch operations for bulk updates

### API Performance
- Response compression middleware
- Request payload size limits
- Efficient JSON serialization
- HTTP keep-alive connections

---

Built with enterprise-grade security and scalability in mind. 