<template>
  <div class="space-y-6">

    <!-- Header -->
    <div class="flex items-start justify-between gap-4 flex-wrap">
      <div>
        <p class="font-black text-[#0f172a]">Soporte</p>
        <p class="text-sm text-slate-400 mt-0.5">Gestión de tickets de soporte de usuarios</p>
      </div>
      <button @click="fetchTickets(1)" :disabled="loading"
        class="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white rounded-xl text-[13px] font-semibold text-slate-600 hover:bg-slate-50 transition disabled:opacity-50 disabled:cursor-not-allowed">
        <svg v-if="loading" class="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
        <span v-else>↻</span>
        Actualizar
      </button>
    </div>

    <!-- Stat cards -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
      <div v-for="s in statCards" :key="s.label"
        class="bg-white border border-slate-100 rounded-2xl p-5 flex items-start justify-between gap-3">
        <div class="flex-1 min-w-0">
          <p class="text-[12px] font-medium text-slate-500">{{ s.label }}</p>
          <p class="text-[22px] font-black text-[#0f172a] mt-1.5 leading-none">
            <span v-if="loading" class="inline-block w-12 h-6 bg-slate-100 rounded animate-pulse"></span>
            <span v-else>{{ s.value }}</span>
          </p>
        </div>
        <div :class="['w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0', s.iconBg]">
          {{ s.icon }}
        </div>
      </div>
    </div>

    <!-- Filtros -->
    <div class="flex gap-3 flex-wrap">
      <div class="relative flex-1 min-w-[220px]">
        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-sm pointer-events-none">🔍</span>
        <input v-model="search" type="text" placeholder="Buscar por asunto, usuario…"
          @input="debouncedFetch"
          class="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-teal-500/30 transition" />
      </div>
      <select v-model="filterStatus" @change="fetchTickets(1)"
        class="border border-slate-200 rounded-xl px-3 py-2.5 text-[13px] text-slate-600 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/30">
        <option value="">Todos los estados</option>
        <option value="open">Abierto</option>
        <option value="in_progress">En proceso</option>
        <option value="resolved">Resuelto</option>
        <option value="closed">Cerrado</option>
      </select>
      <select v-model="filterType" @change="fetchTickets(1)"
        class="border border-slate-200 rounded-xl px-3 py-2.5 text-[13px] text-slate-600 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/30">
        <option value="">Todos los tipos</option>
        <option value="general">General</option>
        <option value="payment">Pago</option>
        <option value="professional">Profesional</option>
        <option value="technical">Técnico</option>
      </select>
      <select v-model="filterPriority" @change="fetchTickets(1)"
        class="border border-slate-200 rounded-xl px-3 py-2.5 text-[13px] text-slate-600 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/30">
        <option value="">Todas las prioridades</option>
        <option value="urgent">Urgente</option>
        <option value="high">Alta</option>
        <option value="medium">Media</option>
        <option value="low">Baja</option>
      </select>
    </div>

    <!-- Loading skeleton -->
    <div v-if="loading && tickets.length === 0" class="flex flex-col items-center justify-center py-20 gap-4 text-slate-400">
      <svg class="w-10 h-10 animate-spin text-[#0d4f5c]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
      <p class="text-[13px]">Cargando tickets…</p>
    </div>

    <!-- Empty -->
    <div v-else-if="!loading && tickets.length === 0"
      class="flex flex-col items-center justify-center py-20 gap-3 bg-white border border-dashed border-slate-200 rounded-2xl text-slate-400">
      <span class="text-5xl">🎧</span>
      <p class="font-bold text-slate-500 text-base">Sin tickets de soporte</p>
      <p class="text-sm">No hay solicitudes que coincidan con los filtros</p>
    </div>

    <!-- Tabla / Cards -->
    <div v-else class="bg-white border border-slate-100 rounded-2xl overflow-hidden">

      <!-- Mobile cards (< md) -->
      <div class="md:hidden divide-y divide-slate-50">
        <div v-for="t in tickets" :key="t.id" class="p-4 space-y-3">
          <div class="flex items-start gap-2.5">
            <img :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${t.user?.name}`"
              class="w-9 h-9 rounded-xl border border-slate-100 flex-shrink-0 mt-0.5" />
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between gap-2">
                <p class="font-bold text-[#0f172a] text-[13px] truncate">{{ t.user?.name ?? '—' }}</p>
                <span :class="['px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wide flex-shrink-0', statusBadge(t.status)]">
                  {{ statusLabel(t.status) }}
                </span>
              </div>
              <p class="text-[10px] text-slate-400">{{ t.user?.email }}</p>
            </div>
          </div>
          <div>
            <p class="font-semibold text-[#0f172a] text-[13px] line-clamp-1">{{ t.subject }}</p>
            <p class="text-[11px] text-slate-400 line-clamp-2 mt-0.5">{{ t.message }}</p>
          </div>
          <div class="flex items-center gap-2 flex-wrap">
            <span :class="['px-2 py-0.5 rounded-lg text-[10px] font-semibold', typeBadge(t.type)]">{{ typeLabel(t.type) }}</span>
            <span :class="['px-2 py-0.5 rounded-lg text-[10px] font-bold', priorityBadge(t.priority)]">{{ priorityLabel(t.priority) }}</span>
            <span class="text-[10px] text-slate-400 ml-auto">{{ formatDate(t.created_at) }}</span>
          </div>
          <div class="flex gap-2 pt-1 border-t border-slate-50">
            <button @click="openTicket(t)"
              class="flex-1 py-2 rounded-xl bg-blue-50 text-blue-700 text-[12px] font-semibold hover:bg-blue-100 transition">
              {{ t.admin_reply ? 'Ver / Editar' : 'Responder' }}
            </button>
            <button v-if="t.status !== 'closed'" @click="quickClose(t)"
              class="px-4 py-2 rounded-xl bg-slate-100 text-slate-500 text-[12px] font-semibold hover:bg-red-50 hover:text-red-600 transition">
              Cerrar
            </button>
          </div>
        </div>
      </div>

      <!-- Desktop table (≥ md) -->
      <div class="hidden md:block overflow-x-auto">
      <table class="w-full border-collapse text-[13px] min-w-[700px]">
        <thead>
          <tr>
            <th v-for="h in ['#','Usuario','Asunto','Tipo','Prioridad','Estado','Fecha','Acciones']" :key="h"
              class="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-wide border-b border-slate-100 bg-slate-50 text-left first:pl-5">
              {{ h }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="t in tickets" :key="t.id"
            class="hover:bg-slate-50 border-b border-slate-50 last:border-0 transition">
            <td class="px-4 py-3 pl-5 text-[11px] text-slate-400 font-mono">#{{ t.id }}</td>
            <td class="px-4 py-3">
              <div class="flex items-center gap-2">
                <img :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${t.user?.name}`"
                  class="w-7 h-7 rounded-lg border border-slate-100 flex-shrink-0" />
                <div class="min-w-0">
                  <p class="font-semibold text-[#0f172a] truncate max-w-[110px]">{{ t.user?.name ?? '—' }}</p>
                  <p class="text-[10px] text-slate-400 truncate max-w-[110px]">{{ t.user?.email }}</p>
                </div>
              </div>
            </td>
            <td class="px-4 py-3 max-w-[180px]">
              <p class="font-semibold text-[#0f172a] line-clamp-1">{{ t.subject }}</p>
              <p class="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{{ t.message }}</p>
            </td>
            <td class="px-4 py-3">
              <span :class="['px-2 py-0.5 rounded-lg text-[11px] font-semibold', typeBadge(t.type)]">
                {{ typeLabel(t.type) }}
              </span>
            </td>
            <td class="px-4 py-3">
              <span :class="['px-2 py-0.5 rounded-lg text-[11px] font-bold', priorityBadge(t.priority)]">
                {{ priorityLabel(t.priority) }}
              </span>
            </td>
            <td class="px-4 py-3">
              <span :class="['px-2.5 py-1 rounded-lg text-[11px] font-black uppercase tracking-wide', statusBadge(t.status)]">
                {{ statusLabel(t.status) }}
              </span>
            </td>
            <td class="px-4 py-3 text-[11px] text-slate-400 whitespace-nowrap">{{ formatDate(t.created_at) }}</td>
            <td class="px-4 py-3">
              <div class="flex gap-2">
                <button @click="openTicket(t)"
                  class="text-[12px] text-blue-600 hover:underline font-semibold">
                  {{ t.admin_reply ? 'Ver' : 'Responder' }}
                </button>
                <button v-if="t.status !== 'closed'" @click="quickClose(t)"
                  class="text-[12px] text-slate-400 hover:text-red-500 hover:underline font-semibold transition">
                  Cerrar
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      </div>

      <!-- Paginación -->
      <div v-if="pages > 1" class="flex items-center justify-center gap-4 px-5 py-4 border-t border-slate-100">
        <button :disabled="currentPage === 1" @click="fetchTickets(currentPage - 1)"
          class="px-4 py-2 bg-slate-100 rounded-xl text-[13px] font-bold text-slate-600 hover:bg-slate-200 transition disabled:opacity-40 disabled:cursor-not-allowed">
          ← Anterior
        </button>
        <span class="text-[13px] text-slate-500 font-semibold">Página {{ currentPage }} de {{ pages }}</span>
        <button :disabled="currentPage === pages" @click="fetchTickets(currentPage + 1)"
          class="px-4 py-2 bg-slate-100 rounded-xl text-[13px] font-bold text-slate-600 hover:bg-slate-200 transition disabled:opacity-40 disabled:cursor-not-allowed">
          Siguiente →
        </button>
      </div>
    </div>

  </div>

  <!-- Modal de ticket -->
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200" enter-from-class="opacity-0"
      leave-active-class="transition duration-150" leave-to-class="opacity-0">
      <div v-if="activeTicket"
        class="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-4"
        style="background:rgba(15,23,42,.55)"
        @click.self="activeTicket = null">
        <Transition
          enter-active-class="transition duration-200" enter-from-class="opacity-0 scale-95"
          leave-active-class="transition duration-150" leave-to-class="opacity-0 scale-95">
          <div v-if="activeTicket" class="bg-white rounded-2xl shadow-2xl w-full max-w-xl" @click.stop>

            <!-- Header -->
            <div class="flex items-start justify-between px-6 py-4 border-b border-slate-100">
              <div>
                <p class="font-black text-[#0f172a]">Ticket #{{ activeTicket.id }}</p>
                <p class="text-[12px] text-slate-400 mt-0.5">{{ formatDate(activeTicket.created_at) }}</p>
              </div>
              <button @click="activeTicket = null" class="text-slate-400 hover:text-slate-600 text-xl leading-none mt-0.5">×</button>
            </div>

            <!-- Cuerpo -->
            <div class="p-6 space-y-4 max-h-[65vh] overflow-y-auto">

              <!-- Info usuario -->
              <div class="flex items-center gap-3 bg-slate-50 rounded-xl p-3">
                <img :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${activeTicket.user?.name}`"
                  class="w-10 h-10 rounded-xl border border-slate-200 flex-shrink-0" />
                <div class="flex-1 min-w-0">
                  <p class="font-bold text-[#0f172a] text-[13px]">{{ activeTicket.user?.name }}</p>
                  <p class="text-[11px] text-slate-400">{{ activeTicket.user?.email }}</p>
                </div>
                <div class="flex gap-1.5 flex-wrap justify-end">
                  <span :class="['px-2 py-0.5 rounded-lg text-[10px] font-bold', typeBadge(activeTicket.type)]">
                    {{ typeLabel(activeTicket.type) }}
                  </span>
                  <span :class="['px-2 py-0.5 rounded-lg text-[10px] font-bold', priorityBadge(activeTicket.priority)]">
                    {{ priorityLabel(activeTicket.priority) }}
                  </span>
                </div>
              </div>

              <!-- Asunto + Mensaje -->
              <div>
                <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1">Asunto</p>
                <p class="font-semibold text-[#0f172a] text-[13px]">{{ activeTicket.subject }}</p>
              </div>
              <div>
                <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1">Mensaje del usuario</p>
                <p class="text-[13px] text-slate-600 bg-slate-50 rounded-xl p-3 whitespace-pre-wrap leading-relaxed">{{ activeTicket.message }}</p>
              </div>

              <!-- Respuesta previa -->
              <div v-if="activeTicket.admin_reply">
                <p class="text-[11px] font-bold text-teal-600 uppercase tracking-wide mb-1">Respuesta anterior</p>
                <p class="text-[13px] text-slate-700 bg-teal-50 border border-teal-100 rounded-xl p-3 whitespace-pre-wrap leading-relaxed">{{ activeTicket.admin_reply }}</p>
                <p class="text-[10px] text-slate-400 mt-1">{{ formatDate(activeTicket.replied_at) }}</p>
              </div>

              <!-- Formulario de respuesta -->
              <div>
                <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                  {{ activeTicket.admin_reply ? 'Actualizar respuesta' : 'Responder al usuario' }}
                </label>
                <textarea v-model="replyText" rows="4" placeholder="Escribe tu respuesta aquí…"
                  class="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-teal-500/30 resize-none transition" />
              </div>

              <!-- Status -->
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Estado</label>
                  <select v-model="replyStatus"
                    class="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/30">
                    <option value="open">Abierto</option>
                    <option value="in_progress">En proceso</option>
                    <option value="resolved">Resuelto</option>
                    <option value="closed">Cerrado</option>
                  </select>
                </div>
                <div>
                  <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Prioridad</label>
                  <select v-model="replyPriority"
                    class="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/30">
                    <option value="low">Baja</option>
                    <option value="medium">Media</option>
                    <option value="high">Alta</option>
                    <option value="urgent">Urgente</option>
                  </select>
                </div>
              </div>

            </div>

            <!-- Footer -->
            <div class="flex justify-between items-center gap-3 px-6 py-4 border-t border-slate-100">
              <button @click="activeTicket = null"
                class="px-5 py-2.5 rounded-xl border border-slate-200 text-[13px] text-slate-600 hover:bg-slate-50 transition">
                Cancelar
              </button>
              <div class="flex gap-2">
                <button @click="saveStatus" :disabled="saving"
                  class="px-4 py-2.5 rounded-xl border border-slate-200 text-[13px] font-semibold text-slate-600 hover:bg-slate-50 transition disabled:opacity-50">
                  Solo actualizar estado
                </button>
                <button @click="sendReply" :disabled="saving || !replyText.trim()"
                  class="px-5 py-2.5 rounded-xl bg-[#0d4f5c] text-white text-[13px] font-bold hover:opacity-90 transition disabled:opacity-50">
                  {{ saving ? 'Enviando…' : 'Enviar respuesta' }}
                </button>
              </div>
            </div>

          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/services/api'
import { useAdminToast } from './useAdminToast'

const { showToast } = useAdminToast()

const tickets     = ref([])
const total       = ref(0)
const pages       = ref(1)
const currentPage = ref(1)
const loading     = ref(true)
const saving      = ref(false)
const stats       = ref({ total: 0, open: 0, in_progress: 0, resolved: 0 })

const search         = ref('')
const filterStatus   = ref('')
const filterType     = ref('')
const filterPriority = ref('')

const activeTicket  = ref(null)
const replyText     = ref('')
const replyStatus   = ref('in_progress')
const replyPriority = ref('medium')

let debounceTimer = null
const debouncedFetch = () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => fetchTickets(1), 400)
}

const fetchTickets = async (page = 1) => {
  loading.value = true
  try {
    const params = { page, per_page: 20 }
    if (search.value.trim())   params.search   = search.value.trim()
    if (filterStatus.value)    params.status   = filterStatus.value
    if (filterType.value)      params.type     = filterType.value
    if (filterPriority.value)  params.priority = filterPriority.value

    const { data } = await api.get('/admin/support', { params })
    tickets.value     = data.tickets
    total.value       = data.total
    pages.value       = data.pages
    currentPage.value = data.current
    if (data.stats) stats.value = data.stats
  } catch { /* silent */ }
  finally { loading.value = false }
}

const statCards = computed(() => [
  { label: 'Total tickets',  value: stats.value.total,       icon: '🎧', iconBg: 'bg-blue-50'    },
  { label: 'Abiertos',       value: stats.value.open,        icon: '📬', iconBg: 'bg-amber-50'   },
  { label: 'En proceso',     value: stats.value.in_progress, icon: '⚙️', iconBg: 'bg-teal-50'    },
  { label: 'Resueltos',      value: stats.value.resolved,    icon: '✅', iconBg: 'bg-emerald-50' },
])

const openTicket = (t) => {
  activeTicket.value  = { ...t }
  replyText.value     = t.admin_reply ?? ''
  replyStatus.value   = t.status
  replyPriority.value = t.priority
}

const sendReply = async () => {
  if (!replyText.value.trim()) return
  saving.value = true
  try {
    const { data } = await api.patch(`/admin/support/${activeTicket.value.id}/reply`, {
      reply:    replyText.value.trim(),
      status:   replyStatus.value,
      priority: replyPriority.value,
    })
    const idx = tickets.value.findIndex(t => t.id === activeTicket.value.id)
    if (idx !== -1) tickets.value[idx] = { ...tickets.value[idx], ...data.ticket }
    showToast('Respuesta enviada', 'success')
    activeTicket.value = null
    fetchTickets(currentPage.value)
  } catch { showToast('Error al enviar respuesta', 'error') }
  finally { saving.value = false }
}

const saveStatus = async () => {
  saving.value = true
  try {
    await api.patch(`/admin/support/${activeTicket.value.id}/status`, {
      status:   replyStatus.value,
      priority: replyPriority.value,
    })
    const idx = tickets.value.findIndex(t => t.id === activeTicket.value.id)
    if (idx !== -1) {
      tickets.value[idx].status   = replyStatus.value
      tickets.value[idx].priority = replyPriority.value
    }
    showToast('Estado actualizado', 'success')
    activeTicket.value = null
    fetchTickets(currentPage.value)
  } catch { showToast('Error al actualizar', 'error') }
  finally { saving.value = false }
}

const quickClose = async (t) => {
  try {
    await api.patch(`/admin/support/${t.id}/status`, { status: 'closed' })
    t.status = 'closed'
    showToast('Ticket cerrado', 'success')
  } catch { showToast('Error al cerrar ticket', 'error') }
}

// ── Labels / badges ───────────────────────────────────────────
const STATUS_LABELS   = { open:'Abierto', in_progress:'En proceso', resolved:'Resuelto', closed:'Cerrado' }
const TYPE_LABELS     = { general:'General', payment:'Pago', professional:'Profesional', technical:'Técnico' }
const PRIORITY_LABELS = { low:'Baja', medium:'Media', high:'Alta', urgent:'Urgente' }

const statusLabel   = (s) => STATUS_LABELS[s]   ?? s
const typeLabel     = (t) => TYPE_LABELS[t]      ?? t
const priorityLabel = (p) => PRIORITY_LABELS[p]  ?? p

const statusBadge = (s) => ({
  open:        'bg-amber-50 text-amber-700',
  in_progress: 'bg-blue-50 text-blue-700',
  resolved:    'bg-emerald-50 text-emerald-700',
  closed:      'bg-slate-100 text-slate-500',
}[s] ?? 'bg-slate-100 text-slate-500')

const typeBadge = (t) => ({
  general:      'bg-slate-100 text-slate-600',
  payment:      'bg-purple-50 text-purple-700',
  professional: 'bg-teal-50 text-teal-700',
  technical:    'bg-indigo-50 text-indigo-700',
}[t] ?? 'bg-slate-100 text-slate-600')

const priorityBadge = (p) => ({
  low:    'bg-slate-100 text-slate-500',
  medium: 'bg-blue-50 text-blue-600',
  high:   'bg-orange-50 text-orange-700',
  urgent: 'bg-red-50 text-red-700',
}[p] ?? 'bg-slate-100 text-slate-500')

const formatDate = (iso) => {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleDateString('es-CO', { day:'2-digit', month:'short', year:'numeric' })
    + ' ' + d.toLocaleTimeString('es-CO', { hour:'2-digit', minute:'2-digit' })
}

onMounted(() => fetchTickets(1))
</script>
