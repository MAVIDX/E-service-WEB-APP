<template>
  <div class="space-y-5">

    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <p class="font-black text-[#0f172a]">Categorías y servicios</p>
        <p class="text-sm text-slate-400 mt-0.5">
          <span class="font-semibold text-[#0d4f5c]">{{ categories.length }}</span> categorías ·
          <span class="font-semibold text-[#0d4f5c]">{{ totalServices }}</span> servicios
        </p>
      </div>
      <div class="flex gap-2">
        <button @click="fetchCategories" :disabled="loading"
          class="border border-slate-200 text-slate-600 text-[13px] font-semibold px-4 py-2 rounded-xl hover:bg-slate-50 transition disabled:opacity-50">
          <svg :class="['w-4 h-4 inline mr-1', loading ? 'animate-spin' : '']" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
          Actualizar
        </button>
        <button @click="openCatModal(null)"
          class="bg-[#0d4f5c] text-white text-[13px] font-bold px-5 py-2 rounded-xl hover:opacity-90 transition">
          + Nueva categoría
        </button>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
      <div class="bg-white border border-slate-100 rounded-2xl p-4 flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
          <svg viewBox="0 0 24 24" class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>
        </div>
        <div><p class="text-xl font-black text-[#0f172a]">{{ categories.length }}</p><p class="text-[11px] text-slate-400 font-semibold">Categorías</p></div>
      </div>
      <div class="bg-white border border-slate-100 rounded-2xl p-4 flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
          <svg viewBox="0 0 24 24" class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
        </div>
        <div><p class="text-xl font-black text-[#0f172a]">{{ totalServices }}</p><p class="text-[11px] text-slate-400 font-semibold">Servicios</p></div>
      </div>
      <div class="bg-white border border-slate-100 rounded-2xl p-4 flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
          <svg viewBox="0 0 24 24" class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        </div>
        <div><p class="text-xl font-black text-[#0f172a]">${{ fmtCOP(avgPrice) }}</p><p class="text-[11px] text-slate-400 font-semibold">Precio promedio</p></div>
      </div>
      <div class="bg-white border border-slate-100 rounded-2xl p-4 flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center flex-shrink-0">
          <svg viewBox="0 0 24 24" class="w-4 h-4 text-[#0d4f5c]" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/></svg>
        </div>
        <div><p class="text-[14px] font-black text-[#0f172a] truncate">{{ topCategory }}</p><p class="text-[11px] text-slate-400 font-semibold">Más servicios</p></div>
      </div>
    </div>

    <!-- Search -->
    <div class="relative">
      <svg viewBox="0 0 24 24" class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/></svg>
      <input v-model="search" type="text" placeholder="Buscar categoría o servicio…"
        class="w-full pl-10 pr-9 py-2.5 bg-white border border-slate-200 rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-teal-500/30" />
      <button v-if="search" @click="search=''" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-lg leading-none">×</button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-12 text-slate-400">
      <svg class="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
      Cargando…
    </div>

    <!-- Empty -->
    <div v-else-if="!loading && filteredCats.length === 0" class="bg-white border border-slate-100 rounded-2xl py-16 text-center text-slate-300">
      <p class="text-[15px] font-bold text-slate-400">Sin resultados</p>
      <p class="text-[13px] mt-1">Intenta con otra búsqueda o crea una nueva categoría</p>
    </div>

    <!-- Accordion list -->
    <div v-else class="space-y-3">
      <div v-for="cat in filteredCats" :key="cat.id"
        class="bg-white border rounded-2xl overflow-hidden transition-all"
        :class="expandedIds.includes(cat.id) ? 'border-blue-200 shadow-sm' : 'border-slate-100'">

        <!-- Category header -->
        <div class="flex flex-col md:flex-row md:items-center md:justify-between px-5 py-4 cursor-pointer hover:bg-slate-50 transition select-none"
          :class="expandedIds.includes(cat.id) ? 'bg-blue-50/50' : ''"
          @click="toggleExpand(cat.id)">
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-10 h-10 rounded-xl bg-[#0d4f5c] flex items-center justify-center text-white font-black text-base flex-shrink-0">
              {{ cat.name.charAt(0).toUpperCase() }}
            </div>
            <div class="min-w-0 flex-1">
              <p class="font-bold text-[#0f172a] text-[14px]">{{ cat.name }}</p>
              <div class="flex items-center gap-2 mt-0.5">
                <span class="text-[11px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-semibold">{{ cat.services?.length ?? 0 }} servicios</span>
                <span v-if="cat.services?.length" class="text-[11px] text-slate-400">desde ${{ fmtCOP(minPrice(cat.services)) }}</span>
              </div>
            </div>
            <!-- Chevron on mobile only -->
            <svg class="md:hidden w-4 h-4 text-slate-400 transition-transform flex-shrink-0" :class="expandedIds.includes(cat.id) ? 'rotate-90' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>
          </div>
          <div class="flex items-center gap-2 mt-2 md:mt-0 flex-shrink-0" @click.stop>
            <button @click="openSvcModal(null, cat)"
              class="text-[12px] bg-emerald-100 text-emerald-700 font-bold px-3 py-1.5 rounded-lg hover:bg-emerald-200 transition">
              + Servicio
            </button>
            <button @click="openCatModal(cat)"
              class="text-[12px] bg-amber-100 text-amber-700 font-bold px-3 py-1.5 rounded-lg hover:bg-amber-200 transition">
              Editar
            </button>
            <button @click="askDelete('category', cat)"
              class="text-[12px] bg-red-100 text-red-600 font-bold px-3 py-1.5 rounded-lg hover:bg-red-200 transition">
              Eliminar
            </button>
            <!-- Chevron on desktop only -->
            <svg class="hidden md:block w-4 h-4 text-slate-400 transition-transform" :class="expandedIds.includes(cat.id) ? 'rotate-90' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>
          </div>
        </div>

        <!-- Services table -->
        <div v-show="expandedIds.includes(cat.id)" class="border-t border-slate-100">
          <div v-if="!cat.services?.length" class="px-6 py-4 text-[13px] text-slate-400 flex items-center gap-2">
            Sin servicios.
            <button @click="openSvcModal(null, cat)" class="text-blue-600 font-semibold hover:underline">Agregar uno</button>
          </div>
          <template v-else>
            <!-- Mobile cards (< md) -->
            <div class="md:hidden divide-y divide-slate-50">
              <div v-for="svc in cat.services" :key="svc.id" class="p-4 space-y-2.5">
                <div class="flex items-center justify-between gap-2">
                  <p class="font-bold text-[#0f172a] text-[13px]">{{ svc.name }}</p>
                  <span class="bg-emerald-100 text-emerald-700 text-[11px] font-bold px-2.5 py-1 rounded-lg flex-shrink-0">
                    ${{ fmtCOP(svc.price) }}
                  </span>
                </div>
                <div class="grid grid-cols-3 gap-x-3 gap-y-1.5 text-[11px]">
                  <div>
                    <p class="text-[9px] text-slate-400 uppercase font-bold">Aliados</p>
                    <p class="text-slate-600 font-semibold">{{ svc.allies_percentage ?? '—' }}%</p>
                  </div>
                  <div>
                    <p class="text-[9px] text-slate-400 uppercase font-bold">Pasarela</p>
                    <p class="text-slate-600 font-semibold">{{ svc.payment_gateway_commission ?? '—' }}%</p>
                  </div>
                  <div>
                    <p class="text-[9px] text-slate-400 uppercase font-bold">IMAVICX</p>
                    <p class="text-slate-600 font-semibold">{{ svc.imavicx_commission ?? '—' }}%</p>
                  </div>
                  <div>
                    <p class="text-[9px] text-slate-400 uppercase font-bold">ASECAL.</p>
                    <p class="text-slate-600 font-semibold">{{ svc.asecalidad_commission ?? '—' }}%</p>
                  </div>
                  <div>
                    <p class="text-[9px] text-slate-400 uppercase font-bold">Mant.</p>
                    <p class="text-slate-600 font-semibold">{{ svc.maintenance_percentage ?? '—' }}%</p>
                  </div>
                </div>
                <div class="flex gap-2 pt-1 border-t border-slate-50">
                  <button @click="openSvcModal(svc, cat)"
                    class="flex-1 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-[12px] font-semibold hover:bg-blue-100 transition">
                    Editar
                  </button>
                  <button @click="askDelete('service', svc)"
                    class="flex-1 py-1.5 rounded-lg bg-red-50 text-red-600 text-[12px] font-semibold hover:bg-red-100 transition">
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
            <!-- Desktop table (≥ md) -->
            <div class="hidden md:block overflow-x-auto">
            <table class="w-full text-sm min-w-[640px]">
              <thead class="bg-slate-50">
                <tr>
                  <th v-for="h in ['Servicio','Precio','Aliados%','Pasarela%','IMAVICX%','ASECALIDAD%','Mant%','']" :key="h"
                    class="text-left px-4 py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-wide whitespace-nowrap">{{ h }}</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-50">
                <tr v-for="svc in cat.services" :key="svc.id" class="hover:bg-slate-50 transition">
                  <td class="px-4 py-3 font-semibold text-[#0f172a] text-[13px]">{{ svc.name }}</td>
                  <td class="px-4 py-3"><span class="bg-emerald-100 text-emerald-700 text-[11px] font-bold px-2 py-0.5 rounded-lg">${{ fmtCOP(svc.price) }}</span></td>
                  <td class="px-4 py-3 text-slate-500 text-[12px]">{{ svc.allies_percentage ?? '—' }}%</td>
                  <td class="px-4 py-3 text-slate-500 text-[12px]">{{ svc.payment_gateway_commission ?? '—' }}%</td>
                  <td class="px-4 py-3 text-slate-500 text-[12px]">{{ svc.imavicx_commission ?? '—' }}%</td>
                  <td class="px-4 py-3 text-slate-500 text-[12px]">{{ svc.asecalidad_commission ?? '—' }}%</td>
                  <td class="px-4 py-3 text-slate-500 text-[12px]">{{ svc.maintenance_percentage ?? '—' }}%</td>
                  <td class="px-4 py-3">
                    <div class="flex gap-2 justify-end">
                      <button @click="openSvcModal(svc, cat)" class="text-[11px] text-blue-600 hover:underline font-semibold">Editar</button>
                      <button @click="askDelete('service', svc)" class="text-[11px] text-red-500 hover:underline font-semibold">Eliminar</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            </div>
          </template>
        </div>
      </div>
    </div>

  </div>

  <!-- ── Modales ── -->
  <Teleport to="body">

    <!-- Modal: Categoría -->
    <Transition name="fade">
      <div v-if="showCatModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4" style="background:rgba(15,23,42,0.55);" @click.self="showCatModal=false">
        <div class="bg-white rounded-3xl shadow-2xl w-full max-w-md p-7 space-y-4">
          <div class="flex items-center justify-between">
            <p class="font-black text-[#0f172a]">{{ editingCat ? 'Editar categoría' : 'Nueva categoría' }}</p>
            <button @click="showCatModal=false" class="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition text-lg">×</button>
          </div>
          <div>
            <label class="text-[11px] font-bold text-slate-400 uppercase tracking-wide block mb-1.5">Nombre</label>
            <input v-model="catForm.name" type="text" placeholder="Ej: Hogar y Mantenimiento"
              class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-blue-400 transition" />
          </div>
          <div>
            <label class="text-[11px] font-bold text-slate-400 uppercase tracking-wide block mb-1.5">Descripción (opcional)</label>
            <textarea v-model="catForm.description" rows="3" placeholder="Describe esta categoría..."
              class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-blue-400 transition resize-none" />
          </div>
          <p v-if="formErr" class="text-[12px] text-red-600 bg-red-50 rounded-xl px-3 py-2">{{ formErr }}</p>
          <div class="flex gap-3 pt-2">
            <button @click="showCatModal=false" class="flex-1 border border-slate-200 text-slate-600 text-[13px] font-semibold py-2.5 rounded-xl hover:bg-slate-50 transition">Cancelar</button>
            <button @click="saveCategory" :disabled="saving" class="flex-1 bg-[#0d4f5c] text-white text-[13px] font-bold py-2.5 rounded-xl hover:opacity-90 transition disabled:opacity-60">
              {{ saving ? 'Guardando…' : 'Guardar' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Modal: Servicio -->
    <Transition name="fade">
      <div v-if="showSvcModal" class="fixed inset-0 z-[110] flex items-center justify-center p-4" style="background:rgba(15,23,42,0.55);" @click.self="showSvcModal=false">
        <div class="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-7 space-y-4 max-h-[90vh] overflow-y-auto">
          <div class="flex items-center justify-between">
            <p class="font-black text-[#0f172a]">{{ editingSvc ? 'Editar servicio' : 'Nuevo servicio' }}</p>
            <button @click="showSvcModal=false" class="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition text-lg">×</button>
          </div>
          <div>
            <label class="text-[11px] font-bold text-slate-400 uppercase tracking-wide block mb-1.5">Nombre del servicio</label>
            <input v-model="svcForm.name" type="text" placeholder="Ej: Instalación de tomacorrientes"
              class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-blue-400 transition" />
          </div>
          <div>
            <label class="text-[11px] font-bold text-slate-400 uppercase tracking-wide block mb-1.5">Precio ($)</label>
            <input v-model.number="svcForm.price" type="number" min="0" placeholder="50000"
              class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-blue-400 transition" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div v-for="f in commissionFields" :key="f.key">
              <label class="text-[11px] font-bold text-slate-400 uppercase tracking-wide block mb-1.5">{{ f.label }}</label>
              <input v-model.number="svcForm[f.key]" type="number" min="0" max="100" step="0.01" placeholder="0"
                class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-blue-400 transition" />
            </div>
          </div>
          <p v-if="formErr" class="text-[12px] text-red-600 bg-red-50 rounded-xl px-3 py-2">{{ formErr }}</p>
          <div class="flex gap-3 pt-2">
            <button @click="showSvcModal=false" class="flex-1 border border-slate-200 text-slate-600 text-[13px] font-semibold py-2.5 rounded-xl hover:bg-slate-50 transition">Cancelar</button>
            <button @click="saveService" :disabled="saving" class="flex-1 bg-[#0d4f5c] text-white text-[13px] font-bold py-2.5 rounded-xl hover:opacity-90 transition disabled:opacity-60">
              {{ saving ? 'Guardando…' : 'Guardar' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Modal: Confirmar eliminación -->
    <Transition name="fade">
      <div v-if="showDeleteModal" class="fixed inset-0 z-[120] flex items-center justify-center p-4" style="background:rgba(15,23,42,0.55);" @click.self="showDeleteModal=false">
        <div class="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-7 text-center space-y-4">
          <div class="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto">
            <svg viewBox="0 0 24 24" class="w-7 h-7 text-red-500" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>
          </div>
          <div>
            <p class="font-black text-[#0f172a] text-[16px]">¿Eliminar {{ deleteTarget?.type === 'category' ? 'categoría' : 'servicio' }}?</p>
            <p class="text-[13px] text-slate-500 mt-1"><strong>{{ deleteTarget?.item?.name }}</strong> será eliminado permanentemente.</p>
          </div>
          <div class="flex gap-3">
            <button @click="showDeleteModal=false" class="flex-1 border border-slate-200 text-slate-600 text-[13px] font-semibold py-2.5 rounded-xl hover:bg-slate-50 transition">Cancelar</button>
            <button @click="confirmDelete" :disabled="saving" class="flex-1 bg-red-500 text-white text-[13px] font-bold py-2.5 rounded-xl hover:bg-red-600 transition disabled:opacity-60">
              {{ saving ? 'Eliminando…' : 'Sí, eliminar' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import categoryService from '@/services/categoryService'
import serviceService  from '@/services/serviceService'
import { useAdminToast } from './useAdminToast'

const { showToast } = useAdminToast()

// ── Estado ─────────────────────────────────────────────────────────────────────
const categories  = ref([])
const loading     = ref(false)
const search      = ref('')
const expandedIds = ref([])

const commissionFields = [
  { key: 'allies_percentage',          label: 'Aliados %' },
  { key: 'payment_gateway_commission', label: 'Pasarela %' },
  { key: 'imavicx_commission',         label: 'IMAVICX %' },
  { key: 'asecalidad_commission',      label: 'ASECALIDAD %' },
  { key: 'maintenance_percentage',     label: 'Mantenimiento %' },
]

// ── Computed ───────────────────────────────────────────────────────────────────
const totalServices = computed(() =>
  categories.value.reduce((s, c) => s + (c.services?.length ?? 0), 0)
)
const avgPrice = computed(() => {
  const all = categories.value.flatMap(c => (c.services ?? []).map(s => parseFloat(s.price) || 0))
  return all.length ? all.reduce((a, b) => a + b, 0) / all.length : 0
})
const topCategory = computed(() => {
  if (!categories.value.length) return '—'
  return [...categories.value].sort((a, b) => (b.services?.length ?? 0) - (a.services?.length ?? 0))[0]?.name ?? '—'
})
const filteredCats = computed(() => {
  const q = search.value.toLowerCase().trim()
  if (!q) return categories.value
  return categories.value
    .map(cat => ({ ...cat, services: (cat.services ?? []).filter(s => s.name.toLowerCase().includes(q)) }))
    .filter(cat => cat.name.toLowerCase().includes(q) || cat.services.length > 0)
})

// ── Helpers ────────────────────────────────────────────────────────────────────
const fmtCOP  = v => Number(v || 0).toLocaleString('es-CO', { maximumFractionDigits: 0 })
const minPrice = svcs => Math.min(...svcs.map(s => parseFloat(s.price) || 0))
const toggleExpand = id => {
  const i = expandedIds.value.indexOf(id)
  if (i === -1) expandedIds.value.push(id)
  else expandedIds.value.splice(i, 1)
}

// ── API ────────────────────────────────────────────────────────────────────────
const fetchCategories = async () => {
  loading.value = true
  try {
    const { data } = await categoryService.getAll()
    categories.value = (data.categories ?? data ?? []).map(c => ({
      ...c,
      services: Array.isArray(c.services) ? c.services : [],
    }))
    if (categories.value.length && !expandedIds.value.length) {
      expandedIds.value = [categories.value[0].id]
    }
  } catch { showToast('Error al cargar categorías', 'error') }
  finally { loading.value = false }
}

// ── Modal Categoría ────────────────────────────────────────────────────────────
const showCatModal = ref(false)
const editingCat   = ref(null)
const catForm      = ref({ name: '', description: '' })
const saving       = ref(false)
const formErr      = ref('')

const openCatModal = cat => {
  editingCat.value = cat
  catForm.value    = { name: cat?.name ?? '', description: cat?.description ?? '' }
  formErr.value    = ''
  showCatModal.value = true
}

const saveCategory = async () => {
  if (!catForm.value.name.trim()) { formErr.value = 'El nombre es requerido'; return }
  saving.value = true; formErr.value = ''
  try {
    if (editingCat.value) {
      await categoryService.update(editingCat.value.id, catForm.value)
      showToast('Categoría actualizada', 'success')
    } else {
      await categoryService.store(catForm.value)
      showToast('Categoría creada', 'success')
    }
    showCatModal.value = false
    await fetchCategories()
  } catch (e) {
    formErr.value = e?.response?.data?.message ?? 'Error al guardar'
  } finally { saving.value = false }
}

// ── Modal Servicio ─────────────────────────────────────────────────────────────
const showSvcModal  = ref(false)
const editingSvc    = ref(null)
const activeCat     = ref(null)
const svcForm       = ref({ name:'', price:0, allies_percentage:0, payment_gateway_commission:0, imavicx_commission:0, asecalidad_commission:0, maintenance_percentage:0 })

const openSvcModal = (svc, cat) => {
  editingSvc.value  = svc
  activeCat.value   = cat
  svcForm.value     = svc
    ? { name:svc.name, price:svc.price, allies_percentage:svc.allies_percentage??0, payment_gateway_commission:svc.payment_gateway_commission??0, imavicx_commission:svc.imavicx_commission??0, asecalidad_commission:svc.asecalidad_commission??0, maintenance_percentage:svc.maintenance_percentage??0 }
    : { name:'', price:0, allies_percentage:0, payment_gateway_commission:0, imavicx_commission:0, asecalidad_commission:0, maintenance_percentage:0 }
  formErr.value     = ''
  showSvcModal.value = true
}

const saveService = async () => {
  if (!svcForm.value.name.trim()) { formErr.value = 'El nombre es requerido'; return }
  saving.value = true; formErr.value = ''
  try {
    const payload = { ...svcForm.value, category_id: activeCat.value?.id }
    if (editingSvc.value) {
      await serviceService.update(editingSvc.value.id, payload)
      showToast('Servicio actualizado', 'success')
    } else {
      await serviceService.store(payload)
      showToast('Servicio creado', 'success')
    }
    showSvcModal.value = false
    await fetchCategories()
  } catch (e) {
    formErr.value = e?.response?.data?.message ?? 'Error al guardar'
  } finally { saving.value = false }
}

// ── Modal Eliminar ─────────────────────────────────────────────────────────────
const showDeleteModal = ref(false)
const deleteTarget    = ref(null)

const askDelete = (type, item) => {
  deleteTarget.value   = { type, item }
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  saving.value = true
  try {
    if (deleteTarget.value.type === 'category') {
      await categoryService.delete(deleteTarget.value.item.id)
      showToast('Categoría eliminada', 'success')
    } else {
      await serviceService.delete(deleteTarget.value.item.id)
      showToast('Servicio eliminado', 'success')
    }
    showDeleteModal.value = false
    await fetchCategories()
  } catch (e) {
    showToast(e?.response?.data?.message ?? 'Error al eliminar', 'error')
  } finally { saving.value = false }
}

onMounted(fetchCategories)
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .2s ease }
.fade-enter-from, .fade-leave-to       { opacity: 0 }
</style>
