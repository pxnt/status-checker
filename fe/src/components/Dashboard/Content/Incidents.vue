<template>
  <div class="space-y-6">
    <!-- Header Actions -->
    <div class="flex justify-between items-center">
      <div class="flex items-center space-x-4">
        <!-- Sort/Filter Controls -->
        <div class="flex items-center space-x-2">
          <ArrowUpDown class="h-4 w-4 text-gray-400" />
        </div>
      </div>
      
      <div class="flex items-center space-x-3">
        <!-- Search -->
        <div class="relative">
          <Search class="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search incidents"
            class="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>
        
        <!-- Options -->
        <Button variant="ghost" size="sm">
          <MoreHorizontal class="h-4 w-4" />
        </Button>
        
        <!-- New Incident Button -->
        <Button @click="showCreateModal = true" class="bg-green-600 hover:bg-green-700" :disabled="$incidentsStore.isCreating">
          <ButtonLoader v-if="$incidentsStore.isCreating" text="Creating..." />
          <span v-else>Create Incident</span>
        </Button>
      </div>
    </div>

    <!-- Incidents Table -->
    <div class="bg-white rounded-lg border border-gray-200">
      <!-- Loading State -->
      <div v-if="$incidentsStore.isLoading">
        <TableLoader :rows="5" />
      </div>
      
      <!-- Table Content -->
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div class="flex items-center space-x-1 cursor-pointer hover:text-gray-700">
                  <span>Name</span>
                  <ChevronDown class="h-4 w-4" />
                </div>
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div class="flex items-center space-x-1 cursor-pointer hover:text-gray-700">
                  <span>Status</span>
                  <ChevronDown class="h-4 w-4" />
                </div>
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div class="flex items-center space-x-1 cursor-pointer hover:text-gray-700">
                  <span>Occurred At</span>
                  <ChevronDown class="h-4 w-4" />
                </div>
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Visible
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="incident in filteredIncidents" :key="incident.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ incident.name }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="getStatusBadgeClass(incident.status)"
                >
                  <div class="w-1.5 h-1.5 rounded-full mr-1.5" :class="getStatusDotClass(incident.status)"></div>
                  {{ getStatusLabel(incident.status) }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900 max-w-xs truncate">{{ incident.description }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ formatDate(incident.occurred_at) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <Check v-if="incident.visible" class="h-5 w-5 text-green-500" />
                <X v-else class="h-5 w-5 text-gray-400" />
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Button variant="ghost" size="sm" @click="editIncident(incident)" class="text-green-600 hover:text-green-700">
                  <Edit class="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="!$incidentsStore.isLoading && filteredIncidents.length === 0" class="text-center py-12">
        <AlertTriangle class="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">No incidents found</h3>
        <p class="text-gray-500 mb-4">Get started by creating your first incident.</p>
        <Button @click="showCreateModal = true" class="bg-green-600 hover:bg-green-700" :disabled="$incidentsStore.isCreating">
          <ButtonLoader v-if="$incidentsStore.isCreating" text="Creating..." />
          <span v-else>Create Incident</span>
        </Button>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="!$incidentsStore.isLoading" class="flex items-center justify-between">
      <div class="text-sm text-gray-700">
        Showing {{ Math.min(1, filteredIncidents.length) }} to {{ Math.min(perPage, filteredIncidents.length) }} of {{ filteredIncidents.length }} results
      </div>
      <div class="flex items-center space-x-2">
        <span class="text-sm text-gray-700">Per page</span>
        <select v-model="perPage" class="border border-gray-300 rounded text-sm px-2 py-1">
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
        </select>
      </div>
    </div>

    <!-- Create/Edit Incident Modal -->
    <IncidentModal
      v-if="showCreateModal || selectedIncident"
      :incident="selectedIncident"
      :create="showCreateModal"
      @close="closeModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Button } from '~/components/ui/button'
import { 
  ArrowUpDown, 
  Search, 
  MoreHorizontal, 
  ChevronDown, 
  Check, 
  X, 
  Edit,
  AlertTriangle
} from 'lucide-vue-next'
import { useIncidentsStore } from '~/stores/incidents'
import type { Incident, IncidentStatus } from '~/types/Incident'
import IncidentModal from '~/components/Dashboard/IncidentModal.vue'
import TableLoader from '~/components/ui/TableLoader.vue'
import ButtonLoader from '~/components/ButtonLoader.vue'

const $incidentsStore = useIncidentsStore()

// Local state
const searchQuery = ref('')
const perPage = ref(10)
const showCreateModal = ref(false)
const selectedIncident = ref<Incident | null>(null)

// Computed
const filteredIncidents = computed(() => {
  if (!searchQuery.value) {
    return $incidentsStore.incidents
  }
  
  const query = searchQuery.value.toLowerCase()
  return $incidentsStore.incidents.filter(incident =>
    incident.name.toLowerCase().includes(query) ||
    incident.description.toLowerCase().includes(query) ||
    incident.status.toLowerCase().includes(query)
  )
})

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

const getStatusDotClass = (status: IncidentStatus) => {
  const classes = {
    reported: 'bg-red-400',
    investigating: 'bg-yellow-400',
    identified: 'bg-orange-400',
    watching: 'bg-blue-400',
    fixed: 'bg-green-400'
  }
  return classes[status]
}

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const editIncident = (incident: Incident) => {
  selectedIncident.value = incident
  showCreateModal.value = false
}

const closeModal = () => {
  showCreateModal.value = false
  selectedIncident.value = null
}

// Load incidents on mount
onMounted(() => {
  if ($incidentsStore.incidents.length === 0) {
    $incidentsStore.getIncidents()
  }
})
</script> 