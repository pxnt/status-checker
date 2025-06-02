<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center">
    <!-- Backdrop -->
    <div class="fixed inset-0 bg-black bg-opacity-50" @click="$emit('close')"></div>
    
    <!-- Modal -->
    <div class="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">
          {{ incident ? 'Edit Incident' : 'Create Incident' }}
        </h3>
      </div>
      
      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="px-6 py-4 space-y-6">
        <!-- Name -->
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
            Name *
          </label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Incident name"
          />
        </div>
        
        <!-- Status -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-3">
            Status *
          </label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="status in statusOptions"
              :key="status.value"
              type="button"
              @click="form.status = status.value"
              :class="[
                'inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors',
                form.status === status.value
                  ? status.activeClass
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              ]"
            >
              <component :is="status.icon" class="h-4 w-4 mr-2" />
              {{ status.label }}
            </button>
          </div>
        </div>
        
        <!-- Description/Message -->
        <div>
          <label for="description" class="block text-sm font-medium text-gray-700 mb-1">
            Message *
          </label>
          <div class="border border-gray-300 rounded-md">
            <!-- Toolbar -->
            <div class="flex items-center space-x-1 p-2 border-b border-gray-200 bg-gray-50">
              <button
                v-for="tool in toolbarTools"
                :key="tool.name"
                type="button"
                @click="tool.action"
                class="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded"
                :title="tool.name"
              >
                <component :is="tool.icon" class="h-4 w-4" />
              </button>
            </div>
            <!-- Text Area -->
            <textarea
              id="description"
              v-model="form.description"
              required
              rows="4"
              class="w-full px-3 py-2 border-0 rounded-b-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              placeholder="Describe the incident and any relevant details..."
            ></textarea>
          </div>
        </div>
        
        <!-- Occurred At -->
        <div>
          <label for="occurred_at" class="block text-sm font-medium text-gray-700 mb-1">
            Occurred at *
          </label>
          <input
            id="occurred_at"
            v-model="occurredAtString"
            type="datetime-local"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
          <p class="mt-1 text-xs text-gray-500">
            The incident's created timestamp will be used if left empty.
          </p>
        </div>
        
        <!-- Affected Components -->
        <div>
          <label for="affected_components" class="block text-sm font-medium text-gray-700 mb-1">
            Affected Components
          </label>
          <ComboboxRoot 
            v-model="form.affected_components" 
            multiple
            class="relative"
          >
            <ComboboxAnchor class="w-full inline-flex items-center justify-between rounded-md border border-gray-300 px-3 py-2 text-sm leading-none h-auto min-h-[42px] gap-2 bg-white text-gray-900 hover:bg-gray-50 shadow-sm focus:shadow-[0_0_0_2px] focus:shadow-green-500 focus:border-green-500 outline-none">
              <ComboboxInput
                class="!bg-transparent outline-none text-gray-900 h-full selection:bg-green-100 placeholder-gray-400 flex-1"
                placeholder="Search components..."
              />
              <ComboboxTrigger>
                <ChevronDown class="h-4 w-4 text-gray-400" />
              </ComboboxTrigger>
            </ComboboxAnchor>

            <ComboboxContent class="absolute z-10 w-full mt-1 bg-white overflow-hidden rounded-md shadow-lg border border-gray-200 max-h-[200px]">
              <ComboboxViewport class="p-1">
                <ComboboxEmpty class="text-gray-500 text-sm text-center py-2">
                  No components found
                </ComboboxEmpty>

                <template
                  v-for="(group, index) in groupedComponents"
                  :key="group.id"
                >
                  <ComboboxGroup>
                    <ComboboxSeparator
                      v-if="index !== 0"
                      class="h-[1px] bg-gray-200 my-1"
                    />

                    <ComboboxLabel class="px-2 text-xs leading-6 text-gray-600 font-medium">
                      {{ group.name }}
                    </ComboboxLabel>

                    <ComboboxItem
                      v-for="component in group.components"
                      :key="component.id"
                      :value="component.id"
                      class="text-sm leading-none text-gray-900 rounded flex items-center h-8 pr-2 pl-6 relative select-none data-[disabled]:text-gray-400 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-green-50 data-[highlighted]:text-green-900 cursor-pointer"
                    >
                      <ComboboxItemIndicator
                        class="absolute left-0 w-6 inline-flex items-center justify-center"
                      >
                        <Check class="h-4 w-4 text-green-600" />
                      </ComboboxItemIndicator>
                      <span>
                        {{ component.name }}
                      </span>
                    </ComboboxItem>
                  </ComboboxGroup>
                </template>
              </ComboboxViewport>
            </ComboboxContent>
          </ComboboxRoot>
          
          <!-- Selected components display -->
          <div v-if="selectedComponentNames.length > 0" class="mt-2">
            <div class="flex flex-wrap gap-1">
              <span
                v-for="name in selectedComponentNames"
                :key="name"
                class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800"
              >
                {{ name }}
              </span>
            </div>
          </div>
          
          <p class="mt-1 text-xs text-gray-500">
            Search and select multiple components
          </p>
        </div>
        
        <!-- Visible -->
        <div class="flex items-center">
          <input
            id="visible"
            v-model="form.visible"
            type="checkbox"
            class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
          />
          <label for="visible" class="ml-2 block text-sm text-gray-900">
            Incident is visible to the public
          </label>
        </div>
      </form>
      
      <!-- Footer -->
      <div class="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
        <Button variant="outline" @click="$emit('close')">
          Cancel
        </Button>
        <Button @click="handleSubmit" class="bg-green-600 hover:bg-green-700" :disabled="loading">
          <ButtonLoader v-if="loading" :text="create ? 'Creating...' : 'Updating...'" />
          <span v-else>
            {{ create ? 'Create Incident' : 'Update Incident' }}
          </span>
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue'
import { Button } from '~/components/ui/button'
import { useIncidentsStore } from '~/stores/incidents'
import { useComponentsStore } from '~/stores/components'
import type { Incident, IncidentStatus } from '~/types/Incident'
import ButtonLoader from '~/components/ButtonLoader.vue'
import {
  AlertCircle,
  Search,
  Target,
  Eye,
  CheckCircle,
  Bold,
  Italic,
  Strikethrough,
  Link,
  List,
  ListOrdered,
  Table,
  Image,
  Undo,
  Redo,
  ChevronDown,
  Check
} from 'lucide-vue-next'
import { 
  ComboboxAnchor, 
  ComboboxContent, 
  ComboboxEmpty, 
  ComboboxGroup, 
  ComboboxInput, 
  ComboboxItem, 
  ComboboxItemIndicator, 
  ComboboxLabel, 
  ComboboxRoot, 
  ComboboxSeparator, 
  ComboboxTrigger, 
  ComboboxViewport 
} from 'reka-ui'

