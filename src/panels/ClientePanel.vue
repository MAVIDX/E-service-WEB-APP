<template>
  <div class="flex h-full overflow-hidden bg-[#f0f4f8] md:p-3 md:gap-3 clp-root">

    <!-- Sidebar card — hidden on mobile -->
    <div :class="['hidden md:flex-shrink-0 md:block md:w-56 rounded-2xl shadow-sm overflow-hidden', isDark ? 'bg-[#071126]' : 'bg-white']">
      <AppSidebar :items="navItems" :activePage="page" :dark="isDark" @navigate="page = $event" @logout="emit('logout')" />
    </div>

    <!-- Mobile sidebar drawer -->
    <Teleport to="body">
      <Transition name="drawer-overlay">
        <div v-if="mobileSidebarOpen" class="fixed inset-0 z-50 flex md:hidden">
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="mobileSidebarOpen = false" />
          <div :class="['relative w-72 max-w-[85vw] h-full shadow-2xl flex flex-col overflow-hidden', isDark ? 'bg-[#071126]' : 'bg-white']">
            <AppSidebar :items="navItems" :activePage="page" :dark="isDark" :showClose="true"
              @navigate="page = $event; mobileSidebarOpen = false"
              @logout="emit('logout')"
              @closeMobile="mobileSidebarOpen = false" />
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Main content card -->
    <div class="flex-1 bg-white md:rounded-2xl shadow-sm overflow-hidden flex flex-col min-w-0">

      <!-- Main header -->
      <div class="flex-shrink-0 flex items-start justify-between px-4 pt-4 pb-3 md:px-8 md:pt-7 md:pb-5">
        <div class="flex items-center gap-3">
          <div>
            <h2 v-if="page === 'Inicio'" class="text-lg md:text-xl font-black text-[#0f172a] leading-tight">¡Hola, {{ firstName }}! 👋</h2>
            <h2 v-else class="text-lg md:text-xl font-black text-[#0f172a] leading-tight">{{ page }}</h2>
            <p class="text-[12px] md:text-[13px] text-slate-400 mt-0.5">
              <span v-if="page === 'Inicio'">¿Qué servicio necesitas hoy?</span>
              <span v-else>{{ today }}</span>
            </p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button class="relative w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center hover:bg-slate-100 transition">
            <svg viewBox="0 0 24 24" class="w-[18px] h-[18px]" fill="none" stroke="#64748b" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
            </svg>
            <span class="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
          </button>
          <button @click="page = 'Mensajes'" class="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center hover:bg-slate-100 transition">
            <svg viewBox="0 0 24 24" class="w-[18px] h-[18px]" fill="none" stroke="#64748b" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </button>
          <!-- Tema dark/light -->
          <button @click="themeStore.toggle()"
            :class="['w-9 h-9 rounded-xl flex items-center justify-center transition text-sm', isDark ? 'bg-white/10 hover:bg-white/15' : 'bg-slate-50 hover:bg-slate-100']">
            {{ isDark ? '☀️' : '🌙' }}
          </button>
          <!-- Cerrar sesión (solo mobile) -->
          <button @click="emit('logout')" title="Cerrar sesión"
            class="md:hidden w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center hover:bg-red-100 transition flex-shrink-0">
            <svg viewBox="0 0 24 24" class="w-[17px] h-[17px] text-red-500" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Page content (scrollable) -->
      <div class="flex-1 overflow-y-auto px-4 pb-20 md:px-8 md:pb-8 space-y-6">

        <!-- ===== INICIO ===== -->
        <template v-if="page === 'Inicio'">
          <!-- Search bar -->
          <div class="flex items-center bg-[#f8fafc] border border-slate-200 rounded-2xl px-4 py-1 gap-3 transition focus-within:border-blue-400 focus-within:shadow focus-within:shadow-blue-100">
            <svg viewBox="0 0 24 24" class="w-4 h-4 flex-shrink-0" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input v-model="search" type="text" placeholder="Buscar servicios..." class="flex-1 py-2.5 text-sm outline-none bg-transparent text-slate-700 placeholder-slate-400" />
            <button class="bg-[#2563ff] text-white text-[13px] font-bold px-5 py-2 rounded-xl hover:bg-blue-700 transition flex-shrink-0">Buscar</button>
          </div>

          <!-- Categories -->
          <div>
            <div class="flex items-center justify-between mb-4">
              <span class="text-[15px] font-black text-[#0f172a]">Categorías populares</span>
              <button class="text-[13px] text-[#2563ff] font-semibold hover:underline">Ver todas</button>
            </div>
            <div class="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2.5">
              <button
                v-for="cat in filteredCats" :key="cat.id"
                @click="openCategoryModal(cat)"
                class="flex flex-col items-center gap-2.5 bg-white border border-slate-100 rounded-2xl py-4 px-2 hover:border-blue-200 hover:shadow-md hover:shadow-blue-50 hover:-translate-y-0.5 transition-all text-center group cursor-pointer"
              >
                <div class="w-12 h-12 rounded-2xl flex items-center justify-center" :style="{background: cat.iconBg}">
                  <svg viewBox="0 0 24 24" class="w-6 h-6" fill="none" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" :stroke="cat.iconColor" v-html="cat.iconSvg" />
                </div>
                <span class="text-[11px] font-semibold text-slate-700 leading-tight">{{ cat.name }}</span>
              </button>
            </div>
          </div>

          <!-- Recommended services -->
          <div>
            <div class="flex items-center justify-between mb-4">
              <span class="text-[15px] font-black text-[#0f172a]">Servicios recomendados para ti</span>
              <button class="text-[13px] text-[#2563ff] font-semibold hover:underline">Ver más</button>
            </div>
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div
                v-for="s in services" :key="s.id"
                @click="openServiceRequest(s)"
                class="bg-white border border-slate-100 rounded-2xl overflow-hidden cursor-pointer hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200 transition-all"
              >
                <div class="h-36 flex items-center justify-center" :style="{background: s.gradient}">
                  <svg viewBox="0 0 24 24" class="w-14 h-14 opacity-60" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" :stroke="s.iconColor" v-html="s.iconSvg" />
                </div>
                <div class="p-3.5">
                  <p class="text-[13px] font-bold text-[#0f172a]">{{ s.name }}</p>
                  <p class="text-[12px] text-slate-400 mt-0.5">Desde ${{ s.price }}</p>
                  <div class="flex items-center gap-1 mt-2">
                    <span v-for="i in 3" :key="i" class="text-[13px] text-amber-400">★</span>
                    <span class="text-[11px] text-slate-400 ml-1">{{ s.rating }} ({{ s.reviews }})</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- ===== MIS SOLICITUDES ===== -->
        <template v-else-if="page === 'Mis solicitudes'">

          <!-- Top bar: tabs + sort + view toggle -->
          <div class="flex items-center gap-1 flex-wrap">
            <!-- Tabs -->
            <button v-for="tab in [{key:'pending',label:'Pendientes'},{key:'accepted',label:'En curso'},{key:'completed',label:'Completadas'}]" :key="tab.key"
              @click="reqTab = tab.key"
              :class="['flex items-center gap-1.5 px-3 md:px-4 py-1.5 rounded-full text-[12px] md:text-[13px] font-semibold transition border', reqTab === tab.key ? 'bg-[#0f172a] text-white border-[#0f172a]' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400']">
              {{ tab.label }}
              <span v-if="countByTab(tab.key)" :class="['text-[10px] px-1.5 py-0.5 rounded-full font-bold', reqTab === tab.key ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600']">{{ countByTab(tab.key) }}</span>
            </button>
            <!-- Sort + View toggle -->
            <div class="ml-auto flex items-center gap-2">
              <div class="hidden sm:flex items-center gap-1.5">
                <span class="text-[12px] text-slate-400 font-semibold">Ordenar:</span>
                <button v-for="s in [{key:'recent',label:'Más recientes'},{key:'date',label:'Por fecha'},{key:'name',label:'Alfabéticamente'}]" :key="s.key"
                  @click="reqSort = s.key"
                  :class="['px-3 py-1.5 text-[12px] font-semibold rounded-lg transition', reqSort === s.key ? 'bg-[#0f172a] text-white' : 'text-slate-500 hover:text-slate-700']">
                  {{ s.label }}
                </button>
              </div>
              <div class="flex border border-slate-200 rounded-lg overflow-hidden">
                <button @click="reqViewMode = 'grid'" :class="['px-2.5 py-1.5 transition', reqViewMode === 'grid' ? 'bg-[#2563ff] text-white' : 'bg-white text-slate-400 hover:bg-slate-50']">
                  <svg viewBox="0 0 24 24" class="w-4 h-4" fill="currentColor"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
                </button>
                <button @click="reqViewMode = 'list'" :class="['px-2.5 py-1.5 transition border-l border-slate-200', reqViewMode === 'list' ? 'bg-[#2563ff] text-white' : 'bg-white text-slate-400 hover:bg-slate-50']">
                  <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><circle cx="3.5" cy="6" r="1" fill="currentColor"/><circle cx="3.5" cy="12" r="1" fill="currentColor"/><circle cx="3.5" cy="18" r="1" fill="currentColor"/></svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Loading -->
          <div v-if="reqsLoading" class="flex items-center justify-center py-16 text-slate-400 gap-3">
            <svg class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
            Cargando solicitudes...
          </div>

          <!-- Empty -->
          <div v-else-if="filteredReqs.length === 0" class="flex flex-col items-center justify-center py-16 text-slate-300 gap-3">
            <svg viewBox="0 0 24 24" class="w-10 h-10" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" v-html="SVG.clip"/>
            <p class="text-[14px] text-slate-400 font-semibold">No tienes solicitudes en esta categoría</p>
          </div>

          <!-- GRID VIEW -->
          <div v-else-if="reqViewMode === 'grid'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="req in pagedReqs" :key="req.id"
              class="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-3 hover:shadow-md transition">

              <!-- Card header: number + status -->
              <div class="flex items-center justify-between">
                <span class="text-[12px] font-bold text-slate-400">#{{ req.num }}</span>
                <span :class="['text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wide', statusBadgeClass(req.status_label)]">{{ req.status_label }}</span>
              </div>

              <!-- Service type -->
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="#2563ff" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" v-html="SVG.clip"/>
                </div>
                <span class="font-bold text-[14px] text-[#0f172a]">{{ req.name }}</span>
              </div>

              <!-- Price -->
              <p class="text-2xl font-black text-[#2563ff]">${{ req.price }}</p>

              <!-- Description -->
              <p v-if="req.description" class="text-[12px] text-slate-500 line-clamp-2">{{ req.description }}</p>

              <!-- Date + address + people -->
              <div class="flex flex-wrap gap-1.5">
                <span class="inline-flex items-center gap-1 bg-slate-50 border border-slate-200 text-[11px] text-slate-600 px-2 py-1 rounded-lg">
                  🗓 {{ req.date }}
                </span>
                <span v-if="req.address" class="inline-flex items-center gap-1 bg-slate-50 border border-slate-200 text-[11px] text-slate-600 px-2 py-1 rounded-lg">
                  📍 {{ req.address }}
                </span>
                <span v-if="req.is_virtual" class="inline-flex items-center gap-1 bg-blue-50 border border-blue-200 text-[11px] text-blue-600 px-2 py-1 rounded-lg">
                  💻 Virtual
                </span>
                <span class="inline-flex items-center gap-1 bg-slate-50 border border-slate-200 text-[11px] text-slate-600 px-2 py-1 rounded-lg">
                  👥 {{ req.people_count }} {{ req.people_count === 1 ? 'persona' : 'personas' }}
                </span>
              </div>

              <!-- === PAGO PENDIENTE === -->
              <template v-if="req.status === 'payment_pending'">
                <button @click="retryPayment(req)"
                  class="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[13px] py-2.5 rounded-xl transition flex items-center justify-center gap-2">
                  💳 Completar pago
                </button>
                <button @click="cancelRequest(req)" :disabled="cancelling === req.id"
                  class="w-full border border-red-200 text-red-500 hover:bg-red-50 font-bold text-[13px] py-2.5 rounded-xl transition disabled:opacity-60">
                  {{ cancelling === req.id ? 'Cancelando...' : 'Cancelar' }}
                </button>
              </template>

              <!-- === EN CURSO === -->
              <template v-else-if="ACTIVE_SET.includes(req.status)">
                <!-- Profesional asignado -->
                <div v-if="req.pro" class="bg-blue-50 border border-blue-100 rounded-xl p-3">
                  <p class="text-[10px] font-black text-blue-600 uppercase tracking-wide mb-2">Profesional asignado</p>
                  <div class="flex items-center justify-between gap-2">
                    <div class="flex items-center gap-2">
                      <div class="w-9 h-9 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-black text-sm flex-shrink-0">{{ req.pro[0] }}</div>
                      <div>
                        <p class="font-bold text-[13px] text-[#0f172a]">{{ req.pro }}</p>
                        <p v-if="req.proPhone" class="text-[11px] text-slate-500">📞 {{ req.proPhone }}</p>
                      </div>
                    </div>
                    <button @click="openChatWithPro(req)" class="bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1">
                      💬 Chatear
                    </button>
                  </div>
                </div>
                <!-- Código de aprobación -->
                <div v-if="req.completion_code" class="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
                  <p class="text-[10px] font-black text-amber-600 uppercase tracking-wide mb-2">Código activo</p>
                  <div class="flex justify-center gap-1.5 mb-2">
                    <span v-for="ch in String(req.completion_code).split('')" :key="ch"
                      class="w-9 h-10 border-2 border-amber-400 rounded-xl bg-white flex items-center justify-center font-black text-lg text-[#0f172a]">{{ ch }}</span>
                  </div>
                  <p class="text-[11px] text-amber-600">Válido por ~15 min · Compártelo solo con el profesional</p>
                  <button @click="generateCode(req)" :disabled="generating === req.id" class="mt-2 text-[11px] font-bold text-amber-600 hover:underline disabled:opacity-60">
                    🔄 Regenerar
                  </button>
                </div>
                <button v-else @click="generateCode(req)" :disabled="generating === req.id"
                  class="w-full bg-[#2563ff] hover:bg-blue-700 text-white font-bold text-[13px] py-2.5 rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-60">
                  {{ generating === req.id ? 'Generando...' : '🔐 Generar código de aprobación' }}
                </button>
              </template>

              <!-- === COMPLETADA === -->
              <template v-else-if="req.status === 'completed'">
                <!-- Profesional asignado -->
                <div v-if="req.pro" class="bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <p class="text-[10px] font-black text-slate-500 uppercase tracking-wide mb-2">Profesional asignado</p>
                  <div class="flex items-center justify-between gap-2">
                    <div class="flex items-center gap-2">
                      <div class="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-black text-sm flex-shrink-0">{{ req.pro[0] }}</div>
                      <div>
                        <p class="font-bold text-[13px] text-[#0f172a]">{{ req.pro }}</p>
                        <p v-if="req.proPhone" class="text-[11px] text-slate-500">📞 {{ req.proPhone }}</p>
                      </div>
                    </div>
                    <button @click="openChatWithPro(req)" class="bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1">
                      💬 Chatear
                    </button>
                  </div>
                </div>
                <!-- Trabajo completado -->
                <div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-2">
                  <div class="flex items-center gap-2 mb-1">
                    <span class="text-emerald-600 text-lg">✅</span>
                    <span class="font-black text-[13px] text-emerald-700">Trabajo completado</span>
                  </div>
                  <div class="flex justify-between text-[13px]">
                    <span class="text-slate-500">Total pagado</span>
                    <span class="font-black text-emerald-600">${{ req.price }}</span>
                  </div>
                  <button @click="openEvidences(req)" class="w-full border border-slate-200 bg-white hover:bg-slate-50 text-[12px] font-semibold text-slate-600 py-2 rounded-xl transition">🖼️ Ver evidencias</button>
                  <button v-if="isCapacitacionReq(req)" @click="downloadActa(req)" class="w-full border border-slate-200 bg-white hover:bg-slate-50 text-[12px] font-semibold text-slate-600 py-2 rounded-xl transition">📄 Descargar acta</button>
                  <button v-if="!req._rated" @click="openRatingModal(req)" class="w-full border border-amber-200 bg-amber-50 hover:bg-amber-100 text-[12px] font-semibold text-amber-600 py-2 rounded-xl transition">⭐ Calificar profesional</button>
                  <span v-else class="flex justify-center text-[12px] text-emerald-600 font-semibold py-1">✓ Calificación enviada</span>
                </div>
              </template>
            </div>
          </div>

          <!-- LIST VIEW -->
          <div v-else>
            <!-- Mobile cards (< md) -->
            <div class="md:hidden space-y-3">
              <div v-for="req in pagedReqs" :key="req.id"
                class="bg-white border border-slate-100 rounded-2xl p-4 space-y-3">
                <div class="flex items-start justify-between gap-2">
                  <div class="flex-1 min-w-0">
                    <p class="font-bold text-[#0f172a] text-[13px]">{{ req.name }}</p>
                    <p class="text-[10px] text-slate-400 mt-0.5">#{{ req.num }} · {{ req.date }}</p>
                  </div>
                  <div class="flex flex-col items-end gap-1 flex-shrink-0">
                    <span :class="['text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wide', statusBadgeClass(req.status_label)]">{{ req.status_label }}</span>
                    <span class="font-black text-[#2563ff] text-[13px]">${{ req.price }}</span>
                  </div>
                </div>
                <p class="text-[11px] text-slate-400">
                  <span v-if="req.is_virtual">💻 Virtual</span>
                  <span v-else-if="req.address">📍 {{ req.address }}</span>
                </p>
                <div class="flex items-center gap-1.5 flex-wrap pt-2 border-t border-slate-50">
                  <button v-if="req.status === 'payment_pending'" @click="retryPayment(req)" class="flex-1 text-[12px] font-bold text-white bg-emerald-500 hover:bg-emerald-600 px-3 py-2 rounded-xl transition whitespace-nowrap text-center">💳 Pagar</button>
                  <button v-if="ACTIVE_SET.includes(req.status)" @click="req.completion_code ? Object.assign(codeModal, {open:true,req}) : generateCode(req)" :disabled="generating === req.id" class="text-[11px] font-bold text-blue-600 border border-blue-200 px-2.5 py-1.5 rounded-xl hover:bg-blue-50 transition whitespace-nowrap disabled:opacity-60">🔐 Código</button>
                  <button v-if="(ACTIVE_SET.includes(req.status) || req.status === 'completed') && req.pro" @click="openChatWithPro(req)" class="text-[11px] font-bold text-emerald-600 border border-emerald-200 px-2.5 py-1.5 rounded-xl hover:bg-emerald-50 transition whitespace-nowrap">💬 Chat</button>
                  <button v-if="req.status === 'completed'" @click="openEvidences(req)" class="text-[11px] font-bold text-slate-600 border border-slate-200 px-2.5 py-1.5 rounded-xl hover:bg-slate-50 transition whitespace-nowrap">🖼️ Ver</button>
                  <button v-if="req.status === 'completed' && !req._rated" @click="openRatingModal(req)" class="text-[11px] font-bold text-amber-600 border border-amber-200 px-2.5 py-1.5 rounded-xl hover:bg-amber-50 transition whitespace-nowrap">⭐ Calificar</button>
                </div>
              </div>
            </div>
            <!-- Desktop table (≥ md) -->
            <div class="hidden md:block bg-white border border-slate-100 rounded-2xl overflow-x-auto">
              <table class="w-full text-sm min-w-[640px]">
                <thead class="bg-slate-50">
                  <tr>
                    <th v-for="h in ['Servicio','Fecha','Ubicación','Valor','Estado','']" :key="h" class="text-left px-5 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wide">{{ h }}</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-50">
                  <tr v-for="req in pagedReqs" :key="req.id" class="hover:bg-slate-50 transition">
                    <td class="px-5 py-3.5">
                      <p class="text-[13px] font-bold text-[#0f172a]">{{ req.name }}</p>
                      <p class="text-[11px] text-slate-400">#{{ req.num }} · {{ req.description }}</p>
                    </td>
                    <td class="px-5 py-3.5 text-[12px] text-slate-500 whitespace-nowrap">{{ req.date }}</td>
                    <td class="px-5 py-3.5 text-[12px] text-slate-500 max-w-[140px]">
                      <span v-if="req.is_virtual" class="text-blue-500 font-semibold">💻 Virtual</span>
                      <span v-else class="truncate block">{{ req.address || '—' }}</span>
                    </td>
                    <td class="px-5 py-3.5 font-black text-[#2563ff] text-[13px] whitespace-nowrap">${{ req.price }}</td>
                    <td class="px-5 py-3.5">
                      <span :class="['text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wide', statusBadgeClass(req.status_label)]">{{ req.status_label }}</span>
                    </td>
                    <td class="px-5 py-3.5">
                      <div class="flex items-center gap-1.5 flex-wrap">
                        <button v-if="req.status === 'payment_pending'" @click="retryPayment(req)" class="text-[11px] font-bold text-emerald-600 border border-emerald-200 px-2.5 py-1 rounded-lg hover:bg-emerald-50 transition whitespace-nowrap">💳 Pagar</button>
                        <button v-if="ACTIVE_SET.includes(req.status)" @click="req.completion_code ? Object.assign(codeModal, {open:true,req}) : generateCode(req)" :disabled="generating === req.id" class="text-[11px] font-bold text-blue-600 border border-blue-200 px-2.5 py-1 rounded-lg hover:bg-blue-50 transition whitespace-nowrap disabled:opacity-60">🔐 Código</button>
                        <button v-if="(ACTIVE_SET.includes(req.status) || req.status === 'completed') && req.pro" @click="openChatWithPro(req)" class="text-[11px] font-bold text-emerald-600 border border-emerald-200 px-2.5 py-1 rounded-lg hover:bg-emerald-50 transition whitespace-nowrap">💬 Chat</button>
                        <button v-if="req.status === 'completed'" @click="openEvidences(req)" class="text-[11px] font-bold text-slate-600 border border-slate-200 px-2.5 py-1 rounded-lg hover:bg-slate-50 transition whitespace-nowrap">🖼️ Ver</button>
                        <button v-if="req.status === 'completed' && isCapacitacionReq(req)" @click="downloadActa(req)" class="text-[11px] font-bold text-slate-600 border border-slate-200 px-2.5 py-1 rounded-lg hover:bg-slate-50 transition whitespace-nowrap">📄 Descargar acta</button>
                        <button v-if="req.status === 'completed' && !req._rated" @click="openRatingModal(req)" class="text-[11px] font-bold text-amber-600 border border-amber-200 px-2.5 py-1 rounded-lg hover:bg-amber-50 transition whitespace-nowrap">⭐ Calificar</button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- PAGINACIÓN -->
          <div v-if="!reqsLoading && filteredReqs.length > 0 && totalReqPages > 1"
            class="flex items-center justify-between pt-1">
            <p class="text-[12px] text-slate-400">
              {{ (reqPage - 1) * reqPageSize + 1 }}–{{ Math.min(reqPage * reqPageSize, filteredReqs.length) }}
              de {{ filteredReqs.length }} solicitudes
            </p>
            <div class="flex items-center gap-1">
              <button @click="reqPage--" :disabled="reqPage === 1"
                class="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 disabled:opacity-40 transition">
                <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>
              </button>
              <template v-for="(p, i) in reqPageNums" :key="'pg'+p">
                <span v-if="i > 0 && p - reqPageNums[i-1] > 1" class="text-[12px] text-slate-300 px-0.5">…</span>
                <button @click="reqPage = p"
                  :class="['w-8 h-8 rounded-lg text-[12px] font-bold transition',
                    p === reqPage ? 'bg-[#2563ff] text-white shadow-sm' : 'border border-slate-200 text-slate-500 hover:bg-slate-50']">
                  {{ p }}
                </button>
              </template>
              <button @click="reqPage++" :disabled="reqPage === totalReqPages"
                class="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 disabled:opacity-40 transition">
                <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </div>
          </div>

        </template>

        <!-- ===== FAVORITOS ===== -->
        <template v-else-if="page === 'Favoritos'">
          <div class="flex items-center justify-between">
            <div>
              <p class="font-black text-[#0f172a]">Mis servicios favoritos</p>
              <p class="text-sm text-slate-400 mt-0.5">{{ favs.length }} servicios guardados</p>
            </div>
            <button @click="page = 'Inicio'" class="text-sm text-[#2563ff] font-semibold border border-blue-200 px-4 py-2 rounded-xl hover:bg-blue-50 transition">+ Explorar más</button>
          </div>
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div v-for="s in favs" :key="s.id" class="bg-white border border-slate-100 rounded-2xl overflow-hidden group cursor-pointer hover:-translate-y-1 hover:shadow-md transition">
              <div class="h-36 flex items-center justify-center relative" :style="{background: s.gradient}">
                <svg viewBox="0 0 24 24" class="w-14 h-14 opacity-60" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" :stroke="s.iconColor" v-html="s.iconSvg" />
                <button @click.stop="removeFav(s.id)" class="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/80 flex items-center justify-center text-red-400 opacity-0 group-hover:opacity-100 transition">
                  <svg viewBox="0 0 24 24" class="w-4 h-4" fill="currentColor"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                </button>
              </div>
              <div class="p-4">
                <p class="text-[13px] font-bold text-[#0f172a]">{{ s.name }}</p>
                <p class="text-[11px] text-slate-400 mt-0.5">{{ s.category }}</p>
                <div class="flex items-center justify-between mt-3">
                  <span class="text-[13px] font-black text-[#2563ff]">Desde ${{ s.price }}</span>
                  <span class="flex items-center gap-1 text-[11px] text-slate-400"><span class="text-amber-400">★</span> {{ s.rating }}</span>
                </div>
                <button @click="openServiceRequest(s)" class="w-full mt-3 bg-[#2563ff] text-white text-xs font-bold py-2 rounded-xl hover:bg-blue-700 transition">Solicitar servicio</button>
              </div>
            </div>
          </div>
        </template>

        <!-- ===== MENSAJES ===== -->
        <template v-else-if="page === 'Mensajes'">
          <div class="bg-white border border-slate-100 rounded-2xl overflow-hidden flex" style="height:calc(100vh - 220px);min-height:480px">

            <!-- LEFT: lista de conversaciones — full width on mobile when no conv selected -->
            <div :class="['border-r border-slate-100 flex flex-col flex-shrink-0', inlineChat.convId ? 'hidden md:flex md:w-64' : 'flex w-full md:w-64']">
              <div class="p-3 border-b border-slate-100">
                <input v-model="convSearchText" type="text" placeholder="Buscar conversación..."
                  class="w-full bg-slate-50 rounded-xl px-3 py-2 text-[12px] outline-none border border-slate-200 focus:border-blue-400 transition" />
              </div>
              <div v-if="filteredConvs.length === 0" class="flex-1 flex flex-col items-center justify-center py-8 text-slate-300 text-center px-4">
                <svg viewBox="0 0 24 24" class="w-10 h-10 mb-2" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                <p class="text-[12px]">Sin conversaciones activas</p>
              </div>
              <div v-else class="flex-1 overflow-y-auto divide-y divide-slate-50">
                <button v-for="c in filteredConvs" :key="c.id"
                  @click="openInlineChat(c)"
                  :class="['w-full flex items-center gap-3 px-4 py-3.5 hover:bg-slate-50 transition text-left', inlineChat.convId === c.id ? 'bg-blue-50 border-r-2 border-[#2563ff]' : '']"
                >
                  <div class="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-[13px] flex-shrink-0" :style="{background: c.color}">{{ c.initial }}</div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between gap-1">
                      <span class="text-[13px] font-bold text-[#0f172a] truncate">{{ c.name }}</span>
                      <span class="text-[10px] text-slate-400 flex-shrink-0">{{ c.time }}</span>
                    </div>
                    <p class="text-[11px] text-slate-400 truncate mt-0.5">{{ c.last || c.serviceName || 'Sin mensajes' }}</p>
                  </div>
                  <div v-if="c.unread" class="w-4 h-4 rounded-full bg-[#2563ff] text-white text-[9px] font-bold flex items-center justify-center flex-shrink-0">{{ c.unread }}</div>
                </button>
              </div>
            </div>

            <!-- RIGHT: área de chat — hidden on mobile when no conv selected -->
            <div :class="['flex-col min-w-0', inlineChat.convId ? 'flex flex-1' : 'hidden md:flex md:flex-1']">

              <!-- Sin conversación seleccionada -->
              <div v-if="!inlineChat.convId" class="flex-1 flex flex-col items-center justify-center text-slate-300">
                <svg viewBox="0 0 24 24" class="w-14 h-14 mb-3" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                <p class="text-[14px] font-semibold text-slate-400">Selecciona una conversación</p>
                <p class="text-[12px] text-slate-300 mt-1">Elige un chat de la lista para comenzar</p>
              </div>

              <template v-else>
                <!-- Cabecera -->
                <div class="flex items-center gap-3 px-4 md:px-5 py-3.5 border-b border-slate-100 flex-shrink-0">
                  <!-- Back button mobile -->
                  <button @click="inlineChat.convId = null" class="md:hidden w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition flex-shrink-0">
                    <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5m7-7-7 7 7 7"/></svg>
                  </button>
                  <div class="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-[13px] flex-shrink-0" :style="{background: inlineChat.color}">{{ inlineChat.initial }}</div>
                  <div class="flex-1 min-w-0">
                    <p class="font-bold text-[#0f172a] text-[14px] leading-tight">{{ inlineChat.name }}</p>
                    <p class="text-[11px] text-slate-500">{{ inlineChat.serviceName }} · <span class="text-emerald-500 font-semibold">En curso</span></p>
                  </div>
                  <p class="text-[11px] text-slate-400 flex-shrink-0">Solicitud #{{ String(inlineChat.convId).padStart(4,'0') }}</p>
                </div>

                <!-- Mensajes -->
                <div class="flex-1 overflow-y-auto p-5 space-y-3 bg-slate-50/60" ref="inlineChatBodyRef">
                  <div v-if="inlineChat.loading" class="flex justify-center py-8">
                    <svg class="animate-spin w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                  </div>
                  <div v-else-if="!inlineChat.messages.length" class="flex flex-col items-center justify-center py-12 text-slate-300">
                    <svg viewBox="0 0 24 24" class="w-12 h-12 mb-3" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                    <p class="text-[13px]">Aún no hay mensajes. ¡Escribe el primero!</p>
                  </div>
                  <template v-else>
                    <div v-for="msg in inlineChat.messages" :key="msg.id" :class="['flex', msg.is_mine ? 'justify-end' : 'justify-start']">
                      <div :class="['max-w-[65%] px-4 py-2.5 rounded-2xl text-[13px]', msg.is_mine ? 'bg-[#2563ff] text-white rounded-br-sm' : 'bg-white text-[#0f172a] rounded-bl-sm shadow-sm border border-slate-100']">
                        <p>{{ msg.message }}</p>
                        <p :class="['text-[10px] mt-1', msg.is_mine ? 'text-blue-200' : 'text-slate-400']">{{ fmtMsgTime(msg.created_at) }}</p>
                      </div>
                    </div>
                  </template>
                </div>

                <!-- Input -->
                <div class="px-4 py-3 border-t border-slate-100 flex items-center gap-3 bg-white flex-shrink-0">
                  <input v-model="inlineChat.newMessage" @keydown.enter.prevent="sendInlineMessage" :disabled="inlineChat.sending"
                    type="text" placeholder="Escribe un mensaje..."
                    class="flex-1 bg-slate-50 rounded-xl px-4 py-2.5 text-[13px] outline-none border border-slate-200 focus:border-blue-400 transition disabled:opacity-60" />
                  <button @click="sendInlineMessage" :disabled="!inlineChat.newMessage.trim() || inlineChat.sending"
                    class="w-10 h-10 rounded-xl bg-[#2563ff] flex items-center justify-center text-white hover:bg-blue-700 transition disabled:opacity-40 flex-shrink-0">
                    <svg viewBox="0 0 24 24" class="w-4 h-4" fill="currentColor"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
                  </button>
                </div>
              </template>
            </div>

          </div>
        </template>

        <!-- ===== NOTIFICACIONES ===== -->
        <template v-else-if="page === 'Notificaciones'">
          <div class="flex items-center justify-between">
            <span class="font-black text-[#0f172a]">Centro de notificaciones</span>
            <button @click="markAllRead" class="text-[13px] text-[#2563ff] font-semibold hover:underline">Marcar todas como leídas</button>
          </div>
          <div class="bg-white border border-slate-100 rounded-2xl divide-y divide-slate-50 overflow-hidden">
            <div v-for="n in notifs" :key="n.id"
              :class="['flex items-start gap-4 px-6 py-4 transition', n.unread ? 'bg-blue-50/60 hover:bg-blue-50' : 'hover:bg-slate-50']">
              <div :class="['w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0', n.iconBg]">{{ n.icon }}</div>
              <div class="flex-1 min-w-0">
                <p class="text-[13px] font-bold text-[#0f172a]">{{ n.title }}</p>
                <p class="text-[12px] text-slate-500 mt-0.5">{{ n.body }}</p>
                <p class="text-[10px] text-slate-400 mt-1">{{ n.time }}</p>
              </div>
              <span v-if="n.unread" class="w-2 h-2 rounded-full bg-[#2563ff] flex-shrink-0 mt-2"></span>
            </div>
          </div>
        </template>

        <!-- ===== PAGOS Y FACTURAS ===== -->
        <template v-else-if="page === 'Pagos y facturas'">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard icon="💰" iconBg="bg-emerald-100" :value="payStats.total"  label="Total pagado" trend="12" :dark="isDark" />
            <StatCard icon="📅" iconBg="bg-blue-100"    :value="payStats.mes"    label="Este mes"               :dark="isDark" />
            <StatCard icon="⏳" iconBg="bg-amber-100"   :value="payStats.pend"   label="Pendiente"               :dark="isDark" />
          </div>
          <div class="bg-white border border-slate-100 rounded-2xl overflow-hidden">
            <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <span class="font-black text-[#0f172a]">Historial de pagos</span>
              <button class="text-[13px] font-semibold text-[#2563ff] border border-blue-200 px-4 py-1.5 rounded-xl hover:bg-blue-50 transition">Descargar PDF</button>
            </div>
            <!-- Mobile cards (< md) -->
            <div class="md:hidden divide-y divide-slate-50">
              <div v-for="p in payHistPagedItems" :key="p.id" class="p-4 space-y-2.5">
                <div class="flex items-start justify-between gap-2">
                  <p class="font-semibold text-[#0f172a] text-[13px]">{{ p.service }}</p>
                  <span class="bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full text-[11px] font-bold flex-shrink-0">Pagado</span>
                </div>
                <div class="grid grid-cols-2 gap-2 text-[12px]">
                  <div>
                    <p class="text-[10px] text-slate-400 uppercase tracking-wide font-bold">Profesional</p>
                    <p class="text-slate-600 mt-0.5">{{ p.pro }}</p>
                  </div>
                  <div>
                    <p class="text-[10px] text-slate-400 uppercase tracking-wide font-bold">Fecha</p>
                    <p class="text-slate-500 mt-0.5">{{ p.date }}</p>
                  </div>
                  <div>
                    <p class="text-[10px] text-slate-400 uppercase tracking-wide font-bold">Monto</p>
                    <p class="font-bold text-[#0f172a] mt-0.5">{{ p.amount }}</p>
                  </div>
                  <div class="flex items-end">
                    <button @click="openInvoice(p)" class="text-[12px] text-[#2563ff] font-semibold hover:underline">Ver factura</button>
                  </div>
                </div>
              </div>
            </div>
            <!-- Mobile pagination -->
            <div v-if="payHistTotalPages > 1" class="md:hidden flex items-center justify-center gap-3 px-4 py-3 border-t border-slate-100">
              <button :disabled="payHistPage <= 1" @click="payHistPage--"
                class="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 text-sm font-bold disabled:opacity-30 hover:bg-slate-200 transition">‹</button>
              <span class="text-[12px] text-slate-500 font-semibold">{{ payHistPage }} / {{ payHistTotalPages }}</span>
              <button :disabled="payHistPage >= payHistTotalPages" @click="payHistPage++"
                class="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 text-sm font-bold disabled:opacity-30 hover:bg-slate-200 transition">›</button>
            </div>
            <!-- Desktop table (≥ md) -->
            <div class="hidden md:block overflow-x-auto">
              <table class="w-full text-sm min-w-[520px]">
                <thead class="bg-slate-50">
                  <tr>
                    <th v-for="h in ['Servicio','Profesional','Fecha','Monto','Estado','']" :key="h" class="text-left px-6 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wide">{{ h }}</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-50">
                  <tr v-for="p in payments" :key="p.id" class="hover:bg-slate-50 transition">
                    <td class="px-6 py-4 font-semibold text-[#0f172a] text-[13px]">{{ p.service }}</td>
                    <td class="px-6 py-4 text-slate-400 text-[13px]">{{ p.pro }}</td>
                    <td class="px-6 py-4 text-slate-400 text-[13px]">{{ p.date }}</td>
                    <td class="px-6 py-4 font-bold text-[#0f172a] text-[13px]">{{ p.amount }}</td>
                    <td class="px-6 py-4"><span class="bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full text-[11px] font-bold">Pagado</span></td>
                    <td class="px-6 py-4"><button @click="openInvoice(p)" class="text-[12px] text-[#2563ff] font-semibold hover:underline">Ver factura</button></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </template>

        <!-- ===== CONFIGURACIÓN ===== -->
        <template v-else-if="page === 'Configuración'">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="md:col-span-2 space-y-5">
              <div class="bg-white border border-slate-100 rounded-2xl p-6 space-y-4">
                <h3 class="font-black text-[#0f172a]">Información personal</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="text-[11px] font-bold text-slate-400 uppercase tracking-wide block mb-1.5">Nombre</label>
                    <input v-model="configForm.name" type="text" class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-blue-400 transition bg-slate-50 focus:bg-white" />
                  </div>
                  <div>
                    <label class="text-[11px] font-bold text-slate-400 uppercase tracking-wide block mb-1.5">Email</label>
                    <input v-model="configForm.email" type="email" class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-blue-400 transition bg-slate-50 focus:bg-white" />
                  </div>
                  <div>
                    <label class="text-[11px] font-bold text-slate-400 uppercase tracking-wide block mb-1.5">Teléfono</label>
                    <input v-model="configForm.phone" type="tel" class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-blue-400 transition bg-slate-50 focus:bg-white" />
                  </div>
                  <div>
                    <label class="text-[11px] font-bold text-slate-400 uppercase tracking-wide block mb-1.5">Ciudad</label>
                    <input v-model="configForm.city" type="text" class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-blue-400 transition bg-slate-50 focus:bg-white" />
                  </div>
                </div>
                <button @click="saveConfig" :disabled="configSaving" class="bg-[#2563ff] text-white text-[13px] font-bold px-6 py-2.5 rounded-xl hover:bg-blue-700 transition disabled:opacity-60">
                  {{ configSaving ? 'Guardando...' : 'Guardar cambios' }}
                </button>
              </div>
              <div class="bg-white border border-slate-100 rounded-2xl p-6 space-y-4">
                <h3 class="font-black text-[#0f172a]">Seguridad</h3>
                <div>
                  <label class="text-[11px] font-bold text-slate-400 uppercase tracking-wide block mb-1.5">Contraseña actual</label>
                  <input v-model="pwForm.current" type="password" placeholder="••••••••" class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-blue-400 transition bg-slate-50 focus:bg-white" />
                </div>
                <div>
                  <label class="text-[11px] font-bold text-slate-400 uppercase tracking-wide block mb-1.5">Nueva contraseña</label>
                  <input v-model="pwForm.newPw" type="password" placeholder="••••••••" class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-blue-400 transition bg-slate-50 focus:bg-white" />
                </div>
                <button @click="changePassword" :disabled="pwSaving" class="bg-slate-800 text-white text-[13px] font-bold px-6 py-2.5 rounded-xl hover:bg-slate-900 transition disabled:opacity-60">
                  {{ pwSaving ? 'Cambiando...' : 'Cambiar contraseña' }}
                </button>
              </div>
            </div>
            <div class="space-y-5">
              <div class="bg-white border border-slate-100 rounded-2xl p-6 flex flex-col items-center gap-4 text-center">
                <div class="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-black text-2xl">{{ userInitial }}</div>
                <div>
                  <p class="font-black text-[#0f172a]">{{ authStore.user?.name ?? 'Usuario' }}</p>
                  <p class="text-[12px] text-slate-400 mt-0.5">Cliente verificado ✓</p>
                </div>
                <button class="w-full border border-slate-200 text-[13px] font-semibold text-slate-600 py-2 rounded-xl hover:bg-slate-50 transition">Cambiar foto</button>
              </div>
              <div class="bg-white border border-slate-100 rounded-2xl p-5 space-y-3">
                <h3 class="font-black text-[#0f172a] text-[13px]">Notificaciones</h3>
                <div v-for="n in notifSettings" :key="n.key" class="flex items-center justify-between">
                  <span class="text-[13px] text-slate-600">{{ n.label }}</span>
                  <button @click="n.on = !n.on" :class="['w-10 h-5 rounded-full transition-colors relative', n.on ? 'bg-[#2563ff]' : 'bg-slate-200']">
                    <span class="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all" :style="{left: n.on ? '22px' : '2px'}"></span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- ===== AYUDA ===== -->
        <template v-else-if="page === 'Ayuda'">
          <div class="max-w-xl mx-auto space-y-5">
            <div class="text-center pb-2">
              <div class="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-3">
                <svg viewBox="0 0 24 24" class="w-7 h-7" fill="none" stroke="#2563ff" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
              </div>
              <h3 class="text-lg font-black text-[#0f172a]">Centro de ayuda</h3>
              <p class="text-[13px] text-slate-400 mt-1">Encuentra respuestas rápidas a tus preguntas</p>
            </div>
            <div class="bg-white border border-slate-100 rounded-2xl overflow-hidden divide-y divide-slate-100">
              <div v-for="faq in faqs" :key="faq.id">
                <button @click="faq.open = !faq.open" class="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-slate-50 transition">
                  <span class="font-semibold text-[#0f172a] text-[13px]">{{ faq.q }}</span>
                  <svg viewBox="0 0 24 24" class="w-4 h-4 flex-shrink-0 ml-3 transition-transform text-slate-400" :class="faq.open ? 'rotate-180' : ''" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                </button>
                <div v-if="faq.open" class="px-6 pb-4 text-[13px] text-slate-500 leading-relaxed">{{ faq.a }}</div>
              </div>
            </div>
            <div class="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white text-center">
              <p class="font-black text-base">¿No encontraste lo que buscabas?</p>
              <p class="text-[13px] text-blue-200 mt-1 mb-4">Nuestro equipo está disponible 24/7</p>
              <button class="bg-white text-[#2563ff] font-bold text-[13px] px-6 py-2 rounded-xl hover:bg-blue-50 transition">Contactar soporte</button>
            </div>
          </div>
        </template>

      </div>

      <!-- Mobile Bottom Tab Bar — todos los menús con scroll horizontal -->
      <nav class="md:hidden flex-shrink-0 bg-white border-t border-slate-100" style="padding-bottom:env(safe-area-inset-bottom,0px)">
        <div class="flex overflow-x-auto" style="scrollbar-width:none;-ms-overflow-style:none">
          <button v-for="item in navItems.filter(i => !i.divider)" :key="item.name"
            @click="page = item.name"
            :class="['flex-shrink-0 flex flex-col items-center gap-0.5 pt-2 pb-1.5 px-3 min-w-[62px] transition-colors',
              page === item.name ? 'text-[#2563ff]' : 'text-slate-400']">
            <div :class="['relative w-10 h-8 rounded-xl flex items-center justify-center transition-colors',
              page === item.name ? 'bg-blue-50' : '']">
              <svg viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" v-html="item.iconSvg"/>
              <span v-if="item.badge" class="absolute -top-1 -right-1 min-w-[14px] h-3.5 px-0.5 bg-red-500 text-white text-[8px] font-black rounded-full flex items-center justify-center leading-none">{{ item.badge > 9 ? '9+' : item.badge }}</span>
            </div>
            <span class="text-[10px] font-bold whitespace-nowrap">{{ item.label ?? item.name }}</span>
          </button>
        </div>
      </nav>
    </div>

    <!-- Right panel (Inicio only) — hidden on mobile/tablet, visible xl+ -->
    <div v-if="page === 'Inicio'" class="hidden xl:block w-64 flex-shrink-0 overflow-y-auto space-y-3">
      <div class="bg-white rounded-2xl shadow-sm px-5 py-4 flex items-center gap-3">
        <div class="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-black text-base flex-shrink-0">{{ userInitial }}</div>
        <div class="flex-1 min-w-0">
          <p class="font-black text-[#0f172a] text-[13px] truncate">{{ authStore.user?.name ?? 'Usuario' }}</p>
          <button @click="page = 'Configuración'" class="text-[11px] text-[#2563ff] font-semibold hover:underline transition">Ver perfil →</button>
        </div>
      </div>
      <div class="bg-white rounded-2xl shadow-sm px-5 py-4">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Total invertido</p>
            <p class="text-2xl font-black text-[#0f172a] mt-0.5">${{ (clientBalance.total_paid / 100).toLocaleString('es-CO') }}</p>
            <p class="text-[11px] text-emerald-500 font-semibold mt-0.5">En servicios pagados</p>
          </div>
          <div class="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
            <svg viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="#2563ff" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
          </div>
        </div>
        <button class="w-full mt-3 bg-blue-50 text-[#2563ff] text-[12px] font-bold py-2 rounded-xl hover:bg-blue-100 transition">Recargar saldo</button>
      </div>
      <div class="bg-white rounded-2xl shadow-sm px-5 py-4">
        <div class="flex items-center justify-between mb-3">
          <span class="font-black text-[#0f172a] text-[13px]">Mis solicitudes</span>
          <button @click="page = 'Mis solicitudes'" class="text-[11px] text-[#2563ff] font-semibold">Ver todas</button>
        </div>
        <div class="space-y-2.5">
          <div v-for="item in reqSummary" :key="item.label" class="flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <div :class="['w-7 h-7 rounded-lg flex items-center justify-center', item.iconBg]">
                <svg viewBox="0 0 24 24" class="w-3.5 h-3.5" fill="none" :stroke="item.iconColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" v-html="item.iconSvg" />
              </div>
              <span class="text-[12px] text-slate-600">{{ item.label }}</span>
            </div>
            <span class="text-[12px] font-bold text-[#0f172a]">{{ item.count }}</span>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-2xl shadow-sm px-5 py-4 flex items-start gap-3">
        <div class="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
          <svg viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="#2563ff" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        </div>
        <div>
          <p class="text-[13px] font-black text-[#0f172a]">Pago 100% seguro</p>
          <p class="text-[11px] text-slate-400 mt-0.5 leading-relaxed">Tu información y pagos están protegidos.</p>
        </div>
      </div>
      <div class="bg-white rounded-2xl shadow-sm px-5 py-4">
        <p class="font-black text-[#0f172a] text-[13px] mb-3">Profesionales destacados</p>
        <div class="space-y-3">
          <div v-for="pro in topPros" :key="pro.id" class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0" :style="{background: pro.color}">{{ pro.initial }}</div>
            <div class="flex-1 min-w-0">
              <p class="text-[12px] font-bold text-[#0f172a] truncate">{{ pro.name }}</p>
              <p class="text-[10px] text-slate-400">{{ pro.specialty }}</p>
            </div>
            <div class="text-right">
              <p class="text-[11px] font-bold text-amber-500">★ {{ pro.rating }}</p>
              <p class="text-[10px] text-slate-400">{{ pro.jobs }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ============================== MODALS ============================== -->
  <Teleport to="body">

    <!-- Toast notifications -->
    <div class="fixed top-4 right-4 z-[200] flex flex-col gap-2 pointer-events-none">
      <Transition v-for="t in toasts" :key="t.id" name="toast">
        <div :class="['flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg text-[13px] font-semibold pointer-events-auto min-w-[260px]',
          t.type === 'success' ? 'bg-emerald-600 text-white' :
          t.type === 'error'   ? 'bg-red-600 text-white' :
                                  'bg-[#0f172a] text-white']">
          <span>{{ t.type === 'success' ? '✓' : t.type === 'error' ? '✕' : 'ℹ' }}</span>
          <span class="flex-1">{{ t.message }}</span>
          <button @click="dismissToast(t.id)" class="opacity-70 hover:opacity-100">×</button>
        </div>
      </Transition>
    </div>

    <!-- ===== SERVICES MODAL ===== -->
    <Transition name="fade">
      <div v-if="showServicesModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4" style="background:rgba(15,23,42,0.55);">
        <div class="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
          <div class="flex items-center justify-between px-7 py-5 border-b border-slate-100">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-2xl flex items-center justify-center" :style="{background: selectedCategoryModal?.iconBg}">
                <svg viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" :stroke="selectedCategoryModal?.iconColor" v-html="selectedCategoryModal?.iconSvg" />
              </div>
              <div>
                <p class="font-black text-[#0f172a]">{{ selectedCategoryModal?.name }}</p>
                <p class="text-[12px] text-slate-400">Elige el servicio que necesitas</p>
              </div>
            </div>
            <button @click="showServicesModal = false" class="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition text-lg">×</button>
          </div>
          <div class="flex-1 overflow-y-auto p-6">
            <div v-if="servicesByCategory.length === 0" class="flex flex-col items-center justify-center py-16 text-slate-400 gap-3">
              <svg viewBox="0 0 24 24" class="w-10 h-10" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" v-html="SVG.tool" />
              <p class="text-sm font-semibold">No hay servicios disponibles en esta categoría</p>
              <button @click="openServiceRequest(null)" class="mt-2 bg-[#2563ff] text-white text-[13px] font-bold px-5 py-2 rounded-xl hover:bg-blue-700 transition">Solicitar de todas formas</button>
            </div>
            <div v-else class="grid grid-cols-2 gap-4">
              <div v-for="svc in servicesByCategory" :key="svc.id"
                @click="openServiceRequest(svc)"
                class="border border-slate-100 rounded-2xl p-4 cursor-pointer hover:border-blue-300 hover:bg-blue-50/50 hover:-translate-y-0.5 transition-all">
                <div class="w-10 h-10 rounded-xl mb-3 flex items-center justify-center" :style="{background: selectedCategoryModal?.iconBg}">
                  <svg viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" :stroke="selectedCategoryModal?.iconColor" v-html="selectedCategoryModal?.iconSvg" />
                </div>
                <p class="text-[13px] font-bold text-[#0f172a]">{{ svc.name }}</p>
                <p class="text-[11px] text-slate-400 mt-0.5 line-clamp-2">{{ svc.description || 'Servicio profesional a domicilio' }}</p>
                <div class="flex items-center justify-between mt-3">
                  <span class="text-[13px] font-black text-[#2563ff]">Desde ${{ formatPrice(svc.price) }}</span>
                  <button class="bg-[#2563ff] text-white text-[11px] font-bold px-3 py-1 rounded-lg hover:bg-blue-700 transition">Solicitar</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ===== REQUEST FORM MODAL ===== -->
    <Transition name="fade">
      <div v-if="showRequestModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4" style="background:rgba(15,23,42,0.55);">
        <div class="bg-white rounded-3xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden">

          <!-- Header -->
          <div class="flex items-center justify-between px-7 py-5 border-b border-slate-100 flex-shrink-0">
            <div>
              <p class="font-black text-[#0f172a]">{{ selectedService?.name || 'Solicitar servicio' }}</p>
              <p class="text-[12px] text-slate-400">{{ selectedCategoryModal?.name }}</p>
            </div>
            <div class="flex items-center gap-4">
              <div v-if="selectedService" class="bg-blue-50 border border-blue-100 rounded-2xl px-5 py-3 text-right">
                <p class="text-[11px] font-black text-blue-400 uppercase tracking-widest leading-tight">Total</p>
                <p class="text-[26px] font-black text-[#2563ff] leading-tight">${{ formatPrice(totalPrice) }}</p>
                <p v-if="isCapacitacion && form.people_count > 1" class="text-[12px] text-blue-400 font-semibold">× {{ form.people_count }} personas</p>
              </div>
              <button @click="closeRequestModal" class="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition text-lg flex-shrink-0">×</button>
            </div>
          </div>

          <!-- Step progress -->
          <div class="flex-shrink-0 px-7 py-4 border-b border-slate-100">
            <div class="flex items-center gap-2">
              <template v-for="(step, i) in visibleSteps" :key="step">
                <div class="flex items-center gap-2">
                  <div :class="['w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black transition-colors',
                    i < formStep ? 'bg-emerald-500 text-white' :
                    i === formStep ? 'bg-[#2563ff] text-white' :
                    'bg-slate-100 text-slate-400']">
                    <span v-if="i < formStep">✓</span>
                    <span v-else>{{ i + 1 }}</span>
                  </div>
                  <span :class="['text-[11px] font-semibold', i === formStep ? 'text-[#2563ff]' : 'text-slate-400']">{{ step }}</span>
                </div>
                <div v-if="i < visibleSteps.length - 1" class="flex-1 h-px bg-slate-200 min-w-[12px]" />
              </template>
            </div>
          </div>

          <!-- Step content (scrollable) -->
          <div class="flex-1 overflow-y-auto px-7 py-6 space-y-4">

            <!-- PASO: Descripción -->
            <template v-if="currentStepName === 'Descripción'">
              <div>
                <label class="text-[11px] font-bold text-slate-400 uppercase tracking-wide block mb-1.5">¿Qué necesitas?</label>
                <textarea v-model="form.description" rows="4" placeholder="Describe detalladamente lo que necesitas. Ej: limpieza de 2 habitaciones, baño y cocina..."
                  class="w-full border border-slate-200 rounded-xl px-4 py-3 text-[13px] outline-none focus:border-blue-400 transition bg-slate-50 focus:bg-white resize-none" />
              </div>
              <div v-if="isCapacitacion">
                <label class="text-[11px] font-bold text-slate-400 uppercase tracking-wide block mb-2">Número de personas</label>
                <div class="flex items-center gap-4">
                  <button @click="form.people_count = Math.max(1, form.people_count - 1)"
                    class="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition font-bold text-lg">−</button>
                  <span class="text-xl font-black text-[#0f172a] min-w-[2rem] text-center">{{ form.people_count }}</span>
                  <button @click="form.people_count++"
                    class="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 hover:bg-blue-200 transition font-bold text-lg">+</button>
                  <span class="text-[13px] text-slate-400">personas</span>
                </div>
                <div class="mt-4 space-y-2">
                  <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Nombres de los participantes</p>
                  <div v-for="(_, i) in Array(form.people_count)" :key="i" class="flex gap-2">
                    <input v-model="form.people_names[i]" type="text" :placeholder="`Participante ${i + 1}`"
                      class="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-blue-400 transition bg-slate-50 focus:bg-white" />
                    <input v-model="form.people_identifications[i]" type="text" placeholder="# Identificación"
                      class="w-32 border border-slate-200 rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-blue-400 transition bg-slate-50 focus:bg-white" />
                  </div>
                </div>
              </div>
            </template>

            <!-- PASO: Empresa -->
            <template v-else-if="currentStepName === 'Empresa'">
              <p class="text-[13px] text-slate-500">{{ isVirtual ? 'Información de la empresa o establecimiento para el servicio virtual.' : 'Información de la empresa que recibirá la capacitación.' }}</p>
              <div class="space-y-3">
                <div>
                  <label class="text-[11px] font-bold text-slate-400 uppercase tracking-wide block mb-1.5">🏢 Empresa / Establecimiento</label>
                  <input v-model="form.company_name" type="text" placeholder="Nombre de la empresa o establecimiento"
                    class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-blue-400 transition bg-slate-50 focus:bg-white" />
                </div>
                <div>
                  <label class="text-[11px] font-bold text-slate-400 uppercase tracking-wide block mb-1.5">📍 Dirección de la empresa</label>
                  <input v-model="form.company_address" type="text" placeholder="Dirección de la empresa"
                    class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-blue-400 transition bg-slate-50 focus:bg-white" />
                </div>
                <div>
                  <label class="text-[11px] font-bold text-slate-400 uppercase tracking-wide block mb-1.5">👤 Propietarios/as</label>
                  <input v-model="form.company_owners" type="text" placeholder="Nombre del propietario o representante"
                    class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-blue-400 transition bg-slate-50 focus:bg-white" />
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="text-[11px] font-bold text-slate-400 uppercase tracking-wide block mb-1.5">🪪 NIT / No. Cédula</label>
                    <input v-model="form.company_nit" type="text" placeholder="NIT o número de cédula"
                      class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-blue-400 transition bg-slate-50 focus:bg-white" />
                  </div>
                  <div>
                    <label class="text-[11px] font-bold text-slate-400 uppercase tracking-wide block mb-1.5">📱 Celular</label>
                    <input v-model="form.company_phone" type="tel" placeholder="Número de celular"
                      class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-blue-400 transition bg-slate-50 focus:bg-white" />
                  </div>
                </div>
                <div>
                  <label class="text-[11px] font-bold text-slate-400 uppercase tracking-wide block mb-1.5">🌆 Ciudad</label>
                  <input type="text" value="Bogotá D.C. — Cundinamarca" disabled
                    class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-[13px] bg-slate-100 text-slate-500 cursor-not-allowed" />
                </div>
              </div>
            </template>

            <!-- PASO: Ubicación -->
            <template v-else-if="currentStepName === 'Ubicación'">
              <div class="relative">
                <label class="text-[11px] font-bold text-slate-400 uppercase tracking-wide block mb-1.5">Buscar dirección</label>
                <div class="flex gap-2">
                  <input v-model="addressSearch" @input="onAddressInput" @blur="onAddressBlur"
                    @focus="geocodeResults.length && (showAddressSuggestions = true)"
                    type="text" placeholder="Escribe tu dirección, ej: Calle 68 Bogotá"
                    autocomplete="off"
                    class="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-blue-400 transition bg-slate-50 focus:bg-white" />
                  <button v-if="geocodeLoading" class="px-3 text-slate-400">
                    <svg class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                  </button>
                </div>
                <div v-if="showAddressSuggestions && geocodeResults.length" class="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-[500] overflow-hidden">
                  <button v-for="r in geocodeResults" :key="r.place_id ?? r.id ?? r.display_name"
                    @mousedown.prevent="selectGeoResult(r)"
                    class="w-full text-left px-4 py-2.5 hover:bg-blue-50 transition border-b border-slate-50 last:border-0 flex items-start gap-2">
                    <svg class="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    <div class="min-w-0">
                      <p class="text-[13px] font-semibold text-[#0f172a] truncate">{{ r._main || r.display_name?.split(',')[0] || r.display_name }}</p>
                      <p class="text-[11px] text-slate-400 truncate">{{ r._secondary || r.display_name }}</p>
                    </div>
                  </button>
                </div>
              </div>
              <div id="map-picker" class="w-full rounded-2xl overflow-hidden border border-slate-200" style="height:240px;"></div>
              <div>
                <label class="text-[11px] font-bold text-slate-400 uppercase tracking-wide block mb-1.5">Dirección confirmada</label>
                <input v-model="form.address" type="text" placeholder="Se llenará al seleccionar en el mapa"
                  class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-blue-400 transition bg-slate-50 focus:bg-white" />
              </div>
              <div>
                <label class="text-[11px] font-bold text-slate-400 uppercase tracking-wide block mb-1.5">Referencia / Indicaciones</label>
                <input v-model="form.reference_note" type="text" placeholder="Ej: Apto 302, portería por la calle 5"
                  class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-blue-400 transition bg-slate-50 focus:bg-white" />
              </div>
              <div>
                <label class="text-[11px] font-bold text-slate-400 uppercase tracking-wide block mb-1.5">🏙️ Ciudad</label>
                <input type="text" value="Bogotá D.C. — Cundinamarca" disabled
                  class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-[13px] bg-slate-100 text-slate-500 cursor-not-allowed" />
              </div>
            </template>

            <!-- PASO: Fecha y hora -->
            <template v-else-if="currentStepName === 'Fecha y hora'">
              <div>
                <label class="text-[11px] font-bold text-slate-400 uppercase tracking-wide block mb-1.5">📅 Fecha del servicio</label>
                <input v-model="form.service_date" type="date" :min="minDate"
                  class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-blue-400 transition bg-slate-50 focus:bg-white" />
              </div>
              <div>
                <label class="text-[11px] font-bold text-slate-400 uppercase tracking-wide block mb-1.5">⏰ Hora preferida</label>
                <div class="flex items-center gap-2">
                  <select v-model="timeHour"
                    class="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-blue-400 transition bg-slate-50 focus:bg-white">
                    <option value="" disabled>HH</option>
                    <option v-for="h in timeHours" :key="h" :value="h">
                      {{ String(h).padStart(2,'0') }}{{ h < 12 ? ' am' : h === 12 ? ' m' : ' pm' }}
                    </option>
                  </select>
                  <span class="text-lg font-bold text-slate-400">:</span>
                  <select v-model="timeMinute"
                    class="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-blue-400 transition bg-slate-50 focus:bg-white">
                    <option value="" disabled>MM</option>
                    <option v-for="m in timeMinutes" :key="m" :value="m">{{ String(m).padStart(2,'0') }}</option>
                  </select>
                </div>
                <p class="text-[11px] text-slate-400 mt-1">Horario disponible: 6:00 am – 9:00 pm</p>
              </div>
              <div class="bg-blue-50 rounded-xl p-4 text-[13px] text-blue-700">
                <p class="font-bold mb-1">💡 Recuerda</p>
                <p>El profesional confirmará disponibilidad en el horario seleccionado. Puedes cancelar hasta 2 horas antes sin cargo.</p>
              </div>
            </template>

            <!-- PASO: Confirmar -->
            <template v-else-if="currentStepName === 'Confirmar'">
              <div class="bg-slate-50 rounded-2xl p-5 space-y-3">
                <div class="flex items-center gap-3 pb-3 border-b border-slate-200">
                  <div class="w-10 h-10 rounded-xl flex items-center justify-center" :style="{background: selectedCategoryModal?.iconBg}">
                    <svg viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" :stroke="selectedCategoryModal?.iconColor" v-html="selectedCategoryModal?.iconSvg" />
                  </div>
                  <div>
                    <p class="font-black text-[#0f172a] text-[13px]">{{ selectedService?.name }}</p>
                    <p class="text-[11px] text-slate-400">{{ selectedCategoryModal?.name }}</p>
                  </div>
                </div>
                <div v-if="form.description" class="flex gap-2">
                  <span class="text-[11px] font-bold text-slate-400 uppercase w-24 flex-shrink-0">Descripción</span>
                  <span class="text-[13px] text-[#0f172a]">{{ form.description }}</span>
                </div>
                <div v-if="isCapacitacion" class="flex gap-2">
                  <span class="text-[11px] font-bold text-slate-400 uppercase w-24 flex-shrink-0">Personas</span>
                  <span class="text-[13px] text-[#0f172a]">{{ form.people_count }}</span>
                </div>
                <div v-if="form.address" class="flex gap-2">
                  <span class="text-[11px] font-bold text-slate-400 uppercase w-24 flex-shrink-0">Dirección</span>
                  <span class="text-[13px] text-[#0f172a]">{{ form.address }}</span>
                </div>
                <div v-if="form.service_date" class="flex gap-2">
                  <span class="text-[11px] font-bold text-slate-400 uppercase w-24 flex-shrink-0">Fecha</span>
                  <span class="text-[13px] text-[#0f172a]">{{ form.service_date }} · {{ form.service_time }}</span>
                </div>
              </div>
              <div class="bg-white border border-slate-200 rounded-2xl p-5 space-y-2.5">
                <div class="flex items-center justify-between">
                  <span class="text-[13px] text-slate-500">Modalidad</span>
                  <span class="text-[13px] font-semibold text-[#0f172a]">{{ isVirtual ? '💻 Virtual (en línea)' : (form.address || '—') }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-[13px] text-slate-500">Precio base</span>
                  <span class="text-[13px] text-[#0f172a]">${{ formatPrice(selectedService?.price_raw ?? selectedService?.price ?? 0) }}</span>
                </div>
                <div v-if="isCapacitacion && form.people_count > 1" class="flex items-center justify-between">
                  <span class="text-[13px] text-slate-500">Cálculo</span>
                  <span class="text-[13px] font-semibold text-slate-700">${{ formatPrice(selectedService?.price_raw ?? selectedService?.price ?? 0) }} × {{ form.people_count }} personas</span>
                </div>
                <div class="pt-2 border-t border-slate-200 flex items-center justify-between">
                  <span class="text-[14px] font-black text-[#0f172a]">Total a pagar</span>
                  <span class="text-[16px] font-black text-[#2563ff]">${{ formatPrice(totalPrice) }}</span>
                </div>
              </div>
              <p class="text-[12px] text-slate-400 text-center">Al confirmar serás redirigido a la pasarela de pago Wompi</p>
            </template>

          </div>

          <!-- Navigation buttons -->
          <div class="flex-shrink-0 flex items-center justify-between px-7 py-5 border-t border-slate-100">
            <button v-if="formStep > 0" @click="prevStep"
              class="flex items-center gap-2 text-[13px] font-semibold text-slate-500 hover:text-slate-700 transition px-4 py-2 rounded-xl hover:bg-slate-100">
              ← Anterior
            </button>
            <div v-else></div>
            <button v-if="formStep < visibleSteps.length - 1" @click="nextStep"
              class="bg-[#2563ff] text-white text-[13px] font-bold px-7 py-2.5 rounded-xl hover:bg-blue-700 transition">
              Siguiente →
            </button>
            <button v-else @click="submitRequest" :disabled="submitting"
              class="bg-emerald-600 text-white text-[13px] font-bold px-7 py-2.5 rounded-xl hover:bg-emerald-700 transition disabled:opacity-60 flex items-center gap-2">
              <svg v-if="submitting" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
              {{ submitting ? 'Enviando...' : 'Confirmar y pagar' }}
            </button>
          </div>

        </div>
      </div>
    </Transition>

    <!-- ===== MODAL CONFIRMACIÓN DE PAGO ===== -->
    <Transition name="fade">
      <div v-if="showPaymentModal" class="fixed inset-0 z-[115] flex items-center justify-center p-4" style="background:rgba(15,23,42,0.75);">
        <div class="bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center gap-5 max-w-sm w-full mx-4">
          <div class="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-3xl">💳</div>
          <div class="text-center">
            <p class="text-xl font-black text-[#0f172a]">¡Solicitud registrada!</p>
            <p class="text-[13px] text-slate-500 mt-2">Para activarla, completa el pago de forma segura.</p>
          </div>

          <!-- Resumen -->
          <div class="w-full bg-slate-50 rounded-2xl p-4 space-y-2">
            <div class="flex items-center justify-between text-[13px]">
              <span class="text-slate-500">Servicio</span>
              <span class="font-bold text-[#0f172a]">{{ pendingPayment?.service_name }}</span>
            </div>
            <div class="h-px bg-slate-200"/>
            <div class="flex items-center justify-between">
              <span class="font-black text-[#0f172a]">Total a pagar</span>
              <span class="font-black text-[#2563ff] text-lg">{{ pendingPayment?.amount_formatted }}</span>
            </div>
          </div>

          <!-- Tarjeta guardada -->
          <template v-if="savedCard && !changingPayMethod">
            <div class="w-full border border-emerald-200 bg-emerald-50 rounded-2xl p-4">
              <p class="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2">Tarjeta guardada</p>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-7 bg-white border border-slate-200 rounded-md flex items-center justify-center text-[10px] font-black text-slate-600 uppercase">{{ savedCard.brand }}</div>
                  <span class="font-bold text-[13px] text-[#0f172a]">•••• •••• •••• {{ savedCard.last4 }}</span>
                </div>
                <button @click="changingPayMethod = true" class="text-[11px] text-slate-400 hover:text-slate-700 transition">Cambiar</button>
              </div>
            </div>
            <button @click="goToWompiCheckout(true)" :disabled="redirectingPay"
              class="w-full bg-emerald-600 text-white font-black py-3.5 rounded-2xl hover:bg-emerald-700 transition disabled:opacity-60 text-[15px]">
              {{ redirectingPay ? 'Cargando…' : '🔐 Confirmar pago' }}
            </button>
            <button @click="changingPayMethod = true" class="w-full border border-slate-200 text-slate-500 text-[13px] font-semibold py-2.5 rounded-2xl hover:bg-slate-50 transition">
              Usar otro método de pago
            </button>
          </template>

          <!-- Sin tarjeta guardada / cambiando método -->
          <template v-else>
            <div v-if="changingPayMethod" class="w-full">
              <button @click="changingPayMethod = false; savedCard = null" class="text-[11px] text-[#2563ff] font-semibold hover:underline flex items-center gap-1">
                ← Usar tarjeta guardada
              </button>
            </div>
            <div class="text-center space-y-1.5">
              <span class="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-[12px] font-bold">🔒 Pago seguro con Wompi</span>
              <p class="text-[11px] text-slate-400">Bancolombia · Nequi · Tarjeta débito/crédito · PSE</p>
            </div>
            <button @click="goToWompiCheckout(false)" :disabled="redirectingPay"
              class="w-full bg-[#2563ff] text-white font-black py-3.5 rounded-2xl hover:bg-blue-700 transition disabled:opacity-60 text-[15px]">
              {{ redirectingPay ? 'Cargando…' : 'Pagar ahora →' }}
            </button>
          </template>

          <button @click="showPaymentModal = false; changingPayMethod = false"
            class="w-full border border-slate-200 text-slate-500 text-[13px] font-semibold py-2.5 rounded-2xl hover:bg-slate-50 transition">
            Cancelar
          </button>
        </div>
      </div>
    </Transition>

    <!-- ===== WOMPI LOADING MODAL ===== -->
    <Transition name="fade">
      <div v-if="showWompiModal" class="fixed inset-0 z-[110] flex items-center justify-center" style="background:rgba(15,23,42,0.7);">
        <div class="bg-white rounded-3xl shadow-2xl p-10 flex flex-col items-center gap-5 max-w-xs w-full mx-4">
          <div class="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
            <svg v-if="wompiLoading" class="animate-spin w-8 h-8 text-[#2563ff]" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
            <svg v-else viewBox="0 0 24 24" class="w-8 h-8" fill="none" stroke="#2563ff" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
          </div>
          <div class="text-center">
            <p class="font-black text-[#0f172a]">Cargando pasarela de pago</p>
            <p class="text-[13px] text-slate-400 mt-1">Conectando con Wompi...</p>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ===== PAYMENT RESULT MODAL ===== -->
    <Transition name="fade">
      <div v-if="showPaymentResult" class="fixed inset-0 z-[120] flex items-center justify-center p-4" style="background:rgba(15,23,42,0.7);">
        <div class="bg-white rounded-3xl shadow-2xl p-10 flex flex-col items-center gap-5 max-w-sm w-full">
          <!-- Success -->
          <template v-if="paymentStatus === 'approved'">
            <div class="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center">
              <svg viewBox="0 0 24 24" class="w-10 h-10" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <div class="text-center">
              <p class="text-xl font-black text-[#0f172a]">¡Pago exitoso!</p>
              <p class="text-[13px] text-slate-500 mt-2">Tu solicitud fue enviada. El profesional la revisará pronto.</p>
            </div>
            <button @click="onPaymentResultClose('approved')" class="w-full bg-emerald-600 text-white font-bold py-3 rounded-2xl hover:bg-emerald-700 transition">
              Ver mis solicitudes
            </button>
          </template>
          <!-- Pending -->
          <template v-else-if="paymentStatus === 'pending'">
            <div class="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center">
              <svg viewBox="0 0 24 24" class="w-10 h-10" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <div class="text-center">
              <p class="text-xl font-black text-[#0f172a]">Pago en proceso</p>
              <p class="text-[13px] text-slate-500 mt-2">Tu pago está siendo procesado. Te notificaremos cuando se confirme.</p>
            </div>
            <button @click="onPaymentResultClose('pending')" class="w-full bg-amber-500 text-white font-bold py-3 rounded-2xl hover:bg-amber-600 transition">
              Entendido
            </button>
          </template>
          <!-- Failed -->
          <template v-else>
            <div class="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
              <svg viewBox="0 0 24 24" class="w-10 h-10" fill="none" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </div>
            <div class="text-center">
              <p class="text-xl font-black text-[#0f172a]">Pago rechazado</p>
              <p class="text-[13px] text-slate-500 mt-2">No se pudo procesar el pago. Intenta con otro método.</p>
            </div>
            <button @click="showPaymentResult = false" class="w-full bg-red-600 text-white font-bold py-3 rounded-2xl hover:bg-red-700 transition">
              Intentar de nuevo
            </button>
          </template>
        </div>
      </div>
    </Transition>

    <!-- ===== OTP PAGO MODAL ===== -->
    <Transition name="fade">
      <div v-if="showOtpModal" class="fixed inset-0 z-[125] flex items-center justify-center p-4" style="background:rgba(15,23,42,0.85);">
        <div class="bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center gap-5 max-w-sm w-full mx-4">

          <!-- Ícono -->
          <div class="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
            <svg viewBox="0 0 24 24" class="w-8 h-8" fill="none" stroke="#2563ff" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
              <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
            </svg>
          </div>

          <div class="text-center">
            <p class="text-xl font-black text-[#0f172a]">Confirmar pago</p>
            <p class="text-[13px] text-slate-500 mt-2 leading-relaxed">
              Enviamos un código de verificación a<br/>
              <strong class="text-[#0f172a]">{{ maskedEmail }}</strong>
            </p>
          </div>

          <!-- 6 dígitos OTP -->
          <div class="flex gap-2">
            <input
              v-for="(_, i) in otpDigits" :key="i"
              :ref="el => { if (el) otpInputRefs[i] = el }"
              v-model="otpDigits[i]"
              type="text" maxlength="1" inputmode="numeric"
              :class="['w-11 h-12 border-2 rounded-xl text-center text-lg font-black outline-none transition',
                otpError ? 'border-red-400 bg-red-50' : 'border-slate-200 focus:border-[#2563ff] bg-slate-50 focus:bg-white']"
              @input="onOtpInput(i, $event)"
              @keydown.backspace="onOtpBackspace(i)"
              @paste.prevent="onOtpPaste($event)"
            />
          </div>

          <p v-if="otpError" class="text-[12px] text-red-500 font-semibold -mt-2 text-center">{{ otpError }}</p>

          <!-- Botón verificar -->
          <button @click="verifyOtp"
            :disabled="otpDigits.join('').length < 6 || otpVerifying"
            class="w-full bg-[#2563ff] text-white font-black py-3.5 rounded-2xl hover:bg-blue-700 transition disabled:opacity-50 text-[15px] flex items-center justify-center gap-2">
            <svg v-if="otpVerifying" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
            {{ otpVerifying ? 'Verificando...' : '🔐 Confirmar y pagar' }}
          </button>

          <!-- Reenviar -->
          <button @click="resendOtp" :disabled="otpResendCooldown > 0 || otpSending"
            class="text-[12px] transition"
            :class="otpResendCooldown > 0 ? 'text-slate-300 cursor-not-allowed' : 'text-[#2563ff] hover:underline'">
            {{ otpSending ? 'Enviando...' : otpResendCooldown > 0 ? `Reenviar en ${otpResendCooldown}s` : 'Reenviar código' }}
          </button>

          <!-- Volver -->
          <button @click="cancelOtp" class="text-[12px] text-slate-400 hover:text-slate-600 transition">
            ← Volver al pago
          </button>

        </div>
      </div>
    </Transition>

    <!-- ===== INVOICE MODAL ===== -->
    <Transition name="fade">
      <div v-if="showInvoiceModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4" style="background:rgba(15,23,42,0.55);">
        <div class="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
          <!-- Print area -->
          <div id="invoice-print" style="background:white;color:#0f172a;" class="p-8 space-y-5">

            <!-- Header: banner + logo + número -->
            <div class="flex items-start justify-between gap-4">
              <div class="flex items-center gap-3">
                <img src="/images/logo-services-sin-fondo.png" alt="e-service" class="h-10 w-auto object-contain" />
                <div>
                  <p style="color:#0f172a;font-size:15px;font-weight:900;line-height:1.2;">e-service</p>
                  <p style="color:#64748b;font-size:10px;font-weight:600;letter-spacing:.05em;">Plataforma de servicios profesionales</p>
                </div>
              </div>
              <div class="text-right">
                <p style="color:#94a3b8;font-size:9px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;">Comprobante de pago</p>
                <p style="color:#2563eb;font-size:20px;font-weight:900;line-height:1.2;">#{{ invoiceData?.num ?? '—' }}</p>
                <p style="color:#94a3b8;font-size:11px;margin-top:2px;">{{ invoiceData?.date ?? today }}</p>
              </div>
            </div>

            <!-- Línea divisoria con gradiente -->
            <div style="height:3px;background:linear-gradient(90deg,#2563eb,#7c3aed,#0ea5e9);border-radius:2px;"/>

            <!-- Partes: Cliente + Profesional -->
            <div class="grid grid-cols-2 gap-4" style="font-size:13px;">
              <div style="background:#f8fafc;border-radius:12px;padding:14px;border:1px solid #e2e8f0;">
                <p style="color:#94a3b8;font-size:9px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;margin-bottom:6px;">Cliente</p>
                <p style="color:#0f172a;font-weight:700;font-size:13px;">{{ invoiceData?.client ?? authStore.user?.name ?? '—' }}</p>
                <p style="color:#94a3b8;font-size:11px;margin-top:2px;">{{ invoiceData?.clientEmail ?? authStore.user?.email ?? '—' }}</p>
              </div>
              <div style="background:#f8fafc;border-radius:12px;padding:14px;border:1px solid #e2e8f0;">
                <p style="color:#94a3b8;font-size:9px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;margin-bottom:6px;">Profesional</p>
                <p style="color:#0f172a;font-weight:700;font-size:13px;">{{ invoiceData?.pro ?? '—' }}</p>
                <p v-if="invoiceData?.proPhone" style="color:#94a3b8;font-size:11px;margin-top:2px;">Tel: {{ invoiceData.proPhone }}</p>
              </div>
            </div>

            <!-- Detalle del servicio -->
            <div style="border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;font-size:13px;">
              <div style="background:#f1f5f9;padding:8px 16px;display:flex;justify-content:space-between;">
                <span style="color:#64748b;font-size:9px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;">Descripción del servicio</span>
                <span style="color:#64748b;font-size:9px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;">Detalle</span>
              </div>
              <div style="border-top:1px solid #f1f5f9;display:flex;justify-content:space-between;padding:10px 16px;">
                <span style="color:#64748b;">Servicio</span>
                <span style="color:#0f172a;font-weight:600;text-align:right;max-width:55%;">{{ invoiceData?.service ?? '—' }}</span>
              </div>
              <div v-if="invoiceData?.description" style="border-top:1px solid #f1f5f9;display:flex;justify-content:space-between;padding:10px 16px;gap:12px;">
                <span style="color:#64748b;flex-shrink:0;">Descripción</span>
                <span style="color:#0f172a;text-align:right;max-width:55%;line-height:1.4;">{{ invoiceData.description }}</span>
              </div>
              <div style="border-top:1px solid #f1f5f9;display:flex;justify-content:space-between;padding:10px 16px;">
                <span style="color:#64748b;">Fecha</span>
                <span style="color:#0f172a;font-weight:600;">{{ invoiceData?.date ?? '—' }}</span>
              </div>
              <div style="border-top:1px solid #f1f5f9;display:flex;justify-content:space-between;padding:10px 16px;">
                <span style="color:#64748b;">Modalidad</span>
                <span style="color:#0f172a;font-weight:600;">{{ invoiceData?.is_virtual ? 'Virtual (en línea)' : 'Presencial' }}</span>
              </div>
              <div v-if="invoiceData?.address && !invoiceData?.is_virtual" style="border-top:1px solid #f1f5f9;display:flex;justify-content:space-between;padding:10px 16px;gap:12px;">
                <span style="color:#64748b;flex-shrink:0;">Direccion</span>
                <span style="color:#0f172a;text-align:right;max-width:55%;">{{ invoiceData.address }}</span>
              </div>
              <div v-if="invoiceData?.people_count && invoiceData.people_count > 1" style="border-top:1px solid #f1f5f9;display:flex;justify-content:space-between;padding:10px 16px;">
                <span style="color:#64748b;">Participantes</span>
                <span style="color:#0f172a;font-weight:600;">{{ invoiceData.people_count }} personas</span>
              </div>
              <!-- Total row -->
              <div style="border-top:2px solid #e2e8f0;display:flex;justify-content:space-between;align-items:center;padding:12px 16px;background:#eff6ff;">
                <span style="color:#0f172a;font-weight:900;font-size:14px;">Total pagado</span>
                <span style="color:#2563eb;font-weight:900;font-size:18px;">{{ invoiceData?.amount ?? '$0' }}</span>
              </div>
            </div>

            <!-- Estado + sello -->
            <div style="display:flex;align-items:center;justify-content:center;gap:12px;padding-top:4px;">
              <span style="display:inline-flex;align-items:center;gap:6px;background:#d1fae5;color:#065f46;padding:8px 20px;border-radius:100px;font-size:12px;font-weight:700;border:1px solid #a7f3d0;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                Pago completado
              </span>
            </div>

            <div style="height:1px;background:#f1f5f9;"/>
            <p style="color:#94a3b8;font-size:10px;text-align:center;">Documento generado por E-Service · Plataforma de servicios profesionales · {{ new Date().getFullYear() }}</p>
          </div>
          <div class="flex gap-3 px-8 pb-7">
            <button @click="showInvoiceModal = false" class="flex-1 border border-slate-200 text-slate-600 text-[13px] font-semibold py-2.5 rounded-xl hover:bg-slate-50 transition">Cerrar</button>
            <button @click="printInvoice" class="flex-1 bg-[#2563ff] text-white text-[13px] font-bold py-2.5 rounded-xl hover:bg-blue-700 transition">
              Descargar PDF
            </button>
          </div>
        </div>
      </div>
    </Transition>

  </Teleport>

  <!-- ===== MODAL EVIDENCIAS ===== -->
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="evidenceModal.open" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden">
          <div class="flex items-center justify-between px-7 pt-6 pb-4 border-b border-slate-100">
            <h3 class="font-black text-[#0f172a]">Evidencias del servicio <span class="text-slate-400 font-semibold">#{{ String(evidenceModal.reqId ?? '').padStart(4,'0') }}</span></h3>
            <button @click="evidenceModal.open = false" class="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition text-sm">✕</button>
          </div>
          <div class="px-7 py-6">
            <div v-if="evidenceModal.loading" class="flex items-center justify-center py-10 text-slate-400 gap-2">
              <svg class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
              Cargando evidencias...
            </div>
            <div v-else-if="!evidenceModal.items.length" class="text-center py-10 text-slate-400">
              <p class="text-4xl mb-2">📂</p>
              <p class="text-[13px]">El profesional no ha subido evidencias aún.</p>
            </div>
            <div v-else class="grid grid-cols-2 gap-4">
              <a v-for="ev in evidenceModal.items" :key="ev.id" :href="ev.file_url" target="_blank"
                class="block bg-slate-50 border border-slate-200 rounded-xl overflow-hidden hover:border-blue-300 transition cursor-pointer">
                <div class="h-28 flex items-center justify-center bg-slate-100">
                  <img v-if="ev.file_type === 'image'" :src="ev.file_url" class="w-full h-full object-cover" :alt="ev.note" />
                  <span v-else class="text-4xl">{{ ev.file_type === 'pdf' ? '📄' : '🎬' }}</span>
                </div>
                <div class="p-2.5">
                  <p class="text-[12px] font-semibold text-[#0f172a] truncate">{{ ev.note || ev.file_type?.toUpperCase() }}</p>
                  <p class="text-[10px] text-slate-400 mt-0.5">{{ ev.created_at }}</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>

  <!-- ===== CHAT MODAL ===== -->
  <ChatModal
    v-model="chatModal.open"
    :requestId="chatModal.requestId"
    :otherName="chatModal.otherName"
    :serviceName="chatModal.serviceName"
  />

  <!-- ===== CÓDIGO MODAL ===== -->
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="codeModal.open" class="fixed inset-0 z-[130] flex items-center justify-center p-4" style="background:rgba(15,23,42,0.7);">
        <div class="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">
          <div class="flex items-center justify-between px-6 pt-6 pb-3 border-b border-slate-100">
            <h3 class="font-black text-[#0f172a]">Código de aprobación</h3>
            <button @click="codeModal.open = false" class="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition text-sm">✕</button>
          </div>
          <div class="p-6 flex flex-col items-center gap-4">
            <p class="text-[13px] text-slate-500 text-center">Comparte este código solo con el profesional para confirmar el servicio</p>
            <div class="bg-amber-50 border border-amber-200 rounded-2xl p-5 w-full text-center">
              <p class="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-3">CÓDIGO ACTIVO</p>
              <div class="flex justify-center gap-2">
                <span v-for="ch in String(codeModal.req?.completion_code ?? '------').split('')" :key="ch + Math.random()"
                  class="w-10 h-12 border-2 border-amber-400 rounded-xl bg-white flex items-center justify-center font-black text-xl text-[#0f172a]">{{ ch }}</span>
              </div>
              <p class="text-[11px] text-amber-600 mt-3">Válido por ~15 min · Compártelo solo con el profesional</p>
            </div>
            <button @click="generateCode(codeModal.req); codeModal.open = false" :disabled="generating === codeModal.req?.id"
              class="w-full border border-amber-200 text-amber-700 font-bold text-[13px] py-2.5 rounded-xl hover:bg-amber-50 transition disabled:opacity-60">
              🔄 Regenerar código
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>

  <!-- ===== MODAL CALIFICACIÓN ===== -->
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="ratingModal.open" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
          <!-- Header -->
          <div class="flex items-center justify-between px-7 pt-6 pb-4 border-b border-slate-100">
            <h3 class="font-black text-[#0f172a]">Calificar profesional</h3>
            <button @click="ratingModal.open = false" class="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition text-sm">✕</button>
          </div>
          <!-- Body -->
          <div class="px-7 py-6 space-y-5">
            <p class="text-[13px] text-slate-600">¿Cómo fue tu experiencia con <span class="font-bold text-[#0f172a]">{{ ratingModal.proName }}</span>?</p>

            <!-- Estrellas -->
            <div class="flex flex-col items-center gap-2">
              <div class="flex gap-2">
                <button v-for="n in 5" :key="n" @click="ratingModal.score = n"
                  class="text-4xl transition-transform hover:scale-110 focus:outline-none"
                  :class="n <= ratingModal.score ? 'text-amber-400' : 'text-slate-200'">★</button>
              </div>
              <span class="text-[13px] font-bold text-slate-500 h-5">{{ starLabel(ratingModal.score) }}</span>
            </div>

            <!-- Comentario -->
            <div>
              <label class="text-[11px] font-bold text-slate-400 uppercase tracking-wide block mb-1.5">Comentario <span class="font-normal normal-case">(opcional)</span></label>
              <textarea v-model="ratingModal.comment" rows="3" maxlength="500"
                placeholder="Cuéntanos más sobre tu experiencia..."
                class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-blue-400 transition resize-none bg-slate-50 focus:bg-white" />
              <p class="text-right text-[11px] text-slate-400 mt-1">{{ ratingModal.comment.length }}/500</p>
            </div>

            <button @click="submitRating" :disabled="!ratingModal.score || ratingModal.submitting"
              class="w-full bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[13px] font-bold py-3 rounded-xl hover:opacity-90 transition disabled:opacity-50 shadow-sm">
              {{ ratingModal.submitting ? 'Enviando...' : 'Enviar calificación' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, reactive, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'
import categoryService from '@/services/categoryService'
import api from '@/services/api'
import AppSidebar  from '../components/AppSidebar.vue'
import StatCard    from '../components/StatCard.vue'
import ChatModal   from '../components/ChatModal.vue'
import chatService from '@/services/chatService'

const emit = defineEmits(['logout'])
const authStore  = useAuthStore()
const themeStore = useThemeStore()
const isDark     = computed(() => themeStore.isDark)
const firstName  = computed(() => authStore.user?.name?.split(' ')[0] ?? 'Usuario')
const userInitial = computed(() => (authStore.user?.name ?? 'U')[0].toUpperCase())

const page              = ref('Inicio')
const mobileSidebarOpen = ref(false)
const search            = ref('')
const reqTab            = ref('pending')
const reqSort           = ref('recent')
const reqViewMode       = ref('grid')
const reqPage           = ref(1)
const reqPageSize       = computed(() => reqViewMode.value === 'grid' ? 6 : 8)
const generating  = ref(null)
const cancelling  = ref(null)
const evidenceModal = reactive({ open: false, loading: false, reqId: null, items: [] })
const msgText    = ref('')
const activeConv = ref(null)
const chatModal  = reactive({ open: false, requestId: null, otherName: '', serviceName: '' })
const codeModal  = reactive({ open: false, req: null })

const today = new Date().toLocaleDateString('es-CO', { weekday:'long', year:'numeric', month:'long', day:'numeric' })

// ─── SVG paths ───────────────────────────────────────────────────────────────
const SVG = {
  home:     `<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>`,
  clip:     `<rect width="8" height="4" x="8" y="2" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/>`,
  heart:    `<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>`,
  message:  `<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>`,
  bell:     `<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>`,
  card:     `<rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>`,
  settings: `<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>`,
  help:     `<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>`,
  monitor:  `<rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/>`,
  scissors: `<circle cx="6" cy="6" r="3"/><circle cx="18" cy="18" r="3"/><line x1="20" x2="4" y1="4" y2="20"/>`,
  zap:      `<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>`,
  paw:      `<circle cx="11" cy="4" r="2"/><circle cx="18" cy="8" r="2"/><circle cx="20" cy="16" r="2"/><path d="M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z"/>`,
  book:     `<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/>`,
  tool:     `<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>`,
  droplet:  `<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>`,
  brush:    `<path d="m9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08"/><path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1 1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z"/>`,
  shield:   `<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>`,
  check:    `<polyline points="20 6 9 17 4 12"/>`,
  clock:    `<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>`,
  bolt:     `<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>`,
}

// ─── Nav ─────────────────────────────────────────────────────────────────────
const unreadCounts = ref({ notifications: 0, messages: 0, pending_requests: 0 })

const navItems = computed(() => [
  { name:'Inicio',           label:'Inicio',      iconSvg: SVG.home     },
  { name:'Mis solicitudes',  label:'Solicitudes', iconSvg: SVG.clip,    badge: unreadCounts.value.pending_requests || undefined },
  { name:'Favoritos',        label:'Favoritos',   iconSvg: SVG.heart    },
  { divider: true },
  { name:'Mensajes',         label:'Mensajes',    iconSvg: SVG.message, badge: unreadCounts.value.messages        || undefined },
  { name:'Notificaciones',   label:'Notifs',      iconSvg: SVG.bell,    badge: unreadCounts.value.notifications   || undefined },
  { divider: true },
  { name:'Pagos y facturas', label:'Pagos',       iconSvg: SVG.card     },
  { name:'Configuración',    label:'Ajustes',     iconSvg: SVG.settings },
  { name:'Ayuda',            label:'Ayuda',       iconSvg: SVG.help     },
])

// ─── Categories ──────────────────────────────────────────────────────────────
const catStyleDefaults = [
  { name:'Hogar',        iconSvg: SVG.home,     iconColor:'#2563ff', iconBg:'#eff6ff' },
  { name:'Belleza',      iconSvg: SVG.scissors, iconColor:'#db2777', iconBg:'#fdf2f8' },
  { name:'Tecnología',   iconSvg: SVG.monitor,  iconColor:'#0891b2', iconBg:'#ecfeff' },
  { name:'Fitness',      iconSvg: SVG.zap,      iconColor:'#7c3aed', iconBg:'#f5f3ff' },
  { name:'Mascotas',     iconSvg: SVG.paw,      iconColor:'#16a34a', iconBg:'#f0fdf4' },
  { name:'Educación',    iconSvg: SVG.book,     iconColor:'#0284c7', iconBg:'#f0f9ff' },
  { name:'Plomería',     iconSvg: SVG.droplet,  iconColor:'#0ea5e9', iconBg:'#e0f2fe' },
  { name:'Electricidad', iconSvg: SVG.bolt,     iconColor:'#f59e0b', iconBg:'#fffbeb' },
  { name:'Pintura',      iconSvg: SVG.brush,    iconColor:'#f97316', iconBg:'#fff7ed' },
  { name:'Reparaciones', iconSvg: SVG.tool,     iconColor:'#64748b', iconBg:'#f8fafc' },
  { name:'Cerrajería',   iconSvg: SVG.shield,   iconColor:'#6366f1', iconBg:'#eef2ff' },
  { name:'Limpieza',     iconSvg: SVG.check,    iconColor:'#10b981', iconBg:'#ecfdf5' },
  { name:'Capacitación', iconSvg: SVG.book,     iconColor:'#0284c7', iconBg:'#f0f9ff' },
  { name:'Seguridad',    iconSvg: SVG.shield,   iconColor:'#6366f1', iconBg:'#eef2ff' },
  { name:'Mudanza',      iconSvg: SVG.tool,     iconColor:'#64748b', iconBg:'#f8fafc' },
]

const catStyleFor = (name) => {
  const lower = name.toLowerCase()
  return catStyleDefaults.find(d => lower.includes(d.name.toLowerCase())) ?? catStyleDefaults[0]
}

const cats       = ref(catStyleDefaults.map((d, i) => ({ id: i + 1, ...d })))
const allServices = ref([])
const services   = ref([
  { id:1, name:'Limpieza a domicilio',  price:'50.000', price_raw:50000, rating:4.9, reviews:120, category_id:null, iconSvg: SVG.check,    iconColor:'#10b981', gradient:'linear-gradient(135deg,#f0fdf4,#bbf7d0)' },
  { id:2, name:'Manicure y pedicure',   price:'35.000', price_raw:35000, rating:4.8, reviews:98,  category_id:null, iconSvg: SVG.scissors, iconColor:'#db2777', gradient:'linear-gradient(135deg,#fdf2f8,#fbcfe8)' },
  { id:3, name:'Clases personalizadas', price:'60.000', price_raw:60000, rating:4.9, reviews:110, category_id:null, iconSvg: SVG.book,     iconColor:'#2563ff', gradient:'linear-gradient(135deg,#eff6ff,#bfdbfe)' },
  { id:4, name:'Paseo de mascotas',     price:'25.000', price_raw:25000, rating:4.7, reviews:85,  category_id:null, iconSvg: SVG.paw,      iconColor:'#16a34a', gradient:'linear-gradient(135deg,#f0fdf4,#d1fae5)' },
])

const filteredCats = computed(() => {
  const q = search.value.toLowerCase().trim()
  const all = q ? cats.value.filter(c => c.name.toLowerCase().includes(q)) : cats.value
  return all.slice(0, 6)
})

// ─── Requests page ───────────────────────────────────────────────────────────
const PENDING_STATUSES = ['pending', 'payment_pending']

const reqsLoading = ref(false)
const reqs = ref([
  { id:1, num:'0001', name:'Instalación eléctrica', description:'Instalación de toma corrientes', pro:'Carlos Mendez',  proPhone:'3001234567', date:'2026-05-15 09:00', address:'Calle 80 # 45-20, Bogotá', is_virtual:false, people_count:1, price:'120.000', price_raw:120000, status:'accepted',       status_label:'EN CURSO',        completion_code:null, _rated:false },
  { id:2, num:'0002', name:'Limpieza profunda',     description:'Limpieza general hogar',         pro:'María González', proPhone:'3009876543', date:'2026-05-10 14:00', address:'Carrera 15 # 100-30',       is_virtual:false, people_count:1, price:'80.000',  price_raw:80000,  status:'completed',      status_label:'COMPLETADA',      completion_code:null, _rated:false },
  { id:3, num:'0003', name:'Reparación tubería',    description:'Fuga en el baño principal',      pro:'Luis Rodríguez', proPhone:'3005551234', date:'2026-05-05 10:00', address:'Av. El Dorado # 68-35',     is_virtual:false, people_count:1, price:'95.000',  price_raw:95000,  status:'completed',      status_label:'COMPLETADA',      completion_code:null, _rated:true  },
  { id:4, num:'0004', name:'Pintura sala',          description:'Pintura sala y comedor',         pro:null,             proPhone:null,         date:'2026-04-28 08:00', address:null,                        is_virtual:false, people_count:1, price:'200.000', price_raw:200000, status:'payment_pending', status_label:'PAGO PENDIENTE',  completion_code:null, _rated:false },
  { id:5, num:'0005', name:'Capacitación Virtual',  description:'Curso online de Excel',          pro:'Ana Torres',     proPhone:'3106667788', date:'2026-04-20 15:00', address:null,                        is_virtual:true,  people_count:2, price:'60.000',  price_raw:60000,  status:'completed',      status_label:'COMPLETADA',      completion_code:null, _rated:false },
])

const PENDING_SET  = ['pending','payment_pending']
const ACTIVE_SET   = ['accepted','active']
const COMPLETE_SET = ['completed']

const countByTab = (key) => reqs.value.filter(r =>
  key === 'pending'   ? PENDING_SET.includes(r.status)
  : key === 'accepted' ? ACTIVE_SET.includes(r.status)
  : COMPLETE_SET.includes(r.status)
).length

const filteredReqs = computed(() => {
  let arr = reqs.value.filter(r =>
    reqTab.value === 'pending'   ? PENDING_SET.includes(r.status)
    : reqTab.value === 'accepted' ? ACTIVE_SET.includes(r.status)
    : COMPLETE_SET.includes(r.status)
  )
  if (reqSort.value === 'name')  arr = [...arr].sort((a, b) => a.name.localeCompare(b.name))
  else if (reqSort.value === 'date') arr = [...arr].sort((a, b) => new Date(a.date) - new Date(b.date))
  else arr = [...arr].sort((a, b) => b.id - a.id)
  return arr
})

const pagedReqs = computed(() => {
  const start = (reqPage.value - 1) * reqPageSize.value
  return filteredReqs.value.slice(start, start + reqPageSize.value)
})

const totalReqPages = computed(() => Math.max(1, Math.ceil(filteredReqs.value.length / reqPageSize.value)))

const reqPageNums = computed(() => {
  const total = totalReqPages.value
  const cur   = reqPage.value
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const s = new Set([1, total, cur])
  if (cur > 2)         s.add(cur - 1)
  if (cur < total - 1) s.add(cur + 1)
  return [...s].sort((a, b) => a - b)
})

watch([reqTab, reqSort, reqViewMode], () => { reqPage.value = 1 })

const reqStats = computed(() => ({
  total:      reqs.value.length,
  activas:    reqs.value.filter(r => [...PENDING_SET,...ACTIVE_SET].includes(r.status)).length,
  completadas:reqs.value.filter(r => COMPLETE_SET.includes(r.status)).length,
  canceladas: reqs.value.filter(r => r.status === 'cancelled').length,
}))

const statusBadgeClass = (sl) => ({
  'PAGO PENDIENTE': 'bg-orange-100 text-orange-700',
  'EN CURSO':       'bg-blue-100 text-blue-700',
  'COMPLETADA':     'bg-emerald-100 text-emerald-700',
  'CANCELADA':      'bg-red-100 text-red-600',
}[sl] || 'bg-slate-100 text-slate-500')

const generateCode = async (req) => {
  generating.value = req.id
  try {
    const { data } = await api.post(`/client/requests/${req.id}/generate-code`)
    const found = reqs.value.find(r => r.id === req.id)
    if (found) {
      found.completion_code            = data.code
      found.completion_code_expires_at = data.expires_at
    }
    // Open code modal with the updated req
    Object.assign(codeModal, { open: true, req: found ?? req })
  } catch { showToast('Error al generar el código', 'error') }
  finally { generating.value = null }
}

const cancelRequest = async (req) => {
  if (!confirm('¿Cancelar esta solicitud? Esta acción no se puede deshacer.')) return
  cancelling.value = req.id
  try {
    await api.delete(`/client/requests/${req.id}`)
    reqs.value = reqs.value.filter(r => r.id !== req.id)
    showToast('Solicitud cancelada correctamente.', 'success')
  } catch { showToast('No se pudo cancelar la solicitud.', 'error') }
  finally { cancelling.value = null }
}

const openEvidences = async (req) => {
  Object.assign(evidenceModal, { open: true, loading: true, reqId: req.id, items: [] })
  try {
    const { data } = await api.get(`/client/requests/${req.id}/evidences`)
    evidenceModal.items   = Array.isArray(data) ? data : []
    evidenceModal.loading = false
  } catch {
    showToast('Error al cargar las evidencias', 'error')
    evidenceModal.open = false
  }
}

const retryPayment = (req) => {
  pendingPayment.value = {
    service_request_id: req.id,
    amount_formatted:   req.price,
    service_name:       req.name,
  }
  showPaymentModal.value = true
}

const openChatWithPro = (req) => {
  Object.assign(chatModal, {
    open:        true,
    requestId:   req.id,
    otherName:   req.pro ?? 'Profesional',
    serviceName: req.name ?? '',
  })
}

const isCapacitacionReq = (req) => /capacit|virtual/i.test(req.name ?? '')

const downloadActa = async (req) => {
  try {
    const res = await api.get(`/client/requests/${req.id}/document/1`, { responseType: 'blob' })
    const url  = URL.createObjectURL(new Blob([res.data], { type: res.data.type }))
    const a    = document.createElement('a'); a.href = url
    a.download = `Acta-${req.num}.docx`; a.click(); URL.revokeObjectURL(url)
  } catch { showToast('No se pudo descargar el acta', 'error') }
}

// ─── Favoritos ───────────────────────────────────────────────────────────────
const favs = ref([
  { id:1, name:'Limpieza a domicilio',  category:'Limpieza',  price:'50.000', price_raw:50000, rating:'4.9', iconSvg: SVG.check,    iconColor:'#10b981', gradient:'linear-gradient(135deg,#f0fdf4,#bbf7d0)' },
  { id:2, name:'Manicure y pedicure',   category:'Belleza',   price:'35.000', price_raw:35000, rating:'4.8', iconSvg: SVG.scissors, iconColor:'#db2777', gradient:'linear-gradient(135deg,#fdf2f8,#fbcfe8)' },
  { id:3, name:'Plomería general',      category:'Plomería',  price:'70.000', price_raw:70000, rating:'4.7', iconSvg: SVG.droplet,  iconColor:'#0ea5e9', gradient:'linear-gradient(135deg,#e0f2fe,#bae6fd)' },
  { id:4, name:'Pintura de interiores', category:'Pintura',   price:'90.000', price_raw:90000, rating:'4.9', iconSvg: SVG.brush,    iconColor:'#f97316', gradient:'linear-gradient(135deg,#fff7ed,#fed7aa)' },
])

const removeFav = async (id) => {
  favs.value = favs.value.filter(f => f.id !== id)
  try { await api.delete(`/client/favorites/${id}`) } catch { /* ignore */ }
  showToast('Eliminado de favoritos', 'success')
}

// ─── Mensajes ────────────────────────────────────────────────────────────────
const convSearchText = ref('')
const convs = ref([])
const convColors = ['#3b82f6','#10b981','#f43f5e','#7c3aed','#f59e0b','#0ea5e9']

// ─── Inline chat (split-panel en página Mensajes) ─────────────────────────────
const inlineChat = reactive({
  convId: null, name: '', serviceName: '', initial: '', color: '',
  messages: [], loading: false, sending: false, newMessage: '',
})
const inlineChatBodyRef = ref(null)
let inlinePollTimer = null

const fmtMsgTime = (d) => {
  if (!d) return ''
  return new Date(d).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
}

const scrollInlineToBottom = () => {
  nextTick(() => {
    if (inlineChatBodyRef.value) inlineChatBodyRef.value.scrollTop = inlineChatBodyRef.value.scrollHeight
  })
}

const loadInlineChatMessages = async () => {
  if (!inlineChat.convId) return
  try {
    const { data } = await chatService.getMessages(inlineChat.convId)
    const list = Array.isArray(data) ? data : (data?.messages ?? data?.data ?? [])
    const myId = authStore.user?.id
    inlineChat.messages = list.map(m => ({ ...m, is_mine: m.is_mine ?? (m.sender_id === myId) }))
    scrollInlineToBottom()
  } catch { /* keep current */ }
}

const openInlineChat = async (conv) => {
  clearInterval(inlinePollTimer)
  Object.assign(inlineChat, {
    convId: conv.id, name: conv.name, serviceName: conv.serviceName,
    initial: conv.initial, color: conv.color, messages: [], loading: true, newMessage: '',
  })
  await loadInlineChatMessages()
  inlineChat.loading = false
  inlinePollTimer = setInterval(loadInlineChatMessages, 3000)
}

const sendInlineMessage = async () => {
  const text = inlineChat.newMessage.trim()
  if (!text || inlineChat.sending) return
  inlineChat.sending = true
  inlineChat.newMessage = ''
  try {
    await chatService.sendMessage(inlineChat.convId, text)
    await loadInlineChatMessages()
  } catch { inlineChat.newMessage = text }
  finally { inlineChat.sending = false }
}

const filteredConvs = computed(() => {
  if (!convSearchText.value.trim()) return convs.value
  const q = convSearchText.value.toLowerCase()
  return convs.value.filter(c => c.name.toLowerCase().includes(q))
})

const loadConversations = async () => {
  try {
    const { data } = await api.get('/client/requests')
    if (Array.isArray(data)) {
      const relevant = data.filter(r => r.professional && ['accepted','active','completed'].includes(r.status))
      // Un chat por profesional: conservar la solicitud más reciente de cada uno
      const byPro = new Map()
      relevant.forEach(r => {
        const proKey = r.professional?.id ?? r.professional?.name ?? r.professional_name
        const existing = byPro.get(proKey)
        if (!existing || r.id > existing.id) byPro.set(proKey, r)
      })
      convs.value = Array.from(byPro.values()).map((r, i) => ({
        id:      r.id,
        name:    r.professional?.name ?? r.professional_name ?? 'Profesional',
        initial: (r.professional?.name ?? r.professional_name ?? 'P')[0].toUpperCase(),
        color:   convColors[i % convColors.length],
        last:    r.last_message ?? '',
        time:    r.last_message_at ? new Date(r.last_message_at).toLocaleTimeString('es-CO',{hour:'2-digit',minute:'2-digit'}) : '',
        unread:  r.unread_count ?? 0,
        serviceName: r.service_name ?? '',
      }))
    }
  } catch { /* keep current */ }
}

const messages = ref([
  { id:1, text:'Hola, ¿está disponible para mañana?', mine:false, time:'10:15' },
  { id:2, text:'Sí, tengo disponibilidad en la tarde.', mine:true, time:'10:18' },
  { id:3, text:'Perfecto, ¿a qué hora?',               mine:false, time:'10:20' },
  { id:4, text:'Llego a las 3pm si le parece bien.',   mine:true,  time:'10:22' },
  { id:5, text:'Perfecto, llego a las 3pm',            mine:false, time:'10:30' },
])

const sendMsg = async () => {
  if (!msgText.value.trim()) return
  const text = msgText.value
  messages.value.push({ id: Date.now(), text, mine: true, time: new Date().toLocaleTimeString('es-CO',{hour:'2-digit',minute:'2-digit'}) })
  msgText.value = ''
  if (activeConv.value) {
    try { await api.post(`/chat/${activeConv.value.id}`, { message: text }) } catch { /* ignore */ }
  }
}

// ─── Chat polling ─────────────────────────────────────────────────────────────
let chatPollTimer = null

const loadMessages = async (convId) => {
  try {
    const { data } = await api.get(`/chat/${convId}`)
    const list = Array.isArray(data) ? data : data?.data
    if (Array.isArray(list) && list.length) {
      messages.value = list.map(m => ({
        id:   m.id,
        text: m.message ?? m.text ?? '',
        mine: m.sender_id === authStore.user?.id || m.is_mine,
        time: m.created_at ? new Date(m.created_at).toLocaleTimeString('es-CO', {hour:'2-digit',minute:'2-digit'}) : m.time ?? '',
      }))
    }
  } catch { /* ignore — keep current messages */ }
}

watch(activeConv, (conv) => {
  clearInterval(chatPollTimer)
  if (conv) {
    loadMessages(conv.id)
    chatPollTimer = setInterval(() => loadMessages(conv.id), 6000)
  }
})

// ─── Invoice modal ────────────────────────────────────────────────────────────
const showInvoiceModal = ref(false)
const invoiceData      = ref(null)

const openInvoice = (payment) => {
  invoiceData.value  = payment
  showInvoiceModal.value = true
}

const openInvoiceForReq = (req) => {
  invoiceData.value = {
    num:          req.num,
    service:      req.name,
    description:  req.description,
    pro:          req.pro,
    proPhone:     req.proPhone,
    date:         req.date,
    amount:       `$${req.price}`,
    amount_raw:   req.price_raw,
    address:      req.address,
    is_virtual:   req.is_virtual,
    people_count: req.people_count,
    client:       authStore.user?.name ?? 'Cliente',
    clientEmail:  authStore.user?.email ?? '',
  }
  showInvoiceModal.value = true
}

const printInvoice = () => {
  window.print()
}

// ─── Notificaciones ──────────────────────────────────────────────────────────
const notifs = reactive([
  { id:1, icon:'✅', iconBg:'bg-emerald-100', title:'Servicio completado',     body:'Carlos Mendez completó la instalación.', time:'Hace 2 horas', unread:true  },
  { id:2, icon:'💬', iconBg:'bg-blue-100',    title:'Nuevo mensaje',           body:'María González te envió un mensaje.',    time:'Hace 4 horas', unread:true  },
  { id:3, icon:'⭐', iconBg:'bg-amber-100',   title:'Califica tu experiencia', body:'¿Cómo fue tu servicio de plomería?',     time:'Hace 1 día',   unread:false },
  { id:4, icon:'🔔', iconBg:'bg-purple-100',  title:'Recordatorio',            body:'Tu limpieza es mañana a las 9am.',       time:'Hace 2 días',  unread:false },
])

const _timeAgo = (iso) => {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000
  if (diff < 60)   return 'Hace un momento'
  if (diff < 3600) return `Hace ${Math.floor(diff / 60)} min`
  if (diff < 86400)return `Hace ${Math.floor(diff / 3600)} h`
  if (diff < 604800)return `Hace ${Math.floor(diff / 86400)} día${Math.floor(diff/86400)>1?'s':''}`
  return new Date(iso).toLocaleDateString('es-CO', {day:'numeric',month:'short'})
}

const _notifIcon  = (type) => ({ new_message:'💬', payment:'💰', rating_reminder:'⭐', service_completed:'✅' })[type] ?? '🔔'
const _notifBg    = (type) => ({ new_message:'bg-blue-100', payment:'bg-emerald-100', rating_reminder:'bg-amber-100', service_completed:'bg-emerald-100' })[type] ?? 'bg-purple-100'

const markAllRead = async () => {
  notifs.forEach(n => { n.unread = false })
  try {
    await api.post('/client/notifications/read-all')
    unreadCounts.value.notifications = 0
  } catch { /* ignore */ }
}

const loadNotifications = async () => {
  try {
    const { data } = await api.get('/client/notifications')
    const list = Array.isArray(data) ? data : data?.data
    if (Array.isArray(list)) {
      notifs.splice(0, notifs.length, ...list.map(n => ({
        id:     n.id,
        icon:   _notifIcon(n.type),
        iconBg: _notifBg(n.type),
        title:  n.title ?? 'Notificación',
        body:   n.body  ?? '',
        time:   n.created_at ? _timeAgo(n.created_at) : 'Reciente',
        unread: !n.read_at,
      })))
    }
  } catch { /* mantener mock si el backend falla */ }
}

const loadUnreadCounts = async () => {
  try {
    const { data } = await api.get('/client/unread-counts')
    unreadCounts.value = data
  } catch { /* ignore */ }
}

const loadFeaturedPros = async () => {
  try {
    const { data } = await api.get('/client/featured-professionals')
    const list = Array.isArray(data) ? data : data?.data ?? []
    if (list.length) {
      topPros.value = list.map((p, i) => ({
        id:       p.id,
        name:     p.name,
        specialty:p.specialty,
        rating:   p.rating > 0 ? String(p.rating) : '—',
        jobs:     p.jobs > 0 ? `${p.jobs} trabajo${p.jobs !== 1 ? 's' : ''}` : 'Nuevo',
        initial:  (p.name ?? 'P')[0].toUpperCase(),
        color:    PRO_COLORS[i % PRO_COLORS.length],
      }))
    }
  } catch { /* keep default */ }
}

const loadBalance = async () => {
  try {
    const { data } = await api.get('/client/balance')
    clientBalance.value = data
  } catch { /* ignore */ }
}

// ─── Calificación ─────────────────────────────────────────────────────────────
const ratingModal = reactive({ open: false, requestId: null, proName: '', score: 0, comment: '', submitting: false })

const starLabel = (n) => (['', 'Muy malo', 'Malo', 'Regular', 'Bueno', '¡Excelente!'])[n] ?? ''

const openRatingModal = (req) => {
  ratingModal.requestId = req.id
  ratingModal.proName   = req.pro
  ratingModal.score     = 0
  ratingModal.comment   = ''
  ratingModal.open      = true
}

const submitRating = async () => {
  if (!ratingModal.score) return
  ratingModal.submitting = true
  try {
    await api.post(`/client/requests/${ratingModal.requestId}/rate`, {
      score:   ratingModal.score,
      comment: ratingModal.comment,
    })
    const found = reqs.value.find(r => r.id === ratingModal.requestId)
    if (found) found._rated = true
    ratingModal.open = false
    showToast('¡Calificación enviada! Gracias por tu opinión.', 'success')
  } catch (e) {
    showToast(e.response?.data?.message ?? 'Error al enviar la calificación', 'error')
  } finally {
    ratingModal.submitting = false
  }
}

// ─── Pagos ───────────────────────────────────────────────────────────────────
const payments = ref([
  { id:1, service:'Instalación eléctrica', pro:'Carlos Mendez',  date:'15 May 2026', amount:'$120.000', amount_raw:120000 },
  { id:2, service:'Limpieza profunda',     pro:'María González', date:'10 May 2026', amount:'$80.000',  amount_raw:80000  },
  { id:3, service:'Reparación tubería',    pro:'Luis Rodríguez', date:'05 May 2026', amount:'$95.000',  amount_raw:95000  },
  { id:4, service:'Pintura sala',          pro:'Ana Martínez',   date:'28 Abr 2026', amount:'$200.000', amount_raw:200000 },
])
const payStats = computed(() => ({
  total: '$' + payments.value.reduce((s, p) => s + (p.amount_raw ?? 0), 0).toLocaleString('es-CO'),
  mes:   '$0',
  pend:  '$0',
}))

const PAY_MOBILE_PG = 5
const payHistPage = ref(1)
const payHistPagedItems = computed(() => {
  const start = (payHistPage.value - 1) * PAY_MOBILE_PG
  return payments.value.slice(start, start + PAY_MOBILE_PG)
})
const payHistTotalPages = computed(() => Math.ceil(payments.value.length / PAY_MOBILE_PG))

// ─── Configuración ───────────────────────────────────────────────────────────
const configForm = reactive({ name: '', email: '', phone: '', city: '' })
const pwForm     = reactive({ current: '', newPw: '' })
const configSaving = ref(false)
const pwSaving     = ref(false)

const saveConfig = async () => {
  configSaving.value = true
  try {
    await api.put('/client/profile', configForm)
    authStore.updateUser({ name: configForm.name, email: configForm.email })
    showToast('Perfil actualizado correctamente', 'success')
  } catch { showToast('Error al guardar. Intenta de nuevo.', 'error') }
  finally { configSaving.value = false }
}

const changePassword = async () => {
  if (!pwForm.current || !pwForm.newPw) { showToast('Completa ambos campos', 'error'); return }
  pwSaving.value = true
  try {
    await api.put('/client/password', { current_password: pwForm.current, new_password: pwForm.newPw })
    showToast('Contraseña cambiada correctamente', 'success')
    pwForm.current = ''; pwForm.newPw = ''
  } catch { showToast('Contraseña actual incorrecta', 'error') }
  finally { pwSaving.value = false }
}

const notifSettings = reactive([
  { key:'email', label:'Notificaciones por email', on:true  },
  { key:'push',  label:'Notificaciones push',       on:true  },
  { key:'sms',   label:'Notificaciones SMS',         on:false },
  { key:'promo', label:'Promociones y ofertas',      on:true  },
])

const faqs = reactive([
  { id:1, q:'¿Cómo solicito un servicio?', a:'Ve a Inicio, elige una categoría o busca el servicio que necesitas, y completa el formulario de solicitud.', open:false },
  { id:2, q:'¿Cómo funciona el pago?',     a:'Los pagos son seguros. El dinero queda retenido hasta que confirmes que el servicio fue completado satisfactoriamente.', open:false },
  { id:3, q:'¿Qué hago si no estoy satisfecho?', a:'Puedes abrir una disputa dentro de las 24 horas siguientes a la finalización. Nuestro equipo revisará el caso.', open:false },
  { id:4, q:'¿Cómo califico a un profesional?',  a:'Una vez completado el servicio recibirás una notificación para calificar con estrellas y comentarios.', open:false },
  { id:5, q:'¿Puedo cancelar una solicitud?',    a:'Puedes cancelar hasta 2 horas antes del servicio sin cargo. Cancelaciones tardías pueden tener penalización.', open:false },
])

const reqSummary = computed(() => [
  { label:'En progreso', count: reqs.value.filter(r => ACTIVE_SET.includes(r.status)).length,   iconBg:'bg-blue-50',    iconColor:'#2563ff', iconSvg: SVG.clock },
  { label:'Pendientes',  count: reqs.value.filter(r => PENDING_SET.includes(r.status)).length,  iconBg:'bg-amber-50',   iconColor:'#f59e0b', iconSvg: SVG.bell  },
  { label:'Completadas', count: reqs.value.filter(r => COMPLETE_SET.includes(r.status)).length, iconBg:'bg-emerald-50', iconColor:'#10b981', iconSvg: SVG.check },
])

const PRO_COLORS    = ['#3b82f6','#10b981','#f43f5e','#7c3aed','#f59e0b','#0ea5e9','#8b5cf6','#ec4899']
const topPros       = ref([])
const clientBalance = ref({ balance: 0, total_paid: 0 })

// ─── Helpers ─────────────────────────────────────────────────────────────────
const formatPrice = (val) => {
  const n = typeof val === 'string' ? parseInt(val.replace(/\./g,'').replace(/[^\d]/g,'')) : Number(val)
  return isNaN(n) ? val : n.toLocaleString('es-CO')
}

// ─── Toast ───────────────────────────────────────────────────────────────────
const toasts  = ref([])
let toastSeq  = 0
const showToast = (message, type = 'info') => {
  const id = ++toastSeq
  toasts.value.push({ id, message, type })
  setTimeout(() => dismissToast(id), 3500)
}
const dismissToast = (id) => { toasts.value = toasts.value.filter(t => t.id !== id) }

// ─── Services modal ──────────────────────────────────────────────────────────
const showServicesModal   = ref(false)
const selectedCategoryModal = ref(null)

const servicesByCategory = computed(() => {
  if (!selectedCategoryModal.value) return []
  const byId = allServices.value.filter(s => s.category_id === selectedCategoryModal.value.id)
  if (byId.length) return byId
  // fallback: search by category name substring
  return allServices.value.filter(s =>
    (s.category_name ?? '').toLowerCase().includes(selectedCategoryModal.value.name.toLowerCase())
  )
})

const openCategoryModal = (cat) => {
  selectedCategoryModal.value = cat
  showServicesModal.value = true
}

// ─── Request form modal ──────────────────────────────────────────────────────
const showRequestModal = ref(false)
const selectedService  = ref(null)
const formStep         = ref(0)
const submitting       = ref(false)

const form = reactive({
  description:    '',
  people_count:   1,
  people_names:   Array(20).fill(''),
  people_identifications: Array(20).fill(''),
  company_name:   '',
  company_nit:    '',
  company_address:'',
  company_phone:  '',
  company_owners: '',
  address:        '',
  reference_note: '',
  lat:            null,
  lng:            null,
  city_id:        1,
  service_date:   '',
  service_time:   '09:00',
  payment_reference: '',
  payment_amount:    0,
})

const isVirtual      = computed(() => selectedService.value?.name?.toLowerCase().includes('virtual') ?? false)
const isCapacitacion = computed(() => selectedCategoryModal.value?.name?.toLowerCase().includes('capacit') ?? false)

const visibleSteps = computed(() => {
  const steps = ['Descripción']
  if (isCapacitacion.value || isVirtual.value) steps.push('Empresa')
  if (!isVirtual.value) { steps.push('Ubicación'); steps.push('Fecha y hora') }
  steps.push('Confirmar')
  return steps
})

const currentStepName = computed(() => visibleSteps.value[formStep.value] ?? '')

const totalPrice = computed(() => {
  const base = selectedService.value?.price_raw
    ?? parseInt(String(selectedService.value?.price ?? '0').replace(/\./g,'').replace(/[^\d]/g,''))
  return isCapacitacion.value ? base * form.people_count : base
})

const minDate = computed(() => {
  const d = new Date(); d.setDate(d.getDate() + 1)
  return d.toISOString().split('T')[0]
})

const timeHours   = Array.from({ length: 16 }, (_, i) => i + 6)  // 6..21
const timeMinutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]

const timeHour = computed({
  get: () => form.service_time ? parseInt(form.service_time.split(':')[0], 10) : '',
  set: (h) => {
    const m = form.service_time ? form.service_time.split(':')[1] : '00'
    form.service_time = `${String(h).padStart(2,'0')}:${m}`
  },
})

const timeMinute = computed({
  get: () => form.service_time ? parseInt(form.service_time.split(':')[1], 10) : '',
  set: (m) => {
    const h = form.service_time ? form.service_time.split(':')[0] : '06'
    form.service_time = `${h}:${String(m).padStart(2,'0')}`
  },
})

const openServiceRequest = (svc) => {
  selectedService.value = svc
  if (svc && !selectedCategoryModal.value) {
    const cat = cats.value.find(c => c.id === svc.category_id)
    if (cat) selectedCategoryModal.value = cat
  }
  showServicesModal.value = false
  formStep.value = 0
  form.description = ''; form.people_count = 1
  form.company_name = ''; form.company_nit = ''; form.company_address = ''
  form.company_phone = ''; form.company_owners = ''
  form.address = ''; form.reference_note = ''; form.lat = null; form.lng = null
  form.service_date = ''; form.service_time = '09:00'
  showRequestModal.value = true
}

const closeRequestModal = () => {
  showRequestModal.value = false
  destroyMap()
}

const validateStep = () => {
  const s = currentStepName.value
  if (s === 'Descripción' && !form.description.trim()) { showToast('Describe lo que necesitas', 'error'); return false }
  if (s === 'Ubicación'   && !form.address.trim())     { showToast('Ingresa la dirección del servicio', 'error'); return false }
  if (s === 'Fecha y hora' && !form.service_date)      { showToast('Selecciona la fecha del servicio', 'error'); return false }
  return true
}

const nextStep = () => {
  if (!validateStep()) return
  if (formStep.value < visibleSteps.value.length - 1) formStep.value++
}

const prevStep = () => {
  if (formStep.value > 0) formStep.value--
}

const submitRequest = async () => {
  submitting.value = true
  try {
    const payload = {
      service_id:      selectedService.value?.id,
      category_id:     selectedCategoryModal.value?.id,
      description:     form.description,
      people_count:    isCapacitacion.value ? form.people_count : 1,
      people_names:    isCapacitacion.value ? form.people_names.slice(0, form.people_count) : [],
      people_ids:      isCapacitacion.value ? form.people_identifications.slice(0, form.people_count) : [],
      company_name:    form.company_name,
      company_nit:     form.company_nit,
      company_address: form.company_address,
      company_phone:   form.company_phone,
      company_owners:  form.company_owners,
      address:         form.address,
      reference_note:  form.reference_note,
      lat:             form.lat,
      lng:             form.lng,
      city_id:         form.city_id,
      service_date:    form.service_date || minDate.value,
      service_time:    form.service_time || '09:00',
    }
    const { data: srData } = await api.post('/client/service-request', payload)
    pendingPayment.value = {
      service_request_id: srData.service_request_id,
      amount_formatted:   srData.amount_formatted ?? ('$' + Number(srData.amount ?? 0).toLocaleString('es-CO')),
      service_name:       selectedService.value?.name ?? 'Servicio',
    }
    closeRequestModal()
    showPaymentModal.value = true
  } catch (e) {
    showToast(e?.response?.data?.message ?? 'Error al enviar la solicitud', 'error')
  } finally {
    submitting.value = false
  }
}

// ─── Wompi ────────────────────────────────────────────────────────────────────
const showWompiModal   = ref(false)
const wompiLoading     = ref(false)
const showPaymentModal = ref(false)
const pendingPayment   = ref(null)
const redirectingPay   = ref(false)
const changingPayMethod = ref(false)
let _widgetTimeoutId   = null
let _paymentHandled    = false

// ─── Tarjeta guardada ─────────────────────────────────────────────────────────
const savedCard = ref(null)  // { last4, brand, token } | null

const loadSavedCard = async () => {
  try {
    const { data } = await api.get('/client/saved-card')
    if (data?.last4) savedCard.value = data
  } catch { /* endpoint no disponible o sin tarjeta guardada */ }
}

// ─── OTP Pago ─────────────────────────────────────────────────────────────────
const showOtpModal      = ref(false)
const otpDigits         = ref(Array(6).fill(''))
const otpInputRefs      = ref([])
const otpSending        = ref(false)
const otpVerifying      = ref(false)
const otpError          = ref('')
const otpResendCooldown = ref(0)
const otpUseSavedCard   = ref(false)
let   otpCooldownTimer  = null

const maskedEmail = computed(() => {
  const email = authStore.user?.email ?? ''
  if (!email.includes('@')) return email
  const [local, domain] = email.split('@')
  return local.slice(0, 2) + '***@' + domain
})

const startOtpCooldown = () => {
  otpResendCooldown.value = 30
  clearInterval(otpCooldownTimer)
  otpCooldownTimer = setInterval(() => {
    if (otpResendCooldown.value <= 0) { clearInterval(otpCooldownTimer); return }
    otpResendCooldown.value--
  }, 1000)
}

const sendOtp = async () => {
  otpSending.value = true
  otpError.value   = ''
  try {
    await api.post('/client/payment/send-otp')
    startOtpCooldown()
  } catch (e) {
    otpError.value = e?.response?.data?.message ?? 'Error al enviar el código. Intenta de nuevo.'
  } finally {
    otpSending.value = false
  }
}

const resendOtp = async () => {
  if (otpResendCooldown.value > 0) return
  otpDigits.value = Array(6).fill('')
  otpError.value  = ''
  await sendOtp()
  nextTick(() => otpInputRefs.value[0]?.focus())
}

const cancelOtp = () => {
  showOtpModal.value    = false
  showPaymentModal.value = true
  otpDigits.value       = Array(6).fill('')
  otpError.value        = ''
  clearInterval(otpCooldownTimer)
  otpResendCooldown.value = 0
}

const verifyOtp = async () => {
  const code = otpDigits.value.join('')
  if (code.length < 6) return
  otpVerifying.value = true
  otpError.value     = ''
  try {
    await api.post('/client/payment/verify-otp', { code })
    showOtpModal.value = false
    otpDigits.value    = Array(6).fill('')
    clearInterval(otpCooldownTimer)
    otpResendCooldown.value = 0
    // Continuar con el pago
    if (otpUseSavedCard.value) {
      await chargeWithSavedCard()
    } else {
      await proceedToWompi()
    }
  } catch (e) {
    otpError.value = e?.response?.data?.message ?? 'Código incorrecto. Verifica e intenta de nuevo.'
    otpDigits.value = Array(6).fill('')
    nextTick(() => otpInputRefs.value[0]?.focus())
  } finally {
    otpVerifying.value = false
  }
}

const onOtpInput = (i, e) => {
  const val = e.target.value.replace(/\D/g, '').slice(-1)
  otpDigits.value[i] = val
  if (val && i < 5) nextTick(() => otpInputRefs.value[i + 1]?.focus())
}

const onOtpBackspace = (i) => {
  if (!otpDigits.value[i] && i > 0) {
    otpDigits.value[i - 1] = ''
    nextTick(() => otpInputRefs.value[i - 1]?.focus())
  }
}

const onOtpPaste = (e) => {
  const text = e.clipboardData?.getData('text') ?? ''
  const digits = text.replace(/\D/g, '').slice(0, 6).split('')
  digits.forEach((d, i) => { if (i < 6) otpDigits.value[i] = d })
  nextTick(() => {
    const next = Math.min(digits.length, 5)
    otpInputRefs.value[next]?.focus()
  })
}

const chargeWithSavedCard = async () => {
  if (!pendingPayment.value || !savedCard.value) return
  redirectingPay.value = true
  try {
    const { data } = await api.post('/client/payment/charge-saved-card', {
      service_request_id: pendingPayment.value.service_request_id,
      card_token:         savedCard.value.token,
    })
    paymentStatus.value     = data.status === 'APPROVED' ? 'approved' : data.status === 'PENDING' ? 'pending' : 'failed'
    showPaymentResult.value = true
    loadRequests()
    loadPayments()
  } catch (e) {
    showToast(e?.response?.data?.message ?? 'Error al procesar el pago con tarjeta guardada', 'error')
    showPaymentModal.value = true
  } finally {
    redirectingPay.value = false
  }
}

// goToWompiCheckout ahora dispara el OTP primero
const goToWompiCheckout = async (useSaved = false) => {
  if (!pendingPayment.value) return
  showPaymentModal.value = false
  otpUseSavedCard.value  = useSaved
  otpDigits.value        = Array(6).fill('')
  otpError.value         = ''
  showOtpModal.value     = true
  await sendOtp()
  nextTick(() => otpInputRefs.value[0]?.focus())
}

const _loadWompiScript = () => new Promise((resolve, reject) => {
  if (window.WidgetCheckout) { resolve(); return }
  const s = document.createElement('script')
  s.src = 'https://checkout.wompi.co/widget.js'
  s.onload = () => { console.log('[Wompi] script loaded, WidgetCheckout:', !!window.WidgetCheckout); resolve() }
  s.onerror = (err) => { console.error('[Wompi] script onerror', err); reject(new Error('Script bloqueado o sin red')) }
  document.head.appendChild(s)
})

const proceedToWompi = async () => {
  if (!pendingPayment.value) return
  let payData = null
  try {
    redirectingPay.value = true
    console.log('[Wompi] step 1: calling payment/init')
    const { data } = await api.post('/client/payment/init', {
      service_request_id: pendingPayment.value.service_request_id,
    })
    payData = data
    console.log('[Wompi] step 2: init OK', data.reference)

    await _loadWompiScript()
    console.log('[Wompi] step 3: script ready, WidgetCheckout=', typeof window.WidgetCheckout)

    if (typeof window.WidgetCheckout !== 'function') {
      throw new Error('WidgetCheckout no disponible después de cargar el script')
    }

    redirectingPay.value   = false
    showPaymentModal.value = false
    _paymentHandled        = false

    _widgetTimeoutId = setTimeout(() => {
      if (!_paymentHandled) {
        showPaymentModal.value = true
        showToast('El widget de pago no cargó. Intenta de nuevo.', 'error')
      }
    }, 12000)

    const resolvedPublicKey = data.public_key || import.meta.env.VITE_WOMPI_PUBLIC_KEY
    console.log('[Wompi] step 4: publicKey=', resolvedPublicKey ? resolvedPublicKey.slice(0, 12) + '...' : 'UNDEFINED')
    if (!resolvedPublicKey) throw new Error('Wompi public key no disponible')

    const u = authStore.user ?? {}
    const _phone = (u.phone ?? '').replace(/\D/g, '')
    const _customerData = {}
    if (u.email)  _customerData.email             = u.email
    if (u.name)   _customerData.fullName           = u.name
    if (_phone)  { _customerData.phoneNumber       = _phone
                   _customerData.phoneNumberPrefix = '+57' }
    if (u.cedula) { _customerData.legalId          = u.cedula
                    _customerData.legalIdType       = 'CC' }
    console.log('[Wompi] step 5: opening widget')
    const widget = new window.WidgetCheckout({
      currency:      'COP',
      amountInCents: data.amount_in_cents,
      reference:     data.reference,
      publicKey:     resolvedPublicKey,
      signature:     { integrity: data.integrity },
      customerData:  _customerData,
    })

    widget.open(async (result) => {
      clearTimeout(_widgetTimeoutId)
      _paymentHandled = true
      showPaymentModal.value = false
      console.log('[Wompi] widget callback, tx=', result?.transaction?.status)

      const tx = result?.transaction ?? null
      if (!tx) {
        try {
          const { data: st } = await api.get(`/client/payment/status?reference=${data.reference}`)
          if (st?.status === 'approved') {
            paymentStatus.value = 'approved'; showPaymentResult.value = true
            loadRequests(); loadPayments(); return
          }
        } catch { /* ignorar */ }
        showPaymentModal.value = true
        return
      }

      if (tx.status === 'APPROVED' && data.reference) {
        try { await api.post('/client/payment/confirm', { reference: data.reference, transaction: tx }) } catch {}
      }

      paymentStatus.value     = tx.status === 'APPROVED' ? 'approved' : tx.status === 'PENDING' ? 'pending' : 'failed'
      showPaymentResult.value = true
      loadRequests(); loadPayments()
    })

  } catch (e) {
    console.error('[Wompi] proceedToWompi ERROR:', e?.message ?? e)
    clearTimeout(_widgetTimeoutId)
    _paymentHandled      = true
    redirectingPay.value = false
    // Fallback: abrir checkout_url directamente si el widget falla
    if (payData?.checkout_url) {
      console.log('[Wompi] fallback: opening checkout_url')
      showPaymentModal.value = false
      window.open(payData.checkout_url, '_blank')
    } else {
      showPaymentModal.value = true
      showToast('Error al iniciar el pago. Intenta de nuevo.', 'error')
    }
  }
}

const openWompi = async ({ reference, amount, signature, publicKey }) => {
  showWompiModal.value = true
  wompiLoading.value   = true
  try {
    if (!window.WidgetCheckout) {
      await new Promise((resolve, reject) => {
        const s = document.createElement('script')
        s.src     = 'https://checkout.wompi.co/widget.js'
        s.onload  = resolve
        s.onerror = reject
        document.head.appendChild(s)
      })
    }
    wompiLoading.value = false
    const wPublicKey = publicKey || import.meta.env.VITE_WOMPI_PUBLIC_KEY
    if (!wPublicKey) { throw new Error('Wompi public key no disponible') }
    const widget = new window.WidgetCheckout({
      currency:       'COP',
      amountInCents:  Math.round(amount * 100),
      reference,
      publicKey:      wPublicKey,
      ...(signature ? { signature: { integrity: signature } } : {}),
    })
    widget.open(async (result) => {
      showWompiModal.value = false
      const tx = result?.transaction
      if (tx?.status === 'APPROVED') {
        try { await api.post('/client/payment/confirm', { reference, transaction_id: tx.id }) } catch { /* ignore */ }
        paymentStatus.value = 'approved'
        showToast('¡Pago exitoso! Tu solicitud fue enviada.', 'success')
      } else if (tx?.status === 'PENDING') {
        paymentStatus.value = 'pending'
      } else {
        paymentStatus.value = 'failed'
      }
      showPaymentResult.value = true
    })
  } catch {
    wompiLoading.value   = false
    showWompiModal.value = false
    showToast('No se pudo cargar la pasarela de pago', 'error')
  }
}

// ─── Payment result ──────────────────────────────────────────────────────────
const showPaymentResult = ref(false)
const paymentStatus     = ref('approved')

const onPaymentResultClose = (status) => {
  showPaymentResult.value = false
  if (status === 'approved') {
    page.value = 'Mis solicitudes'
    loadRequests()
  }
}

// ─── Geocoding + Map ─────────────────────────────────────────────────────────
const addressSearch        = ref('')
const geocodeResults       = ref([])
const geocodeLoading       = ref(false)
const showAddressSuggestions = ref(false)
const cities               = ref([])
const bogotaCityId         = computed(() => cities.value.find(c => /bogot/i.test(c.name))?.id ?? null)
let geocodeTimer      = null
let leafletMap        = null
let leafletMarker     = null

const onAddressInput = () => {
  clearTimeout(geocodeTimer)
  const q = addressSearch.value.trim()
  if (q.length < 3) { geocodeResults.value = []; showAddressSuggestions.value = false; return }
  geocodeTimer = setTimeout(() => geocodeSearch(q), 400)
}

const onAddressBlur = () => {
  setTimeout(() => { showAddressSuggestions.value = false }, 150)
}

const geocodeSearch = async (q) => {
  geocodeLoading.value = true
  try {
    const { data } = await api.get(`/geocode?type=search&q=${encodeURIComponent(q)}&limit=6`)
    const raw = Array.isArray(data) ? data.slice(0, 6) : []
    geocodeResults.value = raw.map(r => {
      const a         = r.address ?? {}
      const main      = a.road || r.display_name.split(',')[0] || ''
      const secondary = [a.suburb || a.neighbourhood, a.city || a.town || a.village].filter(Boolean).join(', ')
      return { ...r, _main: main, _secondary: secondary, lng: parseFloat(r.lon ?? r.lng) }
    })
    showAddressSuggestions.value = geocodeResults.value.length > 0
  } catch { geocodeResults.value = []; showAddressSuggestions.value = false }
  finally { geocodeLoading.value = false }
}

const reverseGeocode = async (lat, lng) => {
  try {
    const { data } = await api.get(`/geocode?type=reverse&lat=${lat}&lng=${lng}`)
    if (data?.display_name) {
      const a = data.address ?? {}
      const parts = [
        a.house_number ? `${a.road ?? ''} # ${a.house_number}` : (a.road ?? ''),
        a.suburb || a.neighbourhood || '',
        a.city || a.town || a.village || '',
      ].filter(Boolean)
      form.address = parts.length ? parts.join(', ') : data.display_name
      addressSearch.value = form.address
      if (bogotaCityId.value) form.city_id = bogotaCityId.value
    }
  } catch { /* ignore */ }
}

const selectGeoResult = (result) => {
  const main      = result._main || result.display_name?.split(',')[0] || ''
  const secondary = result._secondary || ''
  form.address         = main + (secondary ? ', ' + secondary : '')
  addressSearch.value  = form.address
  form.lat = parseFloat(result.lat)
  form.lng = result.lng ?? parseFloat(result.lon)
  geocodeResults.value       = []
  showAddressSuggestions.value = false
  if (bogotaCityId.value) form.city_id = bogotaCityId.value
  if (leafletMap && leafletMarker) {
    leafletMarker.setLatLng([form.lat, form.lng])
    leafletMap.setView([form.lat, form.lng], 16)
  }
}

const initMap = async () => {
  if (leafletMap) { try { leafletMap.invalidateSize() } catch { /* ignore */ } ; return }
  const el = document.getElementById('map-picker')
  if (!el) return

  if (!document.getElementById('leaflet-css')) {
    const link   = document.createElement('link')
    link.id      = 'leaflet-css'
    link.rel     = 'stylesheet'
    link.href    = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
    document.head.appendChild(link)
    await new Promise(r => { link.onload = r; setTimeout(r, 1000) })
  }

  const L = (await import('leaflet')).default

  delete L.Icon.Default.prototype._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  })

  const lat0 = form.lat ?? 4.7109
  const lng0 = form.lng ?? -74.0721

  leafletMap = L.map('map-picker').setView([lat0, lng0], 13)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
  }).addTo(leafletMap)

  leafletMarker = L.marker([lat0, lng0], { draggable: true }).addTo(leafletMap)

  leafletMarker.on('dragend', async () => {
    const { lat, lng } = leafletMarker.getLatLng()
    form.lat = lat; form.lng = lng
    await reverseGeocode(lat, lng)
  })

  leafletMap.on('click', async (e) => {
    const { lat, lng } = e.latlng
    leafletMarker.setLatLng([lat, lng])
    form.lat = lat; form.lng = lng
    await reverseGeocode(lat, lng)
  })
}

