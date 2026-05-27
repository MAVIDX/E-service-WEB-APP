<template>
  <div class="flex h-full overflow-hidden">

    <!-- Sidebar (dark teal) — hidden on mobile -->
    <div class="hidden md:flex-shrink-0 md:block md:w-56 h-full" style="background:#0d4f5c">
      <AppSidebar :items="navItems" :activePage="page" :dark="true" @navigate="page = $event" @logout="authStore.logout()" />
    </div>

    <!-- Mobile sidebar drawer -->
    <Teleport to="body">
      <Transition name="adm-drawer">
        <div v-if="mobileAdminSidebarOpen" class="fixed inset-0 z-50 flex md:hidden">
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="mobileAdminSidebarOpen = false" />
          <div class="relative w-64 max-w-[85vw] h-full shadow-2xl flex flex-col overflow-hidden" style="background:#0d4f5c">
            <AppSidebar :items="navItems" :activePage="page" :dark="true" :showClose="true"
              @navigate="page = $event; mobileAdminSidebarOpen = false"
              @logout="authStore.logout()"
              @closeMobile="mobileAdminSidebarOpen = false" />
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Main area -->
    <div :class="['flex-1 overflow-hidden flex flex-col adp-root', isDark ? 'bg-[#0f172a]' : 'bg-[#f0f4f8]']">

      <!-- Top bar -->
      <div :class="['flex-shrink-0 flex items-center justify-between px-4 md:px-8 py-3 md:py-4 border-b', isDark ? 'bg-[#1e293b] border-white/8' : 'bg-white border-slate-100']">
        <div class="flex items-center gap-3">
          <h2 class="text-[15px] md:text-lg font-black text-[#0f172a] truncate">{{ pageTitle }}</h2>
        </div>
        <div class="flex items-center gap-2 md:gap-3">
          <!-- Tema toggle -->
          <button @click="themeStore.toggle()"
            :class="['w-9 h-9 rounded-xl flex items-center justify-center transition text-sm', isDark ? 'bg-white/10 hover:bg-white/15' : 'bg-slate-50 hover:bg-slate-100 border border-slate-200']">
            {{ isDark ? '☀️' : '🌙' }}
          </button>
          <button class="hidden sm:flex items-center gap-2 border border-slate-200 text-[13px] text-slate-600 font-semibold px-4 py-2 rounded-xl hover:bg-slate-50 transition">
            <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="11" y2="11"/></svg>
            Hoy, 15 de mayo ▾
          </button>
          <div class="hidden sm:flex items-center gap-2.5 cursor-pointer">
            <div class="w-8 h-8 rounded-full bg-[#0d4f5c] flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="white" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <div>
              <p class="text-[13px] font-bold text-[#0f172a] leading-tight">{{ adminName }}</p>
              <p class="text-[10px] text-slate-400">Super Admin ▾</p>
            </div>
          </div>
          <!-- Cerrar sesión (solo mobile) -->
          <button @click="authStore.logout()" title="Cerrar sesión"
            class="md:hidden w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center hover:bg-red-100 transition flex-shrink-0">
            <svg viewBox="0 0 24 24" class="w-[17px] h-[17px] text-red-500" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto p-3 pb-20 md:p-6 space-y-4 md:space-y-6">

        <!-- ===== DASHBOARD ===== -->
        <template v-if="page === 'Panel de administración'">

          <!-- ── Alertas pendientes ── -->
          <div v-if="pendingAlerts.length" class="space-y-2">
            <div v-for="alert in pendingAlerts" :key="alert.message"
              :class="['flex items-center gap-4 px-5 py-3.5 rounded-2xl border', alertBg(alert.type)]">
              <!-- Icono -->
              <div :class="['flex-shrink-0', alertIconColor(alert.type)]">
                <svg v-if="alert.type === 'warning'" viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/>
                </svg>
                <svg v-else-if="alert.type === 'info'" viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>
                </svg>
                <svg v-else viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>
                </svg>
              </div>
              <!-- Mensaje -->
              <span :class="['flex-1 text-center text-[13px] font-bold', alertTextColor(alert.type)]">
                {{ alert.message }}
              </span>
              <!-- Acción -->
              <button @click="page = alert.navigate"
                :class="['px-4 py-1.5 rounded-xl text-[12px] font-bold border bg-white/60 hover:bg-white transition flex-shrink-0', alertBtnClass(alert.type)]">
                {{ alert.action }} →
              </button>
            </div>
          </div>

          <!-- 6 stat cards -->
          <div class="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
            <StatCard v-for="s in stats" :key="s.label" v-bind="s" :dark="isDark" />
          </div>

          <!-- 4 charts 2x2 -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">

            <!-- Chart 1: Multi-series line (Gráfico de usuarios) -->
            <div class="bg-white border border-slate-100 rounded-2xl p-5">
              <div class="flex items-center justify-between mb-3">
                <span class="font-black text-[#0f172a] text-[14px]">Gráfico de usuarios</span>
              </div>
              <div class="flex items-center gap-4 mb-3">
                <span v-for="s in userSeries" :key="s.label" class="flex items-center gap-1.5 text-[11px] font-semibold" :style="{color: s.color}">
                  <span class="w-2 h-2 rounded-full" :style="{background: s.color}"></span> {{ s.label }}
                </span>
              </div>
              <svg viewBox="0 0 560 180" class="w-full" style="height:180px" preserveAspectRatio="none">
                <!-- Grid -->
                <line v-for="(gy,i) in uGridY" :key="i" x1="40" x2="550" :y1="gy" :y2="gy" stroke="#f1f5f9" stroke-width="1"/>
                <text v-for="(lbl,i) in ['8k','6k','4k','2k','0']" :key="i" :x="36" :y="uGridY[i]+4" text-anchor="end" fill="#94a3b8" font-size="10">{{ lbl }}</text>
                <!-- Series lines -->
                <path v-for="s in userSeries" :key="s.label" :d="s.path" fill="none" :stroke="s.color" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <template v-for="s in userSeries" :key="s.label">
                  <circle v-for="(pt,i) in s.pts" :key="s.label+i" :cx="pt.x" :cy="pt.y" r="3.5" :fill="s.color" stroke="white" stroke-width="1.5" />
                </template>
                <!-- X labels -->
                <text v-for="(lbl,i) in uXLabels" :key="i" :x="uPts(userSeries[0].data,i).x" y="175" text-anchor="middle" fill="#94a3b8" font-size="10">{{ lbl }}</text>
              </svg>
            </div>

            <!-- Chart 2: Donut (Distribución de servicios) -->
            <div class="bg-white border border-slate-100 rounded-2xl p-5">
              <span class="font-black text-[#0f172a] text-[14px] block mb-4">Distribución de servicios</span>
              <div class="flex items-center gap-6">
                <div class="relative flex-shrink-0" style="width:140px;height:140px">
                  <svg viewBox="0 0 140 140" class="w-full h-full" style="transform:rotate(-90deg)">
                    <circle cx="70" cy="70" r="50" fill="none" stroke="#f1f5f9" stroke-width="22" />
                    <circle v-for="seg in donut1" :key="seg.label" cx="70" cy="70" r="50" fill="none"
                      :stroke="seg.color" stroke-width="22"
                      :stroke-dasharray="`${seg.dash} ${314 - seg.dash}`"
                      :stroke-dashoffset="`-${seg.offset}`" />
                  </svg>
                  <div class="absolute inset-0 flex flex-col items-center justify-center">
                    <p class="text-xl font-black text-[#0f172a]">{{ dashRaw.totalServices.toLocaleString('es-CO') }}</p>
                    <p class="text-[11px] text-slate-400">Total</p>
                  </div>
                </div>
                <div class="flex-1 space-y-2">
                  <div v-for="seg in donut1" :key="seg.label" class="flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded-full flex-shrink-0" :style="{background: seg.color}"></span>
                    <span class="text-[12px] text-slate-600 flex-1">{{ seg.label }}</span>
                    <span class="text-[12px] font-bold text-[#0f172a]">{{ seg.pct }}%</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Chart 3: Bar (Ingresos últimos 7 días) -->
            <div class="bg-white border border-slate-100 rounded-2xl p-5">
              <span class="font-black text-[#0f172a] text-[14px] block mb-3">Ingresos (últimos 7 días)</span>
              <svg viewBox="0 0 560 180" class="w-full" style="height:180px" preserveAspectRatio="none">
                <!-- Grid -->
                <line v-for="(gy,i) in barGridY" :key="i" x1="44" x2="550" :y1="gy" :y2="gy" stroke="#f1f5f9" stroke-width="1"/>
                <text v-for="(lbl,i) in ['$40M','$30M','$20M','$10M','$0']" :key="i" :x="40" :y="barGridY[i]+4" text-anchor="end" fill="#94a3b8" font-size="10">{{ lbl }}</text>
                <!-- Bars -->
                <rect v-for="(b,i) in barItems" :key="i"
                  :x="b.x - 20" :y="b.y" width="40" :height="160 - b.y"
                  rx="5" fill="#2563ff" opacity="0.9" />
                <!-- X labels -->
                <text v-for="(b,i) in barItems" :key="i" :x="b.x" y="175" text-anchor="middle" fill="#94a3b8" font-size="10">{{ b.label }}</text>
              </svg>
            </div>

            <!-- Chart 4: Donut (Solicitudes por estado) -->
            <div class="bg-white border border-slate-100 rounded-2xl p-5">
              <span class="font-black text-[#0f172a] text-[14px] block mb-4">Solicitudes por estado</span>
              <div class="flex items-center gap-6">
                <div class="relative flex-shrink-0" style="width:140px;height:140px">
                  <svg viewBox="0 0 140 140" class="w-full h-full" style="transform:rotate(-90deg)">
                    <circle cx="70" cy="70" r="50" fill="none" stroke="#f1f5f9" stroke-width="22" />
                    <circle v-for="seg in donut2" :key="seg.label" cx="70" cy="70" r="50" fill="none"
                      :stroke="seg.color" stroke-width="22"
                      :stroke-dasharray="`${seg.dash} ${314 - seg.dash}`"
                      :stroke-dashoffset="`-${seg.offset}`" />
                  </svg>
                  <div class="absolute inset-0 flex flex-col items-center justify-center">
                    <p class="text-xl font-black text-[#0f172a]">{{ dashRaw.totalRequests.toLocaleString('es-CO') }}</p>
                    <p class="text-[11px] text-slate-400">Total</p>
                  </div>
                </div>
                <div class="flex-1 space-y-2">
                  <div v-for="seg in donut2" :key="seg.label" class="flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded-full flex-shrink-0" :style="{background: seg.color}"></span>
                    <span class="text-[12px] text-slate-600 flex-1">{{ seg.label }}</span>
                    <span class="text-[12px] font-bold text-[#0f172a]">{{ seg.pct }}%</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </template>

        <!-- ===== USUARIOS ===== -->
        <template v-else-if="page === 'Usuarios'">
          <AdminUsers />
        </template>


        <!-- ===== PAGOS ===== -->
        <template v-else-if="page === 'Pagos'">
          <AdminPayments />
        </template>

        <!-- ===== SERVICIOS EN VIVO ===== -->
        <template v-else-if="page === 'Servicios en Vivo'">
          <AdminLiveServices />
        </template>

        <!-- ===== AUDITORÍA ===== -->
        <template v-else-if="page === 'Auditoría'">
          <AdminLogs />
        </template>

        <!-- ===== CATEGORÍAS ===== -->
        <template v-else-if="page === 'Categorías'">
          <AdminCategories />
        </template>

        <!-- ===== SUB-ADMINS ===== -->
        <template v-else-if="page === 'Administradores'">
          <AdminSubAdmins />
        </template>

        <!-- ===== REPORTES ===== -->
        <template v-else-if="page === 'Reportes'">
          <AdminReports />
        </template>

        <!-- ===== CONFIGURACIÓN ===== -->
        <template v-else-if="page === 'Configuración'">
          <AdminSettings />
        </template>

        <!-- ===== SOPORTE ===== -->
        <template v-else-if="page === 'Soporte'">
          <AdminSupport />
        </template>

        <!-- Fallback genérico -->
        <template v-else>
          <div class="flex flex-col items-center justify-center py-20 text-slate-300">
            <span class="text-5xl mb-4">🚧</span>
            <p class="text-lg font-bold text-slate-400">{{ page }}</p>
            <p class="text-sm mt-1">Sección en construcción</p>
          </div>
        </template>

      </div>

      <!-- Mobile Bottom Tab Bar — todos los menús con scroll horizontal -->
      <nav class="md:hidden flex-shrink-0 bg-white border-t border-slate-100" style="padding-bottom:env(safe-area-inset-bottom,0px)">
        <div class="flex overflow-x-auto" style="scrollbar-width:none;-ms-overflow-style:none">
          <button v-for="item in navItems.filter(i => !i.divider)" :key="item.name"
            @click="page = item.name"
            :class="['flex-shrink-0 flex flex-col items-center gap-0.5 pt-2 pb-1.5 px-3 min-w-[62px] transition-colors',
              page === item.name ? 'text-[#0d4f5c]' : 'text-slate-400']">
            <div :class="['relative w-10 h-8 rounded-xl flex items-center justify-center transition-colors',
              page === item.name ? 'bg-teal-50' : '']">
              <svg viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" v-html="item.iconSvg"/>
              <span v-if="item.badge" class="absolute -top-1 -right-1 min-w-[14px] h-3.5 px-0.5 bg-red-500 text-white text-[8px] font-black rounded-full flex items-center justify-center leading-none">{{ item.badge > 9 ? '9+' : item.badge }}</span>
            </div>
            <span class="text-[10px] font-bold whitespace-nowrap">{{ item.label ?? item.name }}</span>
          </button>
        </div>
      </nav>
    </div>
  </div>

  <Teleport to="body">
    <!-- Toast -->
    <div class="fixed top-4 right-4 z-[200] flex flex-col gap-2 pointer-events-none">
      <div v-for="t in toasts" :key="t.id"
        :class="['flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg text-[13px] font-semibold pointer-events-auto min-w-[260px]',
          t.type === 'success' ? 'bg-emerald-600 text-white' :
          t.type === 'error'   ? 'bg-red-600 text-white' : 'bg-[#0f172a] text-white']">
        <span>{{ t.type === 'success' ? '✓' : t.type === 'error' ? '✕' : 'ℹ' }}</span>
        <span class="flex-1">{{ t.message }}</span>
        <button @click="removeToast(t.id)" class="opacity-70 hover:opacity-100">×</button>
      </div>
    </div>

    <!-- Category Modal → movido a AdminCategories.vue -->
    <!-- Sub-admin Modal → movido a AdminSubAdmins.vue -->
    <!-- Service Modal  → movido a AdminServices.vue -->
  </Teleport>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .2s ease }
