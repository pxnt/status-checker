<template>
    <div>
      <div class="flex items-center justify-between gap-3 mb-2">
        <div class="flex items-center gap-2">
          <component :is="icon" class="h-4 w-4 text-gray-400" />
          <h3 class="text-lg font-medium text-gray-900">{{ title }}</h3>
        </div>
        <Badge :variant="statusVariant" :class="statusClasses">
          <component :is="statusIcon" class="h-3 w-3 mr-1" />
          {{ statusName }}
        </Badge>
      </div>
      <p class="text-gray-600 mb-3">{{ description }}</p>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Badge } from '~/components/ui/badge'
import { ServiceStatus } from '~/types/Status'
import { useReactiveStatusStyling } from '~/composables/useStatusStyling'

interface Props {
  title: string
  description: string
  status: ServiceStatus
  icon: any
}

const props = defineProps<Props>()

defineEmits<{
  viewDetails: []
}>()

const statusRef = computed(() => props.status)
const { statusName, statusIcon, statusVariant, statusClasses } = useReactiveStatusStyling(statusRef)
</script> 