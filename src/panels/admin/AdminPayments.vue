<template>
  <div class="space-y-5">

    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
          <svg viewBox="0 0 24 24" class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
        </div>
        <div>
          <p class="font-black text-[#0f172a]">Pagos y Dispersiones</p>
          <p class="text-[12px] text-slate-400">Gestión de cobros al cliente y pagos al profesional</p>
        </div>
      </div>
      <button @click="loadAll" :disabled="loading"
        class="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition disabled:opacity-50">
        <svg viewBox="0 0 24 24" :class="['w-4 h-4 text-slate-600', loading ? 'animate-spin' : '']" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-.4-6.15"/></svg>
      </button>
    </div>

    <!-- KPIs -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4" v-if="stats">
      <div class="bg-white border border-slate-100 rounded-2xl p-5 flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-2xl flex-shrink-0">💰</div>
        <div>
          <p class="text-xl font-black text-[#0f172a]">{{ stats.total_cobrado_fmt ?? '$0' }}</p>
          <p class="text-[12px] font-semibold text-slate-600">Total cobrado</p>
          <p class="text-[11px] text-slate-400">{{ stats.cobros_aprobados ?? 0 }} pagos aprobados</p>
        </div>
      </div>
      <div class="bg-white border border-slate-100 rounded-2xl p-5 flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-2xl flex-shrink-0">⏳</div>
        <div>
          <p class="text-xl font-black text-[#0f172a]">${{ fmtNum(stats.cobros_pendientes) }}</p>
          <p class="text-[12px] font-semibold text-slate-600">Cobros pendientes</p>
          <p class="text-[11px] text-slate-400">{{ stats.cobros_fallidos ?? 0 }} fallidos</p>
        </div>
      </div>
      <div class="bg-white border border-slate-100 rounded-2xl p-5 flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-2xl flex-shrink-0">🏦</div>
        <div>
          <p class="text-xl font-black text-[#0f172a]">{{ stats.total_dispersado_fmt ?? '$0' }}</p>
          <p class="text-[12px] font-semibold text-slate-600">Total dispersado</p>
          <p class="text-[11px] text-slate-400">a profesionales</p>
        </div>
      </div>
      <div :class="['bg-white border rounded-2xl p-5 flex items-center gap-4', (stats.dispersiones_pendientes ?? 0) > 0 ? 'border-amber-300 bg-amber-50/50' : 'border-slate-100']">
        <div class="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center text-2xl flex-shrink-0">🔔</div>
        <div>
          <p class="text-xl font-black text-[#0f172a]">{{ stats.dispersiones_pendientes ?? 0 }}</p>
          <p class="text-[12px] font-semibold text-slate-600">Dispersiones pendientes</p>
          <p class="text-[11px] text-slate-400">requieren atención</p>
        </div>
      </div>
    </div>
    <!-- KPI skeleton -->
    <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div v-for="n in 4" :key="n" class="bg-white border border-slate-100 rounded-2xl p-5 h-24 animate-pulse bg-slate-50"></div>
    </div>

    <!-- Tabs -->
    <div class="flex gap-2 overflow-x-auto pb-0.5">
      <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id"
        :class="['flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold border transition flex-shrink-0',
          activeTab === tab.id
            ? 'bg-white border-[#0d4f5c] text-[#0d4f5c] shadow-sm'
            : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300']">
        <span>{{ tab.icon }}</span>
        <span>{{ tab.label }}</span>
        <span v-if="tab.id === 'pending' && (stats?.dispersiones_pendientes ?? 0) > 0"
          class="bg-amber-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full leading-none">
          {{ stats.dispersiones_pendientes }}
        </span>
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-14">
      <svg class="animate-spin w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
    </div>

    <template v-else>

      <!-- ── Tab: Pendientes de dispersar ── -->
      <div v-if="activeTab === 'pending'" class="bg-white border border-slate-100 rounded-2xl overflow-hidden">
        <div class="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div>
            <p class="font-black text-[#0f172a]">Pendientes de dispersar</p>
          </div>
          <p class="text-[12px] text-slate-400">Servicios completados y pagados donde el profesional aún no ha recibido su pago</p>
        </div>

        <!-- Disburse result -->
        <div v-if="disburseResult" :class="['flex items-center justify-between mx-5 mt-4 px-4 py-3 rounded-xl text-[13px] font-semibold',
          disburseResult.success ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200']">
          <span>{{ disburseResult.message }}</span>
          <button @click="disburseResult = null" class="text-current opacity-60 hover:opacity-100 ml-3">×</button>
        </div>

        <div v-if="!pending.data?.length" class="flex justify-center py-14 text-slate-300 text-[13px]">
          No hay dispersiones pendientes
        </div>
        <template v-else>
          <!-- Mobile cards -->
          <div class="md:hidden space-y-3 p-3">
            <div v-for="sr in pending.data" :key="sr.id" class="bg-white border border-slate-100 rounded-2xl p-4 space-y-3">
              <div class="flex items-start justify-between gap-2">
                <div>
                  <p class="font-bold text-[#0f172a] text-[13px]">{{ sr.service_name }}</p>
                  <p class="text-[10px] text-slate-400 font-mono">SR#{{ sr.id }}</p>
                </div>
                <span :class="['text-[10px] font-bold px-2.5 py-1 rounded-full flex-shrink-0',
                  sr.payout_status === 'payout_failed' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-700']">
                  {{ sr.payout_status === 'payout_failed' ? 'Falló' : 'Pendiente' }}
                </span>
              </div>
              <div class="grid grid-cols-2 gap-y-2 text-[12px]">
                <div>
                  <p class="text-[10px] text-slate-400 uppercase tracking-wide font-bold">Profesional</p>
                  <p class="font-bold text-[#0f172a]">{{ sr.professional_name }}</p>
                </div>
                <div>
                  <p class="text-[10px] text-slate-400 uppercase tracking-wide font-bold">Monto</p>
                  <p class="font-bold text-[#0f172a]">{{ sr.budget_formatted }}</p>
                </div>
                <div class="col-span-2">
                  <p class="text-[10px] text-slate-400 uppercase tracking-wide font-bold">Actualizado</p>
                  <p class="text-slate-500">{{ fmtDateTime(sr.updated_at) }}</p>
                </div>
              </div>
              <div class="pt-2 border-t border-slate-50">
                <button @click="disburse(sr.id)" :disabled="disbursing === sr.id"
                  class="w-full flex items-center justify-center gap-1.5 bg-[#0d4f5c] text-white text-[12px] font-bold px-3 py-2 rounded-xl hover:opacity-90 transition disabled:opacity-60">
                  <svg v-if="disbursing === sr.id" class="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                  <span v-else>💸</span>
                  Dispersar
                </button>
              </div>
            </div>
          </div>
          <!-- Desktop table -->
          <div class="hidden md:block overflow-x-auto">
          <table class="w-full text-sm min-w-[740px]">
            <thead class="bg-slate-50">
              <tr>
                <th v-for="h in ['SR#','Servicio','Profesional','Monto bruto','Estado','Última actualización','Acción']" :key="h"
                  class="text-left px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wide">{{ h }}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr v-for="sr in pending.data" :key="sr.id" class="hover:bg-slate-50 transition">
                <td class="px-5 py-3 font-mono text-[12px] text-slate-600">{{ sr.id }}</td>
                <td class="px-5 py-3 text-[13px] text-[#0f172a]">{{ sr.service_name }}</td>
                <td class="px-5 py-3 font-bold text-[13px] text-[#0f172a]">{{ sr.professional_name }}</td>
                <td class="px-5 py-3 font-bold text-[13px] text-[#0f172a]">{{ sr.budget_formatted }}</td>
                <td class="px-5 py-3">
                  <span :class="['text-[10px] font-bold px-2.5 py-1 rounded-full',
                    sr.payout_status === 'payout_failed' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-700']">
                    {{ sr.payout_status === 'payout_failed' ? 'Falló' : 'Pendiente' }}
                  </span>
                </td>
                <td class="px-5 py-3 text-[12px] text-slate-400">{{ fmtDateTime(sr.updated_at) }}</td>
                <td class="px-5 py-3">
                  <button @click="disburse(sr.id)" :disabled="disbursing === sr.id"
                    class="flex items-center gap-1.5 bg-[#0d4f5c] text-white text-[12px] font-bold px-3 py-1.5 rounded-lg hover:opacity-90 transition disabled:opacity-60">
                    <svg v-if="disbursing === sr.id" class="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                    <span v-else>💸</span>
                    Dispersar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          </div>
        </template>
        <div v-if="pending.last_page > 1" class="flex items-center justify-center gap-2 px-5 py-3 border-t border-slate-100">
          <button class="page-btn" :disabled="pending.current_page <= 1" @click="loadPending(pending.current_page - 1)">‹</button>
          <span class="text-[12px] text-slate-500">Página {{ pending.current_page }} / {{ pending.last_page }}</span>
          <button class="page-btn" :disabled="pending.current_page >= pending.last_page" @click="loadPending(pending.current_page + 1)">›</button>
        </div>
      </div>

      <!-- ── Tab: Cobros al cliente ── -->
      <div v-else-if="activeTab === 'payments'" class="bg-white border border-slate-100 rounded-2xl overflow-hidden">
        <div class="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <p class="font-black text-[#0f172a]">Cobros al cliente</p>
          <select v-model="paymentFilter" @change="loadPayments()"
            class="px-3 py-1.5 rounded-xl border border-slate-200 text-[12px] text-slate-600 focus:outline-none bg-white">
            <option value="">Todos los estados</option>
            <option value="approved">Aprobados</option>
            <option value="pending">Pendientes</option>
            <option value="failed">Fallidos</option>
          </select>
        </div>

        <!-- Dev simulate panel -->
        <div class="flex flex-col sm:flex-row sm:items-center gap-3 mx-5 my-4 px-4 py-3 bg-amber-50 border border-amber-200 border-dashed rounded-xl">
          <span class="text-[12px] font-bold text-amber-700">🧪 Modo desarrollo</span>
          <input v-model="simSrId" type="number" placeholder="ID de solicitud (SR#)"
            class="flex-1 bg-white border border-amber-200 rounded-lg px-3 py-1.5 text-[12px] focus:outline-none focus:ring-2 focus:ring-amber-400/30" />
          <button @click="simulatePayment" :disabled="simulating || !simSrId"
            class="bg-amber-500 text-white text-[12px] font-bold px-4 py-1.5 rounded-lg hover:bg-amber-600 transition disabled:opacity-50 sm:flex-shrink-0">
            <svg v-if="simulating" class="inline animate-spin w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
            Simular pago aprobado
          </button>
          <span v-if="simResult" :class="['text-[12px] font-semibold', simResult.success ? 'text-emerald-600' : 'text-red-600']">
            {{ simResult.message }}
          </span>
        </div>

        <div v-if="!payments.data?.length" class="flex justify-center py-14 text-slate-300 text-[13px]">
          Sin cobros registrados aún
        </div>
        <template v-else>
          <!-- Mobile cards -->
          <div class="md:hidden space-y-3 p-3">
            <div v-for="p in payments.data" :key="p.id" class="bg-white border border-slate-100 rounded-2xl p-4 space-y-3">
              <div class="flex items-start justify-between gap-2">
                <div>
                  <p class="font-bold text-[#0f172a] text-[13px]">{{ p.client_name }}</p>
                  <p class="text-[10px] text-slate-400 font-mono">{{ p.reference }}</p>
                </div>
                <span :class="['text-[10px] font-bold px-2.5 py-1 rounded-full flex-shrink-0', statusClass(p.status)]">
                  {{ statusLabel(p.status) }}
                </span>
              </div>
              <div class="grid grid-cols-2 gap-y-2 text-[12px]">
                <div class="col-span-2">
                  <p class="text-[10px] text-slate-400 uppercase tracking-wide font-bold">Servicio</p>
                  <p class="text-slate-600">{{ p.service_name }}<span v-if="p.service_request_id" class="ml-1 bg-slate-100 text-slate-500 text-[10px] font-bold px-1.5 py-0.5 rounded">#{{ p.service_request_id }}</span></p>
                </div>
                <div>
                  <p class="text-[10px] text-slate-400 uppercase tracking-wide font-bold">Monto</p>
                  <p class="font-bold text-[#0f172a]">{{ p.amount_formatted }}</p>
                </div>
                <div>
                  <p class="text-[10px] text-slate-400 uppercase tracking-wide font-bold">Fecha</p>
                  <p class="text-slate-500">{{ fmtDateTime(p.paid_at ?? p.created_at) }}</p>
                </div>
              </div>
            </div>
          </div>
          <!-- Desktop table -->
          <div class="hidden md:block overflow-x-auto">
          <table class="w-full text-sm min-w-[700px]">
            <thead class="bg-slate-50">
              <tr>
                <th v-for="h in ['#','Referencia','Cliente','Servicio','Monto','Estado','Fecha']" :key="h"
                  class="text-left px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wide">{{ h }}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr v-for="p in payments.data" :key="p.id" class="hover:bg-slate-50 transition">
                <td class="px-5 py-3 font-mono text-[12px] text-slate-500">{{ p.id }}</td>
                <td class="px-5 py-3 font-mono text-[11px] text-slate-500">{{ p.reference }}</td>
                <td class="px-5 py-3 font-bold text-[13px] text-[#0f172a]">{{ p.client_name }}</td>
                <td class="px-5 py-3 text-[13px] text-slate-600">
                  {{ p.service_name }}
                  <span v-if="p.service_request_id" class="ml-1 bg-slate-100 text-slate-500 text-[10px] font-bold px-1.5 py-0.5 rounded">#{{ p.service_request_id }}</span>
                </td>
                <td class="px-5 py-3 font-bold text-[13px] text-[#0f172a]">{{ p.amount_formatted }}</td>
                <td class="px-5 py-3">
                  <span :class="['text-[10px] font-bold px-2.5 py-1 rounded-full', statusClass(p.status)]">
                    {{ statusLabel(p.status) }}
                  </span>
                </td>
                <td class="px-5 py-3 text-[12px] text-slate-400">{{ fmtDateTime(p.paid_at ?? p.created_at) }}</td>
              </tr>
            </tbody>
          </table>
          </div>
        </template>
        <div v-if="payments.last_page > 1" class="flex items-center justify-center gap-2 px-5 py-3 border-t border-slate-100">
          <button class="page-btn" :disabled="payments.current_page <= 1" @click="loadPayments(payments.current_page - 1)">‹</button>
          <span class="text-[12px] text-slate-500">Página {{ payments.current_page }} / {{ payments.last_page }}</span>
          <button class="page-btn" :disabled="payments.current_page >= payments.last_page" @click="loadPayments(payments.current_page + 1)">›</button>
        </div>
      </div>

      <!-- ── Tab: Dispersiones ── -->
      <div v-else-if="activeTab === 'payouts'" class="bg-white border border-slate-100 rounded-2xl overflow-hidden">
        <div class="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <p class="font-black text-[#0f172a]">Dispersiones al profesional</p>
          <select v-model="payoutFilter" @change="loadPayouts()"
            class="px-3 py-1.5 rounded-xl border border-slate-200 text-[12px] text-slate-600 focus:outline-none bg-white">
            <option value="">Todos los estados</option>
            <option value="processing">En proceso</option>
            <option value="approved">Aprobadas</option>
            <option value="failed">Fallidas</option>
          </select>
        </div>

        <div v-if="!payouts.data?.length" class="flex justify-center py-14 text-slate-300 text-[13px]">
          Sin dispersiones registradas aún
        </div>
        <template v-else>
          <!-- Mobile cards -->
          <div class="md:hidden space-y-3 p-3">
            <div v-for="p in payouts.data" :key="p.id" class="bg-white border border-slate-100 rounded-2xl p-4 space-y-3">
              <div class="flex items-start justify-between gap-2">
                <div>
                  <p class="font-bold text-[#0f172a] text-[13px]">{{ p.professional_name }}</p>
                  <p class="text-[10px] text-slate-400 font-mono">#{{ p.id }}</p>
                </div>
                <span :class="['text-[10px] font-bold px-2.5 py-1 rounded-full flex-shrink-0', statusClass(p.status)]">
                  {{ statusLabel(p.status) }}
                </span>
              </div>
              <div class="grid grid-cols-2 gap-y-2 text-[12px]">
                <div>
                  <p class="text-[10px] text-slate-400 uppercase tracking-wide font-bold">Monto</p>
                  <p class="font-bold text-[#0f172a]">{{ p.amount_formatted }}</p>
                </div>
                <div>
                  <p class="text-[10px] text-slate-400 uppercase tracking-wide font-bold">Método</p>
                  <p class="text-slate-600">{{ methodLabel(p.payment_method) }}</p>
                </div>
                <div>
                  <p class="text-[10px] text-slate-400 uppercase tracking-wide font-bold">Origen</p>
                  <span :class="['text-[10px] font-bold px-2 py-0.5 rounded-full',
                    p.triggered_by === 'auto' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700']">
                    {{ p.triggered_by === 'auto' ? 'Auto' : 'Manual' }}
                  </span>
                </div>
                <div>
                  <p class="text-[10px] text-slate-400 uppercase tracking-wide font-bold">Fecha</p>
                  <p class="text-slate-500">{{ fmtDateTime(p.paid_at ?? p.created_at) }}</p>
                </div>
              </div>
            </div>
          </div>
          <!-- Desktop table -->
          <div class="hidden md:block overflow-x-auto">
          <table class="w-full text-sm min-w-[780px]">
            <thead class="bg-slate-50">
              <tr>
                <th v-for="h in ['#','Profesional','Monto','Método','Estado Wompi','Estado','Origen','Fecha']" :key="h"
                  class="text-left px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wide">{{ h }}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr v-for="p in payouts.data" :key="p.id" class="hover:bg-slate-50 transition">
                <td class="px-5 py-3 font-mono text-[12px] text-slate-500">{{ p.id }}</td>
                <td class="px-5 py-3 font-bold text-[13px] text-[#0f172a]">{{ p.professional_name }}</td>
                <td class="px-5 py-3 font-bold text-[13px] text-[#0f172a]">{{ p.amount_formatted }}</td>
                <td class="px-5 py-3 text-[12px] text-slate-500">{{ methodLabel(p.payment_method) }}</td>
                <td class="px-5 py-3">
                  <span class="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                    {{ p.wompi_status ?? '—' }}
                  </span>
                </td>
                <td class="px-5 py-3">
                  <span :class="['text-[10px] font-bold px-2.5 py-1 rounded-full', statusClass(p.status)]">
                    {{ statusLabel(p.status) }}
                  </span>
                </td>
                <td class="px-5 py-3">
                  <span :class="['text-[10px] font-bold px-2 py-0.5 rounded-full',
                    p.triggered_by === 'auto' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700']">
                    {{ p.triggered_by === 'auto' ? 'Automático' : 'Manual' }}
                  </span>
                </td>
                <td class="px-5 py-3 text-[12px] text-slate-400">{{ fmtDateTime(p.paid_at ?? p.created_at) }}</td>
              </tr>
            </tbody>
          </table>
          </div>
        </template>
        <div v-if="payouts.last_page > 1" class="flex items-center justify-center gap-2 px-5 py-3 border-t border-slate-100">
          <button class="page-btn" :disabled="payouts.current_page <= 1" @click="loadPayouts(payouts.current_page - 1)">‹</button>
          <span class="text-[12px] text-slate-500">Página {{ payouts.current_page }} / {{ payouts.last_page }}</span>
          <button class="page-btn" :disabled="payouts.current_page >= payouts.last_page" @click="loadPayouts(payouts.current_page + 1)">›</button>
        </div>
      </div>

    </template>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import api from '@/services/api'

const loading        = ref(false)
const activeTab      = ref('pending')
const paymentFilter  = ref('')
const payoutFilter   = ref('')
const disbursing     = ref(null)
const disburseResult = ref(null)
const simSrId        = ref('')
const simulating     = ref(false)
const simResult      = ref(null)

const stats    = ref(null)
const payments = ref({ data: [], last_page: 1, current_page: 1 })
const payouts  = ref({ data: [], last_page: 1, current_page: 1 })
const pending  = ref({ data: [], last_page: 1, current_page: 1 })

const tabs = [
  { id: 'pending',  icon: '🔔', label: 'Pendientes de dispersar' },
  { id: 'payments', icon: '💳', label: 'Cobros al cliente' },
  { id: 'payouts',  icon: '🏦', label: 'Dispersiones' },
]

const fmtNum = (v) => new Intl.NumberFormat('es-CO').format(v ?? 0)

const fmtDateTime = (d) => {
  if (!d) return '—'
  return new Date(d).toLocaleString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const statusLabel = (s) => ({ approved: 'Aprobado', pending: 'Pendiente', failed: 'Fallido', processing: 'En proceso' }[s] ?? s)
const statusClass = (s) => ({
  approved:   'bg-emerald-100 text-emerald-700',
  pending:    'bg-amber-100 text-amber-700',
  failed:     'bg-red-100 text-red-600',
  processing: 'bg-blue-100 text-blue-700',
}[s] ?? 'bg-slate-100 text-slate-600')

const methodLabel = (m) => ({ bank_transfer: 'Transferencia', nequi: 'Nequi', daviplata: 'Daviplata' }[m] ?? (m ?? '—'))

const loadStats = async () => {
  try {
    const { data } = await api.get('/admin/payments/stats')
    stats.value = data
  } catch { stats.value = { total_cobrado_fmt: '$0', cobros_aprobados: 0, cobros_pendientes: 0, cobros_fallidos: 0, total_dispersado_fmt: '$0', dispersiones_pendientes: 0 } }
}

const loadPayments = async (page = 1) => {
  try {
    const params = { page }
    if (paymentFilter.value) params.status = paymentFilter.value
    const { data } = await api.get('/admin/payments', { params })
    payments.value = data
  } catch { /* silencioso */ }
}

const loadPayouts = async (page = 1) => {
  try {
    const params = { page }
    if (payoutFilter.value) params.status = payoutFilter.value
    const { data } = await api.get('/admin/payouts', { params })
    payouts.value = data
  } catch { /* silencioso */ }
}

const loadPending = async (page = 1) => {
  try {
    const { data } = await api.get('/admin/payments/pending-payouts', { params: { page } })
    pending.value = data
  } catch { /* silencioso */ }
}

const loadAll = async () => {
  loading.value = true
  await Promise.all([loadStats(), loadPayments(), loadPayouts(), loadPending()])
  loading.value = false
}

const disburse = async (srId) => {
  disbursing.value = srId
  disburseResult.value = null
  try {
    const { data } = await api.post(`/admin/payouts/${srId}/disburse`)
    disburseResult.value = { success: data.success, message: data.message }
    if (data.success) await Promise.all([loadPending(), loadPayouts(), loadStats()])
  } catch (e) {
    disburseResult.value = { success: false, message: e.response?.data?.message ?? 'Error al dispersar' }
  } finally {
    disbursing.value = null
  }
}

const simulatePayment = async () => {
  simulating.value = true
  simResult.value = null
  try {
    const { data } = await api.post(`/admin/payments/${simSrId.value}/simulate`)
    simResult.value = { success: true, message: data.message }
    simSrId.value = ''
    await Promise.all([loadPayments(), loadStats()])
  } catch (e) {
    simResult.value = { success: false, message: e.response?.data?.message ?? 'Error al simular' }
  } finally {
    simulating.value = false
  }
}

watch(activeTab, (tab) => {
  if (tab === 'payments' && !payments.value.data?.length) loadPayments()
  if (tab === 'payouts'  && !payouts.value.data?.length)  loadPayouts()
})

onMounted(loadAll)
</script>

<style scoped>
.page-btn {
  @apply w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-bold transition disabled:opacity-30;
}
</style>
