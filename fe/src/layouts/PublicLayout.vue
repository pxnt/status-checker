<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <!-- Header -->
    <header class="bg-white border-b shadow-sm sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <TopNav />
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t mt-auto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <!-- Company Info -->
          <div class="col-span-1 md:col-span-2">
            <div class="flex items-center space-x-2 mb-4">
              <div class="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Activity class="h-5 w-5 text-white" />
              </div>
              <span class="text-xl font-bold text-gray-900">Status Checker</span>
            </div>
            <p class="text-gray-600 text-sm max-w-md">
              Monitor the status of all your services and applications in real-time. 
              Get instant notifications when issues arise and keep your users informed.
            </p>
            <div class="flex space-x-4 mt-4">
              <a href="#" class="text-gray-400 hover:text-gray-600 transition-colors">
                <Github class="h-5 w-5" />
              </a>
              <a href="#" class="text-gray-400 hover:text-gray-600 transition-colors">
                <Twitter class="h-5 w-5" />
              </a>
              <a href="#" class="text-gray-400 hover:text-gray-600 transition-colors">
                <Linkedin class="h-5 w-5" />
              </a>
            </div>
          </div>

          <!-- Quick Links -->
          <div>
            <h3 class="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Product
            </h3>
            <ul class="space-y-2">
              <li><a href="#" class="text-gray-600 hover:text-gray-900 text-sm transition-colors">Features</a></li>
              <li><a href="#" class="text-gray-600 hover:text-gray-900 text-sm transition-colors">Pricing</a></li>
              <li><a href="#" class="text-gray-600 hover:text-gray-900 text-sm transition-colors">API</a></li>
              <li><a href="#" class="text-gray-600 hover:text-gray-900 text-sm transition-colors">Documentation</a></li>
            </ul>
          </div>

          <!-- Support -->
          <div>
            <h3 class="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Support
            </h3>
            <ul class="space-y-2">
              <li><a href="#" class="text-gray-600 hover:text-gray-900 text-sm transition-colors">Help Center</a></li>
              <li><a href="#" class="text-gray-600 hover:text-gray-900 text-sm transition-colors">Contact Us</a></li>
              <li><a href="#" class="text-gray-600 hover:text-gray-900 text-sm transition-colors">Status</a></li>
              <li><a href="#" class="text-gray-600 hover:text-gray-900 text-sm transition-colors">Updates</a></li>
            </ul>
          </div>
        </div>

        <!-- Bottom Bar -->
        <div class="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p class="text-gray-500 text-sm">
            © {{ currentYear }} Status Checker. All rights reserved.
          </p>
          <div class="flex space-x-6 mt-4 md:mt-0">
            <a href="#" class="text-gray-500 hover:text-gray-900 text-sm transition-colors">Privacy Policy</a>
            <a href="#" class="text-gray-500 hover:text-gray-900 text-sm transition-colors">Terms of Service</a>
            <a href="#" class="text-gray-500 hover:text-gray-900 text-sm transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Activity } from 'lucide-vue-next'
import TopNav from '~/components/TopNav.vue'


// Current year for footer
const currentYear = computed(() => new Date().getFullYear())

</script>

<style scoped>
/* Custom scrollbar for better UX */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}
</style>