const destroyMap = () => {
  if (leafletMap) { try { leafletMap.remove() } catch { /* ignore */ } ; leafletMap = null; leafletMarker = null }
}

watch(currentStepName, async (name) => {
  if (name === 'Ubicación') { await nextTick(); await initMap() }
})

// ─── API loaders ──────────────────────────────────────────────────────────────
const loadRequests = async () => {
  reqsLoading.value = true
  try {
    const { data } = await api.get('/client/requests')
    if (Array.isArray(data) && data.length) {
      reqs.value = data.map(r => ({
        id:          r.id,
        num:         String(r.id).padStart(4, '0'),
        name:        r.service_name ?? r.service?.name ?? 'Servicio',
        description: r.description ?? '',
        pro:         r.professional?.name ?? r.professional_name ?? null,
        proPhone:    r.professional?.phone ?? null,
        date:        [r.service_date, r.service_time].filter(Boolean).join(' '),
        service_date_raw: r.service_date ?? '',
        address:     r.address ?? null,
        is_virtual:  !!(r.is_virtual || /virtual/i.test(r.service_name ?? '')),
        people_count: Number(r.people_count ?? 1),
        price:       Number(r.budget ?? r.amount ?? 0).toLocaleString('es-CO'),
        price_raw:   Number(r.budget ?? r.amount ?? 0),
        status:      r.status,
        status_label: r.status === 'payment_pending'     ? 'PAGO PENDIENTE'
                    : r.status === 'pending'           ? 'PENDIENTE'
                    : ACTIVE_SET.includes(r.status)    ? 'EN CURSO'
                    : r.status === 'completed'         ? 'COMPLETADA'
                    : r.status === 'cancelled'         ? 'CANCELADA'
                    : r.status.toUpperCase(),
        completion_code:            r.completion_code            ?? null,
        completion_code_expires_at: r.completion_code_expires_at ?? null,
        payment_reference:          r.payment_reference          ?? null,
        conversation_id:            r.conversation_id            ?? null,
        _rated: !!(r.is_rated || r.rated_at || r.review),
      }))
    }
  } catch { /* keep mock data */ }
  finally { reqsLoading.value = false }
}

