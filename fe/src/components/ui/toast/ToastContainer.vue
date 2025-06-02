<template>
  <Teleport to="body">
    <div
      aria-live="assertive"
      class="pointer-events-none fixed inset-0 flex items-end justify-center px-4 py-6 sm:items-start sm:justify-end sm:p-6"
      style="z-index: 9999;"
    >
      <div class="flex w-full flex-col items-center space-y-4 sm:items-end">
        <Toast
          v-for="toast in toasts"
          :key="toast.id"
          :toast="toast"
          @close="removeToast(toast.id)"
        />
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useToast } from '~/composables/useToast'
import Toast from './Toast.vue'

const { toasts, removeToast } = useToast()
</script> 