.fade-enter-from, .fade-leave-to       { opacity: 0 }

/* Admin mobile drawer animation */
.adm-drawer-enter-active { transition: opacity .25s ease }
.adm-drawer-leave-active { transition: opacity .2s ease }
.adm-drawer-enter-from, .adm-drawer-leave-to { opacity: 0 }
.adm-drawer-enter-active > div:last-child { transition: transform .25s ease }
.adm-drawer-leave-active > div:last-child { transition: transform .2s ease }
.adm-drawer-enter-from > div:last-child, .adm-drawer-leave-to > div:last-child { transform: translateX(-100%) }
</style>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'
import api from '@/services/api'
import AppSidebar from '../components/AppSidebar.vue'
import StatCard   from '../components/StatCard.vue'
import AdminSettings    from './admin/AdminSettings.vue'
import AdminCategories  from './admin/AdminCategories.vue'
import AdminSubAdmins   from './admin/AdminSubAdmins.vue'
import AdminUsers       from './admin/AdminUsers.vue'
import AdminPayments      from './admin/AdminPayments.vue'
import AdminLiveServices  from './admin/AdminLiveServices.vue'
import AdminLogs          from './admin/AdminLogs.vue'
import AdminReports       from './admin/AdminReports.vue'
import AdminSupport       from './admin/AdminSupport.vue'
import { useAdminToast } from './admin/useAdminToast'