const loadPayments = async () => {
  try {
    const { data } = await api.get('/client/requests')
    if (Array.isArray(data)) {
      const completed = data.filter(r => r.status === 'completed')
      if (completed.length) {
        payments.value = completed.map(p => ({
          id:          p.id,
          num:         String(p.id).padStart(4, '0'),
          service:     p.service_name ?? p.service?.name ?? '—',
          pro:         p.professional_name ?? p.professional?.name ?? '—',
          date:        p.service_date ? new Date(p.service_date).toLocaleDateString('es-CO', { day:'numeric', month:'short', year:'numeric' }) : (p.updated_at ? new Date(p.updated_at).toLocaleDateString('es-CO', { day:'numeric', month:'short', year:'numeric' }) : '—'),
          amount:      '$' + Number(p.budget ?? p.amount ?? 0).toLocaleString('es-CO'),
          amount_raw:  Number(p.budget ?? p.amount ?? 0),
          description: p.description ?? null,
          address:     p.address ?? null,
          is_virtual:  p.type === 'virtual' || p.is_virtual || false,
          people_count:p.people_count ?? null,
          client:      authStore.user?.name ?? '—',
          clientEmail: authStore.user?.email ?? '',
        }))
      }
    }
  } catch { /* keep mock */ }
}

onMounted(async () => {
  // Solicitar permiso de ubicación para pre-rellenar dirección al crear servicios
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(() => {}, () => {})
  }

  // Pre-fill config form from auth store
  if (authStore.user) {
    configForm.name  = authStore.user.name  ?? ''
    configForm.email = authStore.user.email ?? ''
    configForm.phone = authStore.user.phone ?? ''
    configForm.city  = authStore.user.city  ?? ''
  }

  // Load categories from API
  try {
    const { data } = await categoryService.getAllProfesional()
    if (Array.isArray(data) && data.length) {
      cats.value = data.map(c => ({ ...catStyleFor(c.name), id: c.id, name: c.name }))
    }
  } catch { /* keep defaults */ }

  // Load all services from API
  try {
    const { data } = await api.get('/services')
    if (Array.isArray(data) && data.length) {
      const gradients = [
        'linear-gradient(135deg,#f0fdf4,#bbf7d0)',
        'linear-gradient(135deg,#fdf2f8,#fbcfe8)',
        'linear-gradient(135deg,#eff6ff,#bfdbfe)',
        'linear-gradient(135deg,#f0fdf4,#d1fae5)',
        'linear-gradient(135deg,#fffbeb,#fde68a)',
        'linear-gradient(135deg,#f5f3ff,#ddd6fe)',
      ]
      allServices.value = data.map((s, i) => {
        const style = catStyleFor(s.category_name ?? s.name)
        return {
          id:            s.id,
          name:          s.name,
          description:   s.description ?? '',
          price:         Number(s.price || 0).toLocaleString('es-CO'),
          price_raw:     Number(s.price || 0),
          category_id:   s.category_id ?? null,
          category_name: s.category_name ?? '',
          iconSvg:       style.iconSvg,
          iconColor:     style.iconColor,
          gradient:      gradients[i % gradients.length],
          rating:        4.9,
          reviews:       0,
        }
      })
      services.value = allServices.value.slice(0, 4)
    }
  } catch { /* keep defaults */ }

  // Load requests
  await loadRequests()

  // Load payments
  await loadPayments()

  // Load favorites
  try {
    const { data } = await api.get('/client/favorites')
    if (Array.isArray(data) && data.length) {
      favs.value = data.map((f, i) => {
        const gradients = [
          'linear-gradient(135deg,#f0fdf4,#bbf7d0)',
          'linear-gradient(135deg,#fdf2f8,#fbcfe8)',
          'linear-gradient(135deg,#e0f2fe,#bae6fd)',
          'linear-gradient(135deg,#fff7ed,#fed7aa)',
        ]
        const style = catStyleFor(f.category_name ?? f.service_name ?? '')
        return {
          id:       f.id,
          name:     f.service_name ?? f.name,
          category: f.category_name ?? '',
          price:    Number(f.price || 0).toLocaleString('es-CO'),
          price_raw:Number(f.price || 0),
          rating:   String(f.rating ?? '4.9'),
          iconSvg:  style.iconSvg,
          iconColor:style.iconColor,
          gradient: gradients[i % gradients.length],
        }
      })
    }
  } catch { /* keep defaults */ }

  // Load cities (used to lock Bogotá selection)
  try {
    const { data } = await api.get('/cities')
    if (Array.isArray(data)) {
      cities.value = data
      const bogota = data.find(c => /bogot/i.test(c.name))
      if (bogota) form.city_id = bogota.id
    }
  } catch { /* keep default */ }

  // Load notifications, counts, featured pros and balance in parallel
  loadNotifications()
  loadUnreadCounts()
  loadFeaturedPros()
  loadBalance()

  // Load conversations
  loadConversations()

  // Load saved card
  loadSavedCard()
})

