import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/chat',
    name: 'chat',
    component: () => import(/* webpackChunkName: "chat" */ '../views/Chat.vue'),
  },
  {
    path: '/speechcontrol',
    name: 'SpeechControl',
    component: () =>
      import(
        /* webpackChunkName: "SpeechControl" */ '../views/SpeechControl.vue'
      ),
  },
  {
    path: '/live2d',
    name: 'Live2d',
    component: () =>
      import(/* webpackChunkName: "Live2d" */ '../views/Live2d.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