const authStore  = useAuthStore()
const themeStore = useThemeStore()
const isDark     = computed(() => themeStore.isDark)
const adminName = computed(() => authStore.user?.name ?? 'Administrador')

// ─── Toast (composable compartido con los sub-componentes) ────────────────────
const { toasts, showToast, removeToast } = useAdminToast()

const page = ref('Panel de administración')
const mobileAdminSidebarOpen = ref(false)

const pageTitle = computed(() => page.value)

const SVG = {
  home:  `<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>`,
  users: `<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>`,
  uchk:  `<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/>`,
  grid:  `<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>`,
  trend: `<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>`,
  clip:  `<rect width="8" height="4" x="8" y="2" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/>`,
  card:  `<rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>`,
  bar:   `<line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/>`,
  set:   `<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>`,
  supp:  `<path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>`,
}

const navItems = [
  { name:'Panel de administración', label:'Panel admin',  iconSvg: SVG.home  },
  { divider: true },
  { name:'Usuarios',      label:'Usuarios',   iconSvg: SVG.users },
  { name:'Categorías',    label:'Categorías', iconSvg: `<path d="M4 20h4a2 2 0 0 0 2-2V4H4v14a2 2 0 0 0 0 4zm16-16H12v12h8V4z"/>` },
  { divider: true },
  { name:'Pagos',             label:'Pagos',    iconSvg: SVG.card  },
  { name:'Servicios en Vivo', label:'En Vivo',  iconSvg: `<circle cx="12" cy="12" r="2"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"/>` },
  { name:'Administradores', label:'Admins',   iconSvg: `<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>` },
  { name:'Auditoría',       label:'Auditoría',iconSvg: `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>` },
  { name:'Reportes',        label:'Reportes', iconSvg: SVG.bar   },
  { divider: true },
  { name:'Configuración', label:'Ajustes', iconSvg: SVG.set   },
  { name:'Soporte',       label:'Soporte',  iconSvg: SVG.supp  },
]

