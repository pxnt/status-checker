# Frontend Architecture - Status Monitor SPA

Modern Vue.js 3 single-page application with TypeScript, implementing real-time status monitoring, authentication, and responsive design.

## 🏗️ Architecture Overview

### Component Architecture Pattern
```
├── Views/           # Page-level components (route targets)
├── Components/      # Reusable UI components
├── Layouts/         # Layout templates (Public/Dashboard)
├── Stores/          # Pinia state management
├── Composables/     # Vue 3 composition functions
├── Services/        # API client & HTTP services
├── Router/          # Vue Router configuration
├── Utils/           # Helper functions & utilities
├── Types/           # TypeScript type definitions
└── Config/          # Application configuration
```

### Tech Stack
- **Framework**: Vue.js 3 with Composition API
- **Language**: TypeScript for type safety
- **Build Tool**: Vite with HMR (Hot Module Replacement)
- **UI Framework**: Tailwind CSS + Reka UI components
- **State Management**: Pinia (Vue Store)
- **Authentication**: Clerk Vue SDK
- **Real-time**: Socket.IO client
- **HTTP Client**: Axios with interceptors
- **Routing**: Vue Router 4 with guards

## 🎨 Component Architecture

### Layout System
```typescript
// Layout Templates
interface LayoutConfig {
  public: PublicLayout,    // Status pages, marketing
  dashboard: DashboardLayout // Admin interface
}

// Route-based Layout Selection
{
  path: '/status',
  component: StatusView,
  meta: { layout: 'public' }
}
```

### Component Hierarchy
```
App.vue
├── PublicLayout.vue
│   ├── Header.vue
│   ├── Navigation.vue
│   └── Footer.vue
└── DashboardLayout.vue
    ├── Sidebar.vue
    ├── TopBar.vue
    └── MainContent.vue
```

## 🔐 Authentication & Authorization

### Clerk Integration
```typescript
// Authentication Setup
import { clerkPlugin } from '@clerk/vue'

app.use(clerkPlugin, { 
  publishableKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY 
})
```

### Route Guards
```typescript
// Authentication Guard
export const authGuard = (to: RouteLocationNormalized) => {
  const { isSignedIn } = useAuth()
  
  if (!isSignedIn.value) {
    return { name: 'home' }
  }
}

// Protected Routes
{
  path: '/dashboard',
  component: DashboardView,
  beforeEnter: authGuard
}
```

### Role-based UI Rendering
```vue
<template>
  <div v-if="hasAdminRole">
    <AdminControls />
  </div>
  <div v-else>
    <ReadOnlyView />
  </div>
</template>

<script setup lang="ts">
const { user } = useUser()
const hasAdminRole = computed(() => 
  user.value?.organizationMemberships?.[0]?.role === 'org:admin'
)
</script>
```

## 🗂️ State Management (Pinia)

### Store Architecture
```typescript
// Component Status Store
export const useComponentStore = defineStore('components', () => {
  // State
  const componentGroups = ref<ComponentGroup[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  // Getters (Computed)
  const operationalComponents = computed(() =>
    componentGroups.value.filter(group => 
      group.components.every(c => c.status === 'operational')
    )
  )
  
  // Actions
  async function fetchComponentGroups() {
    loading.value = true
    try {
      const response = await componentService.getComponentGroups()
      componentGroups.value = response.data.componentGroups
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }
  
  return {
    componentGroups,
    loading,
    error,
    operationalComponents,
    fetchComponentGroups
  }
})
```

### Store Modules
```typescript
// Store Organization
├── useAuthStore()        # Authentication state
├── useComponentStore()   # Component groups & components
├── useIncidentStore()    # Incident management
├── useSocketStore()      # WebSocket connection state
└── useUIStore()          # UI state (modals, notifications)
```

## 🔄 Real-time Communication

### Socket.IO Integration
```typescript
// Socket Service
export class SocketService {
  private socket: Socket
  
  constructor() {
    this.socket = io(import.meta.env.VITE_SOCKET_URL, {
      autoConnect: false,
      withCredentials: true
    })
  }
  
  connect() {
    this.socket.connect()
    this.setupEventListeners()
  }
  
  private setupEventListeners() {
    this.socket.on('publicComponentGroupsUpdate', (data) => {
      const componentStore = useComponentStore()
      componentStore.handleRealTimeUpdate(data)
    })
    
    this.socket.on('publicIncidentsUpdate', (data) => {
      const incidentStore = useIncidentStore()
      incidentStore.handleRealTimeUpdate(data)
    })
  }
}
```

