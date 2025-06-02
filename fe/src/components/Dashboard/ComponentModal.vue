<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center">
    <!-- Backdrop -->
    <div class="fixed inset-0 bg-black bg-opacity-50" @click="$emit('close')"></div>
    
    <!-- Modal -->
    <div class="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">
          {{ component ? 'Edit Component' : 'New Component' }}
        </h3>
      </div>
      
      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="px-6 py-4 space-y-4">
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
            placeholder="Component name"
          />
        </div>
        
        <!-- Description -->
        <div>
          <label for="description" class="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            v-model="form.description"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Optional description for this component"
          ></textarea>
        </div>
        
        <!-- Status -->
        <div>
          <label for="status" class="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="status"
            v-model="form.status"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="operational">Operational</option>
            <option value="performance">Performance Issues</option>
            <option value="partial">Partial Outage</option>
            <option value="major">Major Outage</option>
            <option value="unknown">Unknown</option>
          </select>
        </div>
        
        <!-- Group -->
        <div>
          <label for="component_group_id" class="block text-sm font-medium text-gray-700 mb-1">
            Component Group *
          </label>
          <select
            id="component_group_id"
            v-model="form.component_group_id"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="">Select a group</option>
            <option
              v-for="group in $componentsStore.componentGroups"
              :key="group.id"
              :value="group.id"
            >
              {{ group.name }}
            </option>
          </select>
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
            Component is visible
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
            {{ create ? 'Create Component' : 'Update Component' }}
          </span>
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { Button } from '~/components/ui/button'
import { useComponentsStore } from '~/stores/components'
import type { Component } from '~/types/Component'
import ButtonLoader from '~/components/ButtonLoader.vue'

interface Props {
  component?: Component | null
  create: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
}>()

const $componentsStore = useComponentsStore()

// Loading state
const loading = ref(false)

// Form state
const form = reactive({
  name: '',
  description: '',
  status: 'operational' as Component['status'],
  component_group_id: -1,
  visible: true
})

// Populate form if editing
watch(() => props.component, (component) => {
  if (component) {
    form.name = component.name
    form.description = component.description || ''
    form.status = component.status
    form.component_group_id = component.component_group_id
    form.visible = component.visible
  } else {
    // Reset form for new component
    form.name = ''
    form.description = ''
    form.status = 'operational'
    form.component_group_id = -1
    form.visible = true
  }
}, { immediate: true })

async function handleSubmit() {
  if (!form.name || !form.component_group_id || loading.value) {
    return
  }
  
  loading.value = true
  
  try {
    if (props.create) {
      // Create new component
      await $componentsStore.createComponent({
        name: form.name,
        description: form.description,
        status: form.status,
        component_group_id: form.component_group_id,
        visible: form.visible
      })
    } else {
      // Update existing component
      await $componentsStore.updateComponent(props.component?.id || -1, {
        name: form.name,
        description: form.description,
        status: form.status,
        component_group_id: form.component_group_id,
        visible: form.visible
      })
    }
    
    emit('close')
  } finally {
    loading.value = false
  }
}
</script> 