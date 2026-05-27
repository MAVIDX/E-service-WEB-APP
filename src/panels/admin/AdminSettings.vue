<template>
  <div class="space-y-6">
    <div>
      <p class="font-black text-[#0f172a]">Configuración de la plataforma</p>
      <p class="text-sm text-slate-400 mt-0.5">Ajustes generales del sistema</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

      <!-- General -->
      <div class="bg-white border border-slate-100 rounded-2xl p-6 space-y-4">
        <p class="font-black text-[#0f172a] text-[15px]">Información general</p>
        <div>
          <label class="block text-[12px] font-bold text-slate-500 mb-1">Nombre de la plataforma</label>
          <input v-model="cfg.platform_name" class="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-teal-500/30" placeholder="e-Service" />
        </div>
        <div>
          <label class="block text-[12px] font-bold text-slate-500 mb-1">Email de contacto</label>
          <input v-model="cfg.contact_email" type="email" class="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-teal-500/30" placeholder="soporte@e-service.co" />
        </div>
        <div>
          <label class="block text-[12px] font-bold text-slate-500 mb-1">Teléfono de soporte</label>
          <input v-model="cfg.support_phone" class="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-teal-500/30" placeholder="+57 300 000 0000" />
        </div>
      </div>

      <!-- Financiero -->
      <div class="bg-white border border-slate-100 rounded-2xl p-6 space-y-4">
        <p class="font-black text-[#0f172a] text-[15px]">Configuración financiera</p>
        <div>
          <label class="block text-[12px] font-bold text-slate-500 mb-1">Comisión de la plataforma (%)</label>
          <input v-model.number="cfg.commission_rate" type="number" min="0" max="100" step="0.5"
            class="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-teal-500/30" placeholder="10" />
          <p class="text-[11px] text-slate-400 mt-1">Porcentaje que la plataforma retiene de cada pago</p>
        </div>
        <div>
          <label class="block text-[12px] font-bold text-slate-500 mb-1">Monto mínimo de retiro ($)</label>
          <input v-model.number="cfg.min_withdrawal" type="number" min="0"
            class="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-teal-500/30" placeholder="50000" />
        </div>
        <div>
          <label class="block text-[12px] font-bold text-slate-500 mb-1">Clave pública Wompi</label>
          <input v-model="cfg.wompi_public_key" class="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-[13px] font-mono focus:outline-none focus:ring-2 focus:ring-teal-500/30" placeholder="pub_test_…" />
        </div>
      </div>

      <!-- Sistema -->
      <div class="bg-white border border-slate-100 rounded-2xl p-6 space-y-4">
        <p class="font-black text-[#0f172a] text-[15px]">Sistema</p>
        <div class="flex items-center justify-between py-2">
          <div>
            <p class="text-[13px] font-semibold text-[#0f172a]">Modo mantenimiento</p>
            <p class="text-[11px] text-slate-400">Los usuarios verán un mensaje de "en mantenimiento"</p>
          </div>
          <button @click="cfg.maintenance_mode = !cfg.maintenance_mode"
            :class="['w-11 h-6 rounded-full transition-colors relative flex-shrink-0', cfg.maintenance_mode ? 'bg-red-500' : 'bg-slate-200']">
            <span class="absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all"
              :style="{left: cfg.maintenance_mode ? '24px' : '4px'}"></span>
          </button>
        </div>
        <div class="flex items-center justify-between py-2">
          <div>
            <p class="text-[13px] font-semibold text-[#0f172a]">Registro de nuevos usuarios</p>
            <p class="text-[11px] text-slate-400">Permitir que nuevos usuarios se registren</p>
          </div>
          <button @click="cfg.allow_registration = !cfg.allow_registration"
            :class="['w-11 h-6 rounded-full transition-colors relative flex-shrink-0', cfg.allow_registration ? 'bg-[#0d4f5c]' : 'bg-slate-200']">
            <span class="absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all"
              :style="{left: cfg.allow_registration ? '24px' : '4px'}"></span>
          </button>
        </div>
        <div class="flex items-center justify-between py-2">
          <div>
            <p class="text-[13px] font-semibold text-[#0f172a]">Registro de profesionales</p>
            <p class="text-[11px] text-slate-400">Permitir que nuevos proveedores se registren</p>
          </div>
          <button @click="cfg.allow_pro_registration = !cfg.allow_pro_registration"
            :class="['w-11 h-6 rounded-full transition-colors relative flex-shrink-0', cfg.allow_pro_registration ? 'bg-[#0d4f5c]' : 'bg-slate-200']">
            <span class="absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all"
              :style="{left: cfg.allow_pro_registration ? '24px' : '4px'}"></span>
          </button>
        </div>
      </div>

      <!-- Notificaciones -->
      <div class="bg-white border border-slate-100 rounded-2xl p-6 space-y-4">
        <p class="font-black text-[#0f172a] text-[15px]">Notificaciones</p>
        <div>
          <label class="block text-[12px] font-bold text-slate-500 mb-1">Email para alertas del sistema</label>
          <input v-model="cfg.alerts_email" type="email" class="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-teal-500/30" placeholder="alertas@e-service.co" />
        </div>
        <div class="flex items-center justify-between py-2">
          <div>
            <p class="text-[13px] font-semibold text-[#0f172a]">Email al aprobar profesional</p>
            <p class="text-[11px] text-slate-400">Notificar al pro cuando sea aprobado</p>
          </div>
          <button @click="cfg.email_on_pro_approved = !cfg.email_on_pro_approved"
            :class="['w-11 h-6 rounded-full transition-colors relative flex-shrink-0', cfg.email_on_pro_approved ? 'bg-[#0d4f5c]' : 'bg-slate-200']">
            <span class="absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all"
              :style="{left: cfg.email_on_pro_approved ? '24px' : '4px'}"></span>
          </button>
        </div>
        <div class="flex items-center justify-between py-2">
          <div>
            <p class="text-[13px] font-semibold text-[#0f172a]">Email al completar solicitud</p>
            <p class="text-[11px] text-slate-400">Notificar al cliente cuando el servicio esté completado</p>
          </div>
          <button @click="cfg.email_on_completed = !cfg.email_on_completed"
            :class="['w-11 h-6 rounded-full transition-colors relative flex-shrink-0', cfg.email_on_completed ? 'bg-[#0d4f5c]' : 'bg-slate-200']">
            <span class="absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all"
              :style="{left: cfg.email_on_completed ? '24px' : '4px'}"></span>
          </button>
        </div>
      </div>
    </div>

    <!-- Save -->
    <div class="flex justify-end">
      <button @click="save" :disabled="saving"
        class="bg-gradient-to-r from-[#0d4f5c] to-teal-600 text-white font-bold px-8 py-3 rounded-xl hover:opacity-90 transition disabled:opacity-60 text-[13px]">
        {{ saving ? 'Guardando…' : 'Guardar configuración' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import api from '@/services/api'
import { useAdminToast } from './useAdminToast'

const { showToast } = useAdminToast()

const cfg = reactive({
  platform_name:          'e-Service',
  contact_email:          'soporte@e-service.co',
  support_phone:          '',
  commission_rate:        10,
  min_withdrawal:         50000,
  wompi_public_key:       '',
  alerts_email:           '',
  maintenance_mode:       false,
  allow_registration:     true,
  allow_pro_registration: true,
  email_on_pro_approved:  true,
  email_on_completed:     true,
})
const saving = ref(false)

const save = async () => {
  saving.value = true
  try {
    await api.put('/admin/settings', cfg)
    showToast('Configuración guardada', 'success')
  } catch {
    showToast('Error al guardar la configuración', 'error')
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  try {
    const { data } = await api.get('/admin/settings')
    if (data) Object.assign(cfg, data)
  } catch { /* usa defaults */ }
})
</script>