### Real-time State Updates
```typescript
// Composable for Real-time Updates
export function useRealTimeUpdates() {
  const socketStore = useSocketStore()
  const componentStore = useComponentStore()
  
  onMounted(() => {
    socketStore.connect()
  })
  
  onUnmounted(() => {
    socketStore.disconnect()
  })
  
  // Handle real-time component updates
  watch(
    () => socketStore.lastComponentUpdate,
    (update) => {
      if (update) {
        componentStore.updateComponentFromSocket(update)
      }
    }
  )
}
```

## 🛣️ Routing Architecture

### Route Configuration
```typescript
// Router Setup
const routes: RouteRecordRaw[] = [
  // Public Routes
  {
    path: '/',
    name: 'home',
    component: () => import('~/views/Home.vue'),
    meta: { layout: 'public' }
  },
  {
    path: '/status',
    name: 'status',
    component: () => import('~/views/Status.vue'),
    meta: { layout: 'public' }
  },
  
  // Protected Routes
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('~/views/Dashboard.vue'),
    meta: { layout: 'dashboard' },
    beforeEnter: authGuard,
    children: [
      {
        path: ':tab',
        name: 'dashboard-tabs',
        component: () => import('~/views/Dashboard.vue')
      }
    ]
  }
]
```

### Navigation Guards
```typescript
// Global Navigation Guards
router.beforeEach((to, from, next) => {
  // Authentication check
  if (to.meta.requiresAuth && !isAuthenticated()) {
    next({ name: 'login' })
    return
  }
  
  // Role-based access control
  if (to.meta.requiresAdmin && !hasAdminRole()) {
    next({ name: 'unauthorized' })
    return
  }
  
  next()
})
```

## 🎯 API Service Layer

### HTTP Client Configuration
```typescript
// Axios Configuration
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  withCredentials: true
})

// Request Interceptor
apiClient.interceptors.request.use((config) => {
  const { getToken } = useAuth()
  const token = getToken()
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  
  return config
})

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle authentication errors
      const { signOut } = useAuth()
      signOut()
    }
    return Promise.reject(error)
  }
)
```

### Service Layer Pattern
```typescript
// Component Service
export class ComponentService {
  async getComponentGroups(): Promise<ApiResponse<ComponentGroup[]>> {
    const response = await apiClient.get('/component-groups')
    return response.data
  }
  
  async createComponentGroup(data: CreateComponentGroupRequest): Promise<ApiResponse<ComponentGroup>> {
    const response = await apiClient.post('/component-groups/create', data)
    return response.data
  }
  
  async updateComponentGroup(id: number, data: UpdateComponentGroupRequest): Promise<ApiResponse<ComponentGroup>> {
    const response = await apiClient.put(`/component-groups/${id}`, data)
    return response.data
  }
}

export const componentService = new ComponentService()
```

## 🎨 UI Component System

### Design System Integration
```typescript
// Reka UI + Tailwind CSS
import { Button, Input, Modal, Toast } from 'reka-ui'

// Custom Component Composition
<template>
  <Button 
    :variant="variant" 
    :size="size"
    :loading="loading"
    @click="handleClick"
  >
    <slot />
  </Button>
</template>
```

### Component Props & Events
```typescript
// TypeScript Component Definition
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
}

interface ButtonEmits {
  click: [event: MouseEvent]
}

const props = defineProps<ButtonProps>()
const emit = defineEmits<ButtonEmits>()
```

## 🧩 Composables (Composition API)

