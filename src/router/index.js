import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/search/:searchText',
      redirect: (to) => {
        return { path: '/search', query: { q: to.params.searchText } }
      }
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('../views/CatalogueView.vue')
    }
    //{
    //  path: '/about',
    //  name: 'about',
    //  component: () => import('../views/AboutView.vue')
    //}
  ]
})

export default router
