<template>
  <div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th v-for="(header, index) in headers" :key="index" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            <div class="flex items-center space-x-1">
              <span>{{ header.label }}</span>
              <ChevronDown v-if="header.sortable" class="h-4 w-4" />
            </div>
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="row in skeletonRows" :key="row" class="animate-pulse">
          <td v-for="(header, colIndex) in headers" :key="colIndex" class="px-6 py-4 whitespace-nowrap">
            <div v-if="header.type === 'text'" class="space-y-2">
              <div class="h-4 bg-gray-200 rounded" :style="{ width: getRandomWidth() }"></div>
            </div>
            <div v-else-if="header.type === 'badge'" class="inline-flex items-center px-2.5 py-0.5 rounded-full">
              <div class="w-1.5 h-1.5 rounded-full bg-gray-200 mr-1.5"></div>
              <div class="h-4 w-16 bg-gray-200 rounded"></div>
            </div>
            <div v-else-if="header.type === 'description'" class="space-y-1">
              <div class="h-3 bg-gray-200 rounded w-full"></div>
              <div class="h-3 bg-gray-200 rounded" :style="{ width: getRandomWidth() }"></div>
            </div>
            <div v-else-if="header.type === 'datetime'" class="h-4 w-24 bg-gray-200 rounded"></div>
            <div v-else-if="header.type === 'icon'" class="h-5 w-5 bg-gray-200 rounded"></div>
            <div v-else-if="header.type === 'actions'" class="text-right">
              <div class="inline-flex items-center px-3 py-1 rounded bg-gray-200">
                <div class="h-4 w-4 bg-gray-300 rounded mr-1"></div>
                <div class="h-4 w-8 bg-gray-300 rounded"></div>
              </div>
            </div>
            <div v-else class="h-4 bg-gray-200 rounded" :style="{ width: getRandomWidth() }"></div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ChevronDown } from 'lucide-vue-next'

interface TableHeader {
  label: string
  type?: 'text' | 'badge' | 'description' | 'datetime' | 'icon' | 'actions'
  sortable?: boolean
}

interface Props {
  headers?: TableHeader[]
  rows?: number
}

const props = withDefaults(defineProps<Props>(), {
  headers: () => [
    { label: 'Name', type: 'text', sortable: true },
    { label: 'Status', type: 'badge', sortable: true },
    { label: 'Description', type: 'description' },
    { label: 'Occurred At', type: 'datetime', sortable: true },
    { label: 'Visible', type: 'icon' },
    { label: 'Actions', type: 'actions' }
  ],
  rows: 5
})

const skeletonRows = computed(() => Array.from({ length: props.rows }, (_, i) => i))

const getRandomWidth = () => {
  const widths = ['60%', '70%', '80%', '90%', '75%', '85%']
  return widths[Math.floor(Math.random() * widths.length)]
}
</script>

<style scoped>
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Stagger the animation for different rows */
.animate-pulse:nth-child(2) {
  animation-delay: 0.1s;
}

.animate-pulse:nth-child(3) {
  animation-delay: 0.2s;
}

.animate-pulse:nth-child(4) {
  animation-delay: 0.3s;
}

.animate-pulse:nth-child(5) {
  animation-delay: 0.4s;
}

.animate-pulse:nth-child(6) {
  animation-delay: 0.5s;
}
</style> 