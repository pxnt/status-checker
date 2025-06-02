<template>
  <PageLoader v-if="!isLoaded" />
  <div v-else>
    <component :is="layout" :key="route.path">
      <RouterView v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </RouterView>
    </component>
  </div>
  <!-- Toast Container for global notifications -->
  <ToastContainer />
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { RouterView, useRoute } from 'vue-router';
import Layouts from '~/layouts';
import { useUser } from '@clerk/vue';
import PageLoader from './components/PageLoader.vue';
import { ToastContainer } from '~/components/ui/toast';

const route = useRoute();
const { isLoaded } = useUser();

const layoutName = ref<keyof typeof Layouts>('public');

const layout = computed(() => {
  return Layouts[layoutName.value] || Layouts.public;
});

watch(route, (to) => {
  const newLayout = to.meta.layout as keyof typeof Layouts;

  if (newLayout && newLayout in Layouts) {
    layoutName.value = newLayout;
  }
}, { immediate: true, deep: true });

onMounted(() => {
  layoutName.value = route.meta.layout as keyof typeof Layouts;
});
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>