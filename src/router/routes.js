import auth from '@/views/auth.vue'
import guestAuth from '@/views/guest-auth.vue'
import home from '@/views/home.vue'

export default [
  {
    path: '/auth',
    name: 'auth',
    component: auth,
    meta: {
      isProtected: false
    }
  },
  {
    path: '/',
    name: 'home',
    component: home,
    meta: {
      isProtected: true
    }
  },
  {
    path: '/kviz',
    name: 'guest-auth',
    component: guestAuth,
    meta: {
      isProtected: false
    }
  }
]