interface Props {
  incident?: Incident | null
  create: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
}>()

const $incidentsStore = useIncidentsStore()
const $componentsStore = useComponentsStore()

// Loading state
const loading = ref(false)

// Status options
const statusOptions = [
  { 
    value: 'reported' as IncidentStatus, 
    label: 'Reported', 
    icon: AlertCircle, 
    activeClass: 'bg-red-600 text-white hover:bg-red-700' 
  },
  { 
    value: 'investigating' as IncidentStatus, 
    label: 'Investigating', 
    icon: Search, 
    activeClass: 'bg-yellow-600 text-white hover:bg-yellow-700' 
  },
  { 
    value: 'identified' as IncidentStatus, 
    label: 'Identified', 
    icon: Target, 
    activeClass: 'bg-orange-600 text-white hover:bg-orange-700' 
  },
  { 
    value: 'watching' as IncidentStatus, 
    label: 'Watching', 
    icon: Eye, 
    activeClass: 'bg-blue-600 text-white hover:bg-blue-700' 
  },
  { 
    value: 'fixed' as IncidentStatus, 
    label: 'Fixed', 
    icon: CheckCircle, 
    activeClass: 'bg-green-600 text-white hover:bg-green-700' 
  },
]

// Toolbar tools (for rich text editor simulation)
const toolbarTools = [
  { name: 'Bold', icon: Bold, action: () => {} },
  { name: 'Italic', icon: Italic, action: () => {} },
  { name: 'Strikethrough', icon: Strikethrough, action: () => {} },
  { name: 'Link', icon: Link, action: () => {} },
  { name: 'Bulleted List', icon: List, action: () => {} },
  { name: 'Numbered List', icon: ListOrdered, action: () => {} },
  { name: 'Table', icon: Table, action: () => {} },
  { name: 'Image', icon: Image, action: () => {} },
  { name: 'Undo', icon: Undo, action: () => {} },
  { name: 'Redo', icon: Redo, action: () => {} },
]

// Form state
const form = reactive({
  name: '',
  status: 'reported' as IncidentStatus,
  description: '',
  occurred_at: new Date(),
  visible: true,
  affected_components: [] as number[]
})

// Convert occurred_at to datetime-local string
const occurredAtString = computed({
  get() {
    const date = new Date(form.occurred_at)
    // Format as YYYY-MM-DDTHH:MM for datetime-local input
    return date.toISOString().slice(0, 16)
  },
  set(value: string) {
    form.occurred_at = new Date(value)
  }
})

// Helper methods
const getGroupName = (component_group_id: number) => {
  const group = $componentsStore.getComponentGroupById(component_group_id)
  return group ? group.name : 'Unknown Group'
}

// Group components by component group for the combobox
const groupedComponents = computed(() => {
  const groups: { [key: string]: { id: number; name: string; components: any[] } } = {}
  
  $componentsStore.components.forEach(component => {
    const groupName = getGroupName(component.component_group_id)
    const groupId = component.component_group_id
    
    if (!groups[groupId]) {
      groups[groupId] = {
        id: groupId,
        name: groupName,
        components: []
      }
    }
    
    groups[groupId].components.push(component)
  })
  
  return Object.values(groups)
})

// Get selected component names for display
const selectedComponentNames = computed(() => {
  return form.affected_components
    .map(id => {
      const component = $componentsStore.components.find(c => c.id === id)
      return component ? component.name : ''
    })
    .filter(Boolean)
})

// Populate form if editing
watch(() => props.incident, (incident) => {
  if (incident) {
    form.name = incident.name
    form.status = incident.status
    form.description = incident.description
    form.occurred_at = new Date(incident.occurred_at)
    form.visible = incident.visible
    form.affected_components = [...incident.affected_components]
  } else {
    // Reset form for new incident
    form.name = ''
    form.status = 'reported'
    form.description = ''
    form.occurred_at = new Date()
    form.visible = true
    form.affected_components = []
  }
}, { immediate: true })

async function handleSubmit() {
  if (!form.name || !form.description || loading.value) {
    return
  }
  
  loading.value = true
  
  try {
    if (props.create) {
      // Create new incident
      await $incidentsStore.createIncident({
        name: form.name,
        status: form.status,
        description: form.description,
        occurred_at: form.occurred_at,
        visible: form.visible,
        affected_components: form.affected_components
      })
    } else {
      // Update existing incident
      await $incidentsStore.updateIncident(props.incident?.id || -1, {
        name: form.name,
        status: form.status,
        description: form.description,
        occurred_at: form.occurred_at,
        visible: form.visible,
        affected_components: form.affected_components
      })
    }
    
    emit('close')
  } finally {
    loading.value = false
  }
}
</script> 