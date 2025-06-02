import { Component, defineAsyncComponent } from 'vue';

type LayoutType = 'public' | 'dashboard';

const Layouts: Record<LayoutType, ReturnType<typeof defineAsyncComponent<Component>>> = {
  public: defineAsyncComponent(() => import('~/layouts/PublicLayout.vue')),
  dashboard: defineAsyncComponent(() => import('~/layouts/DashboardLayout.vue'))
}

export default Layouts;