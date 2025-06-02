<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center">
    <!-- Backdrop -->
    <div class="fixed inset-0 bg-black bg-opacity-50" @click="$emit('close')"></div>
    
    <!-- Modal -->
    <div class="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">
          {{ group ? 'Edit Component Group' : 'New Component Group' }}
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
            placeholder="Component group name"
          />
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
            Group is visible
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
            {{ create ? 'Create Component Group' : 'Update Component Group' }}
          </span>
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { Button } from '~/components/ui/button'
import type { ComponentGroup } from '~/types/Component'
import { useComponentsStore } from '~/stores/components'
import ButtonLoader from '~/components/ButtonLoader.vue'

interface Props {
  group?: ComponentGroup | null
  create: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
}>()

const $componentsStore = useComponentsStore()

// Form state
const form = reactive({
  name: '',
  visible: true,
})
const loading = ref(false)

// Populate form if editing
watch(() => props.group, (group) => {
  if (group) {
    form.name = group.name
    form.visible = group.visible
  } else {
    // Reset form for new group
    form.name = ''
    form.visible = true
  }
}, { immediate: true })

async function handleSubmit() {
  if (!form.name || loading.value) {
    return
  }

  loading.value = true

  try {

    if (props.create) {
      await $componentsStore.createComponentGroup({
        name: form.name,
        visible: form.visible,
      })
    } else {
      await $componentsStore.updateComponentGroup(props.group?.id || -1, {
        name: form.name,
        visible: form.visible,
      })
    }

    emit('close')
  } finally {
    loading.value = false
  }
}
</script> 