<template>
  <div class="min-h-screen bg-background">
    <SidebarProvider>
      <Sidebar variant="inset">
        <SidebarHeader>
          <router-link to="/">
            <div class="flex items-center gap-2 px-4 py-2">
              <div class="h-8 w-8 rounded bg-green-600 flex items-center justify-center">
                <div class="h-3 w-3 rounded-full bg-white"></div>
              </div>
              <span class="text-lg font-semibold">StatusChecker</span>
            </div>
          </router-link>
        </SidebarHeader>

        <SidebarContent class="mt-4">
          <SidebarMenu>
            <SidebarMenuItem v-for="item in navigationItems" :key="item.title">
              <router-link :to="item.route" class="flex items-center gap-2">
                <SidebarMenuButton :is-active="item.isActive">
                  <component :is="item.icon" class="h-4 w-4" />
                  <span>{{ item.title }}</span>
                  <SidebarMenuBadge v-if="item.badge" class="ml-auto">
                    {{ item.badge }}
                  </SidebarMenuBadge>
                </SidebarMenuButton>
              </router-link>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>

      <SidebarInset>
        <header
          class="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div class="flex h-16 items-center gap-4 px-6">
            <SidebarTrigger class="-ml-1" />
            <div class="ml-auto flex items-center gap-6">
              <Button variant="outline" size="sm">
                New Incident
              </Button>
              <SignedIn>
                <div class="flex items-center space-x-3">
                  <span class="uppercase font-bold text-gray-600">
                    Welcome, {{ username }}
                  </span>
                  <OrganizationSwitcher :after-select-organization-url="currentUrl" />
                  <UserButton />
                </div>
              </SignedIn>
            </div>
          </div>
        </header>
        <main class="flex-1 p-6">
          <slot />
        </main>
      </SidebarInset>
    </SidebarProvider>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import {
  Sidebar,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuBadge,
  SidebarHeader,
} from '~/components/ui/sidebar'
import { Button } from '~/components/ui/button'
import {
  BarChart3,
  Shield,
  AlertTriangle,
  ComponentIcon
} from 'lucide-vue-next'
import { useComponentsStore } from '~/stores/components'
import { SignedIn, UserButton, OrganizationSwitcher, useUser, useOrganization } from '@clerk/vue'

const $route = useRoute()
const { user } = useUser()
const { organization } = useOrganization()
const $componentsStore = useComponentsStore()

const username = computed(() => {
  const email = user.value?.primaryEmailAddress?.emailAddress
  return email ? email.slice(0, email.indexOf('@')) : 'U'
})

const currentUrl = computed(() => {
  return typeof window !== 'undefined' ? window.location.href : ''
})

// Watch for organization changes and reload the page
watch(() => organization.value?.id, (newOrgId, oldOrgId) => {
    if (newOrgId !== oldOrgId) {
      if (typeof window !== 'undefined') {
        window.location.reload()
      }
    }
  },
  { immediate: true }
)

// Navigation items
const navigationItems = computed(() => [
  {
    title: "Dashboard",
    icon: BarChart3,
    route: "/dashboard",
    isActive: !$route.params.tab
  },
  {
    title: "Component Groups",
    icon: ComponentIcon,
    route: "/dashboard/component-groups",
    badge: $componentsStore.componentGroups.length,
    isActive: $route.params.tab === 'component-groups'
  },
  {
    title: "Components",
    icon: Shield,
    route: "/dashboard/components",
    badge: $componentsStore.components.length,
    isActive: $route.params.tab === 'components'
  },
  {
    title: "Incidents",
    icon: AlertTriangle,
    route: "/dashboard/incidents",
    badge: "0",
    isActive: $route.params.tab === 'incidents'
  },
]);
</script>
