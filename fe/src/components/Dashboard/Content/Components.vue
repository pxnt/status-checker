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
            placeholder="Search"
            class="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>
        
        <!-- Options -->
        <Button variant="ghost" size="sm">
          <MoreHorizontal class="h-4 w-4" />
        </Button>
        
        <!-- New Component Button -->
        <Button @click="showCreateModal = true" class="bg-green-600 hover:bg-green-700">
          New Component
        </Button>
      </div>
    </div>

    <!-- Components Table -->
    <div class="bg-white rounded-lg border border-gray-200">
      <div class="overflow-x-auto">
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
                <div class="flex items-center space-x-1 cursor-pointer hover:text-gray-700">
                  <span>Group</span>
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
            <tr v-for="component in filteredComponents" :key="component.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ component.name }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="getStatusBadgeClass(component.status)"
                >
                  <div class="w-1.5 h-1.5 rounded-full mr-1.5" :class="getStatusDotClass(component.status)"></div>
                  {{ getStatusLabel(component.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ getGroupName(component.component_group_id) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <Check v-if="component.visible" class="h-5 w-5 text-green-500" />
                <X v-else class="h-5 w-5 text-gray-400" />
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Button variant="ghost" size="sm" @click="editComponent(component)" class="text-green-600 hover:text-green-700">
                  <Edit class="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Empty State -->
      <div v-if="filteredComponents.length === 0" class="text-center py-12">
        <ComponentIcon class="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">No components found</h3>
        <p class="text-gray-500 mb-4">Get started by creating your first component.</p>
        <Button @click="showCreateModal = true" class="bg-green-600 hover:bg-green-700">
          New Component
        </Button>
      </div>
    </div>

    <!-- Pagination -->
    <div class="flex items-center justify-between">
      <div class="text-sm text-gray-700">
        Showing {{ Math.min(1, filteredComponents.length) }} to {{ Math.min(perPage, filteredComponents.length) }} of {{ filteredComponents.length }} results
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

    <!-- Create/Edit Component Modal -->
    <ComponentModal
      v-if="showCreateModal || selectedComponent"
      :component="selectedComponent"
      :create="showCreateModal"
      @close="closeModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Button } from '~/components/ui/button'
import { 
  ArrowUpDown, 
  Search, 
  MoreHorizontal, 
  ChevronDown, 
  Check, 
  X, 
  Edit,
  Component as ComponentIcon
} from 'lucide-vue-next'
import { useComponentsStore } from '~/stores/components'
import type { Component } from '~/types/Component'
import ComponentModal from '~/components/Dashboard/ComponentModal.vue'

const $componentsStore = useComponentsStore()

// Local state
const searchQuery = ref('')
const perPage = ref(10)
const showCreateModal = ref(false)
const selectedComponent = ref<Component | null>(null)

// Computed
const filteredComponents = computed(() => {
  if (!searchQuery.value) {
    return $componentsStore.components
  }
  
  const query = searchQuery.value.toLowerCase()
  return $componentsStore.components.filter(component =>
    component.name.toLowerCase().includes(query) ||
    getGroupName(component.component_group_id).toLowerCase().includes(query)
  )
})

// Methods
const getStatusLabel = (status: Component['status']) => {
  const labels = {
    operational: 'Operational',
    performance: 'Performance Issues',
    partial: 'Partial Outage',
    major: 'Major Outage',
    unknown: 'Unknown'
  }
  return labels[status]
}

const getStatusBadgeClass = (status: Component['status']) => {
  const classes = {
    operational: 'bg-green-100 text-green-800',
    performance: 'bg-yellow-100 text-yellow-800',
    partial: 'bg-orange-100 text-orange-800',
    major: 'bg-red-100 text-red-800',
    unknown: 'bg-gray-100 text-gray-800'
  }
  return classes[status]
}

const getStatusDotClass = (status: Component['status']) => {
  const classes = {
    operational: 'bg-green-400',
    performance: 'bg-yellow-400',
    partial: 'bg-orange-400',
    major: 'bg-red-400',
    unknown: 'bg-gray-400'
  }
  return classes[status]
}

const getGroupName = (component_group_id: number) => {
  const group = $componentsStore.getComponentGroupById(component_group_id)
  return group?.name || 'Unknown Group'
}

const editComponent = (component: Component) => {
  selectedComponent.value = component
}

const closeModal = () => {
  showCreateModal.value = false
  selectedComponent.value = null
}
</script> 