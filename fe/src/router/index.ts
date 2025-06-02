import { createRouter } from 'vue-router';
import { createWebHistory } from 'vue-router';
import { authGuard } from './guards';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('~/views/Home.vue'),
      meta: {
        layout: 'public'
      }
    },

    // Dashboard routes
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('~/views/Dashboard.vue'),
      meta: {
        layout: 'dashboard'
      },
      beforeEnter: authGuard,
      children: [
        {
          path: ':tab',
          name: 'dashboard-tabs',
          component: () => import('~/views/Dashboard.vue'),
          meta: {
            layout: 'dashboard'
          }
        }
      ]
    },

    // default route
    {
      path: '/login',
      name: 'login',
      redirect: '/',
    }
  ],
});

export default router;