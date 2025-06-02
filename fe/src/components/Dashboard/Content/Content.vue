<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div>
      <h1 class="text-3xl font-bold tracking-tight">Dashboard</h1>
    </div>

    <!-- Service Status Sections -->
    <div class="space-y-4">
      <div v-for="group in $componentsStore.componentGroups" :key="group.id"
        class="mx-auto px-6 bg-white rounded-lg border">
        <Accordion type="single" collapsible class="w-full">
          <AccordionItem :value="group.id.toString()">
            <AccordionTrigger class="hover:no-underline">
              <div class="flex items-center justify-between w-full">
                <h3 class="text-lg font-semibold text-left">{{ group.name }}</h3>
              </div>
            </AccordionTrigger>
            <AccordionContent class="px-6 pb-4">
              <div>
                <ServiceStatusItem 
                v-for="(component, index) in $componentsStore.getComponentsForGroup(group.id)"
                  :key="component.id" 
                  :title="component.name" 
                  :status="component.status" 
                  :class="{'border-b border-gray-200': index !== $componentsStore.getComponentsForGroup(group.id).length - 1}"
                  @status-change="(event) => handleStatusChange(group.id, component.id, event)" />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>

    <!-- Metrics Cards -->
    <div class="grid grid-cols-1 mt-4 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium text-muted-foreground">
            Total Incidents
          </CardTitle>
          <AlertTriangle class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">2</div>
          <p class="text-xs text-muted-foreground">
            Total number of incidents.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium text-muted-foreground">
            Metric Points
          </CardTitle>
          <TrendingUp class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">60</div>
          <p class="text-xs text-muted-foreground">
            Recent metric points.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium text-muted-foreground">
            Total Subscribers
          </CardTitle>
          <Users class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">0</div>
          <p class="text-xs text-muted-foreground">
            Total number of subscribers.
          </p>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import {
  AlertTriangle,
  TrendingUp,
  Users,
} from 'lucide-vue-next'
import ServiceStatusItem from '~/components/Dashboard/ServiceStatusItem.vue'
import { useComponentsStore } from '~/stores/components'
import { ServiceStatus } from '~/types/Status'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '~/components/ui/accordion'


const $componentsStore = useComponentsStore();

function handleStatusChange(component_group_id: number, componentId: number, event: { status: ServiceStatus }) {
  $componentsStore.updateComponent(componentId, {
    status: event.status
  })
}


</script>