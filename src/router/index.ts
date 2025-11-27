import { createRouter, createWebHistory } from 'vue-router'
//import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      component: () => import('../views/IndexView.vue'),
    },
    {
      path: '/ketex',
      name: 'ketex',
      component: () => import('../views/editor/1WangkatexView.vue'),
    },
    {
      path: '/mathjax',
      name: 'mathjax',
      component: () => import('../views/editor/2WangMathJax.vue'),
    },
    {
      path: '/beautiful',
      name: 'beautiful',
      component: () => import('../views/editor/3BeautifulView.vue'),
    },
    {
      path: '/ueditor',
      name: 'ueditor',
      component: () => import('../views/editor/4UeditorView.vue'),
    },
    {
      path: '/mathlive',
      name: 'mathlive',
      component: () => import('../views/editor/5MathliveView.vue'),
    },
    {
      path: '/mathquill',
      name: 'mathquill',
      component: () => import('../views/editor/6MathQuillView.vue'),
    },
    // {
    //   path: '/home',
    //   name: 'home',
    //   component: HomeView,
    // },
    // {
    //   path: '/canvas',
    //   name: 'canvas',
    //   component: () => import('../views/CanvasView.vue'),
    // },
  ],
})

export default router
