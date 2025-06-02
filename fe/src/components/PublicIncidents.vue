<template>
  <section class="py-20 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-0">
          Past Incidents
        </h2>
        
        <!-- Date Range Filter -->
        <div class="flex items-center space-x-2 bg-white rounded-lg border border-gray-200 px-4 py-2">
          <Calendar class="h-5 w-5 text-gray-400" />
          <input
            v-model="startDate"
            type="date"
            class="border-none outline-none text-sm text-gray-600"
            @change="onDateRangeChange"
          />
          <span class="text-gray-400">—</span>
          <input
            v-model="endDate"
            type="date"
            class="border-none outline-none text-sm text-gray-600"
            @change="onDateRangeChange"
          />
        </div>
      </div>

      <!-- Loading State -->
      <PublicIncidentsLoader v-if="$publicIncidentsStore.isLoadingPublic" />

      <!-- Incidents Content -->
      <div v-else class="space-y-8">
        <!-- No incidents for date range -->
        <div v-if="Object.keys($publicIncidentsStore.incidentsByDate).length === 0" class="text-center py-12">
          <AlertTriangle class="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">No incidents found</h3>
          <p class="text-gray-500">No incidents were reported during the selected time period.</p>
        </div>

        <!-- Incidents grouped by date -->
        <div v-else class="space-y-4">
          <div v-for="(incidents, date) in $publicIncidentsStore.incidentsByDate" :key="date" class="space-y-4">
            <!-- Date Header -->
            <h3 class="text-xl font-semibold text-gray-900">{{ date }}</h3>
            
            <!-- Incidents for this date -->
            <div v-if="incidents.length > 0" class="space-y-3">
              <div 
                v-for="incident in incidents" 
                :key="incident.id"
                class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <h4 class="text-lg font-semibold text-gray-900 mb-2">
                      {{ incident.name }}
                    </h4>
                    <p class="text-sm text-gray-600 mb-3">
                      {{ formatIncidentTime(incident.occurred_at) }}
                    </p>
                    <div v-if="incident.description" class="text-gray-700 text-sm">
                      {{ incident.description }}
                    </div>
                  </div>
                  
                  <!-- Status Badge -->
                  <div class="flex items-center space-x-2 ml-4">
                    <div 
                      :class="[
                        'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
                        getStatusBadgeClass(incident.status)
                      ]"
                    >
                      <CheckCircle v-if="incident.status === 'fixed'" class="h-4 w-4 mr-1" />
                      <AlertCircle v-else class="h-4 w-4 mr-1" />
                      {{ getStatusLabel(incident.status) }}
                    </div>
                  </div>
                </div>

                <!-- Affected Components -->
                <div v-if="incident.components && incident.components.length > 0" class="mt-4 pt-4 border-t border-gray-100">
                  <p class="text-sm text-gray-600 mb-2">Affected components:</p>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="component in incident.components"
                      :key="component.id"
                      class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {{ component.name }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- No incidents for this date -->
            <div v-else class="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
              <p class="text-gray-500 text-sm">No incidents reported.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import { ref, onMounted, computed } from 'vue'
import { usePublicIncidentsStore } from '~/stores/incidents'
import { Calendar, AlertTriangle, CheckCircle } from 'lucide-vue-next'
import type { IncidentStatus } from '~/types/Incident'
import PublicIncidentsLoader from './PublicIncidentsLoader.vue'

const $publicIncidentsStore = usePublicIncidentsStore()

// Date range state
const startDate = ref('')
const endDate = ref('')

// Set default date range (last 30 days)
const setDefaultDateRange = () => {
  const today = dayjs().endOf('day');
  const thirtyDaysAgo = today.subtract(31, 'month').startOf('day');
  
  endDate.value = today.format('YYYY-MM-DD')
  startDate.value = thirtyDaysAgo.format('YYYY-MM-DD')
}

// Methods
const getStatusLabel = (status: IncidentStatus) => {
  const labels = {
    reported: 'Reported',
    investigating: 'Investigating',
    identified: 'Identified',
    watching: 'Watching',
    fixed: 'Fixed'
  }
  return labels[status]
}

const getStatusBadgeClass = (status: IncidentStatus) => {
  const classes = {
    reported: 'bg-red-100 text-red-800',
    investigating: 'bg-yellow-100 text-yellow-800',
    identified: 'bg-orange-100 text-orange-800',
    watching: 'bg-blue-100 text-blue-800',
    fixed: 'bg-green-100 text-green-800'
  }
  return classes[status]
}

const formatIncidentTime = (occurredAt: Date) => {
  const now = dayjs()
  const incidentTime = dayjs(occurredAt)
  const diffInMinutes = Math.floor(now.diff(incidentTime, 'minute'))
  
  let timeAgo = ''
  if (diffInMinutes < 60) {
    timeAgo = `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`
  } else if (diffInMinutes < 1440) { // Less than 24 hours
    const hours = Math.floor(diffInMinutes / 60)
    timeAgo = `${hours} hour${hours !== 1 ? 's' : ''} ago`
  } else {
    const days = Math.floor(diffInMinutes / 1440)
    timeAgo = `${days} day${days !== 1 ? 's' : ''} ago`
  }
  
  const formattedDate = incidentTime.format('DD/MM/YYYY')
  const formattedTime = incidentTime.format('HH:mm:ss')
  
  return `${timeAgo} — ${formattedDate}, ${formattedTime}`
}

const onDateRangeChange = () => {
  fetchIncidents()
}

const fetchIncidents = async () => {
  if (startDate.value && endDate.value) {
    const _startDate = dayjs(startDate.value).startOf('day').toISOString()
    const _endDate = dayjs(endDate.value).endOf('day').toISOString()

    await $publicIncidentsStore.getPublicIncidents({
      start_date: _startDate,
      end_date: _endDate
    })
  }
}

// Load incidents on mount
onMounted(() => {
  setDefaultDateRange()
  fetchIncidents()
})
</script> 