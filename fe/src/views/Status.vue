<template>
    <div class="py-8">
      <div class="max-w-6xl mx-auto px-4">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Service Status</h1>
          <p class="text-gray-600">Monitor the status of all your services</p>
        </div>
        
        <!-- Main Status Checker Component -->
        <StatusChecker />
        
        <!-- Example with different data -->
        <div class="mt-8">
          <StatusChecker 
            section-title="API Services"
            :items="apiServices"
          />
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import StatusChecker from '~/components/StatusChecker.vue'
import { Server, Database, Shield, Zap } from 'lucide-vue-next'
import { ServiceStatusName } from '~/types/Status'

// Example with different services and statuses
const apiServices = ref([
  {
    id: 'auth-api',
    title: 'Authentication API',
    description: 'User authentication and authorization service.',
    status: ServiceStatusName.Operational,
    icon: Shield
  },
  {
    id: 'main-api',
    title: 'Main API',
    description: 'Core application programming interface.',
    status: ServiceStatusName.Performance,
    icon: Server
  },
  {
    id: 'database',
    title: 'Database',
    description: 'Primary database server cluster.',
    status: ServiceStatusName.Operational,
    icon: Database
  },
  {
    id: 'cdn',
    title: 'CDN',
    description: 'Content delivery network for static assets.',
    status: ServiceStatusName.Major,
    icon: Zap
  }
])
</script>