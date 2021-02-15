import Vue from 'vue'
import VueRouter from 'vue-router'
import home from '../views/home.vue'
import fileList from '../views/fileList.vue'
import songsQuery from '../views/songsQuery.vue'
import finish from '../views/finish.vue'
import callback from '../views/callback.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: home
  },
  {
    path: '/fileList',
    name: 'fileList',
    component: fileList
  },
  {
    path: '/songsQuery',
    name: 'songsQuery',
    component: songsQuery
  },
  {
    path: '/finish',
    name: 'finish',
    component: finish
  },
  {
    path: '/callback',
    name: 'callback',
    component: callback
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
