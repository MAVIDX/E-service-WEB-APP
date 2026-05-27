import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import LandingPage from '@/views/LandingPage.vue'
import DashboardClient from '@/views/DashboardClient.vue'
import DashboardProfessional from '@/views/DashboardProfessional.vue'
import DashboardAdmin from '@/views/DashboardAdmin.vue'

const routes = [
  {
    path: '/',
    name: 'Landing',
    component: LandingPage,
    meta: { title: 'e-service — Servicios profesionales en Colombia' },
    beforeEnter: () => {
      const auth = localStorage.getItem('isAuthenticated') === 'true'
      const role = localStorage.getItem('userRole')
      if (auth && role) return `/dashboard/${role}`
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { title: 'Iniciar Sesión — e-service' },
  },

  // ── Cliente ────────────────────────────────────────────────
  {
    path: '/dashboard/client',
    name: 'DashboardClient',
    component: DashboardClient,
    meta: { requiresAuth: true, role: 'client', title: 'Panel Cliente — e-service' },
  },

  // ── Profesional ────────────────────────────────────────────
  {
    path: '/dashboard/professional',
    name: 'DashboardProfessional',
    component: DashboardProfessional,
    meta: { requiresAuth: true, role: 'professional', title: 'Panel Profesional — e-service' },
  },

  // ── Admin ──────────────────────────────────────────────────
  {
    path: '/dashboard/admin',
    name: 'DashboardAdmin',
    component: DashboardAdmin,
    meta: { requiresAuth: true, role: 'admin', title: 'Panel Admin — e-service' },
  },

  {
    path: '/dashboard',
    redirect: () => `/dashboard/${localStorage.getItem('userRole') || 'client'}`,
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0 }
  },
})

// ── Navigation Guard ───────────────────────────────────────
router.beforeEach((to, from) => {
  document.title = to.meta.title || 'e-service'

  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
  const userRole        = localStorage.getItem('userRole')

  if (to.meta.requiresAuth && !isAuthenticated) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }

  if (to.meta.requiresAuth && to.meta.role && to.meta.role !== userRole) {
    return `/dashboard/${userRole}`
  }

  if (to.path === '/login' && isAuthenticated) {
    return `/dashboard/${userRole}`
  }

  if (to.meta.role === 'admin') {
    const storedUser    = localStorage.getItem('user')
    const user          = storedUser ? JSON.parse(storedUser) : null
    const isSuperAdmin  = user?.is_super_admin ?? false

    if (to.meta.superAdminOnly && !isSuperAdmin) {
      return { name: 'DashboardAdmin' }
    }

    if (to.meta.module) {
      const perm      = user?.permissions?.[to.meta.module]
      const hasAccess = isSuperAdmin || (perm && (typeof perm === 'boolean' ? perm : perm.enabled === true))
      if (!hasAccess) return { name: 'DashboardAdmin' }
    }
  }
})

router.afterEach((to, from) => {
  if (import.meta.env.DEV) {
    console.log(`[router] ${from.path} → ${to.path}`)
  }
})

export default router
