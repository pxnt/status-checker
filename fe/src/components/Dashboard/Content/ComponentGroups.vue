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
        
        <!-- New Component Group Button -->
        <Button @click="showCreateModal = true" class="bg-green-600 hover:bg-green-700">
          New Component Group
        </Button>
      </div>
    </div>

    <!-- Component Groups Table -->
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
                  <span>Visible</span>
                  <ChevronDown class="h-4 w-4" />
                </div>
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="group in filteredGroups" :key="group.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ group.name }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <Eye class="h-4 w-4 text-blue-500 mr-2" />
                  <span class="text-sm text-blue-600 capitalize">{{ group.visible ? 'Visible' : 'Hidden' }}</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Button variant="ghost" size="sm" @click="editGroup(group)" class="text-green-600 hover:text-green-700">
                  <Edit class="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Empty State -->
      <div v-if="filteredGroups.length === 0" class="text-center py-12">
        <Folder class="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">No component groups found</h3>
        <p class="text-gray-500 mb-4">Get started by creating your first component group.</p>
        <Button @click="showCreateModal = true" class="bg-green-600 hover:bg-green-700">
          New Component Group
        </Button>
      </div>
    </div>

    <!-- Pagination -->
    <div class="flex items-center justify-between">
      <div class="text-sm text-gray-700">
        Showing {{ Math.min(1, filteredGroups.length) }} result
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

    <!-- Create/Edit Component Group Modal -->
    <ComponentGroupModal
      v-if="showCreateModal || selectedGroup"
      :group="selectedGroup"
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
  ChevronUp,
  Eye, 
  Edit,
  Folder
} from 'lucide-vue-next'
import { useComponentsStore } from '~/stores/components'
import type { ComponentGroup } from '~/types/Component'
import ComponentGroupModal from '~/components/Dashboard/ComponentGroupModal.vue'

const $componentsStore = useComponentsStore()

// Local state
const searchQuery = ref('')
const perPage = ref(10)
const showCreateModal = ref(false)
const selectedGroup = ref<ComponentGroup | null>(null)

// Computed
const filteredGroups = computed(() => {
  if (!searchQuery.value) {
    return $componentsStore.componentGroups
  }
  
  const query = searchQuery.value.toLowerCase()
  return $componentsStore.componentGroups.filter(group =>
    group.name.toLowerCase().includes(query)
  )
})

// Methods
const editGroup = (group: ComponentGroup) => {
  selectedGroup.value = group
}

const closeModal = () => {
  showCreateModal.value = false
  selectedGroup.value = null
}

</script> 