<template>
  <div>
    <!-- Status Preview Section -->
    <section class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Live Status Dashboard
          </h2>
          <p class="text-xl text-gray-600">
            See how your services are performing right now
          </p>
        </div>

        <div class="max-w-4xl mx-auto space-y-4">
          <!-- Show loaders while data is loading -->
          <StatusCheckerLoader 
            v-if="isLoadingComponentGroups" 
            :item-count="4"
          />          
          <!-- Show actual data when loaded -->
          <template v-else>
            <StatusChecker 
              v-for="group in $componentsStore.publicComponentGroups"
              :key="group.id"
              :section-title="group.name"
              :items="$componentsStore.getPublicComponentsForGroup(group.id)" 
            />
          </template>
        </div>
      </div>
    </section>

    <!-- Incidents Section -->
    <PublicIncidents />


  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import StatusChecker from '~/components/StatusChecker.vue'
import StatusCheckerLoader from '~/components/StatusCheckerLoader.vue'
import PublicIncidents from '~/components/PublicIncidents.vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthentication } from '~/composables/useAuthentication'
import { useComponentsStore } from '~/stores/components'
import { useLiveStatus } from '~/composables/useLiveStatus'

const $route = useRoute()
const $router = useRouter()
const $componentsStore = useComponentsStore()
const { handleLoginRedirection } = useAuthentication()

const { initializeSocketListeners, cleanupSocketListeners } = useLiveStatus();

const isLoadingComponentGroups = ref(true)

onMounted(() => {
  initializeSocketListeners();
  // Load initial data if not already loaded
  if ($componentsStore.publicComponentGroups.length === 0) {
    $componentsStore.listPublicComponentGroups().finally(() => {
      isLoadingComponentGroups.value = false
    })
  } else {
    isLoadingComponentGroups.value = false
  }

  // Handle login redirection
  const login_redirect = $route.query.login_redirect as string;
  if (login_redirect) {
    handleLoginRedirection(login_redirect)
  }
  $router.replace('/')
})

onUnmounted(() => {
  // Clean up socket listeners when component is unmounted
  cleanupSocketListeners()
})
</script> 