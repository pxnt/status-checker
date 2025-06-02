# Status Checker Components

A modular accordion-based status checker built with Vue 3, TypeScript, and shadcn-vue components.

## Components Overview

### 1. StatusChecker.vue
The main accordion component that displays a collapsible section with multiple status items.

#### Props
- `sectionTitle` (optional, default: "StatusChecker"): The title of the accordion section
- `items` (optional): Array of status items to display

#### Usage
```vue
<template>
  <StatusChecker 
    section-title="API Services"
    :items="customItems"
  />
</template>

<script setup>
import StatusChecker from '~/components/StatusChecker.vue'
import { Server, Database } from 'lucide-vue-next'

const customItems = [
  {
    id: 'api',
    title: 'Main API',
    description: 'Core application programming interface.',
    status: 'Operational',
    icon: Server
  },
  {
    id: 'db',
    title: 'Database',
    description: 'Primary database server.',
    status: 'Warning',
    icon: Database
  }
]
</script>
```

### 2. StatusItem.vue
A reusable component for individual status items within the accordion.

#### Props
- `title` (required): The name of the service/component
- `description` (required): Brief description of the service
- `status` (required): One of 'Operational', 'Warning', 'Critical', 'Maintenance'
- `icon` (required): Lucide Vue icon component

#### Events
- `viewDetails`: Emitted when the "View Details" button is clicked

#### Usage
```vue
<template>
  <StatusItem
    title="Authentication Service"
    description="User authentication and authorization."
    status="Operational"
    :icon="Shield"
    @view-details="handleViewDetails"
  />
</template>

<script setup>
import StatusItem from '~/components/StatusItem.vue'
import { Shield } from 'lucide-vue-next'

const handleViewDetails = () => {
  console.log('View details clicked')
}
</script>
```

## Status Types & Styling

### Available Status Types
1. **Operational** - Green badge with check circle icon
2. **Warning** - Yellow badge with alert triangle icon
3. **Critical** - Red badge with X circle icon  
4. **Maintenance** - Blue badge with clock icon

### Color Scheme
- **Operational**: Green (`bg-green-100 text-green-800 border-green-200`)
- **Warning**: Yellow (`bg-yellow-100 text-yellow-800 border-yellow-200`)
- **Critical**: Red (`bg-red-100 text-red-800 border-red-200`)
- **Maintenance**: Blue (`bg-blue-100 text-blue-800 border-blue-200`)

## Features

### ✅ Accordion Functionality
- Collapsible sections using shadcn-vue Accordion components
- Smooth animations and transitions
- Chevron icon rotation on expand/collapse

### ✅ Status Indicators
- Color-coded badges for different status types
- Appropriate icons for each status
- Visual feedback for operational status

### ✅ Modular Design
- Reusable StatusItem component
- Configurable through props
- Event-driven architecture

### ✅ Responsive Design
- Mobile-friendly layout
- Proper spacing and typography
- Accessible design patterns

## Installation Requirements

Make sure you have the following shadcn-vue components installed:

```bash
# Install required components
pnpm dlx shadcn-vue@latest add accordion badge

# Icons are from lucide-vue-next (should already be installed)
```

## Example Implementation

See `src/views/Public.vue` for a complete example showing:
- Default StatusChecker status display
- Custom API services with different status types
- Proper icon usage and status indicators

## Customization

### Adding New Status Types
To add new status types, update the `StatusItem.vue` component:

1. Add new status to the `Props` interface
2. Update the `statusIcon` computed property
3. Update the `statusClasses` computed property
4. Add appropriate styling classes

### Custom Icons
You can use any Lucide Vue icon:

```typescript
import { 
  Server, Database, Shield, Zap, 
  Globe, Mail, Settings, Users 
} from 'lucide-vue-next'
```

### Event Handling
The components emit events that you can handle:

```vue
<StatusChecker 
  @view-details="(item) => router.push(`/status/${item.id}`)"
/>
```

## Dependencies

- Vue 3
- TypeScript
- shadcn-vue (Accordion, Badge components)
- lucide-vue-next (Icons)
- Tailwind CSS (Styling) 