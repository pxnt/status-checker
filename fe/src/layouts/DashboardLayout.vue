<template>
  <div class="min-h-screen bg-background">
    <DashboardSidebar>
      <slot />
    </DashboardSidebar>
  </div>
</template>

<script setup lang="ts">
import DashboardSidebar from '~/components/Dashboard/Sidebar.vue'
</script>