// ─── Dashboard real API ───────────────────────────────────────────────────────
const dashLoading = ref(false)
const dashRaw = ref({
  totalUsers: 0, totalClients: 0, totalProfessionals: 0,
  activeUsers: 0, inactiveUsers: 0, pendingProfessionals: 0,
  totalRequests: 0, pendingRequests: 0, acceptedRequests: 0,
  completedRequests: 0, cancelledRequests: 0, todayRequests: 0,
  totalCollected: 0, totalServices: 0,
})

const formatCOP = (v) =>
  '$' + Number(v || 0).toLocaleString('es-CO', { maximumFractionDigits: 0 })

const catColors = ['#2563ff','#10b981','#f43f5e','#7c3aed','#f59e0b','#0891b2','#ec4899','#84cc16']
const categoriesChartData = ref([])

const fetchDashStats = async () => {
  dashLoading.value = true
  try {
    const [statsRes, catRes] = await Promise.allSettled([
      api.get('/admin/stats'),
      api.get('/admin/categories'),
    ])

    // Stats
    if (statsRes.status === 'fulfilled') {
      const s = statsRes.value.data.stats ?? statsRes.value.data
      const n = (...keys) => { for (const k of keys) if (s[k] != null) return Number(s[k]); return 0 }
      Object.assign(dashRaw.value, {
        totalUsers:           n('totalUsers',           'total_users',           'users'),
        totalClients:         n('totalClients',         'total_clients',         'clients'),
        totalProfessionals:   n('totalProfessionals',   'total_professionals',   'professionals'),
        activeUsers:          n('activeUsers',           'active_users',          'active'),
        inactiveUsers:        n('inactiveUsers',         'inactive_users',        'inactive'),
        pendingProfessionals: n('pendingProfessionals',  'pending_professionals'),
        totalRequests:        n('totalRequests',         'total_requests',        'requests'),
        pendingRequests:      n('pendingRequests',       'pending_requests'),
        acceptedRequests:     n('acceptedRequests',      'accepted_requests'),
        completedRequests:    n('completedRequests',     'completed_requests'),
        cancelledRequests:    n('cancelledRequests',     'cancelled_requests'),
        todayRequests:        n('todayRequests',         'today_requests',        'requests_today'),
        totalCollected:       n('totalCollected',        'total_collected',       'revenue_total', 'collected'),
        totalServices:        n('totalServices',         'total_services',        'services'),
      })
    }

    // Categorías para donut1
    if (catRes.status === 'fulfilled') {
      const cats = (catRes.value.data.categories ?? catRes.value.data ?? [])
        .map((c, i) => ({
          label: c.name,
          value: Array.isArray(c.services) ? c.services.length : (c.services_count ?? 0),
          color: catColors[i % catColors.length],
        }))
        .filter(c => c.value > 0)
        .sort((a, b) => b.value - a.value)
      categoriesChartData.value = cats
    }
  } catch { /* usa 0s */ }
  finally { dashLoading.value = false }
}

