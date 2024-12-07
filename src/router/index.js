import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import routes from './routes'

import authMiddleware from './middlewares/auth.middleware'

const router = createRouter({
  history: import.meta.env.MODE === 'production' ? createWebHistory() : createWebHashHistory(),
  routes
})

router.beforeEach(authMiddleware)

export default router
