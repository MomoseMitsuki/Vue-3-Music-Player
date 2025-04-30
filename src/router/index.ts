import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: () => import('@/views/PlayerIndex.vue') },
    { path: '/default', component: () => import('@/views/PlayerSong.vue') },
    { path: '/love', component: () => import('@/views/PlayerSong.vue') },
    { path: '/video', component: () => import('@/views/PlayerVideo.vue') },
    { path: '/lyric', component: () => import('@/views/PlayerLyric.vue') },
    { path: '/list:id(\\d+)', component: () => import('@/views/PlayerSong.vue') },
  ],
})

export default router