const stats = computed(() => [
  { label:'Usuarios totales',     value: dashRaw.value.totalUsers.toLocaleString('es-CO'),         iconSvg: SVG.users, iconBg:'bg-blue-50',    iconColor:'#2563ff' },
  { label:'Profesionales',        value: dashRaw.value.totalProfessionals.toLocaleString('es-CO'),  iconSvg: SVG.uchk,  iconBg:'bg-purple-50',  iconColor:'#7c3aed' },
  { label:'Servicios publicados', value: dashRaw.value.totalServices.toLocaleString('es-CO'),       iconSvg: SVG.grid,  iconBg:'bg-teal-50',    iconColor:'#0891b2' },
  { label:'Total recaudado',      value: formatCOP(dashRaw.value.totalCollected),                    iconSvg: SVG.trend, iconBg:'bg-emerald-50', iconColor:'#10b981' },
  { label:'Solicitudes hoy',      value: dashRaw.value.todayRequests.toLocaleString('es-CO'),       iconSvg: SVG.clip,  iconBg:'bg-amber-50',   iconColor:'#f59e0b' },
  { label:'Servicios en curso',   value: dashRaw.value.acceptedRequests.toLocaleString('es-CO'),    iconSvg: SVG.card,  iconBg:'bg-blue-50',    iconColor:'#2563ff' },
])

