<template>
  <div ref="reportEl" class="space-y-6">

    <!-- Header -->
    <div class="flex items-start justify-between gap-4 flex-wrap">
      <div>
        <p class="font-black text-[#0f172a]">Reportes</p>
        <p class="text-sm text-slate-400 mt-0.5">Resumen ejecutivo · {{ today }}</p>
      </div>
      <div data-no-print class="flex gap-2">
        <button @click="doPrint" :disabled="loading"
          class="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white rounded-xl text-[13px] font-semibold text-slate-600 hover:bg-slate-50 transition disabled:opacity-50 disabled:cursor-not-allowed">
          <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/>
          </svg>
          Imprimir
        </button>
        <button @click="doPrint" :disabled="loading"
          class="flex items-center gap-2 px-4 py-2 bg-[#0d4f5c] text-white rounded-xl text-[13px] font-bold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed">
          <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>
          </svg>
          Descargar PDF
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-20 gap-4 text-slate-400">
      <svg class="w-10 h-10 animate-spin text-[#0d4f5c]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
      <p class="text-[13px]">Cargando reporte…</p>
    </div>

    <template v-else-if="report">

      <!-- ── KPI cards ── -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div v-for="kpi in kpiCards" :key="kpi.label"
          class="bg-white border border-slate-100 rounded-2xl p-5 flex items-start justify-between gap-3">
          <div class="flex-1 min-w-0">
            <p class="text-[12px] font-medium text-slate-500">{{ kpi.label }}</p>
            <p class="text-[22px] font-black text-[#0f172a] mt-1.5 leading-none">{{ kpi.value }}</p>
          </div>
          <div :class="['w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0', kpi.iconBg]">
            {{ kpi.icon }}
          </div>
        </div>
      </div>

      <!-- ── Estado + Evolución mensual ── -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">

        <!-- Por estado -->
        <div class="bg-white border border-slate-100 rounded-2xl p-5">
          <p class="font-black text-[#0f172a] text-[14px] mb-5">Solicitudes por estado</p>
          <div class="space-y-4">
            <div v-for="s in byStatus" :key="s.label" class="space-y-1.5">
              <div class="flex items-center justify-between text-[13px]">
                <div class="flex items-center gap-2">
                  <span :class="['w-2.5 h-2.5 rounded-full flex-shrink-0', s.dot]"></span>
                  <span class="text-slate-600">{{ s.label }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="font-black text-[#0f172a]">{{ s.value.toLocaleString('es-CO') }}</span>
                  <span class="text-[11px] text-slate-400 w-9 text-right">
                    {{ totalRequests ? Math.round((s.value / totalRequests) * 100) : 0 }}%
                  </span>
                </div>
              </div>
              <div class="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div :class="['h-full rounded-full transition-all', s.bar]"
                  :style="{width: totalRequests ? `${(s.value / totalRequests) * 100}%` : '0%'}"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Evolución mensual -->
        <div class="bg-white border border-slate-100 rounded-2xl p-5">
          <div class="flex items-center justify-between mb-4">
            <p class="font-black text-[#0f172a] text-[14px]">Evolución mensual</p>
            <div class="flex items-center gap-4 text-[11px] font-semibold text-slate-500">
              <span class="flex items-center gap-1.5">
                <span class="w-2.5 h-2.5 rounded-sm bg-slate-200 inline-block"></span> Total
              </span>
              <span class="flex items-center gap-1.5">
                <span class="w-2.5 h-2.5 rounded-sm bg-[#0d4f5c] inline-block"></span> Completadas
              </span>
            </div>
          </div>
          <svg v-if="monthChart.length" viewBox="0 0 520 158" class="w-full" style="height:158px" preserveAspectRatio="none">
            <!-- Gridlines -->
            <line v-for="gy in [18,52,86,120]" :key="gy" x1="0" x2="520" :y1="gy" :y2="gy" stroke="#f1f5f9" stroke-width="1"/>
            <!-- Bars -->
            <template v-for="(m, i) in monthChart" :key="i">
              <!-- Total bar (background) -->
              <rect :x="m.x" :y="130 - m.totalH" :width="m.bw" :height="m.totalH || 2" rx="3" fill="#e2e8f0"/>
              <!-- Completed bar (foreground) -->
              <rect v-if="m.completedH > 0" :x="m.x" :y="130 - m.completedH" :width="m.bw" :height="m.completedH" rx="3" fill="#0d4f5c"/>
              <!-- Value label -->
              <text v-if="m.totalH > 8" :x="m.x + m.bw / 2" :y="130 - m.totalH - 4"
                text-anchor="middle" fill="#94a3b8" font-size="9">{{ m.total }}</text>
            </template>
            <!-- X labels -->
            <text v-for="(m, i) in monthChart" :key="'lbl'+i"
              :x="m.x + m.bw / 2" y="148"
              text-anchor="middle" fill="#94a3b8" font-size="10">{{ m.label }}</text>
          </svg>
          <p v-else class="text-center text-slate-300 text-sm py-8">Sin datos mensuales</p>
        </div>

      </div>

      <!-- ── Por categoría ── -->
      <div class="bg-white border border-slate-100 rounded-2xl overflow-hidden">
        <div class="px-5 py-4 border-b border-slate-100">
          <p class="font-black text-[#0f172a] text-[14px]">Solicitudes por categoría</p>
        </div>

        <div v-if="!report.by_category.length" class="px-5 py-8 text-center text-slate-300 text-[13px]">
          Sin datos de categorías
        </div>
        <template v-else>
          <!-- Mobile cards (< md) -->
          <div class="md:hidden divide-y divide-slate-50">
            <div v-for="c in catMobilePagedItems" :key="c.name" class="px-4 py-3 space-y-2">
              <div class="flex items-center justify-between gap-2">
                <p class="font-bold text-[#0f172a] text-[13px]">{{ c.name }}</p>
                <p class="font-bold text-[#0f172a] text-[13px]">{{ formatCOP(c.revenue) }}</p>
              </div>
              <div class="grid grid-cols-3 gap-2 text-[12px]">
                <div>
                  <p class="text-[10px] text-slate-400 uppercase font-bold">Total</p>
                  <p class="font-semibold text-slate-600">{{ c.total }}</p>
                </div>
                <div>
                  <p class="text-[10px] text-slate-400 uppercase font-bold">Completadas</p>
                  <p class="font-semibold text-emerald-700">{{ c.completed }}</p>
                </div>
                <div>
                  <p class="text-[10px] text-slate-400 uppercase font-bold">Éxito</p>
                  <p class="font-semibold text-slate-600">{{ c.total > 0 ? Math.round((c.completed / c.total) * 100) : 0 }}%</p>
                </div>
              </div>
              <div class="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div class="h-full bg-emerald-500 rounded-full"
                  :style="{width: c.total > 0 ? `${Math.round((c.completed / c.total) * 100)}%` : '0%'}"></div>
              </div>
            </div>
          </div>
          <!-- Mobile pagination -->
          <div v-if="catMobileTotalPages > 1" class="md:hidden flex items-center justify-center gap-3 px-4 py-3 border-t border-slate-100">
            <button :disabled="catMobilePage <= 1" @click="catMobilePage--"
              class="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 text-sm font-bold disabled:opacity-30 hover:bg-slate-200 transition">‹</button>
            <span class="text-[12px] text-slate-500 font-semibold">{{ catMobilePage }} / {{ catMobileTotalPages }}</span>
            <button :disabled="catMobilePage >= catMobileTotalPages" @click="catMobilePage++"
              class="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 text-sm font-bold disabled:opacity-30 hover:bg-slate-200 transition">›</button>
          </div>
          <!-- Desktop table (≥ md) -->
          <div class="hidden md:block overflow-x-auto">
          <table class="w-full text-[13px] min-w-[500px]">
            <thead>
              <tr>
                <th v-for="h in ['Categoría','Total','Completadas','Tasa de éxito','Revenue']" :key="h"
                  class="px-5 py-3 text-[10px] font-black text-slate-400 uppercase tracking-wide border-b border-slate-50 bg-slate-50 text-left">
                  {{ h }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="c in report.by_category" :key="c.name"
                class="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition">
                <td class="px-5 py-3 font-semibold text-[#0f172a]">{{ c.name }}</td>
                <td class="px-5 py-3 text-slate-600">{{ c.total }}</td>
                <td class="px-5 py-3">
                  <span class="font-semibold text-emerald-700">{{ c.completed }}</span>
                </td>
                <td class="px-5 py-3">
                  <div class="flex items-center gap-2">
                    <div class="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div class="h-full bg-emerald-500 rounded-full"
                        :style="{width: c.total > 0 ? `${Math.round((c.completed / c.total) * 100)}%` : '0%'}"></div>
                    </div>
                    <span class="text-[12px] text-slate-500 tabular-nums">
                      {{ c.total > 0 ? Math.round((c.completed / c.total) * 100) : 0 }}%
                    </span>
                  </div>
                </td>
                <td class="px-5 py-3 font-bold text-[#0f172a]">{{ formatCOP(c.revenue) }}</td>
              </tr>
            </tbody>
          </table>
          </div>
        </template>
      </div>

      <!-- ── Top profesionales + Usuarios ── -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">

        <!-- Top profesionales -->
        <div class="bg-white border border-slate-100 rounded-2xl overflow-hidden">
          <div class="px-5 py-4 border-b border-slate-100">
            <p class="font-black text-[#0f172a] text-[14px]">Top profesionales</p>
          </div>
          <div class="divide-y divide-slate-50">
            <div v-for="(p, i) in report.top_professionals" :key="p.id"
              class="flex items-center gap-3 px-5 py-3">
              <span :class="['w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black flex-shrink-0',
                i === 0 ? 'bg-amber-100 text-amber-700' :
                i === 1 ? 'bg-slate-200 text-slate-600' :
                i === 2 ? 'bg-orange-100 text-orange-700' : 'bg-slate-50 text-slate-400']">
                {{ i + 1 }}
              </span>
              <img :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${p.name}`"
                class="w-8 h-8 rounded-xl border border-slate-100 flex-shrink-0" />
              <div class="flex-1 min-w-0">
                <p class="font-semibold text-[#0f172a] text-[13px] truncate">{{ p.name }}</p>
                <p class="text-[11px] text-slate-400">{{ p.jobs }} trabajo{{ p.jobs !== 1 ? 's' : '' }}</p>
              </div>
              <span class="font-bold text-[13px] text-[#0f172a] flex-shrink-0">{{ formatCOP(p.revenue) }}</span>
            </div>
            <div v-if="!report.top_professionals.length"
              class="px-5 py-8 text-center text-slate-300 text-[13px]">
              Sin profesionales con trabajos completados
            </div>
          </div>
        </div>

        <!-- Estadísticas de usuarios -->
        <div class="bg-white border border-slate-100 rounded-2xl p-5">
          <p class="font-black text-[#0f172a] text-[14px] mb-4">Estadísticas de usuarios</p>
          <div class="grid grid-cols-2 gap-3">
            <div v-for="u in userStatCards" :key="u.label"
              class="bg-slate-50 rounded-xl p-4 flex items-start justify-between gap-2">
              <div class="flex-1 min-w-0">
                <p class="text-[11px] font-medium text-slate-500 leading-tight">{{ u.label }}</p>
                <p class="text-[20px] font-black text-[#0f172a] mt-1 leading-none">{{ u.value.toLocaleString('es-CO') }}</p>
              </div>
              <div :class="['w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0', u.iconBg]">
                {{ u.icon }}
              </div>
            </div>
          </div>
        </div>

      </div>

    </template>

    <!-- Empty state -->
    <div v-else
      class="flex flex-col items-center justify-center py-20 gap-3 bg-white border border-dashed border-slate-200 rounded-2xl text-slate-400">
      <span class="text-5xl">📊</span>
      <p class="font-bold text-slate-500 text-base">No hay datos disponibles</p>
      <p class="text-sm">No se pudo cargar el reporte</p>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

import api from '@/services/api'

const reportEl = ref(null)
const report   = ref(null)
const loading  = ref(true)

const catMobilePage = ref(1)
const catMobilePagedItems = computed(() => {
  if (!report.value) return []
  const start = (catMobilePage.value - 1) * 6
  return report.value.by_category.slice(start, start + 6)
})
const catMobileTotalPages = computed(() => {
  if (!report.value) return 0
  return Math.ceil(report.value.by_category.length / 6)
})

const today = computed(() =>
  new Date().toLocaleDateString('es-CO', { day: '2-digit', month: 'long', year: 'numeric' })
)

const fetchReport = async () => {
  loading.value = true
  try {
    const { data } = await api.get('/admin/reports')
    report.value = data.data
  } catch { /* silent */ }
  finally { loading.value = false }
}

const formatCOP = (v) =>
  '$' + Number(v || 0).toLocaleString('es-CO', { maximumFractionDigits: 0 })

// ── Status breakdown ──────────────────────────────────────────
const byStatus = computed(() => {
  if (!report.value) return []
  const s = report.value.by_status
  const progress = (Number(s.active) || 0) + (Number(s.accepted) || 0)
  return [
    { label: 'Pendientes',  value: Number(s.pending)   || 0, dot: 'bg-amber-400',   bar: 'bg-amber-400'   },
    { label: 'En progreso', value: progress,                  dot: 'bg-blue-500',    bar: 'bg-blue-500'    },
    { label: 'Completadas', value: Number(s.completed) || 0, dot: 'bg-emerald-500', bar: 'bg-emerald-500' },
    { label: 'Canceladas',  value: Number(s.cancelled) || 0, dot: 'bg-red-500',     bar: 'bg-red-500'     },
  ]
})

const totalRequests  = computed(() => byStatus.value.reduce((s, i) => s + i.value, 0))
const completedCount = computed(() => Number(report.value?.by_status?.completed) || 0)
const successRate    = computed(() =>
  totalRequests.value > 0 ? Math.round((completedCount.value / totalRequests.value) * 100) : 0
)

// ── KPI cards ─────────────────────────────────────────────────
const kpiCards = computed(() => [
  { label: 'Total solicitudes', value: totalRequests.value.toLocaleString('es-CO'),          icon: '📋', iconBg: 'bg-blue-50'    },
  { label: 'Completadas',       value: completedCount.value.toLocaleString('es-CO'),          icon: '✅', iconBg: 'bg-emerald-50' },
  { label: 'Revenue recaudado', value: formatCOP(report.value?.revenue?.completed ?? 0),      icon: '💰', iconBg: 'bg-teal-50'    },
  { label: 'Tasa de éxito',     value: `${successRate.value}%`,                               icon: '📈', iconBg: 'bg-purple-50'  },
])

// ── User stat cards ───────────────────────────────────────────
const userStatCards = computed(() => {
  const u = report.value?.user_stats ?? {}
  return [
    { label: 'Clientes',           value: u.total_clients       || 0, icon: '👤', iconBg: 'bg-blue-50'    },
    { label: 'Profesionales',      value: u.total_professionals || 0, icon: '💼', iconBg: 'bg-amber-50'   },
    { label: 'Verificados',        value: u.verified_pros       || 0, icon: '✅', iconBg: 'bg-emerald-50' },
    { label: 'Pend. verificación', value: u.pending_pros        || 0, icon: '⏳', iconBg: 'bg-orange-50'  },
  ]
})

// ── Monthly bar chart ─────────────────────────────────────────
const monthChart = computed(() => {
  const months = report.value?.by_month ?? []
  if (!months.length) return []
  const maxTotal = Math.max(...months.map(m => m.total), 1)
  const LP = 8, RP = 8, TOTAL_W = 520, H = 112
  const usableW = TOTAL_W - LP - RP
  const n = months.length
  const groupW = usableW / n
  const bw = Math.max(14, Math.min(44, groupW * 0.55))

  return months.map((m, i) => {
    const cx = LP + (i + 0.5) * groupW
    return {
      label:      m.month,
      total:      m.total,
      completed:  m.completed,
      totalH:     Math.round((m.total / maxTotal) * H),
      completedH: Math.round((m.completed / maxTotal) * H),
      x:          cx - bw / 2,
      bw,
    }
  })
})

// ── Print / PDF ───────────────────────────────────────────────
const doPrint = () => {
  if (!reportEl.value) return
  const overlay = document.createElement('div')
  overlay.style.cssText = [
    'position:fixed', 'inset:0', 'background:white',
    'z-index:9999', 'overflow:auto', 'padding:40px', 'box-sizing:border-box',
  ].join(';')
  const clone = reportEl.value.cloneNode(true)
  clone.querySelectorAll('[data-no-print]').forEach(el => el.remove())
  overlay.appendChild(clone)
  document.body.appendChild(overlay)
  window.print()
  window.addEventListener('afterprint', () => {
    try { document.body.removeChild(overlay) } catch { /* already removed */ }
  }, { once: true })
}

onMounted(fetchReport)
</script>
