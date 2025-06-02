<template>
    <div class="py-8">
      <div class="max-w-6xl mx-auto px-4">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Incident History</h1>
          <p class="text-gray-600">Past incidents and their resolutions</p>
        </div>
        
        <div class="bg-white rounded-lg shadow-sm border p-6">
          <div class="text-center py-12">
            <AlertTriangle class="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 class="text-lg font-medium text-gray-900 mb-2">No incidents to display</h3>
            <p class="text-gray-600">All systems are running normally.</p>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { AlertTriangle } from 'lucide-vue-next'
</script> 