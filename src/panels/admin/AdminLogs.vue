<template>
  <div class="space-y-6">

    <!-- Header -->
    <div class="flex items-start justify-between gap-4 flex-wrap">
      <div>
        <p class="font-black text-[#0f172a]">Auditoría</p>
        <p class="text-sm text-slate-400 mt-0.5">Registro de acciones de administradores, clientes y profesionales</p>
      </div>
      <button @click="fetchLogs(1)" :disabled="loading"
        class="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white rounded-xl text-[13px] font-semibold text-slate-600 hover:bg-slate-50 transition disabled:opacity-50 disabled:cursor-not-allowed">
        <svg v-if="loading" class="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
        <span v-else>↻</span>
        Actualizar
      </button>
    </div>

    <!-- Quick stats -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
      <div class="bg-white border border-slate-100 rounded-2xl p-4 flex items-center gap-3">
        <span class="text-2xl flex-shrink-0">📝</span>
        <div>
          <p class="text-[22px] font-black text-[#0f172a] leading-none">{{ total }}</p>
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wide mt-1">Total acciones</p>
        </div>
      </div>
      <div class="bg-white border border-slate-100 rounded-2xl p-4 flex items-center gap-3 border-l-[3px] border-l-emerald-500">
        <span class="text-2xl flex-shrink-0">✅</span>
        <div>
          <p class="text-[22px] font-black text-[#0f172a] leading-none">{{ actionCount('create') }}</p>
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wide mt-1">Creaciones</p>
        </div>
      </div>
      <div class="bg-white border border-slate-100 rounded-2xl p-4 flex items-center gap-3 border-l-[3px] border-l-blue-500">
        <span class="text-2xl flex-shrink-0">✏️</span>
        <div>
          <p class="text-[22px] font-black text-[#0f172a] leading-none">{{ actionCount('update') }}</p>
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wide mt-1">Ediciones</p>
        </div>
      </div>
      <div class="bg-white border border-slate-100 rounded-2xl p-4 flex items-center gap-3 border-l-[3px] border-l-red-500">
        <span class="text-2xl flex-shrink-0">🗑️</span>
        <div>
          <p class="text-[22px] font-black text-[#0f172a] leading-none">{{ actionCount('delete') }}</p>
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wide mt-1">Eliminaciones</p>
        </div>
      </div>
    </div>

    <!-- Filtros -->
    <div class="flex gap-3 flex-wrap">
      <div class="relative flex-1 min-w-[220px]">
        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-sm pointer-events-none">🔍</span>
        <input v-model="search" type="text" placeholder="Buscar por usuario o descripción…"
          @input="debouncedFetch"
          class="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-teal-500/30 transition" />
      </div>
      <select v-model="filterEntity" @change="fetchLogs(1)"
        class="border border-slate-200 rounded-xl px-3 py-2.5 text-[13px] text-slate-600 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/30">
        <option value="">Todas las entidades</option>
        <option value="user">Usuarios</option>
        <option value="sub-admin">Sub-admins</option>
        <option value="category">Categorías</option>
        <option value="service">Servicios</option>
        <option value="service_request">Solicitudes</option>
      </select>
      <select v-model="filterAction" @change="fetchLogs(1)"
        class="border border-slate-200 rounded-xl px-3 py-2.5 text-[13px] text-slate-600 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/30">
        <option value="">Todas las acciones</option>
        <option value="create">Crear</option>
        <option value="update">Actualizar</option>
        <option value="delete">Eliminar</option>
        <option value="verify">Verificar</option>
        <option value="toggle">Cambiar estado</option>
        <option value="cancel">Cancelar</option>
        <option value="complete">Completar</option>
        <option value="upload_evidence">Evidencias</option>
        <option value="rate">Calificar</option>
        <option value="reassign">Reasignar</option>
      </select>
    </div>

    <!-- Loading -->
    <div v-if="loading && logs.length === 0" class="flex flex-col items-center justify-center py-20 gap-4 text-slate-400">
      <svg class="w-10 h-10 animate-spin text-[#0d4f5c]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
      <p class="text-[13px]">Cargando registros…</p>
    </div>

    <!-- Empty -->
    <div v-else-if="!loading && logs.length === 0"
      class="flex flex-col items-center justify-center py-20 gap-3 bg-white border border-dashed border-slate-200 rounded-2xl text-slate-400">
      <span class="text-5xl">📋</span>
      <p class="font-bold text-slate-500 text-base">Sin registros aún</p>
      <p class="text-sm">Las acciones del panel de administración aparecerán aquí.</p>
    </div>

    <!-- Tabla / Cards -->
    <div v-else class="bg-white border border-slate-100 rounded-2xl overflow-hidden">

      <!-- Mobile cards (< md) -->
      <div class="md:hidden divide-y divide-slate-50">
        <div v-for="log in logs" :key="log.id" class="p-4 space-y-2.5">
          <div class="flex items-center justify-between gap-2">
            <div class="flex items-center gap-2">
              <img :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${log.admin_name}`"
                class="w-8 h-8 rounded-lg border border-slate-100 flex-shrink-0" />
              <div>
                <p class="font-semibold text-[#0f172a] text-[13px]">{{ log.admin_name }}</p>
                <p class="text-[10px] text-slate-400">{{ formatDate(log.created_at) }}</p>
              </div>
            </div>
            <span :class="['inline-block px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wide flex-shrink-0', actionBadgeClass(log.action)]">
              {{ actionLabel(log.action) }}
            </span>
          </div>
          <div class="flex items-center gap-2">
            <span class="inline-block px-2.5 py-1 bg-slate-100 rounded-lg text-[11px] text-slate-600 font-semibold">
              {{ entityLabel(log.entity) }}
            </span>
          </div>
          <p class="text-[12px] text-slate-600">{{ log.description }}</p>
        </div>
      </div>

      <!-- Desktop table (≥ md) -->
      <div class="hidden md:block overflow-x-auto">
      <table class="w-full border-collapse text-[13px] min-w-[560px]">
        <thead>
          <tr>
            <th v-for="h in ['Fecha','Admin','Acción','Entidad','Descripción']" :key="h"
              class="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-wide border-b border-slate-100 bg-slate-50 text-left whitespace-nowrap first:pl-5">
              {{ h }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="log in logs" :key="log.id" class="hover:bg-slate-50 border-b border-slate-50 last:border-0">
            <td class="px-4 py-3 pl-5 whitespace-nowrap text-[11px] text-slate-400">{{ formatDate(log.created_at) }}</td>
            <td class="px-4 py-3">
              <div class="flex items-center gap-2">
                <img :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${log.admin_name}`"
                  class="w-7 h-7 rounded-lg border border-slate-100 flex-shrink-0" />
                <span class="font-semibold text-[#0f172a]">{{ log.admin_name }}</span>
              </div>
            </td>
            <td class="px-4 py-3">
              <span :class="['inline-block px-2.5 py-1 rounded-lg text-[11px] font-black uppercase tracking-wide', actionBadgeClass(log.action)]">
                {{ actionLabel(log.action) }}
              </span>
            </td>
            <td class="px-4 py-3">
              <span class="inline-block px-2.5 py-1 bg-slate-100 rounded-lg text-[12px] text-slate-600 font-semibold">
                {{ entityLabel(log.entity) }}
              </span>
            </td>
            <td class="px-4 py-3 max-w-xs text-[13px] text-slate-600">{{ log.description }}</td>
          </tr>
        </tbody>
      </table>
      </div>

      <!-- Paginación -->
      <div v-if="pages > 1" class="flex items-center justify-center gap-4 px-5 py-4 border-t border-slate-100">
        <button :disabled="currentPage === 1" @click="fetchLogs(currentPage - 1)"
          class="px-4 py-2 bg-slate-100 rounded-xl text-[13px] font-bold text-slate-600 hover:bg-slate-200 transition disabled:opacity-40 disabled:cursor-not-allowed">
          ← Anterior
        </button>
        <span class="text-[13px] text-slate-500 font-semibold">Página {{ currentPage }} de {{ pages }}</span>
        <button :disabled="currentPage === pages" @click="fetchLogs(currentPage + 1)"
          class="px-4 py-2 bg-slate-100 rounded-xl text-[13px] font-bold text-slate-600 hover:bg-slate-200 transition disabled:opacity-40 disabled:cursor-not-allowed">
          Siguiente →
        </button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'