watch(page, (p) => {
  if (p === 'Mensajes') {
    loadConversations()
    loadUnreadCounts()
  } else if (p === 'Notificaciones') {
    loadNotifications()
    loadUnreadCounts()
  } else {
    clearInterval(inlinePollTimer)
    inlinePollTimer = null
  }
})

onUnmounted(() => {
  clearInterval(chatPollTimer)
  clearInterval(inlinePollTimer)
  clearInterval(otpCooldownTimer)
})
</script>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: all .3s ease }
.toast-enter-from { opacity: 0; transform: translateX(60px) }
.toast-leave-to   { opacity: 0; transform: translateX(60px) }

.fade-enter-active, .fade-leave-active { transition: opacity .2s ease }
.fade-enter-from, .fade-leave-to       { opacity: 0 }

.drawer-overlay-enter-active, .drawer-overlay-leave-active { transition: opacity .25s ease }
.drawer-overlay-enter-active > div:last-child, .drawer-overlay-leave-active > div:last-child { transition: transform .25s ease }
.drawer-overlay-enter-from > div:last-child, .drawer-overlay-leave-to > div:last-child { transform: translateX(-100%) }
.drawer-overlay-enter-from, .drawer-overlay-leave-to { opacity: 0 }
</style>

<style>
@media print {
  body * { visibility: hidden !important; }
  #invoice-print, #invoice-print * { visibility: visible !important; }
  #invoice-print {
    position: fixed !important;
    inset: 0 !important;
    width: 100% !important;
    background: white !important;
    padding: 2.5rem !important;
    z-index: 99999 !important;
  }

  /* ── Forzar colores correctos en impresión (anula dark mode) ── */
  #invoice-print,
  #invoice-print * { color: inherit !important; background-color: inherit !important; border-color: inherit !important; }

  #invoice-print { color: #0f172a !important; background-color: white !important; }

  /* Textos principales */
  #invoice-print .text-\[\#0f172a\]    { color: #0f172a !important; }
  #invoice-print .text-\[\#2563ff\]    { color: #2563eb !important; }
  #invoice-print .text-slate-400       { color: #94a3b8 !important; }
  #invoice-print .text-slate-500       { color: #64748b !important; }
  #invoice-print .text-slate-600       { color: #475569 !important; }
  #invoice-print .text-emerald-700     { color: #15803d !important; }

  /* Fondos de secciones */
  #invoice-print .bg-white             { background-color: #ffffff !important; }
  #invoice-print .bg-slate-50          { background-color: #f8fafc !important; }
  #invoice-print .bg-blue-50           { background-color: #eff6ff !important; }
  #invoice-print .bg-emerald-100       { background-color: #d1fae5 !important; }
  #invoice-print .bg-slate-100         { background-color: #f1f5f9 !important; }

  /* Bordes */
  #invoice-print .border-slate-200     { border-color: #e2e8f0 !important; }
  #invoice-print .border-slate-100     { border-color: #f1f5f9 !important; }
  #invoice-print .divide-slate-100 > * { border-color: #f1f5f9 !important; }
  #invoice-print .h-px                 { background-color: #e2e8f0 !important; }

  /* Rounding y sombras → limpiar para PDF */
  #invoice-print .shadow-2xl { box-shadow: none !important; }
  #invoice-print .rounded-3xl, #invoice-print .rounded-2xl, #invoice-print .rounded-xl { border-radius: inherit !important; }
}

/* ── ClientePanel dark mode: modal dialogs ── */
html.dark .clp-root .bg-white\/60 { background-color: rgba(255,255,255,0.08) !important; }
html.dark .clp-root .bg-white\/80 { background-color: rgba(30,41,59,0.92) !important; }

/* Modales (Teleport al body — usan clase modal-backdrop o similares) */
html.dark .clp-modal-surface { background-color: #1e293b !important; }
</style>
