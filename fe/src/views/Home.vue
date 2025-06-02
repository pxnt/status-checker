<template>
  <div>
    <!-- Status Preview Section -->
    <section class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Live Status Dashboard
          </h2>
          <p class="text-xl text-gray-600">
            See how your services are performing right now
          </p>
        </div>

        <div class="max-w-4xl mx-auto space-y-4">
          <!-- Show loaders while data is loading -->
          <StatusCheckerLoader 
            v-if="isLoadingComponentGroups" 
            :item-count="4"
          />          
          <!-- Show actual data when loaded -->
          <template v-else>
            <StatusChecker 
              v-for="group in $componentsStore.publicComponentGroups"
              :key="group.id"
              :section-title="group.name"
              :items="$componentsStore.getPublicComponentsForGroup(group.id)" 
            />
          </template>
        </div>
      </div>
    </section>

    <!-- Incidents Section -->
    <PublicIncidents />

    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div class="text-center">
          <h1 class="text-4xl md:text-6xl font-bold mb-6">
            Monitor Your Services
            <span class="block text-blue-200">In Real-Time</span>
          </h1>
          <p class="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Keep track of all your applications, APIs, and services with our comprehensive status monitoring platform.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" class="bg-white text-blue-600 hover:bg-gray-100">
              <Activity class="h-5 w-5 mr-2" />
              View Status Page
            </Button>
            <Button size="lg" variant="secondary" class="bg-white text-blue-600 hover:bg-gray-100">
              <BarChart class="h-5 w-5 mr-2" />
              See Metrics
            </Button>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need
          </h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Comprehensive monitoring tools to keep your services running smoothly
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="feature in features" :key="feature.title" class="text-center">
            <div class="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <component :is="feature.icon" class="h-8 w-8 text-blue-600" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ feature.title }}</h3>
            <p class="text-gray-600">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-blue-600">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">
          Ready to Get Started?
        </h2>
        <p class="text-xl text-blue-200 mb-8 max-w-2xl mx-auto">
          Join thousands of companies monitoring their services with our platform
        </p>
        <Button size="lg" variant="secondary" class="bg-white text-blue-600 hover:bg-gray-100">
          <Rocket class="h-5 w-5 mr-2" />
          Start Monitoring
        </Button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import StatusChecker from '~/components/StatusChecker.vue'
import StatusCheckerLoader from '~/components/StatusCheckerLoader.vue'
import PublicIncidents from '~/components/PublicIncidents.vue'
import { Button } from '~/components/ui/button'
import { 
  Activity, 
  BarChart, 
  Shield, 
  Bell, 
  Globe, 
  Rocket,
  Monitor,
  Zap,
  Server, Database
} from 'lucide-vue-next'
import { ServiceStatusName } from '~/types/Status'
import { useRoute, useRouter } from 'vue-router'
import { useUser, useClerk } from '@clerk/vue'
import { useAuthentication } from '~/composables/useAuthentication'
import { useComponentsStore } from '~/stores/components'
import { useLiveStatus } from '~/composables/useLiveStatus'

const $route = useRoute()
const $router = useRouter()
const $componentsStore = useComponentsStore()
const { handleLoginRedirection } = useAuthentication()

const { initializeSocketListeners, cleanupSocketListeners } = useLiveStatus();

const isLoadingComponentGroups = ref(true)

const features = ref([
  {
    title: 'Real-time Monitoring',
    description: 'Monitor your services 24/7 with instant alerts and notifications.',
    icon: Monitor
  },
  {
    title: 'Global Coverage',
    description: 'Check your services from multiple locations around the world.',
    icon: Globe
  },
  {
    title: 'Smart Alerts',
    description: 'Get notified via email, SMS, or webhook when issues occur.',
    icon: Bell
  },
  {
    title: 'Security First',
    description: 'Enterprise-grade security with encrypted connections.',
    icon: Shield
  },
  {
    title: 'Lightning Fast',
    description: 'Sub-second response times and instant status updates.',
    icon: Zap
  },
  {
    title: 'Analytics',
    description: 'Detailed analytics and performance metrics for your services.',
    icon: BarChart
  }
])

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
    status: ServiceStatusName.Partial,
    icon: Zap
  }
])

onMounted(() => {
  initializeSocketListeners();
  // Load initial data if not already loaded
  if ($componentsStore.publicComponentGroups.length === 0) {
    $componentsStore.listPublicComponentGroups().finally(() => {
      isLoadingComponentGroups.value = false
    })
  } else {
    isLoadingComponentGroups.value = false
  }

  // Handle login redirection
  const login_redirect = $route.query.login_redirect as string;
  if (login_redirect) {
    handleLoginRedirection(login_redirect)
  }
  $router.replace('/')
})

onUnmounted(() => {
  // Clean up socket listeners when component is unmounted
  cleanupSocketListeners()
})
</script> 