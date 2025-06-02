<template>
  <header>
    <div class="flex justify-between items-center h-16">
      <!-- Logo/Brand -->
      <div class="flex items-center">
        <router-link to="/" class="flex items-center space-x-2">
          <div class="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Activity class="h-5 w-5 text-white" />
          </div>
          <span class="text-xl font-bold text-gray-900">Status Checker</span>
        </router-link>
      </div>
      <!-- Desktop Navigation -->
      <nav class="hidden md:flex items-center space-x-8">
        <router-link v-for="item in navigationItems" :key="item.name" :to="item.href"
          class="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
          :class="{ 'text-blue-600 font-semibold': $route.path === item.href }">
          {{ item.name }}
        </router-link>
      </nav>

      <!-- Mobile menu button -->
      <div class="md:hidden">
        <Button variant="ghost" size="sm" @click="mobileMenuOpen = !mobileMenuOpen">
          <Menu class="h-5 w-5" />
        </Button>
      </div>

      <div>
        <SignedOut>
          <div class="flex items-center space-x-3 !cursor-pointer">
            <div class="flex items-center space-x-2">
              <User class="h-5 w-5 text-gray-600" />
            </div>
            <SignInButton />
          </div>
        </SignedOut>
        <SignedIn>
          <div class="flex items-center space-x-3">
            <span class="uppercase font-bold text-gray-600">
              Welcome, {{ username }}
            </span>
            <OrganizationSwitcher />
            <UserButton />
          </div>
        </SignedIn>
      </div>
    </div>

    <!-- Mobile Navigation -->
    <div v-if="mobileMenuOpen" class="md:hidden border-t border-gray-200 py-4">
      <nav class="flex flex-col space-y-2">
        <router-link v-for="item in navigationItems" :key="item.name" :to="item.href"
          class="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors block"
          :class="{ 'text-blue-600 font-semibold': $route.path === item.href }" @click="mobileMenuOpen = false">
          {{ item.name }}
        </router-link>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { Button } from '~/components/ui/button'
import { Activity, Menu, User } from 'lucide-vue-next'
import { OrganizationSwitcher, SignedIn, SignedOut, SignInButton, UserButton, useUser } from '@clerk/vue'

const route = useRoute()
const { user } = useUser()

const navigationItems = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Status', href: '/status' },
  { name: 'Incidents', href: '/incidents' },
  { name: 'Metrics', href: '/metrics' },
]

const mobileMenuOpen = ref(false)

const username = computed(() => {
  const email = user.value?.primaryEmailAddress?.emailAddress
  return email ? email.slice(0, email.indexOf('@')) : 'U'
})

watch(route, () => {
  mobileMenuOpen.value = false
})
</script>