// ─── Chart helpers ───────────────────────────────────────────────
// Shared point calculator
const uLP = 44, uTP = 20, uW = 506, uH = 130, uYMax = 8000
function uPts(data, idx) {
  return { x: uLP + (idx / (data.length - 1)) * uW, y: uTP + (1 - data[idx] / uYMax) * uH }
}

const uXLabels = ['9 May','10 May','11 May','12 May','13 May','14 May','15 May']
const uGridY   = [20, 52, 85, 117, 150]

const userData = {
  nuevos:    [2000, 2800, 3200, 3500, 4800, 6200, 7500],
  activos:   [4000, 4800, 4200, 5300, 5800, 4900, 6300],
  inactivos: [500,  800,  1500, 2000, 2500, 2800, 3800],
}

function makePath(data) {
  return data.map((v, i) => {
    const p = uPts(data, i)
    return `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`
  }).join(' ')
}

const userSeries = [
  { label:'Nuevos',    color:'#2563ff', data: userData.nuevos,    path: makePath(userData.nuevos),    pts: userData.nuevos.map((_,i) => uPts(userData.nuevos, i)) },
  { label:'Activos',   color:'#10b981', data: userData.activos,   path: makePath(userData.activos),   pts: userData.activos.map((_,i) => uPts(userData.activos, i)) },
  { label:'Inactivos', color:'#f43f5e', data: userData.inactivos, path: makePath(userData.inactivos), pts: userData.inactivos.map((_,i) => uPts(userData.inactivos, i)) },
]

