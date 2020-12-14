import Vue from 'vue'
import VueRouter from 'vue-router'
import MyBlog from '../views/MyBlog.vue'
import PerBasicInfor from '../views/PerBasicInfor.vue'
import PerFriendsList from '../views/PerFriendsList.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'MyBlog',
    component: MyBlog
  },
  {
    path: '/PersonInformation',
    name: 'PersonInformation',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/PersonInformation.vue'),
    children:[
      {
        path:'/PersonInformation/',
        name: 'PerBasicInfor',
        component:PerBasicInfor
      },
      {
        path: '/PersonInformation/PerFriendsList',
        name: 'PerFriendsList',
        component:PerFriendsList
      }
    ]
  },
  {
    path: '/Friends',
    name: 'Friends',
    component: ()=>import('../views/Friends.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
