<template>
  <div class="space-y-6">

    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <p class="font-black text-[#0f172a]">Catálogo de servicios</p>
        <p class="text-sm text-slate-400 mt-0.5">{{ adminServices.length }} servicios registrados</p>
      </div>
      <button @click="openSvcModal(null)"
        class="bg-gradient-to-r from-teal-600 to-teal-700 text-white text-[13px] font-bold px-5 py-2.5 rounded-xl hover:opacity-90 transition">
        + Nuevo servicio
      </button>
    </div>

    <!-- Filtros -->
    <div class="flex gap-3">
      <div class="flex-1 relative">
        <svg viewBox="0 0 24 24" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/></svg>
        <input v-model="svcSearch" placeholder="Buscar servicio..."
          class="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-teal-500/30" />
      </div>
      <select v-model="svcCatFilter"
        class="px-3 py-2.5 rounded-xl border border-slate-200 text-[13px] text-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500/30 bg-white">
        <option value="">Todas las categorías</option>
        <option v-for="c in categories" :key="c.id" :value="c.name">{{ c.name }}</option>
      </select>
    </div>

    <!-- Cards mobile / Table desktop -->
    <div class="bg-white border border-slate-100 rounded-2xl overflow-hidden">

      <!-- Loading / Empty states -->
      <div v-if="svcLoading" class="px-6 py-8 text-center text-slate-300 text-[13px]">Cargando servicios…</div>
      <div v-else-if="!filteredAdminServices.length" class="px-6 py-8 text-center text-slate-300 text-[13px]">No hay servicios</div>

      <template v-else>
        <!-- Mobile cards (< md) -->
        <div class="md:hidden divide-y divide-slate-50">
          <div v-for="s in svsMobilePagedItems" :key="s.id" class="p-4 space-y-3">
            <div class="flex items-start justify-between gap-2">
              <div class="flex-1 min-w-0">
                <p class="font-bold text-[#0f172a] text-[13px]">{{ s.name }}</p>
                <p class="text-[11px] text-slate-400 mt-0.5 line-clamp-2">{{ s.description }}</p>
              </div>
              <span :class="['text-[10px] font-bold px-2.5 py-1 rounded-full flex-shrink-0', s.active ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600']">
                {{ s.active ? 'Activo' : 'Inactivo' }}
              </span>
            </div>
            <div class="flex items-center gap-2">
              <span class="bg-teal-100 text-teal-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full">{{ s.category }}</span>
              <span class="font-bold text-[#0f172a] text-[13px] ml-auto">${{ Number(s.price ?? 0).toLocaleString('es-CO') }}</span>
            </div>
            <div class="flex gap-2 pt-2 border-t border-slate-50">
              <button @click="openSvcModal(s)"
                class="flex-1 py-2 rounded-xl bg-blue-50 text-blue-700 text-[12px] font-semibold hover:bg-blue-100 transition">
                Editar
              </button>
              <button @click="toggleSvcStatus(s)"
                :class="['flex-1 py-2 rounded-xl text-[12px] font-semibold transition', s.active ? 'bg-amber-50 text-amber-700 hover:bg-amber-100' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100']">
                {{ s.active ? 'Desactivar' : 'Activar' }}
              </button>
              <button @click="deleteSvc(s.id)"
                class="px-4 py-2 rounded-xl bg-red-50 text-red-600 text-[12px] font-semibold hover:bg-red-100 transition">
                Eliminar
              </button>
            </div>
          </div>
        </div>
        <!-- Mobile pagination -->
        <div v-if="svsMobileTotalPages > 1" class="md:hidden flex items-center justify-center gap-3 px-4 py-3 border-t border-slate-100">
          <button :disabled="svsMobilePage <= 1" @click="svsMobilePage--"
            class="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 text-sm font-bold disabled:opacity-30 hover:bg-slate-200 transition">‹</button>
          <span class="text-[12px] text-slate-500 font-semibold">{{ svsMobilePage }} / {{ svsMobileTotalPages }}</span>
          <button :disabled="svsMobilePage >= svsMobileTotalPages" @click="svsMobilePage++"
            class="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 text-sm font-bold disabled:opacity-30 hover:bg-slate-200 transition">›</button>
        </div>

        <!-- Desktop table (≥ md) -->
        <div class="hidden md:block overflow-x-auto">
        <table class="w-full text-sm min-w-[540px]">
          <thead class="bg-slate-50">
            <tr>
              <th v-for="h in ['Servicio','Categoría','Precio','Estado','Acciones']" :key="h"
                class="text-left px-6 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wide">{{ h }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            <tr v-for="s in filteredAdminServices" :key="s.id" class="hover:bg-slate-50 transition">
              <td class="px-6 py-4">
                <p class="font-semibold text-[#0f172a] text-[13px]">{{ s.name }}</p>
                <p class="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{{ s.description }}</p>
              </td>
              <td class="px-6 py-4">
                <span class="bg-teal-100 text-teal-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full">{{ s.category }}</span>
              </td>
              <td class="px-6 py-4 font-bold text-[#0f172a] text-[13px]">
                ${{ Number(s.price ?? 0).toLocaleString('es-CO') }}
              </td>
              <td class="px-6 py-4">
                <span :class="['text-[10px] font-bold px-2.5 py-0.5 rounded-full', s.active ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600']">
                  {{ s.active ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex gap-3">
                  <button @click="openSvcModal(s)" class="text-[12px] text-blue-600 hover:underline font-semibold">Editar</button>
                  <button @click="toggleSvcStatus(s)" :class="['text-[12px] font-semibold hover:underline', s.active ? 'text-amber-600' : 'text-emerald-600']">
                    {{ s.active ? 'Desactivar' : 'Activar' }}
                  </button>
                  <button @click="deleteSvc(s.id)" class="text-[12px] text-red-500 hover:underline font-semibold">Eliminar</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        </div>
      </template>
    </div>

  </div>

  <!-- Modal -->
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200"
      enter-from-class="opacity-0"
      leave-active-class="transition duration-150"
      leave-to-class="opacity-0">
      <div v-if="showSvcModal"
        class="fixed inset-0 z-[110] flex items-center justify-center p-4"
        style="background:rgba(15,23,42,.55)"
        @click.self="showSvcModal = false">
        <Transition
          enter-active-class="transition duration-200"
          enter-from-class="opacity-0 scale-95"
          leave-active-class="transition duration-150"
          leave-to-class="opacity-0 scale-95">
          <div v-if="showSvcModal" class="bg-white rounded-2xl shadow-2xl w-full max-w-lg" @click.stop>

            <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <p class="font-black text-[#0f172a]">{{ editingSvc ? 'Editar servicio' : 'Nuevo servicio' }}</p>
              <button @click="showSvcModal = false" class="text-slate-400 hover:text-slate-600 text-xl leading-none">×</button>
            </div>

            <div class="p-6 space-y-4">
              <div>
                <label class="block text-[12px] font-bold text-slate-500 mb-1">Nombre del servicio *</label>
                <input v-model="svcForm.name"
                  class="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                  placeholder="Ej: Limpieza a domicilio" />
              </div>
              <div>
                <label class="block text-[12px] font-bold text-slate-500 mb-1">Descripción</label>
                <textarea v-model="svcForm.description" rows="2"
                  class="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-teal-500/30 resize-none"
                  placeholder="Breve descripción del servicio…" />
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-[12px] font-bold text-slate-500 mb-1">Precio desde ($) *</label>
                  <input v-model.number="svcForm.price" type="number" min="0"
                    class="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                    placeholder="50000" />
                </div>
                <div>
                  <label class="block text-[12px] font-bold text-slate-500 mb-1">Categoría *</label>
                  <select v-model="svcForm.category_id"
                    class="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-teal-500/30 bg-white">
                    <option value="">— Seleccionar —</option>
                    <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
                  </select>
                </div>
              </div>
              <div class="flex items-center justify-between py-1">
                <div>
                  <p class="text-[13px] font-semibold text-[#0f172a]">Servicio activo</p>
                  <p class="text-[11px] text-slate-400">Visible para los clientes en la plataforma</p>
                </div>
                <button @click="svcForm.active = !svcForm.active"
                  :class="['w-11 h-6 rounded-full transition-colors relative flex-shrink-0', svcForm.active ? 'bg-teal-600' : 'bg-slate-200']">
                  <span class="absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all"
                    :style="{left: svcForm.active ? '24px' : '4px'}"></span>
                </button>
              </div>
            </div>

            <div class="flex justify-end gap-3 px-6 py-4 border-t border-slate-100">
              <button @click="showSvcModal = false"
                class="px-5 py-2.5 rounded-xl border border-slate-200 text-[13px] text-slate-600 hover:bg-slate-50 transition">
                Cancelar
              </button>
              <button @click="saveSvc" :disabled="svcSaving"
                class="px-5 py-2.5 rounded-xl bg-[#0d4f5c] text-white text-[13px] font-bold hover:opacity-90 transition disabled:opacity-60">
                {{ svcSaving ? 'Guardando…' : (editingSvc ? 'Guardar cambios' : 'Crear servicio') }}
              </button>
            </div>

          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import api from '@/services/api'
import serviceService from '@/services/serviceService'
import { useAdminToast } from './useAdminToast'

const { showToast } = useAdminToast()

const svcLoading   = ref(false)
const svcSearch    = ref('')
const svcCatFilter = ref('')
const categories   = ref([])

const adminServices = reactive([])

const showSvcModal = ref(false)
const editingSvc   = ref(null)
const svcForm      = reactive({ name: '', description: '', price: 0, category_id: '', active: true })
const svcSaving    = ref(false)

const filteredAdminServices = computed(() =>
  adminServices.filter(s => {
    const matchName = !svcSearch.value || s.name.toLowerCase().includes(svcSearch.value.toLowerCase())
    const matchCat  = !svcCatFilter.value || s.category === svcCatFilter.value
    return matchName && matchCat
  })
)

const SVC_MOBILE_PG = 6
const svsMobilePage = ref(1)
const svsMobilePagedItems = computed(() => {
  const start = (svsMobilePage.value - 1) * SVC_MOBILE_PG
  return filteredAdminServices.value.slice(start, start + SVC_MOBILE_PG)
})
const svsMobileTotalPages = computed(() => Math.ceil(filteredAdminServices.value.length / SVC_MOBILE_PG))
watch([svcSearch, svcCatFilter], () => { svsMobilePage.value = 1 })

const openSvcModal = (svc) => {
  editingSvc.value    = svc
  svcForm.name        = svc?.name        ?? ''
  svcForm.description = svc?.description ?? ''
  svcForm.price       = svc?.price       ?? 0
  svcForm.category_id = svc?.category_id ?? ''
  svcForm.active      = svc?.active      ?? true
  showSvcModal.value  = true
}

const saveSvc = async () => {
  if (!svcForm.name.trim())  { showToast('El nombre es requerido', 'error'); return }
  if (!svcForm.category_id)  { showToast('Selecciona una categoría', 'error'); return }
  svcSaving.value = true
  try {
    const catObj = categories.value.find(c => c.id === svcForm.category_id)
    if (editingSvc.value) {
      await serviceService.update(editingSvc.value.id, svcForm)
      const idx = adminServices.findIndex(s => s.id === editingSvc.value.id)
      if (idx !== -1) {
        Object.assign(adminServices[idx], {
          name:        svcForm.name,
          description: svcForm.description,
          price:       svcForm.price,
          category:    catObj?.name ?? svcForm.category_id,
          category_id: svcForm.category_id,
          active:      svcForm.active,
        })
      }
      showToast('Servicio actualizado', 'success')
    } else {
      const { data } = await serviceService.store(svcForm)
      adminServices.push({
        id:          data?.id ?? Date.now(),
        name:        svcForm.name,
        description: svcForm.description,
        price:       svcForm.price,
        category:    catObj?.name ?? '',
        category_id: svcForm.category_id,
        active:      svcForm.active,
      })
      showToast('Servicio creado', 'success')
    }
    showSvcModal.value = false
  } catch { showToast('Error al guardar el servicio', 'error') }
  finally { svcSaving.value = false }
}

const toggleSvcStatus = async (svc) => {
  const prev = svc.active
  svc.active = !svc.active
  try {
    await serviceService.update(svc.id, { active: svc.active })
    showToast(svc.active ? 'Servicio activado' : 'Servicio desactivado', 'success')
  } catch { svc.active = prev; showToast('Error al cambiar estado', 'error') }
}

const deleteSvc = async (id) => {
  if (!confirm('¿Eliminar este servicio?')) return
  try {
    await serviceService.delete(id)
    const idx = adminServices.findIndex(s => s.id === id)
    if (idx !== -1) adminServices.splice(idx, 1)
    showToast('Servicio eliminado', 'success')
  } catch { showToast('Error al eliminar', 'error') }
}

onMounted(async () => {
  const [svcRes, catRes] = await Promise.allSettled([
    serviceService.getAll(),
    api.get('/admin/categories'),
  ])

  if (svcRes.status === 'fulfilled') {
    const list = Array.isArray(svcRes.value.data) ? svcRes.value.data : svcRes.value.data?.data
    if (Array.isArray(list) && list.length) {
      adminServices.splice(0, adminServices.length, ...list.map(s => ({
        id:          s.id,
        name:        s.name,
        description: s.description ?? '',
        category:    s.category_name ?? s.category?.name ?? '—',
        category_id: s.category_id  ?? s.category?.id   ?? '',
        price:       Number(s.price ?? 0),
        active:      s.active ?? true,
      })))
    }
  }

  if (catRes.status === 'fulfilled') {
    const raw = catRes.value.data.categories ?? catRes.value.data
    if (Array.isArray(raw)) {
      categories.value = raw.map(c => ({ id: c.id, name: c.name }))
    }
  }

  svcLoading.value = false
})
</script>