const logs        = ref([])
const total       = ref(0)
const pages       = ref(1)
const currentPage = ref(1)
const loading     = ref(true)
const search      = ref('')
const filterEntity = ref('')
const filterAction = ref('')

let debounceTimer = null
const debouncedFetch = () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => fetchLogs(1), 400)
}

const fetchLogs = async (page = 1) => {
  loading.value = true
  try {
    const params = { page, per_page: 50 }
    if (search.value.trim()) params.search = search.value.trim()
    if (filterEntity.value)  params.entity = filterEntity.value
    if (filterAction.value)  params.action = filterAction.value

    const { data } = await api.get('/admin/logs', { params })
    logs.value        = data.logs
    total.value       = data.total
    pages.value       = data.pages
    currentPage.value = data.current
  } catch { /* silent */ }
  finally { loading.value = false }
}

const actionCount = (action) => logs.value.filter(l => l.action === action).length

const ACTION_LABELS = {
  create: 'Crear', update: 'Editar', delete: 'Eliminar',
  verify: 'Verificar', toggle: 'Estado', cancel: 'Cancelar',
  complete: 'Completar', upload_evidence: 'Evidencia', rate: 'Calificación',
  reassign: 'Reasignar',
}
const ENTITY_LABELS = {
  user: 'Usuario', 'sub-admin': 'Sub-admin',
  category: 'Categoría', service: 'Servicio',
  service_request: 'Solicitud',
}

const actionLabel = (a) => ACTION_LABELS[a] ?? a
const entityLabel = (e) => ENTITY_LABELS[e] ?? e

const actionBadgeClass = (a) => ({
  create:          'bg-emerald-50 text-emerald-700',
  update:          'bg-blue-50 text-blue-700',
  delete:          'bg-red-50 text-red-600',
  verify:          'bg-amber-50 text-amber-700',
  toggle:          'bg-purple-50 text-purple-700',
  cancel:          'bg-slate-100 text-slate-500',
  complete:        'bg-teal-50 text-teal-700',
  upload_evidence: 'bg-indigo-50 text-indigo-700',
  rate:            'bg-pink-50 text-pink-700',
  reassign:        'bg-orange-50 text-orange-700',
}[a] ?? 'bg-slate-100 text-slate-500')

const formatDate = (iso) => {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
    + ' ' + d.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
}

onMounted(() => fetchLogs(1))
</script>
