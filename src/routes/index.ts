// Third-party
import { createWebHistory, createRouter } from 'vue-router'

export const routes = [
  {
    path: '/',
    name: 'Index',
    component: () => import('@/pages/Index.vue'),
    meta: {
      title: 'Home',
      icon: 'tabler:home',
    },
  },
  {
    path: '/data-table-demo',
    name: 'DataTableDemo',
    component: () => import('@/pages/DataTableDemo.vue'),
    meta: {
      title: 'Data Table',
      icon: 'tabler:table',
    },
  },
  {
    path: '/card-list-demo',
    name: 'CardListDemo',
    component: () => import('@/pages/CardListDemo.vue'),
    meta: {
      title: 'Card List',
      icon: 'tabler:layout-list',
    },
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
