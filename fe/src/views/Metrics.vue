<template>
    <div class="py-8">
      <div class="max-w-6xl mx-auto px-4">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Performance Metrics</h1>
          <p class="text-gray-600">Real-time performance data for all services</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div v-for="metric in metrics" :key="metric.name" class="bg-white rounded-lg shadow-sm border p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-medium text-gray-900">{{ metric.name }}</h3>
              <component :is="metric.icon" class="h-5 w-5 text-gray-400" />
            </div>
            <div class="text-3xl font-bold text-blue-600 mb-1">{{ metric.value }}</div>
            <div class="text-sm text-gray-600">{{ metric.unit }}</div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border p-6">
          <div class="text-center py-12">
            <BarChart class="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 class="text-lg font-medium text-gray-900 mb-2">Detailed Analytics</h3>
            <p class="text-gray-600">Charts and graphs will be displayed here.</p>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { BarChart, Clock, Zap, Globe } from 'lucide-vue-next'

const metrics = ref([
  {
    name: 'Response Time',
    value: '245',
    unit: 'ms average',
    icon: Clock
  },
  {
    name: 'Uptime',
    value: '99.9',
    unit: '% this month',
    icon: Zap
  },
  {
    name: 'Global Checks',
    value: '1,247',
    unit: 'checks/hour',
    icon: Globe
  }
])
</script> 