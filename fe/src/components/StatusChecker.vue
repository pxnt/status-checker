<template>
  <div class="mx-auto px-6 bg-white rounded-lg shadow-sm border">
    <Accordion type="single" collapsible class="w-full">
      <AccordionItem value="StatusChecker" class="border-b">
        <AccordionTrigger class="text-xl font-semibold hover:no-underline">
          <div class="flex items-center gap-2">
            <ChevronRight class="h-5 w-5 transition-transform duration-200" />
            {{ sectionTitle }}
          </div>
        </AccordionTrigger>
        <AccordionContent class="pt-4 pb-6">
          <div class="space-y-4">
            <StatusItem
              v-for="(item, index) in items"
              :key="item.id"
              :title="item.name"
              :description="item.description || ''"
              :status="item.status"
              :icon="Info"
              :class="{'border-b': index !== items.length - 1}"
              @view-details="handleViewDetails(item)"
            />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </div>
</template>

<script setup lang="ts">
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '~/components/ui/accordion'
import StatusItem from './StatusItem.vue'
import { ChevronRight, Info } from 'lucide-vue-next'
import { Component } from '~/types/Component'

interface Props {
  sectionTitle?: string
  items?: Component[]
}

const props = withDefaults(defineProps<Props>(), {
  sectionTitle: '',
  items: () => []
})

const handleViewDetails = (item: Component) => {
  // Emit event or handle navigation
  console.log('View details for:', item.name)
  // You can add custom logic here or emit an event
}
</script>

<style scoped>
/* Custom styling for the chevron rotation */
[data-state="open"] .transition-transform {
  transform: rotate(90deg);
}
</style> 