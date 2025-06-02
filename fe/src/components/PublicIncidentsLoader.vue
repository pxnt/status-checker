<template>
  <div class="space-y-8">
    <!-- Header Section -->
    <div class="flex items-center justify-between">
      <div class="h-8 w-48 bg-gray-200 animate-pulse rounded"></div>
      <div class="h-10 w-64 bg-gray-200 animate-pulse rounded-md"></div>
    </div>

    <!-- Date Groups -->
    <div v-for="i in 3" :key="i" class="space-y-4">
      <!-- Date Header -->
      <div class="h-6 w-32 bg-gray-200 animate-pulse rounded"></div>
      
      <!-- Incident Cards for this date -->
      <div class="space-y-3">
        <div v-for="j in Math.floor(Math.random() * 3) + 1" :key="j" class="bg-white border border-gray-200 rounded-lg p-6">
          <div class="flex items-start justify-between">
            <div class="flex-1 space-y-3">
              <!-- Incident Title -->
              <div class="h-6 w-72 bg-gray-200 animate-pulse rounded"></div>
              <!-- Incident Time -->
              <div class="h-4 w-48 bg-gray-200 animate-pulse rounded"></div>
            </div>
            <!-- Status Badge -->
            <div class="h-6 w-16 bg-gray-200 animate-pulse rounded-full"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty Date Section -->
    <div class="space-y-4">
      <div class="h-6 w-32 bg-gray-200 animate-pulse rounded"></div>
      <div class="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
        <div class="h-4 w-40 bg-gray-200 animate-pulse rounded mx-auto"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No props needed for this loader component
</script> 