// Bar chart
const barValues = [25, 30, 28, 32, 22, 28, 35] // millions
const barMax = 40, bLP = 48, bTP = 10, bW = 502, bH = 150
const barGridY = [10, 47, 85, 122, 160]

const barItems = barValues.map((v, i) => ({
  x: bLP + (i / (barValues.length - 1)) * bW,
  y: bTP + (1 - v / barMax) * bH,
  label: ['9 May','10 May','11 May','12 May','13 May','14 May','15 May'][i],
}))

// Donut 1 — distribución servicios (datos reales por categoría)
const donut1 = computed(() => {
  const cats = categoriesChartData.value
  if (!cats.length) return []
  const total = cats.reduce((s, c) => s + c.value, 0) || 1
  // Agrupa las últimas categorías en "Otros" si hay más de 5
  const top = cats.slice(0, 5)
  const rest = cats.slice(5)
  const segs = rest.length
    ? [...top, { label: 'Otros', value: rest.reduce((s, c) => s + c.value, 0), color: '#f59e0b' }]
    : top
  let offset = 0
  return segs.map(s => {
    const pct = Math.round((s.value / total) * 100)
    const dash = (pct / 100) * 314
    const r = { ...s, pct, dash, offset }
    offset += dash
    return r
  })
})

// Donut 2 — solicitudes por estado (datos reales)
const donut2 = computed(() => {
  const d = dashRaw.value
  const total = (d.pendingRequests + d.acceptedRequests + d.completedRequests + d.cancelledRequests) || 1
  const segs = [
    { label:'Pendientes',  value: d.pendingRequests,   color:'#7c3aed' },
    { label:'En progreso', value: d.acceptedRequests,  color:'#0891b2' },
    { label:'Completadas', value: d.completedRequests, color:'#10b981' },
    { label:'Canceladas',  value: d.cancelledRequests, color:'#ef4444' },
  ].map(s => ({ ...s, pct: Math.round((s.value / total) * 100) }))
  let offset = 0
  return segs.map(s => {
    const dash = (s.pct / 100) * 314
    const r = { ...s, dash, offset }
    offset += dash
    return r
  })
})

// ─── Alertas pendientes del dashboard ────────────────────────
const pendingAlerts = computed(() => {
  if (dashLoading.value) return []
  const d = dashRaw.value
  const alerts = []

  if (d.pendingProfessionals > 0) {
    const n = d.pendingProfessionals
    alerts.push({
      type:     'warning',
      message:  `${n} profesional${n > 1 ? 'es' : ''} pendiente${n > 1 ? 's' : ''} de aprobación`,
      action:   'Revisar',
      navigate: 'Usuarios',
    })
  }

  return alerts
})

const alertBg       = (t) => ({ warning:'bg-amber-50 border-amber-200', info:'bg-blue-50 border-blue-200', error:'bg-red-50 border-red-200' }[t] ?? 'bg-slate-50 border-slate-200')
const alertIconColor = (t) => ({ warning:'text-amber-500', info:'text-blue-500', error:'text-red-500' }[t] ?? 'text-slate-400')
const alertTextColor = (t) => ({ warning:'text-amber-900', info:'text-blue-900', error:'text-red-900' }[t] ?? 'text-slate-700')
const alertBtnClass  = (t) => ({ warning:'border-amber-300 text-amber-700 hover:border-amber-400', info:'border-blue-300 text-blue-700 hover:border-blue-400', error:'border-red-300 text-red-700 hover:border-red-400' }[t] ?? 'border-slate-300 text-slate-600')

// Usuarios y Profesionales → movidos a AdminUsers.vue

// Pagos y Dispersiones → movidos a AdminPayments.vue

watch(page, (p) => { if (p === 'Panel de administración') fetchDashStats() })

// Categories CRUD → movido a AdminCategories.vue
// Sub-admins CRUD → movido a AdminSubAdmins.vue
// Services CRUD   → movido a AdminServices.vue

onMounted(() => {
  fetchDashStats()
  // Usuarios   → AdminUsers.vue
  // Sub-admins → AdminSubAdmins.vue
  // Services   → AdminServices.vue
})
</script>
