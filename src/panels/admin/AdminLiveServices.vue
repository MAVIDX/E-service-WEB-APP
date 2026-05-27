<template>
  <div class="space-y-5 pb-8">

    <!-- Header -->
    <div class="flex items-start justify-between gap-4 flex-wrap">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center text-2xl flex-shrink-0">🔴</div>
        <div>
          <p class="font-black text-[#0f172a] text-2xl">Servicios en Vivo</p>
          <p class="text-[13px] text-slate-400 mt-1 flex items-center gap-2 flex-wrap">
            <span class="live-dot"></span>
            Monitoreo en tiempo real · Actualiza cada {{ POLL_INTERVAL / 1000 }}s
            <span class="text-slate-200">·</span>
            <span>Última: {{ lastUpdate }}</span>
          </p>
        </div>
      </div>
      <button @click="refreshAll" :disabled="loadingSummary"
        class="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white rounded-xl text-[13px] font-semibold text-slate-600 hover:bg-slate-50 transition disabled:opacity-50 disabled:cursor-not-allowed">
        <span :class="loadingSummary ? 'inline-block animate-spin' : ''">🔄</span>
        Actualizar
      </button>
    </div>

    <!-- KPI cards 2x4 -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
      <div v-for="kpi in kpis" :key="kpi.key"
        class="bg-white border border-slate-100 rounded-2xl p-5 flex items-start justify-between gap-3">
        <div class="flex-1 min-w-0">
          <p class="text-[12px] font-medium text-slate-500">{{ kpi.label }}</p>
          <div class="text-[22px] font-black text-[#0f172a] mt-1.5 leading-none">
            <span v-if="loadingSummary" class="inline-block w-10 h-5 bg-slate-100 rounded animate-pulse"></span>
            <span v-else>{{ summary[kpi.key] ?? 0 }}</span>
          </div>
        </div>
        <div :class="['w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0', kpiIconBg(kpi.color)]">
          {{ kpi.icon }}
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit flex-wrap">
      <button v-for="tab in tabs" :key="tab.key"
        :class="['flex items-center gap-1.5 px-4 py-2 rounded-[9px] text-[13px] font-bold transition-all',
          activeTab === tab.key ? 'bg-white text-[#0d4f5c] shadow-sm' : 'text-slate-500 hover:text-slate-700']"
        @click="activeTab = tab.key">
        <span>{{ tab.icon }}</span>
        {{ tab.label }}
        <span v-if="tabBadge(tab.key)"
          :class="['text-[10px] font-black px-1.5 py-px rounded-full min-w-[18px] text-center',
            activeTab === tab.key ? 'bg-[#0d4f5c] text-white' : 'bg-red-500 text-white']">
          {{ tabBadge(tab.key) }}
        </span>
      </button>
    </div>

    <!-- Filters -->
    <div class="flex items-center gap-3 flex-wrap">
      <div class="relative">
        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-sm pointer-events-none">🔍</span>
        <input v-model="search" type="text" placeholder="Buscar por cliente, profesional o ID…"
          class="pl-9 pr-8 py-2.5 border border-slate-200 rounded-xl text-[13px] w-64 focus:outline-none focus:ring-2 focus:ring-teal-500/30 transition" />
        <button v-if="search" @click="search = ''"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs hover:text-slate-600">✕</button>
      </div>
      <div v-if="activeTab === 'requests'" class="flex gap-1.5 flex-wrap">
        <button v-for="s in statusFilters" :key="s.value"
          :class="['flex items-center gap-1.5 px-3 py-2 border rounded-xl text-[12px] font-semibold transition-all',
            statusFilter === s.value
              ? 'bg-[#0d4f5c]/10 text-[#0d4f5c] border-[#0d4f5c]/30'
              : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300']"
          @click="setStatusFilter(s.value)">
          <span v-if="s.value" :class="['w-1.5 h-1.5 rounded-full flex-shrink-0', statusDotColor(s.value)]"></span>
          {{ s.label }}
        </button>
      </div>
    </div>

    <!-- ── TAB: SOLICITUDES ── -->
    <div v-if="activeTab === 'requests'">
      <!-- skeleton -->
      <div v-if="loadingRequests" class="space-y-2">
        <div v-for="n in 5" :key="n" class="flex items-center gap-3 bg-white border border-slate-100 rounded-2xl p-4">
          <div class="w-9 h-9 rounded-xl bg-slate-100 animate-pulse flex-shrink-0"></div>
          <div class="flex-1 space-y-2">
            <div class="h-3 bg-slate-100 rounded animate-pulse w-3/5"></div>
            <div class="h-2.5 bg-slate-100 rounded animate-pulse w-2/5"></div>
          </div>
          <div class="w-16 h-5 bg-slate-100 rounded animate-pulse"></div>
        </div>
      </div>
      <!-- empty -->
      <div v-else-if="filteredRequests.length === 0"
        class="text-center py-12 bg-white border border-dashed border-slate-200 rounded-2xl">
        <span class="text-3xl block mb-2">📋</span>
        <p class="font-bold text-slate-500 text-sm">Sin solicitudes</p>
        <p class="text-slate-400 text-xs mt-1">No hay solicitudes que coincidan con los filtros</p>
      </div>
      <!-- table -->
      <div v-else>
        <!-- Mobile cards (< md) -->
        <div class="md:hidden space-y-3">
          <div v-for="req in reqMobilePagedItems" :key="req.id" class="bg-white border border-slate-100 rounded-2xl p-4 space-y-3">
            <div class="flex items-start justify-between gap-2">
              <div>
                <span class="text-[12px] font-bold text-[#0d4f5c]">#{{ String(req.id).padStart(4,'0') }}</span>
                <p class="font-semibold text-[#0f172a] text-[13px] mt-0.5">{{ req.service_name }}</p>
              </div>
              <span :class="['inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap flex-shrink-0', statusBadgeClass(req.status)]">
                <span class="w-1.5 h-1.5 rounded-full bg-current opacity-80 flex-shrink-0"></span>
                {{ statusLabel(req.status) }}
              </span>
            </div>
            <div class="grid grid-cols-2 gap-y-2 text-[12px]">
              <div>
                <p class="text-[10px] text-slate-400 uppercase tracking-wide font-bold">Cliente</p>
                <div class="flex items-center gap-1.5 mt-0.5">
                  <span :class="['w-1.5 h-1.5 rounded-full flex-shrink-0', req.client_online ? 'bg-emerald-400' : 'bg-slate-300']"></span>
                  <p class="font-semibold text-[#0f172a] truncate">{{ req.client_name }}</p>
                </div>
              </div>
              <div>
                <p class="text-[10px] text-slate-400 uppercase tracking-wide font-bold">Profesional</p>
                <div class="flex items-center gap-1.5 mt-0.5">
                  <span v-if="req.professional_name" :class="['w-1.5 h-1.5 rounded-full flex-shrink-0', req.professional_online ? 'bg-emerald-400' : 'bg-slate-300']"></span>
                  <p class="font-semibold text-[#0f172a] truncate">{{ req.professional_name || 'Sin asignar' }}</p>
                </div>
              </div>
              <div>
                <p class="text-[10px] text-slate-400 uppercase tracking-wide font-bold">Tiempo</p>
                <span :class="['text-[11px] font-bold', isSlowElapsed(req.elapsed) ? 'text-red-600' : 'text-emerald-700']">{{ req.elapsed }}</span>
              </div>
              <div>
                <p class="text-[10px] text-slate-400 uppercase tracking-wide font-bold">Creado</p>
                <p class="text-slate-500 text-[11px]">{{ req.created_at }}</p>
              </div>
            </div>
            <div class="pt-2 border-t border-slate-50">
              <button @click="openDetail(req)"
                class="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-50 text-[#0d4f5c] text-[12px] font-semibold hover:bg-slate-100 transition">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                Ver detalle
              </button>
            </div>
          </div>
        </div>
        <!-- Mobile pagination -->
        <div v-if="reqMobileTotalPages > 1" class="md:hidden flex items-center justify-center gap-3 px-4 py-3 mt-1">
          <button :disabled="reqMobilePage <= 1" @click="reqMobilePage--"
            class="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 text-sm font-bold disabled:opacity-30 hover:bg-slate-200 transition">‹</button>
          <span class="text-[12px] text-slate-500 font-semibold">{{ reqMobilePage }} / {{ reqMobileTotalPages }}</span>
          <button :disabled="reqMobilePage >= reqMobileTotalPages" @click="reqMobilePage++"
            class="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 text-sm font-bold disabled:opacity-30 hover:bg-slate-200 transition">›</button>
        </div>
        <!-- Desktop table (≥ md) -->
        <div class="hidden md:block bg-white border border-slate-100 rounded-2xl overflow-auto">
          <table class="w-full border-collapse text-[13px]">
            <thead>
              <tr>
                <th v-for="h in ['ID','Servicio','Cliente','Profesional','Estado','Creado','Actualizado','Tiempo','Detalle']" :key="h"
                  class="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-wide border-b border-slate-100 bg-slate-50 text-left whitespace-nowrap first:pl-5">
                  {{ h }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="req in filteredRequests" :key="req.id" class="hover:bg-slate-50 border-b border-slate-50 last:border-0">
                <td class="px-4 py-3 pl-5 whitespace-nowrap">
                  <span class="text-[12px] font-bold text-[#0d4f5c]">#{{ String(req.id).padStart(4,'0') }}</span>
                </td>
                <td class="px-4 py-3">
                  <span class="text-[12px] font-semibold text-slate-600">{{ req.service_name }}</span>
                </td>
                <td class="px-4 py-3">
                  <div class="flex items-center gap-2">
                    <div class="relative flex-shrink-0">
                      <img :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${req.client_name}`" class="w-8 h-8 rounded-lg" />
                      <span :class="['absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white',
                        req.client_online ? 'bg-emerald-400' : 'bg-slate-300']"></span>
                    </div>
                    <span class="font-semibold text-[#0f172a]">{{ req.client_name }}</span>
                  </div>
                </td>
                <td class="px-4 py-3">
                  <div v-if="req.professional_name" class="flex items-center gap-2">
                    <div class="relative flex-shrink-0">
                      <img :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${req.professional_name}`" class="w-8 h-8 rounded-lg" />
                      <span :class="['absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white',
                        req.professional_online ? 'bg-emerald-400' : 'bg-slate-300']"></span>
                    </div>
                    <span class="font-semibold text-[#0f172a]">{{ req.professional_name }}</span>
                  </div>
                  <span v-else class="text-[11px] text-slate-400">Sin asignar</span>
                </td>
                <td class="px-4 py-3">
                  <span :class="['inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap', statusBadgeClass(req.status)]">
                    <span class="w-1.5 h-1.5 rounded-full bg-current opacity-80 flex-shrink-0"></span>
                    {{ statusLabel(req.status) }}
                  </span>
                </td>
                <td class="px-4 py-3"><span class="text-[11px] text-slate-400">{{ req.created_at }}</span></td>
                <td class="px-4 py-3"><span class="text-[11px] text-slate-400">{{ req.updated_at }}</span></td>
                <td class="px-4 py-3">
                  <span :class="['inline-block px-2 py-0.5 rounded-md text-[11px] font-bold',
                    isSlowElapsed(req.elapsed) ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-700']">
                    {{ req.elapsed }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <button @click="openDetail(req)"
                    class="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-slate-500 hover:bg-[#0d4f5c]/10 hover:text-[#0d4f5c] transition">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ── TAB: USUARIOS ONLINE ── -->
    <div v-if="activeTab === 'users'">
      <div v-if="loadingUsers" class="space-y-2">
        <div v-for="n in 4" :key="n" class="flex items-center gap-3 bg-white border border-slate-100 rounded-2xl p-4">
          <div class="w-9 h-9 rounded-xl bg-slate-100 animate-pulse flex-shrink-0"></div>
          <div class="flex-1 space-y-2">
            <div class="h-3 bg-slate-100 rounded animate-pulse w-3/5"></div>
            <div class="h-2.5 bg-slate-100 rounded animate-pulse w-2/5"></div>
          </div>
        </div>
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Clientes -->
        <div class="bg-white border border-slate-100 rounded-2xl overflow-hidden">
          <div class="flex items-center gap-2 px-5 py-3.5 border-b border-slate-100">
            <span>👤</span>
            <span class="text-[13px] font-black text-[#0f172a] flex-1">Clientes conectados</span>
            <span class="bg-slate-100 text-slate-500 text-[11px] font-bold px-2.5 py-0.5 rounded-full">{{ connectedUsers.clients.length }}</span>
          </div>
          <div v-if="connectedUsers.clients.length === 0" class="text-center py-8">
            <span class="text-3xl block mb-2">👤</span>
            <p class="text-sm font-bold text-slate-400">Ningún cliente conectado</p>
          </div>
          <div v-else class="flex flex-col max-h-96 overflow-y-auto divide-y divide-slate-50">
            <div v-for="u in filteredClients" :key="u.id" class="flex items-center gap-3 px-5 py-3 hover:bg-slate-50">
              <div class="relative flex-shrink-0">
                <img :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name}`" class="w-8 h-8 rounded-lg" />
                <span class="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white bg-emerald-400"></span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-[13px] font-semibold text-[#0f172a] truncate">{{ u.name }}</p>
                <p class="text-[11px] text-slate-400 truncate">{{ u.email }}</p>
              </div>
              <div class="flex flex-col items-end gap-1 flex-shrink-0">
                <span v-if="u.active_request"
                  class="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-100">
                  Sol. #{{ u.active_request }}
                </span>
                <span v-else
                  class="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-100 text-slate-500 text-[10px] font-bold">
                  Navegando
                </span>
                <span class="text-[10px] text-slate-400">{{ u.last_seen_at }}</span>
              </div>
            </div>
          </div>
        </div>
        <!-- Profesionales -->
        <div class="bg-white border border-slate-100 rounded-2xl overflow-hidden">
          <div class="flex items-center gap-2 px-5 py-3.5 border-b border-slate-100">
            <span>💼</span>
            <span class="text-[13px] font-black text-[#0f172a] flex-1">Profesionales conectados</span>
            <span class="bg-slate-100 text-slate-500 text-[11px] font-bold px-2.5 py-0.5 rounded-full">{{ connectedUsers.professionals.length }}</span>
          </div>
          <div v-if="connectedUsers.professionals.length === 0" class="text-center py-8">
            <span class="text-3xl block mb-2">💼</span>
            <p class="text-sm font-bold text-slate-400">Ningún profesional conectado</p>
          </div>
          <div v-else class="flex flex-col max-h-96 overflow-y-auto divide-y divide-slate-50">
            <div v-for="u in filteredProfessionals" :key="u.id" class="flex items-center gap-3 px-5 py-3 hover:bg-slate-50">
              <div class="relative flex-shrink-0">
                <img :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name}`" class="w-8 h-8 rounded-lg" />
                <span class="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white bg-emerald-400"></span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-[13px] font-semibold text-[#0f172a] truncate">{{ u.name }}</p>
                <p class="text-[11px] text-slate-400 truncate">{{ u.email }}</p>
              </div>
              <div class="flex flex-col items-end gap-1 flex-shrink-0">
                <span v-if="u.is_busy"
                  class="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-100">
                  En servicio
                </span>
                <span v-else
                  class="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-100 text-slate-500 text-[10px] font-bold">
                  Disponible
                </span>
                <span class="text-[10px] text-slate-400">{{ u.last_seen_at }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── TAB: CHATS ACTIVOS ── -->
    <div v-if="activeTab === 'chats'">
      <div v-if="loadingChats" class="space-y-2">
        <div v-for="n in 4" :key="n" class="flex items-center gap-3 bg-white border border-slate-100 rounded-2xl p-4">
          <div class="w-9 h-9 rounded-xl bg-slate-100 animate-pulse flex-shrink-0"></div>
          <div class="flex-1 space-y-2">
            <div class="h-3 bg-slate-100 rounded animate-pulse w-3/5"></div>
            <div class="h-2.5 bg-slate-100 rounded animate-pulse w-2/5"></div>
          </div>
        </div>
      </div>
      <div v-else-if="filteredChats.length === 0"
        class="text-center py-12 bg-white border border-dashed border-slate-200 rounded-2xl">
        <span class="text-3xl block mb-2">💬</span>
        <p class="font-bold text-slate-500 text-sm">Sin chats activos</p>
        <p class="text-slate-400 text-xs mt-1">No hay conversaciones en las últimas 24 horas</p>
      </div>
      <div v-else>
        <!-- Mobile cards (< md) -->
        <div class="md:hidden space-y-3">
          <div v-for="chat in chatMobilePagedItems" :key="chat.request_id" class="bg-white border border-slate-100 rounded-2xl p-4 space-y-3">
            <div class="flex items-start justify-between gap-2">
              <div>
                <span class="text-[12px] font-bold text-[#0d4f5c]">#{{ String(chat.request_id).padStart(4,'0') }}</span>
                <p class="text-[11px] text-slate-400 mt-0.5">{{ chat.last_message_time }}</p>
              </div>
              <span :class="['inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap flex-shrink-0', statusBadgeClass(chat.status)]">
                <span class="w-1.5 h-1.5 rounded-full bg-current opacity-80 flex-shrink-0"></span>
                {{ statusLabel(chat.status) }}
              </span>
            </div>
            <div class="grid grid-cols-2 gap-y-2 text-[12px]">
              <div>
                <p class="text-[10px] text-slate-400 uppercase tracking-wide font-bold">Cliente</p>
                <div class="flex items-center gap-1.5 mt-0.5">
                  <img :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${chat.client_name}`" class="w-5 h-5 rounded-md flex-shrink-0" />
                  <p class="font-semibold text-[#0f172a] truncate">{{ chat.client_name }}</p>
                </div>
              </div>
              <div>
                <p class="text-[10px] text-slate-400 uppercase tracking-wide font-bold">Profesional</p>
                <div class="flex items-center gap-1.5 mt-0.5">
                  <img :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${chat.professional_name}`" class="w-5 h-5 rounded-md flex-shrink-0" />
                  <p class="font-semibold text-[#0f172a] truncate">{{ chat.professional_name }}</p>
                </div>
              </div>
              <div class="col-span-2">
                <p class="text-[10px] text-slate-400 uppercase tracking-wide font-bold">Último mensaje</p>
                <p class="text-[11px] text-slate-600 truncate mt-0.5">{{ chat.sender_name }}: {{ truncate(chat.last_message, 50) }}</p>
              </div>
            </div>
            <div class="pt-2 border-t border-slate-50">
              <button @click="openChatViewer(chat)"
                class="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-50 text-[#0d4f5c] text-[12px] font-semibold hover:bg-slate-100 transition">
                💬 Ver {{ chat.total_messages }} mensajes
              </button>
            </div>
          </div>
        </div>
        <!-- Mobile pagination -->
        <div v-if="chatMobileTotalPages > 1" class="md:hidden flex items-center justify-center gap-3 px-4 py-3 mt-1">
          <button :disabled="chatMobilePage <= 1" @click="chatMobilePage--"
            class="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 text-sm font-bold disabled:opacity-30 hover:bg-slate-200 transition">‹</button>
          <span class="text-[12px] text-slate-500 font-semibold">{{ chatMobilePage }} / {{ chatMobileTotalPages }}</span>
          <button :disabled="chatMobilePage >= chatMobileTotalPages" @click="chatMobilePage++"
            class="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 text-sm font-bold disabled:opacity-30 hover:bg-slate-200 transition">›</button>
        </div>
        <!-- Desktop table (≥ md) -->
        <div class="hidden md:block bg-white border border-slate-100 rounded-2xl overflow-auto">
          <table class="w-full border-collapse text-[13px]">
            <thead>
              <tr>
                <th v-for="h in ['Solicitud','Cliente','Profesional','Último mensaje','Hora','Mensajes','Estado']" :key="h"
                  class="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-wide border-b border-slate-100 bg-slate-50 text-left whitespace-nowrap first:pl-5">
                  {{ h }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="chat in filteredChats" :key="chat.request_id" class="hover:bg-slate-50 border-b border-slate-50 last:border-0">
                <td class="px-4 py-3 pl-5">
                  <span class="text-[12px] font-bold text-[#0d4f5c]">#{{ String(chat.request_id).padStart(4,'0') }}</span>
                </td>
                <td class="px-4 py-3">
                  <div class="flex items-center gap-2">
                    <img :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${chat.client_name}`" class="w-7 h-7 rounded-lg flex-shrink-0" />
                    <span class="font-semibold text-[#0f172a]">{{ chat.client_name }}</span>
                  </div>
                </td>
                <td class="px-4 py-3">
                  <div class="flex items-center gap-2">
                    <img :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${chat.professional_name}`" class="w-7 h-7 rounded-lg flex-shrink-0" />
                    <span class="font-semibold text-[#0f172a]">{{ chat.professional_name }}</span>
                  </div>
                </td>
                <td class="px-4 py-3 max-w-[180px]">
                  <p class="text-[10px] font-bold text-slate-400">{{ chat.sender_name }}:</p>
                  <p class="text-[12px] text-slate-600 truncate">{{ truncate(chat.last_message, 40) }}</p>
                </td>
                <td class="px-4 py-3"><span class="text-[11px] text-slate-400">{{ chat.last_message_time }}</span></td>
                <td class="px-4 py-3">
                  <button @click="openChatViewer(chat)"
                    class="inline-flex items-center justify-center px-3 py-1 rounded-lg bg-slate-100 text-slate-600 text-[12px] font-bold hover:bg-[#0d4f5c]/10 hover:text-[#0d4f5c] transition">
                    {{ chat.total_messages }}
                  </button>
                </td>
                <td class="px-4 py-3">
                  <span :class="['inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap', statusBadgeClass(chat.status)]">
                    <span class="w-1.5 h-1.5 rounded-full bg-current opacity-80 flex-shrink-0"></span>
                    {{ statusLabel(chat.status) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ── TAB: INCIDENCIAS ── -->
    <div v-if="activeTab === 'incidents'">
      <div v-if="loadingIncidents" class="space-y-2">
        <div v-for="n in 3" :key="n" class="flex items-center gap-3 bg-white border border-slate-100 rounded-2xl p-4">
          <div class="w-9 h-9 rounded-xl bg-slate-100 animate-pulse flex-shrink-0"></div>
          <div class="flex-1 space-y-2">
            <div class="h-3 bg-slate-100 rounded animate-pulse w-3/5"></div>
            <div class="h-2.5 bg-slate-100 rounded animate-pulse w-2/5"></div>
          </div>
        </div>
      </div>
      <div v-else-if="filteredIncidents.length === 0"
        class="text-center py-12 bg-white border border-dashed border-slate-200 rounded-2xl">
        <span class="text-3xl block mb-2">✅</span>
        <p class="font-bold text-slate-500 text-sm">Sin incidencias</p>
        <p class="text-slate-400 text-xs mt-1">No hay solicitudes pendientes por más de 30 minutos sin profesional asignado</p>
      </div>
      <div v-else class="space-y-3">
        <div v-for="inc in filteredIncidents" :key="inc.id"
          class="flex items-center gap-5 flex-wrap bg-white border border-red-100 rounded-2xl px-5 py-4">
          <div class="flex items-center gap-3 flex-1 min-w-[200px]">
            <span class="text-2xl flex-shrink-0">⚠️</span>
            <div>
              <p class="text-[13px] font-bold text-red-800">{{ inc.label }}</p>
              <p class="text-[11px] text-slate-400 mt-0.5">Sol. #{{ String(inc.id).padStart(4,'0') }} · {{ inc.service_name }}</p>
            </div>
          </div>
          <div class="flex items-center gap-2.5 flex-1 min-w-[160px]">
            <img :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${inc.client_name}`" class="w-7 h-7 rounded-lg flex-shrink-0" />
            <div>
              <p class="text-[13px] font-semibold text-[#0f172a]">{{ inc.client_name }}</p>
              <p class="text-[11px] text-slate-400">{{ inc.client_email }}</p>
            </div>
          </div>
          <div class="flex flex-col items-end gap-1.5 flex-shrink-0">
            <span class="inline-block px-2 py-0.5 rounded-md text-[11px] font-bold bg-red-50 text-red-600">{{ inc.elapsed }}</span>
            <span class="text-[11px] text-slate-400">{{ inc.created_at }}</span>
            <span :class="['inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold', statusBadgeClass(inc.status)]">
              <span class="w-1.5 h-1.5 rounded-full bg-current opacity-80 flex-shrink-0"></span>
              {{ statusLabel(inc.status) }}
            </span>
            <button @click="openReassign(inc)"
              class="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-100 px-3 py-1.5 rounded-xl hover:bg-amber-100 transition whitespace-nowrap">
              ↺ Reasignar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Error global -->
    <div v-if="globalError" class="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-100 rounded-2xl text-[13px] text-red-600">
      <span>⚠️</span> {{ globalError }}
      <button @click="refreshAll"
        class="ml-auto px-3 py-1 border border-red-200 bg-white text-red-600 rounded-xl text-[12px] font-semibold hover:bg-red-50 transition">
        Reintentar
      </button>
    </div>

    <!-- ══════════════════════════════════════════ -->
    <!-- MODAL: Detalle de Solicitud               -->
    <!-- ══════════════════════════════════════════ -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-200"
        enter-from-class="opacity-0"
        leave-active-class="transition duration-150"
        leave-to-class="opacity-0">
        <div v-if="detailModal.open"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          @click.self="detailModal.open = false">
          <Transition
            enter-active-class="transition duration-200"
            enter-from-class="opacity-0 scale-95"
            leave-active-class="transition duration-150"
            leave-to-class="opacity-0 scale-95">
            <div v-if="detailModal.open" class="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
              <!-- Header azul -->
              <div class="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-blue-700 to-blue-500 flex-shrink-0">
                <div class="flex items-center gap-2">
                  <span class="text-[14px] font-black text-white">#{{ String(detailModal.req.id || 0).padStart(4,'0') }}</span>
                  <span class="text-[14px] font-bold text-white/90">{{ detailModal.req.service_name }}</span>
                </div>
                <button @click="detailModal.open = false"
                  class="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center text-sm transition">✕</button>
              </div>
              <!-- Body -->
              <div class="flex-1 overflow-y-auto p-5 space-y-5">
                <!-- Cliente -->
                <div class="space-y-2">
                  <p class="text-[11px] font-black text-blue-600 uppercase tracking-wide pb-1.5 border-b border-slate-100">👤 Cliente</p>
                  <div class="flex justify-between items-center text-[12px]"><span class="text-slate-500">Nombre</span><strong class="text-[#0f172a] text-right">{{ detailModal.req.client_name }}</strong></div>
                  <div class="flex justify-between items-center text-[12px]"><span class="text-slate-500">Email</span><strong class="text-[#0f172a] text-right">{{ detailModal.req.client_email }}</strong></div>
                  <div class="flex justify-between items-center text-[12px]">
                    <span class="text-slate-500">Estado conexión</span>
                    <span :class="['text-[11px] font-bold px-2 py-0.5 rounded-lg', detailModal.req.client_online ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500']">
                      {{ detailModal.req.client_online ? 'En línea' : 'Desconectado' }}
                    </span>
                  </div>
                </div>
                <!-- Profesional -->
                <div class="space-y-2">
                  <p class="text-[11px] font-black text-blue-600 uppercase tracking-wide pb-1.5 border-b border-slate-100">💼 Profesional</p>
                  <template v-if="detailModal.req.professional_name">
                    <div class="flex justify-between items-center text-[12px]"><span class="text-slate-500">Nombre</span><strong class="text-[#0f172a] text-right">{{ detailModal.req.professional_name }}</strong></div>
                    <div class="flex justify-between items-center text-[12px]"><span class="text-slate-500">Email</span><strong class="text-[#0f172a] text-right">{{ detailModal.req.professional_email }}</strong></div>
                    <div class="flex justify-between items-center text-[12px]">
                      <span class="text-slate-500">Estado conexión</span>
                      <span :class="['text-[11px] font-bold px-2 py-0.5 rounded-lg', detailModal.req.professional_online ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500']">
                        {{ detailModal.req.professional_online ? 'En línea' : 'Desconectado' }}
                      </span>
                    </div>
                  </template>
                  <div v-else class="flex justify-between items-center text-[12px]"><span class="text-slate-500">Asignado</span><strong class="text-slate-400">Sin asignar</strong></div>
                </div>
                <!-- Solicitud -->
                <div class="space-y-2">
                  <p class="text-[11px] font-black text-blue-600 uppercase tracking-wide pb-1.5 border-b border-slate-100">📋 Solicitud</p>
                  <div class="flex justify-between items-center text-[12px]">
                    <span class="text-slate-500">Estado</span>
                    <span :class="['inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold', statusBadgeClass(detailModal.req.status)]">
                      <span class="w-1.5 h-1.5 rounded-full bg-current opacity-80"></span>{{ statusLabel(detailModal.req.status) }}
                    </span>
                  </div>
                  <div class="flex justify-between items-center text-[12px]"><span class="text-slate-500">Presupuesto</span><strong class="text-[#0f172a]">${{ Number(detailModal.req.budget||0).toLocaleString('es-CO') }}</strong></div>
                  <div v-if="detailModal.req.description" class="flex justify-between items-start gap-4 text-[12px]"><span class="text-slate-500 flex-shrink-0">Descripción</span><strong class="text-[#0f172a] text-right">{{ detailModal.req.description }}</strong></div>
                  <div v-if="detailModal.req.address" class="flex justify-between items-start gap-4 text-[12px]"><span class="text-slate-500 flex-shrink-0">Dirección</span><strong class="text-[#0f172a] text-right">{{ detailModal.req.address }}</strong></div>
                  <div v-if="detailModal.req.service_date" class="flex justify-between items-center text-[12px]"><span class="text-slate-500">Fecha</span><strong class="text-[#0f172a]">{{ detailModal.req.service_date }}</strong></div>
                  <div v-if="detailModal.req.service_time" class="flex justify-between items-center text-[12px]"><span class="text-slate-500">Hora</span><strong class="text-[#0f172a]">{{ detailModal.req.service_time }}</strong></div>
                  <div v-if="detailModal.req.people_count" class="flex justify-between items-center text-[12px]"><span class="text-slate-500">Personas</span><strong class="text-[#0f172a]">{{ detailModal.req.people_count }}</strong></div>
                  <div class="flex justify-between items-center text-[12px]"><span class="text-slate-500">Creado</span><strong class="text-[#0f172a]">{{ detailModal.req.created_at }}</strong></div>
                  <div class="flex justify-between items-center text-[12px]"><span class="text-slate-500">Actualizado</span><strong class="text-[#0f172a]">{{ detailModal.req.updated_at }}</strong></div>
                  <div class="flex justify-between items-center text-[12px]"><span class="text-slate-500">Tiempo</span><strong class="text-[#0f172a]">{{ detailModal.req.elapsed }}</strong></div>
                </div>
                <!-- Reasignación -->
                <div v-if="['pending','accepted'].includes(detailModal.req.status)" class="space-y-3">
                  <p class="text-[11px] font-black text-blue-600 uppercase tracking-wide pb-1.5 border-b border-slate-100">↺ Reasignar servicio</p>
                  <div v-if="detailModal.loadingProfs" class="text-[13px] text-slate-400 py-1">Cargando profesionales…</div>
                  <template v-else>
                    <div>
                      <label class="block text-[12px] font-bold text-slate-500 mb-1">Profesional</label>
                      <select v-model="detailModal.reassign.professionalId"
                        class="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-teal-500/30">
                        <option :value="null">— Sin cambio —</option>
                        <option v-for="p in detailModal.profs" :key="p.id" :value="p.id">
                          {{ p.name }}{{ p.is_online ? ' 🟢' : ' ⚫' }}
                        </option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-[12px] font-bold text-slate-500 mb-1">Nueva fecha</label>
                      <input type="date" v-model="detailModal.reassign.serviceDate"
                        class="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-teal-500/30" />
                    </div>
                    <div>
                      <label class="block text-[12px] font-bold text-slate-500 mb-1">Nueva hora</label>
                      <input type="time" v-model="detailModal.reassign.serviceTime"
                        class="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-teal-500/30" />
                    </div>
                    <div v-if="detailModal.reassign.error" class="px-3 py-2 bg-red-50 border border-red-100 rounded-xl text-[12px] text-red-600">{{ detailModal.reassign.error }}</div>
                    <button @click="applyDetailReassign"
                      :disabled="detailModal.reassign.saving || (!detailModal.reassign.professionalId && !detailModal.reassign.serviceDate && !detailModal.reassign.serviceTime)"
                      class="w-full py-2.5 bg-gradient-to-r from-blue-700 to-blue-500 hover:opacity-90 disabled:opacity-50 text-white text-[13px] font-bold rounded-xl transition">
                      {{ detailModal.reassign.saving ? 'Guardando…' : '✓ Aplicar cambios' }}
                    </button>
                  </template>
                </div>
                <!-- Evidencias -->
                <div class="space-y-2">
                  <p class="text-[11px] font-black text-blue-600 uppercase tracking-wide pb-1.5 border-b border-slate-100">📎 Evidencias del servicio</p>
                  <div v-if="detailModal.loadingEvidences" class="text-[13px] text-slate-400 py-2">Cargando evidencias…</div>
                  <div v-else-if="!detailModal.evidences.length" class="text-[13px] text-slate-400 py-2">Sin evidencias registradas.</div>
                  <div v-else class="grid grid-cols-3 gap-2.5 pt-1">
                    <a v-for="(ev, i) in detailModal.evidences" :key="i" :href="ev.url" target="_blank"
                      class="flex flex-col items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50 hover:border-blue-400 hover:shadow-sm transition no-underline">
                      <img v-if="ev.is_image" :src="ev.url" :alt="ev.file_name" class="w-full h-20 object-cover" />
                      <div v-else class="flex flex-col items-center gap-1 p-3 text-slate-400">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="26" height="26">
                          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
                        </svg>
                        <span class="text-[10px] text-center break-all text-slate-500">{{ ev.file_name }}</span>
                      </div>
                      <p v-if="ev.description" class="text-[10px] text-slate-400 px-1.5 pb-1 text-center truncate w-full">{{ ev.description }}</p>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>

    <!-- ══════════════════════════════════════════ -->
    <!-- MODAL: Reasignación de Incidencia         -->
    <!-- ══════════════════════════════════════════ -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-200"
        enter-from-class="opacity-0"
        leave-active-class="transition duration-150"
        leave-to-class="opacity-0">
        <div v-if="reassignModal.open"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          @click.self="reassignModal.open = false">
          <Transition
            enter-active-class="transition duration-200"
            enter-from-class="opacity-0 scale-95"
            leave-active-class="transition duration-150"
            leave-to-class="opacity-0 scale-95">
            <div v-if="reassignModal.open" class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
              <div class="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-blue-700 to-blue-500">
                <span class="text-[14px] font-bold text-white">↺ Reasignar Sol. #{{ String(reassignModal.incidentId || 0).padStart(4,'0') }}</span>
                <button @click="reassignModal.open = false"
                  class="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center text-sm transition">✕</button>
              </div>
              <div class="p-5 space-y-4">
                <p class="text-[13px] text-slate-500">Selecciona un profesional disponible para este servicio (🟢 = en línea ahora):</p>
                <div v-if="reassignModal.loading" class="text-center py-6 text-slate-400 text-[13px]">Buscando profesionales…</div>
                <div v-else-if="reassignModal.professionals.length === 0" class="text-center py-6 text-slate-400 text-[13px]">
                  No hay profesionales verificados para este servicio.
                </div>
                <div v-else class="space-y-2 max-h-64 overflow-y-auto">
                  <div v-for="p in reassignModal.professionals" :key="p.id"
                    :class="['flex items-center gap-3 px-3 py-2.5 rounded-xl border cursor-pointer transition',
                      reassignModal.selectedId === p.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50']"
                    @click="reassignModal.selectedId = p.id">
                    <img :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${p.name}`" class="w-8 h-8 rounded-lg flex-shrink-0" />
                    <span class="text-[13px] font-semibold text-[#0f172a] flex-1">{{ p.name }}</span>
                    <span v-if="reassignModal.selectedId === p.id" class="text-blue-600 font-black text-sm">✓</span>
                  </div>
                </div>
                <div v-if="reassignModal.error" class="px-3 py-2 bg-red-50 border border-red-100 rounded-xl text-[12px] text-red-600">{{ reassignModal.error }}</div>
                <div class="flex justify-end gap-2 pt-1">
                  <button @click="reassignModal.open = false"
                    class="px-4 py-2 border border-slate-200 bg-white rounded-xl text-[13px] font-semibold text-slate-600 hover:bg-slate-50 transition">Cancelar</button>
                  <button :disabled="!reassignModal.selectedId || reassignModal.saving" @click="confirmReassign"
                    class="px-4 py-2 bg-gradient-to-r from-blue-700 to-blue-500 hover:opacity-90 disabled:opacity-50 text-white text-[13px] font-bold rounded-xl transition">
                    {{ reassignModal.saving ? 'Asignando…' : '✓ Confirmar asignación' }}
                  </button>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>

    <!-- ══════════════════════════════════════════ -->
    <!-- MODAL: Visor de Chat (solo lectura)       -->
    <!-- ══════════════════════════════════════════ -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-200"
        enter-from-class="opacity-0"
        leave-active-class="transition duration-150"
        leave-to-class="opacity-0">
        <div v-if="chatViewer.open"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          @click.self="chatViewer.open = false">
          <Transition
            enter-active-class="transition duration-200"
            enter-from-class="opacity-0 scale-95"
            leave-active-class="transition duration-150"
            leave-to-class="opacity-0 scale-95">
            <div v-if="chatViewer.open" class="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden" style="height:560px">
              <!-- Header -->
              <div class="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-blue-700 to-blue-500 flex-shrink-0">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center font-black text-base text-white flex-shrink-0">
                    {{ initials(chatViewer.clientName) }}
                  </div>
                  <div>
                    <div class="flex items-center gap-2 font-bold text-[14px] text-white">
                      {{ chatViewer.clientName }}
                      <span class="text-[10px] opacity-50 font-normal">#{{ String(chatViewer.requestId || 0).padStart(4,'0') }}</span>
                    </div>
                    <div class="text-[11px] text-white/75">con {{ chatViewer.professionalName }}</div>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <span class="bg-white/20 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg">👁️ Solo lectura</span>
                  <button @click="chatViewer.open = false"
                    class="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center text-sm transition">✕</button>
                </div>
              </div>
              <!-- Leyenda -->
              <div class="flex justify-between items-center px-4 py-2 bg-slate-50 border-b border-slate-100 text-[11px] font-bold flex-shrink-0">
                <span class="text-slate-500">👤 {{ chatViewer.clientName }}</span>
                <span class="text-blue-600">💼 {{ chatViewer.professionalName }}</span>
              </div>
              <!-- Mensajes -->
              <div class="flex-1 overflow-y-auto p-4 bg-[#f0f2f5] flex flex-col gap-2 scroll-smooth" ref="chatBodyRef">
                <div v-if="chatViewer.loading" class="m-auto text-center text-slate-400 text-[13px]">Cargando mensajes…</div>
                <div v-else-if="chatViewer.messages.length === 0" class="m-auto text-center text-slate-400 text-[13px]">Sin mensajes en esta conversación</div>
                <template v-else>
                  <div v-for="msg in chatViewer.messages" :key="msg.id"
                    :class="['flex', msg.sender_id === chatViewer.professionalUserId ? 'justify-end' : 'justify-start']">
                    <div :class="['max-w-[72%] px-3 py-2 flex flex-col gap-0.5 break-words text-[13px]',
                      msg.sender_id === chatViewer.professionalUserId
                        ? 'bg-blue-600 text-white rounded-2xl rounded-br-sm'
                        : 'bg-white text-slate-800 rounded-2xl rounded-bl-sm shadow-sm']">
                      <span :class="['text-[10px] font-bold',
                        msg.sender_id === chatViewer.professionalUserId ? 'text-white/70' : 'text-slate-400']">
                        {{ msg.sender_name }}
                      </span>
                      <span class="leading-snug">{{ msg.message }}</span>
                      <span :class="['text-[10px] text-right mt-0.5',
                        msg.sender_id === chatViewer.professionalUserId ? 'text-white/60' : 'text-slate-300']">
                        {{ msg.created_at }}
                      </span>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import api from '@/services/api'

const POLL_INTERVAL = 10000

const activeTab     = ref('requests')
const search        = ref('')
const statusFilter  = ref('')
const lastUpdate    = ref('—')
const globalError   = ref('')

const summary        = ref({})
const requests       = ref([])
const connectedUsers = ref({ clients: [], professionals: [] })
const chats          = ref([])
const incidents      = ref([])

const loadingSummary   = ref(true)
const loadingRequests  = ref(true)
const loadingUsers     = ref(true)
const loadingChats     = ref(true)
const loadingIncidents = ref(true)

const kpis = [
  { key: 'requests_today',       icon: '📋', label: 'Solicitudes hoy',       color: 'blue'   },
  { key: 'clients_online',       icon: '👤', label: 'Clientes online',        color: 'green'  },
  { key: 'professionals_online', icon: '💼', label: 'Profesionales online',   color: 'green'  },
  { key: 'professionals_active', icon: '🔧', label: 'Profesionales activos',  color: 'blue'   },
  { key: 'requests_pending',     icon: '⏳', label: 'Solicitudes pendientes', color: 'yellow' },
  { key: 'requests_completed',   icon: '✅', label: 'Completadas hoy',        color: 'green'  },
  { key: 'active_chats',         icon: '💬', label: 'Chats activos',          color: 'blue'   },
  { key: 'incidents',            icon: '⚠️', label: 'Incidencias',            color: 'red'    },
]

const tabs = [
  { key: 'requests',  icon: '📋', label: 'Solicitudes'     },
  { key: 'users',     icon: '👥', label: 'Usuarios online' },
  { key: 'chats',     icon: '💬', label: 'Chats activos'   },
  { key: 'incidents', icon: '⚠️', label: 'Incidencias'     },
]

const statusFilters = [
  { value: '',          label: 'Todos'       },
  { value: 'pending',   label: 'Pendientes'  },
  { value: 'accepted',  label: 'Aceptadas'   },
  { value: 'completed', label: 'Completadas' },
  { value: 'cancelled', label: 'Canceladas'  },
]

const tabBadge = (key) => {
  if (key === 'incidents') return summary.value.incidents || null
  if (key === 'chats')     return summary.value.active_chats || null
  if (key === 'users')     return ((summary.value.clients_online || 0) + (summary.value.professionals_online || 0)) || null
  return null
}

const kpiIconBg = (color) => ({
  blue:   'bg-blue-50',
  green:  'bg-emerald-50',
  yellow: 'bg-amber-50',
  red:    'bg-red-50',
}[color] ?? 'bg-slate-50')

const statusBadgeClass = (s) => ({
  pending:   'bg-amber-50 text-amber-700',
  accepted:  'bg-emerald-50 text-emerald-700',
  completed: 'bg-blue-50 text-blue-700',
  cancelled: 'bg-slate-100 text-slate-500',
}[s] ?? 'bg-slate-100 text-slate-500')

const statusLabel = (s) => ({
  pending:   'Pendiente',
  accepted:  'Aceptada',
  completed: 'Completada',
  cancelled: 'Cancelada',
}[s] ?? s ?? '—')

const statusDotColor = (v) => ({
  pending:   'bg-amber-400',
  accepted:  'bg-emerald-400',
  completed: 'bg-blue-500',
  cancelled: 'bg-slate-400',
}[v] ?? 'bg-slate-400')

const isSlowElapsed = (e) => e && (e.includes('h') || e.includes('d'))
const setStatusFilter = (v) => { statusFilter.value = v }
const truncate = (str, len) => str && str.length > len ? str.slice(0, len) + '…' : str

const filteredRequests = computed(() => {
  let list = requests.value
  if (statusFilter.value) list = list.filter(r => r.status === statusFilter.value)
  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    list = list.filter(r =>
      r.client_name.toLowerCase().includes(q) ||
      (r.professional_name || '').toLowerCase().includes(q) ||
      String(r.id).includes(q)
    )
  }
  return list
})

const filteredClients = computed(() => {
  if (!search.value.trim()) return connectedUsers.value.clients
  const q = search.value.toLowerCase()
  return connectedUsers.value.clients.filter(u =>
    u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
  )
})

const filteredProfessionals = computed(() => {
  if (!search.value.trim()) return connectedUsers.value.professionals
  const q = search.value.toLowerCase()
  return connectedUsers.value.professionals.filter(u =>
    u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
  )
})

const filteredChats = computed(() => {
  if (!search.value.trim()) return chats.value
  const q = search.value.toLowerCase()
  return chats.value.filter(c =>
    c.client_name.toLowerCase().includes(q) ||
    c.professional_name.toLowerCase().includes(q)
  )
})

const filteredIncidents = computed(() => {
  if (!search.value.trim()) return incidents.value
  const q = search.value.toLowerCase()
  return incidents.value.filter(i =>
    i.client_name.toLowerCase().includes(q) ||
    i.service_name.toLowerCase().includes(q)
  )
})

const REQ_MOBILE_PG = 5
const reqMobilePage = ref(1)
const reqMobilePagedItems = computed(() => {
  const start = (reqMobilePage.value - 1) * REQ_MOBILE_PG
  return filteredRequests.value.slice(start, start + REQ_MOBILE_PG)
})
const reqMobileTotalPages = computed(() => Math.ceil(filteredRequests.value.length / REQ_MOBILE_PG))

const CHAT_MOBILE_PG = 5
const chatMobilePage = ref(1)
const chatMobilePagedItems = computed(() => {
  const start = (chatMobilePage.value - 1) * CHAT_MOBILE_PG
  return filteredChats.value.slice(start, start + CHAT_MOBILE_PG)
})
const chatMobileTotalPages = computed(() => Math.ceil(filteredChats.value.length / CHAT_MOBILE_PG))

watch([search, statusFilter], () => { reqMobilePage.value = 1 })
watch(search, () => { chatMobilePage.value = 1 })

// API calls
const fetchSummary = async () => {
  try {
    const { data } = await api.get('/admin/live-services/summary')
    summary.value = data
  } catch { globalError.value = 'Error al cargar el resumen.' }
  finally { loadingSummary.value = false }
}

const fetchRequests = async () => {
  try {
    const { data } = await api.get('/admin/live-services/requests')
    requests.value = data.requests
  } catch { /* silencioso en polling */ }
  finally { loadingRequests.value = false }
}

const fetchUsers = async () => {
  try {
    const { data } = await api.get('/admin/live-services/connected-users')
    connectedUsers.value = data
  } catch { /* silencioso */ }
  finally { loadingUsers.value = false }
}

const fetchChats = async () => {
  try {
    const { data } = await api.get('/admin/live-services/chats')
    chats.value = data.chats
  } catch { /* silencioso */ }
  finally { loadingChats.value = false }
}

const fetchIncidents = async () => {
  try {
    const { data } = await api.get('/admin/live-services/incidents')
    incidents.value = data.incidents
  } catch { /* silencioso */ }
  finally { loadingIncidents.value = false }
}

const refreshAll = async () => {
  loadingSummary.value = true
  globalError.value = ''
  await Promise.all([fetchSummary(), fetchRequests(), fetchUsers(), fetchChats(), fetchIncidents()])
  lastUpdate.value = new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

// Detail Modal
const detailModal = ref({
  open: false, req: {}, evidences: [], loadingEvidences: false,
  profs: [], loadingProfs: false,
  reassign: { professionalId: null, serviceDate: '', serviceTime: '', saving: false, error: '' },
})

const openDetail = async (req) => {
  detailModal.value = {
    open: true, req, evidences: [], loadingEvidences: true,
    profs: [], loadingProfs: false,
    reassign: { professionalId: null, serviceDate: '', serviceTime: '', saving: false, error: '' },
  }
  if (['pending', 'accepted'].includes(req.status)) {
    detailModal.value.loadingProfs = true
    try {
      const { data } = await api.get(`/admin/live-services/requests/${req.id}/available-professionals`)
      detailModal.value.profs = data.professionals || []
    } catch {
      detailModal.value.profs = []
    } finally {
      detailModal.value.loadingProfs = false
    }
  }
  try {
    const { data } = await api.get(`/admin/live-services/requests/${req.id}/evidences`)
    detailModal.value.evidences = (Array.isArray(data) ? data : []).map(ev => ({
      url:         ev.file_url,
      file_name:   ev.file_url ? ev.file_url.split('/').pop() : 'archivo',
      is_image:    ev.file_type === 'image',
      description: ev.note || '',
    }))
  } catch {
    detailModal.value.evidences = []
  } finally {
    detailModal.value.loadingEvidences = false
  }
}

const applyDetailReassign = async () => {
  const r = detailModal.value.reassign
  if (!r.professionalId && !r.serviceDate && !r.serviceTime) return
  r.saving = true
  r.error  = ''
  try {
    const payload = {}
    if (r.professionalId) payload.professional_id = r.professionalId
    if (r.serviceDate)    payload.service_date    = r.serviceDate
    if (r.serviceTime)    payload.service_time    = r.serviceTime
    await api.post(`/admin/live-services/requests/${detailModal.value.req.id}/reassign`, payload)
    if (r.serviceDate) detailModal.value.req.service_date = r.serviceDate
    if (r.serviceTime) detailModal.value.req.service_time = r.serviceTime
    detailModal.value.open = false
    await refreshAll()
  } catch (e) {
    r.error = e.response?.data?.message || 'Error al reasignar.'
  } finally {
    r.saving = false
  }
}

// Reassign Modal
const reassignModal = ref({
  open: false, loading: false, saving: false,
  incidentId: null, professionals: [], selectedId: null, error: '',
})

const openReassign = async (inc) => {
  reassignModal.value = { open: true, loading: true, saving: false, incidentId: inc.id, professionals: [], selectedId: null, error: '' }
  try {
    const { data } = await api.get(`/admin/live-services/requests/${inc.id}/available-professionals`)
    reassignModal.value.professionals = data.professionals
  } catch {
    reassignModal.value.error = 'Error al cargar profesionales disponibles.'
  } finally {
    reassignModal.value.loading = false
  }
}

const confirmReassign = async () => {
  if (!reassignModal.value.selectedId) return
  reassignModal.value.saving = true
  reassignModal.value.error  = ''
  try {
    await api.post(`/admin/live-services/requests/${reassignModal.value.incidentId}/reassign`, {
      professional_id: reassignModal.value.selectedId,
    })
    reassignModal.value.open = false
    await refreshAll()
  } catch (e) {
    reassignModal.value.error = e.response?.data?.message || 'Error al reasignar.'
  } finally {
    reassignModal.value.saving = false
  }
}

// Chat Viewer
const chatBodyRef = ref(null)
const chatViewer  = ref({
  open: false, loading: false, requestId: null,
  clientName: '', professionalName: '',
  clientId: null, professionalUserId: null,
  messages: [],
})

const initials = (name) =>
  (name || '?').split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()

const openChatViewer = async (chat) => {
  chatViewer.value = {
    open: true, loading: true,
    requestId: chat.request_id,
    clientName: chat.client_name,
    professionalName: chat.professional_name,
    clientId: null, professionalUserId: null,
    messages: [],
  }
  try {
    const { data } = await api.get(`/admin/live-services/chat/${chat.request_id}/messages`)
    chatViewer.value.messages           = data.messages
    chatViewer.value.clientId           = data.client_id
    chatViewer.value.professionalUserId = data.professional_user_id
    nextTick(() => {
      if (chatBodyRef.value) chatBodyRef.value.scrollTop = chatBodyRef.value.scrollHeight
    })
  } catch {
    chatViewer.value.messages = []
  } finally {
    chatViewer.value.loading = false
  }
}

// Polling
let pollTimer = null
onMounted(() => {
  refreshAll()
  pollTimer = setInterval(refreshAll, POLL_INTERVAL)
})
onUnmounted(() => clearInterval(pollTimer))
</script>

<style scoped>
.live-dot {
  display: inline-block;
  width: 8px; height: 8px; border-radius: 50%;
  background: #22c55e;
  box-shadow: 0 0 0 3px rgba(34,197,94,.2);
  animation: pulse-live 2s infinite;
  flex-shrink: 0;
}
@keyframes pulse-live {
  0%,100% { box-shadow: 0 0 0 3px rgba(34,197,94,.2); }
  50%      { box-shadow: 0 0 0 6px rgba(34,197,94,.04); }
}
</style>
