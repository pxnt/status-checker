<template>
  <div>
    <component :is="componentToRender" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useComponentsStore } from '~/stores/components'
import Content from '~/components/Dashboard/Content/Content.vue'
import Components from '~/components/Dashboard/Content/Components.vue'
import ComponentGroups from '~/components/Dashboard/Content/ComponentGroups.vue'
import Incidents from '~/components/Dashboard/Content/Incidents.vue'

const $route = useRoute()
const $componentsStore = useComponentsStore()


const componentToRender = computed(() => {
  switch ($route.params.tab) {
    case 'components':
      return Components;
    case 'component-groups':
      return ComponentGroups;
    case 'incidents':
      return Incidents;
    default:
      return Content;
  }
})

onMounted(() => {
  if ($componentsStore.componentGroups.length === 0) {
    $componentsStore.getComponentGroups()
  }
})

</script> 