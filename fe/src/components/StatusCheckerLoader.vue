<template>
  <div class="mx-auto px-6 bg-white rounded-lg shadow-sm border">
    <div class="w-full">
      <div class="border-b">
        <!-- Accordion Header Skeleton -->
        <div class="flex items-center justify-between py-4">
          <div class="flex items-center gap-2">
            <div class="w-5 h-5 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-shimmer"></div>
            <div class="w-40 h-6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-shimmer"></div>
          </div>
        </div>
        
        <!-- Accordion Content Skeleton -->
        <div class="pt-4 pb-6">
          <div class="space-y-4">
            <!-- Status Item Skeletons -->
            <div v-for="n in itemCount" :key="n" class="status-item-skeleton" :class="{'border-b': n !== itemCount}">
              <div class="flex items-center justify-between gap-3 mb-2">
                <div class="flex items-center gap-2">
                  <div class="w-4 h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-shimmer"></div>
                  <div class="w-32 h-5 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-shimmer"></div>
                </div>
                <div class="w-20 h-6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-full animate-shimmer"></div>
              </div>
              <div class="w-3/4 h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-shimmer mb-3"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  itemCount?: number
}

const props = withDefaults(defineProps<Props>(), {
  itemCount: 3
})
</script>

<style scoped>
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.animate-shimmer {
  background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.status-item-skeleton:not(:last-child) {
  padding-bottom: 1rem;
  border-bottom: 1px solid #f3f4f6;
}

/* Enhanced shimmer effect with more subtle animation */
.animate-shimmer {
  background: linear-gradient(
    90deg,
    #f8fafc 0%,
    #f1f5f9 20%,
    #e2e8f0 50%,
    #f1f5f9 80%,
    #f8fafc 100%
  );
  background-size: 200% 100%;
  animation: shimmer 2s ease-in-out infinite;
}

/* Pulse animation for variety */
@keyframes pulse-gentle {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

.status-item-skeleton:nth-child(odd) .animate-shimmer {
  animation: shimmer 2s ease-in-out infinite, pulse-gentle 3s ease-in-out infinite;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .status-item-skeleton {
    padding-bottom: 0.75rem;
  }
}
</style> 