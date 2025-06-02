<template>
  <div class="flex items-center justify-between py-3">
    <span class="font-medium">{{ title }}</span>
    <div class="flex items-center gap-2">
      <button :class="getButtonClass('operational')" @click="handleStatusChange('operational')">
        <CheckCircle class="h-3 w-3 inline mr-1" />
        Operational
      </button>
      <button :class="getButtonClass('performance')" @click="handleStatusChange('performance')">
        <AlertCircle class="h-3 w-3 inline mr-1" />
        Performance Issues
      </button>
      <button :class="getButtonClass('partial')" @click="handleStatusChange('partial')">
        <AlertTriangle class="h-3 w-3 inline mr-1" />
        Partial Outage
      </button>
      <button :class="getButtonClass('major')" @click="handleStatusChange('major')">
        <XCircle class="h-3 w-3 inline mr-1" />
        Major Outage
      </button>
      <button :class="getButtonClass('unknown')" @click="handleStatusChange('unknown')">
        <Clock class="h-3 w-3 inline mr-1" />
        Unknown
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { 
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  XCircle,
  Clock
} from 'lucide-vue-next'
import type { ServiceStatus } from '~/types/Status'
import { useReactiveStatusStyling } from '~/composables/useStatusStyling'

// Props definition
interface Props {
  title: string
  status: ServiceStatus
}

const props = defineProps<Props>()

// Emits definition
interface Emits {
  'status-change': [event: { service: string; status: ServiceStatus }]
}

const emit = defineEmits<Emits>()

// Reactive state
const currentStatus = ref(props.status)
const { statusConfig } = useReactiveStatusStyling(currentStatus)

// Methods
const handleStatusChange = (newStatus: ServiceStatus) => {
  currentStatus.value = newStatus
  emit('status-change', { service: props.title, status: newStatus })
}

const getButtonClass = (status: ServiceStatus) => {
  const baseClass = "px-3 py-1.5 text-sm font-medium rounded-md border transition-colors"
  if (currentStatus.value === status) {
    const { statusClasses } = useReactiveStatusStyling(ref(status))
    return `${baseClass} ${statusClasses.value}`
  }
  return `${baseClass} text-muted-foreground hover:text-foreground border-transparent hover:border-border`
}
</script>