### Custom Composables
```typescript
// Toast Notifications
export function useToast() {
  const toasts = ref<Toast[]>([])
  
  const toast = {
    success: (title: string, message?: string) => {
      addToast({ type: 'success', title, message })
    },
    error: (title: string, message?: string) => {
      addToast({ type: 'error', title, message })
    },
    info: (title: string, message?: string) => {
      addToast({ type: 'info', title, message })
    }
  }
  
  function addToast(toast: Omit<Toast, 'id'>) {
    const id = Date.now().toString()
    toasts.value.push({ ...toast, id })
    
    setTimeout(() => {
      removeToast(id)
    }, 5000)
  }
  
  return { toast, toasts }
}

// API Loading States
export function useAsyncData<T>(
  fetcher: () => Promise<T>,
  options: { immediate?: boolean } = {}
) {
  const data = ref<T | null>(null)
  const loading = ref(false)
  const error = ref<Error | null>(null)
  
  async function execute() {
    loading.value = true
    error.value = null
    
    try {
      data.value = await fetcher()
    } catch (err) {
      error.value = err as Error
    } finally {
      loading.value = false
    }
  }
  
  if (options.immediate !== false) {
    execute()
  }
  
  return { data, loading, error, execute }
}
```

## 📱 Responsive Design

### Tailwind CSS Configuration
```typescript
// tailwind.config.js
export default {
  content: ['./src/**/*.{vue,js,ts}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a'
        }
      },
      screens: {
        'xs': '475px'
      }
    }
  }
}
```

### Mobile-first Approach
```vue
<template>
  <div class="
    grid 
    grid-cols-1 
    md:grid-cols-2 
    lg:grid-cols-3 
    gap-4 
    p-4
  ">
    <ComponentCard 
      v-for="component in components" 
      :key="component.id"
      :component="component"
      class="w-full"
    />
  </div>
</template>
```

## 🔧 Development Setup

### Environment Variables
```bash
VITE_API_BASE_URL=http://localhost:3001
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_SOCKET_URL=http://localhost:3001
```

### Development Scripts
```bash
pnpm run dev     # Development server with HMR
pnpm run build   # Production build
pnpm run preview # Preview production build
```

### Project Structure
```
fe/
├── src/
│   ├── assets/             # Static assets
│   ├── components/         # Reusable components
│   │   ├── ui/            # Base UI components
│   │   ├── forms/         # Form components
│   │   └── charts/        # Chart components
│   ├── composables/        # Vue 3 composables
│   │   ├── useAuth.ts     # Authentication logic
│   │   ├── useToast.ts    # Toast notifications
│   │   └── useSocket.ts   # WebSocket management
│   ├── config/            # App configuration
│   ├── layouts/           # Layout components
│   │   ├── PublicLayout.vue
│   │   └── DashboardLayout.vue
│   ├── lib/               # Third-party integrations
│   ├── router/            # Vue Router setup
│   │   ├── index.ts       # Router configuration
│   │   └── guards.ts      # Navigation guards
│   ├── services/          # API services
│   │   ├── api.ts         # HTTP client setup
│   │   ├── component.ts   # Component API
│   │   └── incident.ts    # Incident API
│   ├── stores/            # Pinia stores
│   │   ├── auth.ts        # Authentication store
│   │   ├── component.ts   # Component store
│   │   └── incident.ts    # Incident store
│   ├── types/             # TypeScript definitions
│   │   ├── api.ts         # API response types
│   │   ├── component.ts   # Component types
│   │   └── user.ts        # User types
│   ├── utils/             # Utility functions
│   ├── views/             # Page components
│   │   ├── Home.vue       # Landing page
│   │   ├── Status.vue     # Public status page
│   │   ├── Dashboard.vue  # Admin dashboard
│   │   └── Incidents.vue  # Incident history
│   ├── App.vue            # Root component
│   ├── main.ts            # Application entry point
│   └── style.css          # Global styles
├── public/                # Public assets
├── index.html             # HTML template
├── package.json
├── tsconfig.json          # TypeScript configuration
├── vite.config.ts         # Vite configuration
└── components.json        # UI component registry
```

## 🚀 Build & Deployment

### Production Build
```bash
# Build for production
pnpm run build

# Preview production build
pnpm run preview
```

### Build Optimizations
- **Code Splitting**: Automatic route-based splitting
- **Tree Shaking**: Dead code elimination
- **Asset Optimization**: Image compression and lazy loading
- **Bundle Analysis**: Webpack bundle analyzer integration

### Performance Features
- **Lazy Loading**: Route-based code splitting
- **Virtual Scrolling**: Large list optimization
- **Image Optimization**: WebP format with fallbacks
- **Service Worker**: Offline capability (optional)

---

Built with modern Vue.js 3 and TypeScript for optimal developer experience and performance. 