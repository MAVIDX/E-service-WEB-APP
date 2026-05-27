<template>
  <div class="flex h-full bg-[#f0f4f8] md:p-3 md:gap-3 overflow-hidden prp-root">

    <!-- Sidebar card — hidden on mobile -->
    <div :class="['hidden md:flex-shrink-0 md:block md:w-56 rounded-2xl shadow-sm overflow-hidden', isDark ? 'bg-[#071126]' : 'bg-white']">
      <AppSidebar :items="navItems" :activePage="page" :dark="isDark" @navigate="page = $event" @logout="emit('logout')" />
    </div>

    <!-- Mobile sidebar drawer -->
    <Teleport to="body">
      <Transition name="drawer-overlay">
        <div v-if="mobileSidebarOpen" class="fixed inset-0 z-50 flex md:hidden">
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="mobileSidebarOpen = false" />
          <div class="relative w-72 max-w-[85vw] bg-[#071126] h-full shadow-2xl flex flex-col overflow-hidden">
            <AppSidebar :items="navItems" :activePage="page" :dark="isDark" :showClose="true"
              @navigate="page = $event; mobileSidebarOpen = false"
              @logout="emit('logout')"
              @closeMobile="mobileSidebarOpen = false" />
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Main card -->
    <div class="flex-1 bg-white md:rounded-2xl shadow-sm overflow-hidden flex flex-col min-w-0">

      <!-- Header -->
      <div class="flex-shrink-0 flex items-center justify-between px-4 pt-4 pb-3 md:px-8 md:pt-7 md:pb-5 border-b border-slate-100">
        <div class="flex items-center gap-3">
          <div>
            <h2 class="text-lg md:text-xl font-black text-[#0f172a]">{{ page === 'Inicio' ? `¡Hola, ${firstName}! 👋` : page }}</h2>
            <p class="text-[12px] md:text-[13px] text-slate-400 mt-0.5">{{ page === 'Inicio' ? 'Bienvenido a tu panel profesional' : today }}</p>
          </div>
        </div>
        <div class="flex items-center gap-2.5">
          <button v-if="page === 'Inicio'" @click="openSvcModal(null)" class="hidden md:flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-[13px] font-bold px-5 py-2.5 rounded-xl hover:opacity-90 transition shadow-sm">
            Publicar servicio
            <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
          </button>
          <!-- Campana notificaciones -->
          <div class="relative" ref="notifBtnRef">
            <button @click.stop="notifPanelOpen = !notifPanelOpen"
              class="relative w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center hover:bg-slate-100 transition">
              <svg viewBox="0 0 24 24" class="w-[17px] h-[17px]" fill="none" stroke="#64748b" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
              <span v-if="totalUnreadMessages > 0"
                class="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                {{ totalUnreadMessages > 9 ? '9+' : totalUnreadMessages }}
              </span>
            </button>
            <!-- Panel notificaciones -->
            <Transition name="fade">
              <div v-if="notifPanelOpen"
                class="absolute right-0 top-11 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden">
                <div class="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                  <p class="font-black text-[13px] text-[#0f172a]">Notificaciones</p>
                  <button @click="notifPanelOpen = false" class="text-slate-400 hover:text-slate-600 text-lg leading-none">×</button>
                </div>
                <div class="max-h-72 overflow-y-auto">
                  <div v-if="notifItems.length === 0" class="py-10 text-center text-slate-400 text-[13px]">
                    Sin notificaciones nuevas
                  </div>
                  <div v-for="n in notifItems" :key="n.jobId"
                    @click="page = 'Mis Trabajos'; notifPanelOpen = false; openJobChat(n.job)"
                    class="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0 transition">
                    <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg viewBox="0 0 24 24" class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-[13px] font-semibold text-[#0f172a] truncate">{{ n.clientName }}</p>
                      <p class="text-[11px] text-slate-400 truncate">{{ n.serviceName }}</p>
                    </div>
                    <span class="flex-shrink-0 min-w-[20px] h-5 px-1.5 bg-blue-600 text-white text-[10px] font-black rounded-full flex items-center justify-center">{{ n.count }}</span>
                  </div>
                </div>
                <div class="px-4 py-2.5 border-t border-slate-100">
                  <button @click="page = 'Mis Trabajos'; notifPanelOpen = false"
                    class="w-full text-[12px] text-blue-600 font-semibold hover:underline text-center">
                    Ver todos en Mis Trabajos
                  </button>
                </div>
              </div>
            </Transition>
          </div>

          <!-- Tema dark/light -->
          <button @click="themeStore.toggle()"
            :class="['w-9 h-9 rounded-xl flex items-center justify-center transition text-sm', isDark ? 'bg-white/10 hover:bg-white/15' : 'bg-slate-50 hover:bg-slate-100']">
            {{ isDark ? '☀️' : '🌙' }}
          </button>
          <!-- Mensajes -->
          <button @click="page = 'Mis Trabajos'"
            class="relative w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center hover:bg-slate-100 transition">
            <svg viewBox="0 0 24 24" class="w-[17px] h-[17px]" fill="none" stroke="#64748b" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            <span v-if="totalUnreadMessages > 0"
              class="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-amber-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
              {{ totalUnreadMessages > 9 ? '9+' : totalUnreadMessages }}
            </span>
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

      <!-- Publicar servicio — solo mobile, debajo del header -->
      <div v-if="page === 'Inicio'" class="md:hidden flex-shrink-0 px-4 py-2.5 border-b border-slate-100">
        <button @click="openSvcModal(null)" class="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-[13px] font-bold px-5 py-2.5 rounded-xl hover:opacity-90 transition shadow-sm">
          Publicar servicio
          <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
        </button>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto px-4 pb-20 md:px-8 md:pb-8 space-y-6 pt-4 md:pt-6">

        <!-- ===== INICIO ===== -->
        <template v-if="page === 'Inicio'">

          <!-- Stats -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard v-for="s in stats" :key="s.label" v-bind="s" :dark="isDark" />
          </div>

          <!-- MAPA -->
          <div id="pro-map" ref="mapRef"></div>

          <!-- Header solicitudes -->
          <div class="req-header">
            <div>
              <h3 class="req-title">Solicitudes disponibles</h3>
              <p class="req-subtitle">{{ subtitleText }}</p>
            </div>
            <div class="live-badge">
              <span class="live-dot"></span>
              En vivo
            </div>
          </div>

          <!-- Skeleton -->
          <div v-if="reqLoading" class="skeleton-list">
            <div v-for="n in 2" :key="n" class="skeleton-card">
              <div class="skeleton-line w-60"></div>
              <div class="skeleton-line w-90 short"></div>
              <div class="skeleton-line w-40 short"></div>
            </div>
          </div>

          <!-- Empty -->
          <div v-else-if="availableRequests.length === 0" class="req-empty-state">
            <div class="req-empty-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="24" height="24">
                <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 01-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 011-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 011.52 0C14.51 3.81 17 5 19 5a1 1 0 011 1z" />
              </svg>
            </div>
            <p class="req-empty-title">Sin solicitudes por ahora</p>
            <small>Actualizando cada 5 segundos…</small>
          </div>

          <!-- Cards -->
          <TransitionGroup v-else name="card" tag="div" class="card-group">
            <div v-for="req in availableRequests" :key="req.id" class="request-card" :class="{ 'request-new': req.isNew }">
              <span v-if="req.isNew" class="new-badge">Nueva</span>

              <!-- Top -->
              <div class="request-top">
                <div class="service-icon-wrap">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" width="16" height="16">
                    <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
                  </svg>
                </div>
                <div class="request-service">{{ req.service_name }}</div>
                <div class="request-budget">${{ Number(req.budget).toLocaleString('es-CO') }}</div>
              </div>

              <p class="request-description">{{ req.description }}</p>

              <div class="request-meta">
                <span class="meta-chip">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                  {{ req.service_date }} {{ req.service_time }}
                </span>
                <span v-if="req.address" class="meta-chip">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  {{ req.address }}
                </span>
                <span v-if="req.people_count && req.people_count > 1" class="meta-chip chip-people">
                  👥 {{ req.people_count }} personas
                </span>
              </div>

              <div class="request-divider"></div>

              <div class="request-footer">
                <div class="req-client-info">
                  <div class="req-client-avatar">{{ getInitials(req.client_name) }}</div>
                  <span class="req-client-name">{{ req.client_name }}</span>
                </div>
                <div class="req-actions">
                  <button class="btn-distance" @click="viewDistance(req)">Distancia</button>
                  <button class="btn-detail" @click="openReqDetails(req)">Detalles</button>
                  <button class="btn-accept-req" @click="acceptAvailable(req)" :disabled="accepting === req.id">
                    {{ accepting === req.id ? 'Aceptando…' : 'Aceptar →' }}
                  </button>
                </div>
              </div>
            </div>
          </TransitionGroup>

          <!-- Modal detalles -->
          <div v-if="showDetailsModal" class="modal-overlay-req">
            <div class="modal-pro">
              <div class="modal-pro-header">
                <div class="avatar-big">{{ getInitials(selectedRequest?.client_name) }}</div>
                <div>
                  <h3>{{ selectedRequest?.client_name }}</h3>
                  <p class="service-tag">{{ selectedRequest?.service_name }}</p>
                </div>
              </div>
              <div class="modal-pro-body">
                <div class="info-card-req"><span>📍 Dirección</span><p>{{ selectedRequest?.address || 'Virtual' }}</p></div>
                <div class="info-card-req"><span>📝 Descripción</span><p>{{ selectedRequest?.description }}</p></div>
                <div v-if="selectedRequest?.people_count" class="info-card-req"><span>👥 Personas</span><p>{{ selectedRequest?.people_count }}</p></div>
                <div class="info-row-req">
                  <div class="mini-card-req"><span>📅</span><p>{{ selectedRequest?.service_date }}</p></div>
                  <div class="mini-card-req"><span>⏰</span><p>{{ selectedRequest?.service_time }}</p></div>
                </div>
                <div class="price-card-req">${{ Number(selectedRequest?.budget || 0).toLocaleString('es-CO') }}</div>
              </div>
              <div class="modal-pro-actions">
                <button class="btn-modal-cerrar" @click="showDetailsModal = false">Cerrar</button>
                <button class="btn-ver-ruta" @click="viewRouteFromModal(selectedRequest)">Ver ruta</button>
              </div>
            </div>
          </div>
        </template>

        <!-- ===== MIS SERVICIOS ===== -->
        <template v-else-if="page === 'Mis servicios'">
          <div class="flex items-center justify-between">
            <div>
              <p class="font-black text-[#0f172a]">Mis servicios publicados</p>
              <p class="text-sm text-slate-400 mt-0.5">{{ myServices.length }} servicios activos</p>
            </div>
            <button @click="openSvcModal(null)" class="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-[13px] font-bold px-5 py-2.5 rounded-xl hover:opacity-90 transition">+ Nuevo servicio</button>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="s in myServices" :key="s.id" class="bg-white border border-slate-100 rounded-2xl overflow-hidden">
              <div class="h-32 flex items-center justify-center" :style="{background: s.gradient}">
                <svg viewBox="0 0 24 24" class="w-12 h-12 opacity-70" fill="none" :stroke="s.iconColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" v-html="s.iconSvg" />
              </div>
              <div class="p-4">
                <div class="flex items-center justify-between mb-1">
                  <p class="text-[13px] font-bold text-[#0f172a]">{{ s.name }}</p>
                  <span :class="['text-[10px] font-bold px-2 py-0.5 rounded-full', s.active ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600']">{{ s.active ? 'Activo' : 'Pausado' }}</span>
                </div>
                <p class="text-[11px] text-slate-400">{{ s.category }}</p>
                <div class="flex items-center justify-between mt-3">
                  <span class="text-[13px] font-black text-[#2563ff]">Desde ${{ s.price }}</span>
                  <span class="text-[11px] text-amber-500 font-semibold">★ {{ s.rating }}</span>
                </div>
                <div class="flex gap-2 mt-3">
                  <button @click="openSvcModal(s)" class="flex-1 bg-slate-50 text-slate-600 text-[11px] font-semibold py-1.5 rounded-lg hover:bg-slate-100 transition border border-slate-100">Editar</button>
                  <button @click="toggleSvcStatus(s)" class="flex-1 bg-slate-50 text-slate-600 text-[11px] font-semibold py-1.5 rounded-lg hover:bg-slate-100 transition border border-slate-100">{{ s.active ? 'Pausar' : 'Activar' }}</button>
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- ===== MIS TRABAJOS ===== -->
        <template v-else-if="page === 'Mis Trabajos'">
          <!-- Top bar -->
          <div class="trabajos-top-bar">
            <div class="trabajos-tabs">
              <button v-for="tab in trabajosTabs" :key="tab.key"
                :class="['tab-btn', { active: trabajosTab === tab.key }]"
                @click="setTrabajosTab(tab.key)">
                {{ tab.label }}
                <span v-if="countByTrabajosTab(tab.key)" class="tab-badge">{{ countByTrabajosTab(tab.key) }}</span>
              </button>
            </div>
            <div class="trabajos-controls">
              <div class="sort-group">
                <span class="sort-lbl">Ordenar:</span>
                <button v-for="s in trabajosSortOptions" :key="s.key"
                  :class="['sort-chip', { active: trabajosSort === s.key }]"
                  @click="setTrabajosSort(s.key)">{{ s.label }}</button>
              </div>
              <div class="view-toggle">
                <button :class="['vt-btn', { active: trabajosView === 'grid' }]" @click="setTrabajosView('grid')" title="Cuadrícula">
                  <svg width="15" height="15" viewBox="0 0 14 14" fill="currentColor"><rect x="0" y="0" width="6" height="6" rx="1.2"/><rect x="8" y="0" width="6" height="6" rx="1.2"/><rect x="0" y="8" width="6" height="6" rx="1.2"/><rect x="8" y="8" width="6" height="6" rx="1.2"/></svg>
                </button>
                <button :class="['vt-btn', { active: trabajosView === 'list' }]" @click="setTrabajosView('list')" title="Lista">
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><line x1="5" y1="4" x2="15" y2="4"/><line x1="5" y1="8" x2="15" y2="8"/><line x1="5" y1="12" x2="15" y2="12"/><circle cx="2" cy="4" r="1.2" fill="currentColor" stroke="none"/><circle cx="2" cy="8" r="1.2" fill="currentColor" stroke="none"/><circle cx="2" cy="12" r="1.2" fill="currentColor" stroke="none"/></svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Loading -->
          <div v-if="trabajosLoading" class="skeleton-list">
            <div v-for="n in 3" :key="n" class="skeleton-card">
              <div class="skeleton-line w-60"></div>
              <div class="skeleton-line w-90 short"></div>
              <div class="skeleton-line w-40 short"></div>
            </div>
          </div>

          <!-- Empty -->
          <div v-else-if="trabajosPaginated.length === 0" class="req-empty-state">
            <p class="req-empty-title">Sin trabajos en esta sección</p>
          </div>

          <!-- GRID VIEW -->
          <TransitionGroup v-else-if="trabajosView === 'grid'" name="fade" tag="div" class="jobs-grid">
            <div v-for="job in trabajosPaginated" :key="job.id" class="job-card" :class="job.status">
              <div class="card-top-row">
                <span class="job-id-badge">#{{ String(job.id).padStart(4, '0') }}</span>
                <span :class="['status-pill', job.status]">{{ trabajosStatusLabel(job.status) }}</span>
              </div>
              <div class="card-body-cols">
                <div class="card-body-left">
                  <div class="job-head">
                    <div class="svc-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg></div>
                    <span class="job-svc">{{ job.service_name }}</span>
                  </div>
                  <div class="job-budget">${{ Number(job.budget).toLocaleString('es-CO') }}</div>
                  <p class="job-desc">{{ job.description }}</p>
                  <div class="job-chips">
                    <span class="chip">📅 {{ job.service_date }} {{ job.service_time }}</span>
                    <span v-if="job.address" class="chip">📍 {{ job.address }}</span>
                    <span v-else class="chip chip-virtual">💻 Virtual</span>
                  </div>
                  <div class="job-divider"></div>
                  <div class="trabajos-client-info">
                    <div class="trabajos-client-avatar">{{ getInitials(job.client_name) }}</div>
                    <div>
                      <span class="trabajos-client-name">{{ job.client_name }}</span>
                      <span v-if="job.client_phone" class="trabajos-client-phone">{{ job.client_phone }}</span>
                    </div>
                  </div>
                </div>
                <div class="card-body-right">
                  <button class="btn-chat-job" @click.stop="openJobChat(job)">
                    💬 Chat
                    <span v-if="unreadChats[job.id]" class="chat-unread-badge">{{ unreadChats[job.id] }}</span>
                  </button>
                </div>
              </div>
              <div class="card-actions">
                <button v-if="job.status === 'accepted'" class="btn-evidence-job" @click.stop="openJobEvidence(job)">📷 Evidencias</button>
                <button v-if="job.status === 'accepted'" class="btn-complete-job" @click.stop="openJobCode(job)">✓ Completar</button>
                <button v-if="job.status === 'completed'" class="btn-view-ev-job" @click.stop="openJobEvidence(job)">🖼️ Ver evidencias</button>
                <button v-if="job.status === 'completed' && !job._rated" class="btn-rate-client-job" @click.stop="openJobRating(job)">⭐ Calificar cliente</button>
                <span v-if="job.status === 'completed' && job._rated" class="rated-badge-job">✅ Calificado</span>
              </div>
            </div>
          </TransitionGroup>

          <!-- LIST VIEW -->
          <div v-else class="list-view-jobs">
            <div class="list-header-jobs">
              <span class="lh-svc">Servicio</span>
              <span class="lh-date">Fecha</span>
              <span class="lh-addr hide-sm">Ubicación</span>
              <span class="lh-budget">Valor</span>
              <span class="lh-client hide-sm">Cliente</span>
              <span class="lh-status">Estado</span>
              <span class="lh-arrow"></span>
            </div>
            <div v-for="job in trabajosPaginated" :key="job.id" class="list-item-wrap-job">
              <div :class="['list-row-job', job.status, { 'is-expanded': expandedJobId === job.id }]"
                @click="toggleJobExpand(job.id)">
                <div class="lr-svc">
                  <div :class="['lr-icon', job.status]">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>
                  </div>
                  <div>
                    <div class="lr-name">{{ job.service_name }} <span class="lr-id">#{{ String(job.id).padStart(4,'0') }}</span></div>
                    <div class="lr-mini-desc">{{ job.description }}</div>
                  </div>
                </div>
                <div class="lr-date"><span>{{ job.service_date }}</span><span class="lr-time">{{ job.service_time }}</span></div>
                <span class="lr-addr hide-sm">{{ job.address || '💻 Virtual' }}</span>
                <span class="lr-budget">${{ Number(job.budget).toLocaleString('es-CO') }}</span>
                <div class="lr-client hide-sm">
                  <div class="trabajos-client-avatar sm">{{ getInitials(job.client_name) }}</div>
                  <span class="lr-client-name">{{ job.client_name }}</span>
                </div>
                <span :class="['lr-pill-job', job.status]">{{ trabajosStatusLabel(job.status) }}</span>
                <span class="lr-arrow-job" :class="{ open: expandedJobId === job.id }">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2"><polyline points="2,4 6,8 10,4"/></svg>
                </span>
              </div>
              <Transition name="expand">
                <div v-if="expandedJobId === job.id" class="row-detail-job">
                  <p class="rd-desc">{{ job.description }}</p>
                  <div class="rd-actions">
                    <button class="btn-chat-job" @click.stop="openJobChat(job)">💬 Chat con cliente
                      <span v-if="unreadChats[job.id]" class="chat-unread-badge">{{ unreadChats[job.id] }}</span>
                    </button>
                    <button v-if="job.status === 'accepted'" class="btn-evidence-job" @click.stop="openJobEvidence(job)">📷 Evidencias</button>
                    <button v-if="job.status === 'accepted'" class="btn-complete-job" @click.stop="openJobCode(job)">✓ Completar</button>
                    <button v-if="job.status === 'completed'" class="btn-view-ev-job" @click.stop="openJobEvidence(job)">🖼️ Ver evidencias</button>
                    <button v-if="job.status === 'completed' && !job._rated" class="btn-rate-client-job" @click.stop="openJobRating(job)">⭐ Calificar cliente</button>
                    <span v-if="job.status === 'completed' && job._rated" class="rated-badge-job">✅ Calificado</span>
                  </div>
                </div>
              </Transition>
            </div>
          </div>

          <!-- Pagination -->
          <div v-if="!trabajosLoading && trabajosTotalPages > 1" class="trabajos-pagination">
            <button class="pg-btn" :disabled="trabajosPage === 1" @click="trabajosPage--">← Anterior</button>
            <div class="pg-numbers">
              <button v-for="p in trabajosTotalPages" :key="p" :class="['pg-num', { active: p === trabajosPage }]" @click="trabajosPage = p">{{ p }}</button>
            </div>
            <button class="pg-btn" :disabled="trabajosPage === trabajosTotalPages" @click="trabajosPage++">Siguiente →</button>
          </div>
        </template>

        <!-- ===== CALENDARIO ===== -->
        <template v-else-if="page === 'Calendario'">
          <div class="bg-white border border-slate-100 rounded-2xl p-6">
            <!-- Header -->
            <div class="flex items-center justify-between mb-6">
              <h3 class="font-black text-[#0f172a] text-lg">{{ calMonthLabel }}</h3>
              <div class="flex gap-1">
                <button @click="prevCalMonth" class="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center hover:bg-slate-100 transition text-slate-500 text-base">‹</button>
                <button @click="nextCalMonth" class="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center hover:bg-slate-100 transition text-slate-500 text-base">›</button>
              </div>
            </div>

            <!-- Day headers -->
            <div class="grid grid-cols-7 mb-1">
              <div v-for="d in ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom']" :key="d"
                class="text-[11px] font-bold text-slate-400 py-2 text-center">{{ d }}</div>
            </div>

            <!-- Grid cells -->
            <div class="grid grid-cols-7 gap-1">
              <div v-for="(cell, idx) in calCells" :key="idx"
                @click="cell.inMonth && openCalDay(cell)"
                class="cal-cell"
                :class="{
                  'cal-cell-other':   !cell.inMonth,
                  'cal-cell-today':    cell.isToday && !calDayJobs(cell.dateStr).length,
                  'cal-cell-event':    cell.inMonth && calDayJobs(cell.dateStr).length > 0,
                  'cal-cell-clickable': cell.inMonth,
                }">
                <!-- Job cards within cell -->
                <div v-if="cell.inMonth && calDayJobs(cell.dateStr).length"
                  class="cal-event-list">
                  <div v-for="job in calDayJobs(cell.dateStr)" :key="job.id"
                    class="cal-event-chip">
                    <span class="truncate font-semibold">servicio#{{ job.id }}</span>
                    <span class="truncate text-blue-100 text-[10px]">{{ job.client_name }}</span>
                  </div>
                </div>
                <!-- Day number -->
                <span class="cal-day-number">{{ cell.day }}</span>
              </div>
            </div>
          </div>

          <!-- Modal: servicios del día (cards + scroll) -->
          <Teleport to="body">
            <Transition name="modal">
              <div v-if="calModalOpen" class="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4"
                style="background:rgba(15,23,42,.6)" @click.self="calModalOpen = false">
                <div class="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl w-full sm:max-w-lg flex flex-col overflow-hidden"
                  style="max-height:88vh">

                  <!-- Header -->
                  <div class="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 flex-shrink-0 rounded-t-3xl sm:rounded-t-2xl">
                    <div>
                      <p class="text-white font-black text-[15px] capitalize">{{ calModalDate }}</p>
                      <p class="text-blue-200 text-[12px] mt-0.5">
                        {{ calDayJobs(calModalDateStr).length }} servicio(s) agendado(s)
                      </p>
                    </div>
                    <button @click="calModalOpen = false"
                      class="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 transition text-sm">✕</button>
                  </div>

                  <!-- Scrollable cards -->
                  <div class="flex-1 overflow-y-auto p-4 space-y-3">
                    <div v-for="job in calDayJobs(calModalDateStr)" :key="job.id"
                      class="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">

                      <!-- Card top: id + status -->
                      <div class="flex items-center justify-between gap-2">
                        <span class="text-[11px] font-mono font-bold text-[#0d4f5c] bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md">
                          #{{ String(job.id).padStart(4,'0') }}
                        </span>
                        <span class="px-2.5 py-1 rounded-full text-[11px] font-bold"
                          :class="job.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-blue-100 text-blue-700'">
                          {{ job.status === 'completed' ? 'Completado' : 'En curso' }}
                        </span>
                      </div>

                      <!-- Service name -->
                      <p class="font-black text-[#0f172a] text-[14px] leading-snug">{{ job.service_name }}</p>

                      <!-- Info grid -->
                      <div class="grid grid-cols-2 gap-2">
                        <div class="cal-info-card">
                          <span class="cal-info-label">👤 Cliente</span>
                          <p class="cal-info-val">{{ job.client_name }}</p>
                        </div>
                        <div class="cal-info-card">
                          <span class="cal-info-label">⏰ Hora</span>
                          <p class="cal-info-val">{{ job.service_time }}</p>
                        </div>
                        <div class="cal-info-card">
                          <span class="cal-info-label">💰 Presupuesto</span>
                          <p class="cal-info-val font-black text-emerald-600">${{ Number(job.budget ?? 0).toLocaleString('es-CO') }}</p>
                        </div>
                        <div v-if="job.people_count" class="cal-info-card">
                          <span class="cal-info-label">👥 Personas</span>
                          <p class="cal-info-val">{{ job.people_count }}</p>
                        </div>
                        <div v-if="job.address" class="cal-info-card col-span-2">
                          <span class="cal-info-label">📍 Dirección</span>
                          <p class="cal-info-val">{{ job.address }}</p>
                        </div>
                        <div v-if="job.city_name" class="cal-info-card">
                          <span class="cal-info-label">🏙 Ciudad</span>
                          <p class="cal-info-val">{{ job.city_name }}</p>
                        </div>
                        <div v-if="job.company_name" class="cal-info-card col-span-2">
                          <span class="cal-info-label">🏢 Empresa</span>
                          <p class="cal-info-val">{{ job.company_name }}</p>
                        </div>
                        <div v-if="job.description" class="cal-info-card col-span-2">
                          <span class="cal-info-label">📝 Descripción</span>
                          <p class="cal-info-val">{{ job.description }}</p>
                        </div>
                      </div>

                      <!-- Action -->
                      <button @click="page = 'Mis Trabajos'; calModalOpen = false"
                        class="w-full py-2 rounded-xl bg-white border border-blue-200 text-[12px] font-semibold text-blue-700 hover:bg-blue-50 transition">
                        Ver en Mis Trabajos →
                      </button>
                    </div>
                  </div>

                  <!-- Footer -->
                  <div class="px-5 py-3 border-t border-slate-100 flex-shrink-0">
                    <button @click="calModalOpen = false"
                      class="w-full border border-slate-200 text-slate-600 text-[13px] font-semibold py-2.5 rounded-xl hover:bg-slate-50 transition">
                      Cerrar
                    </button>
                  </div>
                </div>
              </div>
            </Transition>
          </Teleport>
        </template>


        <!-- ===== MIS INGRESOS ===== -->
        <template v-else-if="page === 'Mis ingresos'">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard iconSvg='<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>' iconBg="bg-emerald-50" iconColor="#10b981" value="$3.240.000" label="Total este mes"  :trend="18" :dark="isDark" />
            <StatCard iconSvg='<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>' iconBg="bg-blue-50"    iconColor="#2563ff" value="$840.000"  label="Última semana"  :trend="12" :dark="isDark" />
            <StatCard iconSvg='<rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>'                   iconBg="bg-amber-50"  iconColor="#f59e0b" value="$120.000"  label="Pendiente" :dark="isDark" />
          </div>
          <div class="bg-white border border-slate-100 rounded-2xl overflow-hidden">
            <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <span class="font-black text-[#0f172a]">Historial de ingresos</span>
              <button class="text-[13px] font-semibold text-[#2563ff] border border-blue-200 px-4 py-1.5 rounded-xl hover:bg-blue-50 transition">Descargar</button>
            </div>
            <!-- Mobile cards (< md) -->
            <div class="md:hidden divide-y divide-slate-50">
              <div v-for="p in incomeMobilePagedItems" :key="p.id" class="p-4 space-y-2">
                <div class="flex items-start justify-between gap-2">
                  <p class="font-semibold text-[#0f172a] text-[13px]">{{ p.service }}</p>
                  <span class="bg-emerald-100 text-emerald-700 text-[11px] font-bold px-2.5 py-1 rounded-full flex-shrink-0">Cobrado</span>
                </div>
                <div class="grid grid-cols-2 gap-2 text-[12px]">
                  <div>
                    <p class="text-[10px] text-slate-400 uppercase tracking-wide font-bold">Cliente</p>
                    <p class="text-slate-600 mt-0.5">{{ p.client }}</p>
                  </div>
                  <div>
                    <p class="text-[10px] text-slate-400 uppercase tracking-wide font-bold">Fecha</p>
                    <p class="text-slate-500 mt-0.5">{{ p.date }}</p>
                  </div>
                  <div class="col-span-2">
                    <p class="text-[10px] text-slate-400 uppercase tracking-wide font-bold">Monto</p>
                    <p class="font-black text-emerald-600 mt-0.5">{{ p.amount }}</p>
                  </div>
                </div>
              </div>
            </div>
            <!-- Mobile pagination -->
            <div v-if="incomeMobileTotalPages > 1" class="md:hidden flex items-center justify-center gap-3 px-4 py-3 border-t border-slate-100">
              <button :disabled="incomeMobilePage <= 1" @click="incomeMobilePage--"
                class="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 text-sm font-bold disabled:opacity-30 hover:bg-slate-200 transition">‹</button>
              <span class="text-[12px] text-slate-500 font-semibold">{{ incomeMobilePage }} / {{ incomeMobileTotalPages }}</span>
              <button :disabled="incomeMobilePage >= incomeMobileTotalPages" @click="incomeMobilePage++"
                class="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 text-sm font-bold disabled:opacity-30 hover:bg-slate-200 transition">›</button>
            </div>
            <!-- Desktop table (≥ md) -->
            <div class="hidden md:block overflow-x-auto">
              <table class="w-full text-sm min-w-[500px]">
                <thead class="bg-slate-50">
                  <tr><th v-for="h in ['Servicio','Cliente','Fecha','Monto','Estado']" :key="h" class="text-left px-6 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wide">{{ h }}</th></tr>
                </thead>
                <tbody class="divide-y divide-slate-50">
                  <tr v-for="p in incomeHistory" :key="p.id" class="hover:bg-slate-50 transition">
                    <td class="px-6 py-4 font-semibold text-[#0f172a] text-[13px]">{{ p.service }}</td>
                    <td class="px-6 py-4 text-slate-400 text-[13px]">{{ p.client }}</td>
                    <td class="px-6 py-4 text-slate-400 text-[13px]">{{ p.date }}</td>
                    <td class="px-6 py-4 font-black text-emerald-600 text-[13px]">{{ p.amount }}</td>
                    <td class="px-6 py-4"><span class="bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full text-[11px] font-bold">Cobrado</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </template>

        <!-- ===== ESTADÍSTICAS ===== -->
        <template v-else-if="page === 'Estadísticas'">

          <!-- Summary cards -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div class="bg-white border border-slate-100 rounded-2xl p-5">
              <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Total ganado (neto)</p>
              <p class="text-[22px] font-black text-emerald-600 mt-1.5">{{ statsTotalEarned }}</p>
            </div>
            <div class="bg-white border border-slate-100 rounded-2xl p-5">
              <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Trabajos completados</p>
              <p class="text-[22px] font-black text-[#0f172a] mt-1.5">{{ statsTotalJobs }}</p>
            </div>
            <div class="bg-white border border-slate-100 rounded-2xl p-5">
              <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wide">En curso / Pendientes</p>
              <p class="text-[22px] font-black text-amber-500 mt-1.5">{{ statsPendingJobs }}</p>
            </div>
          </div>

          <!-- Gráfica mensual -->
          <div class="bg-white border border-slate-100 rounded-2xl p-5">
            <div class="flex items-center justify-between mb-4">
              <span class="font-black text-[#0f172a]">Ingresos mensuales {{ new Date().getFullYear() }}</span>
            </div>
            <div class="relative" style="height:210px" @mouseleave="statsTooltip.visible = false">
              <svg viewBox="0 0 800 210" class="w-full h-full">
                <!-- Grid -->
                <line v-for="(gy,i) in statsMonthGrid.y" :key="'mg'+i" x1="64" x2="780" :y1="gy" :y2="gy" stroke="#f1f5f9" stroke-width="1"/>
                <text v-for="(lbl,i) in statsMonthGrid.labels" :key="'ml'+i" x="58" :y="statsMonthGrid.y[i]+4" text-anchor="end" fill="#94a3b8" font-size="11">{{ lbl }}</text>
                <!-- Fill + line -->
                <path :d="statsMonthFill" fill="rgba(37,99,255,0.07)"/>
                <path :d="statsMonthLine" fill="none" stroke="#2563eb" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                <!-- Points -->
                <circle v-for="(pt,i) in statsMonthPts" :key="'mc'+i"
                  :cx="pt.x" :cy="pt.y" r="5" fill="#2563eb" stroke="white" stroke-width="2"
                  style="cursor:pointer"
                  @mouseenter="showStatsTip(pt, ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'][i], statsMonthValues[i])"/>
                <!-- X labels -->
                <text v-for="(lbl,i) in ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']" :key="'mx'+i"
                  :x="statsMonthPts[i]?.x" y="200" text-anchor="middle" fill="#94a3b8" font-size="10">{{ lbl }}</text>
              </svg>
              <!-- Tooltip -->
              <div v-if="statsTooltip.visible"
                class="stats-tip"
                :style="{ left: (statsTooltip.x / 800 * 100).toFixed(1)+'%', top: Math.max(0, statsTooltip.y * (210/210) - 44) + 'px' }">
                <span class="font-black">{{ statsTooltip.value }}</span>
                <span class="text-blue-200 text-[11px] ml-1">{{ statsTooltip.label }}</span>
              </div>
            </div>
          </div>

          <!-- Gráfica semanal -->
          <div class="bg-white border border-slate-100 rounded-2xl p-5">
            <div class="flex items-center justify-between mb-4">
              <span class="font-black text-[#0f172a]">Ingresos de la semana</span>
            </div>
            <div class="relative" style="height:210px" @mouseleave="statsTooltip.visible = false">
              <svg viewBox="0 0 800 210" class="w-full h-full">
                <!-- Grid -->
                <line v-for="(gy,i) in statsWeekGrid.y" :key="'wg'+i" x1="64" x2="780" :y1="gy" :y2="gy" stroke="#f1f5f9" stroke-width="1"/>
                <text v-for="(lbl,i) in statsWeekGrid.labels" :key="'wl'+i" x="58" :y="statsWeekGrid.y[i]+4" text-anchor="end" fill="#94a3b8" font-size="11">{{ lbl }}</text>
                <!-- Fill + line -->
                <path :d="statsWeekFill" fill="rgba(37,99,255,0.07)"/>
                <path :d="statsWeekLine" fill="none" stroke="#2563eb" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                <!-- Points -->
                <circle v-for="(pt,i) in statsWeekPts" :key="'wc'+i"
                  :cx="pt.x" :cy="pt.y" r="5" fill="#2563eb" stroke="white" stroke-width="2"
                  style="cursor:pointer"
                  @mouseenter="showStatsTip(pt, ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'][i], statsWeekValues[i])"/>
                <!-- X labels -->
                <text v-for="(lbl,i) in ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom']" :key="'wx'+i"
                  :x="statsWeekPts[i]?.x" y="200" text-anchor="middle" fill="#94a3b8" font-size="10">{{ lbl }}</text>
              </svg>
              <!-- Tooltip -->
              <div v-if="statsTooltip.visible"
                class="stats-tip"
                :style="{ left: (statsTooltip.x / 800 * 100).toFixed(1)+'%', top: Math.max(0, statsTooltip.y - 44) + 'px' }">
                <span class="font-black">{{ statsTooltip.value }}</span>
                <span class="text-blue-200 text-[11px] ml-1">{{ statsTooltip.label }}</span>
              </div>
            </div>
          </div>

        </template>

        <!-- ===== CONFIGURACIÓN ===== -->
        <template v-else-if="page === 'Configuración'">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="md:col-span-2 space-y-5">
              <div class="bg-white border border-slate-100 rounded-2xl p-6 space-y-4">
                <h3 class="font-black text-[#0f172a]">Perfil profesional</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="text-[11px] font-bold text-slate-400 uppercase tracking-wide block mb-1.5">Nombre</label>
                    <input v-model="profForm.name" type="text" class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-blue-400 transition bg-slate-50 focus:bg-white" />
                  </div>
                  <div>
                    <label class="text-[11px] font-bold text-slate-400 uppercase tracking-wide block mb-1.5">Email</label>
                    <input v-model="profForm.email" type="email" class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-blue-400 transition bg-slate-50 focus:bg-white" />
                  </div>
                  <div>
                    <label class="text-[11px] font-bold text-slate-400 uppercase tracking-wide block mb-1.5">Teléfono</label>
                    <input v-model="profForm.phone" type="tel" class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-blue-400 transition bg-slate-50 focus:bg-white" />
                  </div>
                  <div>
                    <label class="text-[11px] font-bold text-slate-400 uppercase tracking-wide block mb-1.5">Ciudad</label>
                    <input v-model="profForm.city" type="text" class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-blue-400 transition bg-slate-50 focus:bg-white" />
                  </div>
                </div>
                <div>
                  <label class="text-[11px] font-bold text-slate-400 uppercase tracking-wide block mb-1.5">Descripción</label>
                  <textarea v-model="profForm.description" rows="3" class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-blue-400 transition resize-none bg-slate-50 focus:bg-white" />
                </div>
                <button @click="saveProfile" :disabled="profSaving"
                  class="bg-[#2563ff] text-white text-[13px] font-bold px-6 py-2.5 rounded-xl hover:bg-blue-700 transition disabled:opacity-60">
                  {{ profSaving ? 'Guardando...' : 'Guardar cambios' }}
                </button>
              </div>
            </div>
            <div class="bg-white border border-slate-100 rounded-2xl p-6 flex flex-col items-center gap-4 text-center">
              <div class="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-black text-2xl">{{ userInitial }}</div>
              <div>
                <p class="font-black text-[#0f172a]">{{ fullName }}</p>
                <p class="text-[12px] text-[#2563ff] font-semibold mt-0.5">Proveedor verificado ✓</p>
                <div class="flex items-center justify-center gap-0.5 mt-1.5">
                  <span v-for="i in 5" :key="i" class="text-base" :class="i <= 4 ? 'text-amber-400' : 'text-slate-200'">★</span>
                  <span class="text-[11px] text-slate-400 ml-1">4.9</span>
                </div>
              </div>
              <button class="w-full border border-slate-200 text-[13px] font-semibold text-slate-600 py-2 rounded-xl hover:bg-slate-50 transition">Cambiar foto</button>
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
            </div>
            <div class="bg-white border border-slate-100 rounded-2xl overflow-hidden divide-y divide-slate-100">
              <div v-for="faq in faqs" :key="faq.id">
                <button @click="faq.open = !faq.open" class="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-slate-50 transition">
                  <span class="font-semibold text-[#0f172a] text-[13px]">{{ faq.q }}</span>
                  <svg viewBox="0 0 24 24" class="w-4 h-4 flex-shrink-0 ml-3 text-slate-400 transition-transform" :class="faq.open ? 'rotate-180' : ''" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                </button>
                <div v-if="faq.open" class="px-6 pb-4 text-[13px] text-slate-500 leading-relaxed">{{ faq.a }}</div>
              </div>
            </div>
          </div>
        </template>

        <!-- ===== DATOS DE PAGO ===== -->
        <template v-else-if="page === 'Datos de pago'">
          <div class="max-w-2xl space-y-5">
            <p class="text-[13px] text-slate-500">Configura cómo quieres recibir tus pagos. El dinero se transfiere cada lunes.</p>
            <!-- Bank account -->
            <div class="bg-white border border-slate-100 rounded-2xl p-6 space-y-4">
              <h3 class="font-black text-[#0f172a]">Cuenta bancaria</h3>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="text-[11px] font-bold text-slate-400 uppercase tracking-wide block mb-1.5">Banco</label>
                  <select v-model="payForm.bank" class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-blue-400 transition bg-slate-50 focus:bg-white">
                    <option :value="null">Seleccionar banco</option>
                    <option v-for="b in banks" :key="b.id" :value="b">{{ b.name }}</option>
                  </select>
                </div>
                <div>
                  <label class="text-[11px] font-bold text-slate-400 uppercase tracking-wide block mb-1.5">Tipo de cuenta</label>
                  <select v-model="payForm.account_type" class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-blue-400 transition bg-slate-50 focus:bg-white">
                    <option value="ahorros">Ahorros</option>
                    <option value="corriente">Corriente</option>
                  </select>
                </div>
                <div>
                  <label class="text-[11px] font-bold text-slate-400 uppercase tracking-wide block mb-1.5">Número de cuenta</label>
                  <input v-model="payForm.account_number" type="text" placeholder="0000000000"
                    class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-blue-400 transition bg-slate-50 focus:bg-white" />
                </div>
                <div>
                  <label class="text-[11px] font-bold text-slate-400 uppercase tracking-wide block mb-1.5">Titular de la cuenta</label>
                  <input v-model="payForm.account_holder" type="text" :placeholder="fullName"
                    class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-blue-400 transition bg-slate-50 focus:bg-white" />
                </div>
                <div>
                  <label class="text-[11px] font-bold text-slate-400 uppercase tracking-wide block mb-1.5">Cédula del titular</label>
                  <input v-model="payForm.account_id" type="text" placeholder="00000000"
                    class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-blue-400 transition bg-slate-50 focus:bg-white" />
                </div>
              </div>
              <button @click="savePayData" :disabled="paySaving"
                class="bg-[#2563ff] text-white text-[13px] font-bold px-6 py-2.5 rounded-xl hover:bg-blue-700 transition disabled:opacity-60">
                {{ paySaving ? 'Guardando...' : 'Guardar cuenta bancaria' }}
              </button>
            </div>
            <!-- Nequi -->
            <div class="bg-white border border-slate-100 rounded-2xl p-6 space-y-4">
              <h3 class="font-black text-[#0f172a]">Nequi</h3>
              <div class="max-w-xs">
                <label class="text-[11px] font-bold text-slate-400 uppercase tracking-wide block mb-1.5">Número de celular</label>
                <input v-model="payForm.nequi_phone" type="tel" placeholder="+57 300 000 0000"
                  class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-blue-400 transition bg-slate-50 focus:bg-white" />
              </div>
              <button @click="savePayData('nequi')" :disabled="paySaving"
                class="bg-purple-600 text-white text-[13px] font-bold px-6 py-2.5 rounded-xl hover:bg-purple-700 transition disabled:opacity-60">
                {{ paySaving ? 'Guardando...' : 'Guardar Nequi' }}
              </button>
            </div>
            <div class="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-[13px] text-amber-700">
              <span class="font-bold">⚠ Importante:</span> Asegúrate de que los datos sean correctos. Los pagos incorrectos pueden tardar varios días en revertirse.
            </div>
          </div>
        </template>

        <!-- ===== PERFIL PROFESIONAL ===== -->
        <template v-else-if="page === 'Perfil profesional'">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Main form -->
            <div class="md:col-span-2 space-y-5">

              <!-- Verification status banner -->
              <div class="flex items-center gap-3 p-4 rounded-2xl border"
                   :class="verIsVerified ? 'bg-emerald-50 border-emerald-200' : verStatus === 'under_review' ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-200'">
                <span class="w-2.5 h-2.5 rounded-full flex-shrink-0" :class="verDotClass"></span>
                <div>
                  <p class="text-[13px] font-bold" :class="verIsVerified ? 'text-emerald-700' : verStatus === 'under_review' ? 'text-amber-700' : 'text-slate-600'">{{ verStatusLabel }}</p>
                  <p class="text-[12px] text-slate-400 mt-0.5">
                    {{ verIsVerified ? 'Tu perfil ha sido verificado exitosamente.'
                      : verStatus === 'under_review' ? 'Tu documentación está siendo revisada por nuestro equipo.'
                      : 'Completa tu perfil y sube los documentos para solicitar verificación.' }}
                  </p>
                </div>
              </div>

              <!-- Foto de perfil -->
              <div class="bg-white border border-slate-100 rounded-2xl p-6 space-y-4">
                <h3 class="font-black text-[#0f172a]">Foto de perfil</h3>
                <div class="flex items-center gap-5">
                  <div class="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                    <img v-if="verPhotoPreview || verExistingFiles.photo" :src="verPhotoPreview || verExistingFiles.photo" class="w-full h-full object-cover" />
                    <span v-else class="text-white font-black text-2xl">{{ userInitial }}</span>
                  </div>
                  <label class="flex items-center gap-2 bg-slate-50 border border-slate-200 text-[13px] font-semibold text-slate-600 px-4 py-2 rounded-xl cursor-pointer hover:bg-slate-100 transition">
                    <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                    Cambiar foto
                    <input type="file" accept="image/*" class="hidden" @change="e => handleVerFile('photo', e.target.files[0])" />
                  </label>
                </div>
              </div>

              <!-- Especialidades -->
              <div class="bg-white border border-slate-100 rounded-2xl p-6 space-y-4">
                <h3 class="font-black text-[#0f172a]">Especialidades y servicios</h3>
                <div ref="verCatDropdownRef" class="relative">
                  <!-- Trigger field -->
                  <div class="ver-ms-field" :class="{ open: verCatOpen }" @click.stop="verCatOpen = !verCatOpen">
                    <span v-if="!verForm.category_ids.length" class="ver-ms-placeholder">Seleccionar especialidades...</span>
                    <span v-else class="ver-ms-label">{{ verSelectedCatLabel }}</span>
                    <div class="ver-ms-icons">
                      <button v-if="verForm.category_ids.length" type="button" class="ver-ms-clear"
                        @click.stop="verForm.category_ids = []; verForm.service_ids = []" title="Limpiar">×</button>
                      <svg viewBox="0 0 24 24" class="ver-ms-chevron" :class="{ rotated: verCatOpen }" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                    </div>
                  </div>
                  <!-- Dropdown -->
                  <div v-if="verCatOpen" class="ver-ms-dropdown">
                    <div class="ver-ms-header" @click.stop>
                      <!-- Select all checkbox -->
                      <span class="ver-ms-checkbox"
                        :class="{ checked: verAllCatsSelected, partial: verForm.category_ids.length > 0 && !verAllCatsSelected }"
                        @click.stop="toggleVerAllCategories">
                        <svg v-if="verAllCatsSelected" viewBox="0 0 12 10" fill="none" width="11" height="9">
                          <polyline points="1,5 4.5,8.5 11,1" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <span v-else-if="verForm.category_ids.length > 0" class="ver-ms-partial"></span>
                      </span>
                      <input v-model="verCatSearch" class="ver-ms-search" placeholder="Buscar especialidad…" @click.stop />
                      <button class="ver-ms-close" @click.stop="verCatOpen = false">×</button>
                    </div>
                    <div class="ver-ms-options">
                      <div v-for="cat in verFilteredCats" :key="cat.id"
                        class="ver-ms-option" :class="{ checked: verForm.category_ids.includes(cat.id) }"
                        @click.stop="toggleVerCategory(cat.id)">
                        <span class="ver-ms-checkbox" :class="{ checked: verForm.category_ids.includes(cat.id) }">
                          <svg v-if="verForm.category_ids.includes(cat.id)" viewBox="0 0 12 10" fill="none" width="11" height="9">
                            <polyline points="1,5 4.5,8.5 11,1" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
                          </svg>
                        </span>
                        <span class="ver-ms-option-label">{{ cat.name }}</span>
                      </div>
                      <div v-if="!verFilteredCats.length" class="ver-ms-empty">Sin resultados</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Servicios que ofreces -->
              <div class="bg-white border border-slate-100 rounded-2xl p-6 space-y-4">
                <h3 class="font-black text-[#0f172a]">Servicios que ofreces</h3>
                <div v-if="!verForm.category_ids.length" class="ver-chips-hint">
                  Selecciona primero una o más especialidades
                </div>
                <div v-else-if="!verCategoriesWithServices.length" class="ver-chips-hint">
                  No hay servicios disponibles para las especialidades seleccionadas
                </div>
                <template v-else>
                  <div v-for="cat in verCategoriesWithServices" :key="cat.id" class="ver-service-group">
                    <p class="ver-group-label">{{ cat.name }}</p>
                    <div class="ver-service-chips">
                      <button v-for="svc in cat.services" :key="svc.id" type="button"
                        class="ver-service-chip" :class="{ selected: verForm.service_ids.includes(svc.id) }"
                        @click="toggleVerService(svc.id)">
                        <span v-if="verForm.service_ids.includes(svc.id)" class="ver-chip-check">✓</span>
                        {{ svc.name }}
                      </button>
                    </div>
                  </div>
                </template>
              </div>

              <!-- Datos personales -->
              <div class="bg-white border border-slate-100 rounded-2xl p-6 space-y-4">
                <h3 class="font-black text-[#0f172a]">Datos personales</h3>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="text-[11px] font-bold text-slate-400 uppercase tracking-wide block mb-1.5">N.º de documento</label>
                    <input v-model="verForm.document_number" type="text" class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-blue-400 transition bg-slate-50 focus:bg-white" />
                  </div>
                  <div>
                    <label class="text-[11px] font-bold text-slate-400 uppercase tracking-wide block mb-1.5">Teléfono</label>
                    <input v-model="verForm.phone" type="tel" class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-blue-400 transition bg-slate-50 focus:bg-white" />
                  </div>
                  <div>
                    <label class="text-[11px] font-bold text-slate-400 uppercase tracking-wide block mb-1.5">Ciudad</label>
                    <select v-model="verForm.city_id" class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-blue-400 transition bg-slate-50 focus:bg-white">
                      <option value="">Seleccionar ciudad...</option>
                      <option v-for="city in verCities" :key="city.id" :value="city.id">{{ city.name }}</option>
                    </select>
                  </div>
                  <div>
                    <label class="text-[11px] font-bold text-slate-400 uppercase tracking-wide block mb-1.5">Dirección</label>
                    <input v-model="verForm.address" type="text" class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-blue-400 transition bg-slate-50 focus:bg-white" />
                  </div>
                </div>
                <div>
                  <label class="text-[11px] font-bold text-slate-400 uppercase tracking-wide block mb-1.5">Descripción / Bio</label>
                  <textarea v-model="verForm.bio" rows="3" placeholder="Cuéntanos sobre tu experiencia y habilidades..." class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-blue-400 transition resize-none bg-slate-50 focus:bg-white" />
                </div>
              </div>

              <!-- Documentos de verificación -->
              <div class="bg-white border border-slate-100 rounded-2xl p-6 space-y-4">
                <h3 class="font-black text-[#0f172a]">Documentos de verificación</h3>
                <p class="text-[13px] text-blue-500">Sube documentos legibles en JPG, PNG o PDF (máx. 5 MB c/u).</p>
                <div class="space-y-4">
                  <div v-for="doc in [{key:'identity_card',label:'Cédula de ciudadanía'},{key:'professional_card',label:'Tarjeta profesional'},{key:'professional_title',label:'Título profesional'}]" :key="doc.key">
                    <label class="text-[11px] font-bold text-slate-400 uppercase tracking-wide block mb-1.5">{{ doc.label }}</label>

                    <!-- Zona de upload -->
                    <label class="flex items-center gap-3 border-2 border-dashed rounded-xl p-4 cursor-pointer transition"
                      :class="verForm[doc.key] ? 'border-blue-400 bg-blue-50' : verExistingFiles[doc.key] ? 'border-slate-300 bg-slate-50 hover:border-blue-300' : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'">
                      <svg viewBox="0 0 24 24" class="w-5 h-5 flex-shrink-0"
                        :class="verForm[doc.key] ? 'text-blue-600' : verExistingFiles[doc.key] ? 'text-slate-400' : 'text-slate-300'"
                        fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                      </svg>
                      <span class="text-[13px] flex-1 truncate"
                        :class="verForm[doc.key] ? 'text-blue-700 font-semibold' : verExistingFiles[doc.key] ? 'text-slate-500' : 'text-slate-400'">
                        {{ verForm[doc.key]
                            ? verForm[doc.key].name
                            : verExistingFiles[doc.key]
                              ? verDocFileName(verExistingFiles[doc.key]) + ' (cambiar)'
                              : 'Seleccionar archivo...' }}
                      </span>
                      <input type="file" accept=".jpg,.jpeg,.png,.pdf" class="hidden" @change="e => handleVerFile(doc.key, e.target.files[0])" />
                    </label>

                    <!-- Vista previa del archivo existente -->
                    <div v-if="verExistingFiles[doc.key] && !verForm[doc.key]" class="flex items-center gap-2 mt-1.5 px-1">
                      <svg viewBox="0 0 24 24" class="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      <span class="text-[11px] text-emerald-600 font-semibold">Documento subido —</span>
                      <a :href="verExistingFiles[doc.key]" target="_blank" rel="noopener"
                        class="text-[11px] text-blue-600 font-semibold hover:underline"
                        @click.stop>Ver / descargar</a>
                    </div>
                  </div>
                </div>
              </div>

              <button @click="saveVerProfile" :disabled="verSaving"
                class="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-[13px] font-bold px-6 py-3 rounded-xl hover:opacity-90 transition disabled:opacity-60 shadow-sm">
                {{ verSaving ? 'Guardando...' : 'Guardar perfil profesional' }}
              </button>
            </div>

            <!-- Sidebar: status card -->
            <div class="space-y-4">
              <div class="bg-white border border-slate-100 rounded-2xl p-5 space-y-4">
                <h4 class="font-black text-[#0f172a] text-[14px]">Estado de verificación</h4>
                <div class="flex flex-col items-center gap-3 text-center py-2">
                  <div class="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                    <img v-if="verPhotoPreview || verExistingFiles.photo" :src="verPhotoPreview || verExistingFiles.photo" class="w-full h-full object-cover" />
                    <span v-else class="text-white font-black text-2xl">{{ userInitial }}</span>
                  </div>
                  <p class="font-black text-[#0f172a]">{{ fullName }}</p>
                  <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold"
                    :class="verIsVerified ? 'bg-emerald-100 text-emerald-700' : verStatus === 'under_review' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'">
                    <span class="w-1.5 h-1.5 rounded-full" :class="verDotClass"></span>
                    {{ verStatusLabel }}
                  </span>
                </div>
                <div class="space-y-2 pt-2 border-t border-slate-100">
                  <div class="flex justify-between text-[12px]">
                    <span class="text-slate-400">Especialidades</span>
                    <span class="font-bold text-[#0f172a]">{{ verForm.category_ids.length }}</span>
                  </div>
                  <div class="flex justify-between text-[12px]">
                    <span class="text-slate-400">Servicios</span>
                    <span class="font-bold text-[#0f172a]">{{ verForm.service_ids.length }}</span>
                  </div>
                  <div class="flex justify-between text-[12px]">
                    <span class="text-slate-400">Documentos</span>
                    <span class="font-bold text-[#0f172a]">{{ [verForm.identity_card||verExistingFiles.identity_card, verForm.professional_card||verExistingFiles.professional_card, verForm.professional_title||verExistingFiles.professional_title].filter(Boolean).length }}/3</span>
                  </div>
                </div>
              </div>
              <div class="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-[12px] text-blue-700 space-y-1.5">
                <p class="font-bold">¿Por qué verificarme?</p>
                <p>Los profesionales verificados reciben hasta 3× más solicitudes y aparecen primero en los resultados de búsqueda.</p>
              </div>
            </div>
          </div>
        </template>

        <!-- Fallback -->
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
              page === item.name ? 'text-[#7c3aed]' : 'text-slate-400']">
            <div :class="['relative w-10 h-8 rounded-xl flex items-center justify-center transition-colors',
              page === item.name ? 'bg-purple-50' : '']">
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

      <!-- Profile card -->
      <div class="bg-white rounded-2xl shadow-sm p-5">
        <div class="flex items-center justify-between mb-4">
          <span class="font-black text-[#0f172a] text-[13px]">Perfil profesional</span>
          <button @click="page = 'Perfil profesional'" class="text-[12px] text-[#2563ff] font-semibold">Editar perfil</button>
        </div>
        <div class="flex flex-col items-center gap-3 text-center">
          <div class="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-black text-2xl flex-shrink-0">
            <img v-if="verPhotoPreview || verExistingFiles.photo"
              :src="verPhotoPreview || verExistingFiles.photo"
              class="w-full h-full object-cover" />
            <span v-else>{{ userInitial }}</span>
          </div>
          <div>
            <p class="font-black text-[#0f172a]">{{ fullName }}</p>
            <p v-if="verIsVerified" class="text-[12px] text-[#2563ff] font-semibold mt-0.5">Proveedor verificado ✓</p>
            <p v-else class="text-[12px] text-slate-400 font-semibold mt-0.5">Pendiente de verificación</p>
            <template v-if="profAvgRating > 0">
              <div class="flex items-center justify-center gap-0.5 mt-1.5">
                <span v-for="i in 5" :key="i" class="text-base"
                  :class="i <= Math.round(profAvgRating) ? 'text-amber-400' : 'text-slate-200'">★</span>
              </div>
              <p class="text-[11px] text-slate-400 mt-0.5">{{ profAvgRating.toFixed(1) }} ({{ profReviewCount }} reseñas)</p>
            </template>
            <p v-else class="text-[11px] text-slate-400 mt-1.5">Sin calificaciones aún</p>
          </div>
          <button @click="page = 'Perfil profesional'"
            class="w-full border border-blue-200 text-[#2563ff] text-[13px] font-semibold py-2 rounded-xl hover:bg-blue-50 transition">
            Ver mi perfil público
          </button>
        </div>
      </div>

      <!-- Stats resumen -->
      <div class="bg-white rounded-2xl shadow-sm p-5 space-y-3">
        <p class="font-black text-[#0f172a] text-[13px]">Resumen del mes</p>
        <div v-for="s in profSummary" :key="s.label" class="flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <div :class="['w-7 h-7 rounded-lg flex items-center justify-center', s.iconBg]">
              <svg viewBox="0 0 24 24" class="w-3.5 h-3.5" fill="none" :stroke="s.iconColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" v-html="s.iconSvg" />
            </div>
            <span class="text-[12px] text-slate-600">{{ s.label }}</span>
          </div>
          <span class="text-[12px] font-black text-[#0f172a]">{{ s.value }}</span>
        </div>
      </div>

      <!-- Consejo del día -->
      <div class="bg-white rounded-2xl shadow-sm p-5 relative overflow-hidden">
        <p class="font-black text-[#0f172a] text-[13px] mb-2">Consejo del día 💡</p>
        <p class="text-[12px] text-slate-500 leading-relaxed pr-8">Responde rápido a las solicitudes para aumentar tus reservas.</p>
        <span class="absolute right-4 bottom-4 text-3xl">🚀</span>
      </div>

      <!-- Disponibilidad -->
      <div class="bg-white rounded-2xl shadow-sm p-4">
        <div class="flex items-center justify-between">
          <span class="text-[13px] font-bold text-[#0f172a]">Disponibilidad</span>
          <button @click="available = !available" :class="['w-10 h-5 rounded-full transition-colors relative', available ? 'bg-[#2563ff]' : 'bg-slate-200']">
            <span class="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all" :style="{left: available ? '22px' : '2px'}"></span>
          </button>
        </div>
        <p :class="['text-[11px] font-semibold mt-1', available ? 'text-emerald-500' : 'text-slate-400']">{{ available ? '● Disponible para trabajos' : '● No disponible' }}</p>
      </div>
    </div>
  </div>

  <Teleport to="body">
    <div class="fixed top-4 right-4 z-[200] flex flex-col gap-2 pointer-events-none">
      <div v-for="t in toasts" :key="t.id"
        :class="['flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg text-[13px] font-semibold pointer-events-auto min-w-[260px]',
          t.type === 'success' ? 'bg-emerald-600 text-white' :
          t.type === 'error'   ? 'bg-red-600 text-white' : 'bg-[#0f172a] text-white']">
        <span>{{ t.type === 'success' ? '✓' : t.type === 'error' ? '✕' : 'ℹ' }}</span>
        <span class="flex-1">{{ t.message }}</span>
        <button @click="toasts = toasts.filter(x => x.id !== t.id)" class="opacity-70 hover:opacity-100">×</button>
      </div>
    </div>

    <!-- Service Modal -->
    <Transition name="fade">
      <div v-if="showSvcModal" class="fixed inset-0 z-[110] flex items-center justify-center p-4" style="background:rgba(15,23,42,.55)">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg" @click.stop>
          <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <p class="font-black text-[#0f172a]">{{ editingSvc ? 'Editar servicio' : 'Publicar nuevo servicio' }}</p>
            <button @click="showSvcModal = false" class="text-slate-400 hover:text-slate-600 text-xl leading-none">×</button>
          </div>
          <div class="p-6 space-y-4">
            <div>
              <label class="block text-[12px] font-bold text-slate-500 mb-1">Nombre del servicio *</label>
              <input v-model="svcForm.name" class="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500/30" placeholder="Ej: Limpieza a domicilio" />
            </div>
            <div>
              <label class="block text-[12px] font-bold text-slate-500 mb-1">Descripción</label>
              <textarea v-model="svcForm.description" rows="2" class="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none" placeholder="Describe lo que incluye tu servicio…" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-[12px] font-bold text-slate-500 mb-1">Precio desde ($) *</label>
                <input v-model.number="svcForm.price" type="number" min="0" class="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500/30" placeholder="50000" />
              </div>
              <div>
                <label class="block text-[12px] font-bold text-slate-500 mb-1">Categoría</label>
                <input v-model="svcForm.category" class="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500/30" placeholder="Ej: Limpieza" />
              </div>
            </div>
            <div class="flex items-center justify-between py-1">
              <div>
                <p class="text-[13px] font-semibold text-[#0f172a]">Publicar de inmediato</p>
                <p class="text-[11px] text-slate-400">Visible para los clientes al guardar</p>
              </div>
              <button @click="svcForm.active = !svcForm.active"
                :class="['w-11 h-6 rounded-full transition-colors relative flex-shrink-0', svcForm.active ? 'bg-blue-600' : 'bg-slate-200']">
                <span class="absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all"
                  :style="{left: svcForm.active ? '24px' : '4px'}"></span>
              </button>
            </div>
          </div>
          <div class="flex justify-end gap-3 px-6 py-4 border-t border-slate-100">
            <button @click="showSvcModal = false" class="px-5 py-2.5 rounded-xl border border-slate-200 text-[13px] text-slate-600 hover:bg-slate-50 transition">Cancelar</button>
            <button @click="saveSvc" :disabled="svcSaving"
              class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-[13px] font-bold hover:opacity-90 transition disabled:opacity-60">
              {{ svcSaving ? 'Guardando…' : (editingSvc ? 'Guardar cambios' : 'Publicar servicio') }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Code Verification Modal (6 inputs individuales) -->
    <Transition name="modal">
      <div v-if="showCodeModal" class="modal-overlay-full" @click.self="showCodeModal = false">
        <div class="modal-code">
          <div class="modal-code-header">
            <div class="code-icon">🔐</div>
            <div>
              <h3>Código de aprobación</h3>
              <p>Ingresa el código de 6 dígitos que el cliente te proporcionó</p>
            </div>
          </div>
          <div class="code-inputs">
            <input v-for="(digit, i) in codeDigits" :key="i" :ref="el => digitRefs[i] = el"
              v-model="codeDigits[i]" type="text" inputmode="numeric" maxlength="1" class="digit-input"
              :class="{ filled: digit }" @input="onDigitInput(i)" @keydown.backspace="onBackspace(i)"
              @paste.prevent="onPaste($event)" />
          </div>
          <p v-if="codeError" class="code-error">{{ codeError }}</p>
          <div class="modal-code-actions">
            <button class="btn-cancel-code" @click="showCodeModal = false">Cancelar</button>
            <button class="btn-verify-code" :disabled="fullCode.length < 6 || codeSubmitting" @click="submitCode">
              {{ codeSubmitting ? 'Verificando…' : 'Verificar →' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Evidence Modal (grid + upload) -->
    <Transition name="modal">
      <div v-if="showEvidModal" class="modal-overlay-full" @click.self="showEvidModal = false">
        <div class="modal-evidence">
          <div class="modal-ev-header-row">
            <div>
              <h3>Evidencias del trabajo</h3>
              <p>{{ selectedJobForEvid?.service_name }} — {{ selectedJobForEvid?.client_name }}</p>
            </div>
            <button class="btn-modal-close-ev" @click="showEvidModal = false">✕</button>
          </div>
          <div class="evidences-grid" v-if="jobEvidences.length">
            <div v-for="ev in jobEvidences" :key="ev.id" class="evidence-item">
              <img v-if="ev.file_type === 'image'" :src="ev.file_url" class="ev-preview" />
              <div v-else class="ev-file-icon">{{ ev.file_type === 'video' ? '🎥' : '📄' }}</div>
              <p class="ev-note">{{ ev.note || 'Sin nota' }}</p>
              <span class="ev-date">{{ ev.created_at }}</span>
            </div>
          </div>
          <p v-else class="no-evidences">Aún no hay evidencias subidas.</p>
          <div v-if="selectedJobForEvid?.status === 'accepted'" class="upload-section">
            <p class="upload-title">Subir nueva evidencia</p>
            <label class="file-drop-ev" :class="{ 'has-file': evidFile }">
              <input type="file" accept="image/*,video/*,.pdf" @change="e => evidFile = e.target.files[0]" class="hidden" />
              <span v-if="!evidFile">📎 Toca para seleccionar imagen, video o PDF</span>
              <span v-else class="file-selected-ev">✓ {{ evidFile.name }}</span>
            </label>
            <textarea v-model="evidNote" class="note-input-ev" placeholder="Nota opcional" rows="2"></textarea>
            <button class="btn-upload-ev" :disabled="!evidFile || evidSubmitting" @click="submitEvidence">
              {{ evidSubmitting ? 'Subiendo…' : '⬆️ Subir evidencia' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Rating Modal (estrellas grandes) -->
    <Transition name="modal">
      <div v-if="showRatingModal" class="modal-overlay-full modal-center" @click.self="showRatingModal = false">
        <div class="modal-rating">
          <div class="modal-ev-header-row">
            <div>
              <h3>Calificar cliente</h3>
              <p>¿Cómo fue la experiencia con <strong>{{ ratingClientName }}</strong>?</p>
            </div>
            <button class="btn-modal-close-ev" @click="showRatingModal = false">✕</button>
          </div>
          <div class="rating-body">
            <div class="stars-row">
              <button v-for="n in 5" :key="n" :class="['star-btn', { filled: n <= ratingScore }]" @click="ratingScore = n">★</button>
            </div>
            <p class="stars-label">{{ starLabel(ratingScore) }}</p>
            <textarea v-model="ratingComment" class="rating-comment" placeholder="Comentario opcional…" maxlength="500" rows="3"></textarea>
            <button class="btn-submit-rating" :disabled="ratingScore === 0 || ratingSubmitting" @click="submitRating">
              {{ ratingSubmitting ? 'Enviando…' : 'Enviar calificación' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Chat Modal por solicitud -->
    <ChatModal
      v-if="jobChatRequest"
      v-model="chatModalOpen"
      :request-id="jobChatRequest.id"
      :other-name="jobChatRequest.client_name ?? 'Cliente'"
      :service-name="jobChatRequest.service_name ?? ''"
      @read="loadUnreadChats"
    />

    <!-- Welcome Modal (new professionals) -->
    <Transition name="fade">
      <div v-if="showWelcomeModal" class="fixed inset-0 z-[120] flex items-center justify-center p-4" style="background:rgba(15,23,42,.65)">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md text-center" @click.stop>
          <div class="p-8 space-y-4">
            <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto">
              <svg viewBox="0 0 24 24" class="w-8 h-8" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            </div>
            <h3 class="text-xl font-black text-[#0f172a]">¡Bienvenido a e-Service!</h3>
            <p class="text-[13px] text-slate-500 leading-relaxed">Tu cuenta ha sido creada exitosamente. Completa tu perfil profesional para empezar a recibir solicitudes de servicio.</p>
            <div class="bg-blue-50 rounded-xl p-4 text-left space-y-1.5">
              <p class="text-[12px] font-bold text-blue-700">Próximos pasos:</p>
              <p class="text-[12px] text-blue-600">• Sube tu foto y documentos de verificación</p>
              <p class="text-[12px] text-blue-600">• Selecciona tus especialidades y servicios</p>
              <p class="text-[12px] text-blue-600">• Configura tus datos de pago</p>
            </div>
          </div>
          <div class="flex gap-3 px-8 pb-8">
            <button @click="closeWelcomeModal" class="flex-1 border border-slate-200 text-[13px] font-semibold text-slate-600 py-2.5 rounded-xl hover:bg-slate-50 transition">Explorar primero</button>
            <button @click="page = 'Perfil profesional'; closeWelcomeModal()" class="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-[13px] font-bold py-2.5 rounded-xl hover:opacity-90 transition">Completar perfil</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .2s ease }
.fade-enter-from, .fade-leave-to       { opacity: 0 }

/* ── Stats tooltip ── */
.stats-tip {
  position: absolute;
  transform: translateX(-50%);
  background: #2563eb;
  color: #fff;
  font-size: 13px;
  padding: 6px 12px;
  border-radius: 10px;
  white-space: nowrap;
  pointer-events: none;
  box-shadow: 0 4px 16px rgba(37,99,235,.35);
  z-index: 10;
}
.stats-tip::after {
  content: '';
  position: absolute;
  top: 100%; left: 50%;
  transform: translateX(-50%);
  border: 5px solid transparent;
  border-top-color: #2563eb;
}

/* ── Calendario ── */
.cal-cell {
  min-height: 90px; border-radius: 10px; padding: 6px;
  position: relative; display: flex; flex-direction: column;
  border: 1px solid #f1f5f9;
  transition: background .15s;
}
.cal-cell-clickable { cursor: pointer; }
.cal-cell-clickable:hover { background: #f8fafc; }
.cal-cell-other { opacity: .35; cursor: default; }
.cal-cell-today { background: #2563eb !important; border-color: #2563eb; }
.cal-cell-today .cal-day-number { color: #fff; font-weight: 900; }
.cal-cell-event { background: #2563eb; border-color: #2563eb; }
.cal-cell-event:hover { background: #1d4ed8 !important; }
.cal-cell-event .cal-day-number { color: #fff; font-weight: 900; }

.cal-day-number {
  font-size: 13px; color: #475569; line-height: 1;
  margin-top: auto; align-self: flex-end; padding: 2px 4px;
}

.cal-event-list {
  display: flex; flex-direction: column; gap: 3px;
  flex: 1; overflow: hidden;
}
.cal-event-chip {
  display: flex; flex-direction: column;
  background: rgba(255,255,255,.18);
  border-radius: 6px; padding: 4px 6px;
  font-size: 11px; color: #fff; line-height: 1.3;
  overflow: hidden;
}

/* Calendario responsive: ocultar chips, mostrar solo punto azul en móvil */
@media (max-width: 767px) {
  .cal-cell { min-height: 48px; padding: 3px 2px; border-radius: 6px; }
  .cal-event-list { display: none !important; }
  .cal-cell-event::before {
    content: ''; display: block; width: 7px; height: 7px;
    border-radius: 50%; background: rgba(255,255,255,.9);
    margin: 4px auto 2px; flex-shrink: 0;
  }
  .cal-day-number { font-size: 10px; }
}

/* Modal calendario */
.cal-info-card {
  background: #f8fafc; border-radius: 10px; padding: 10px 12px;
}
.cal-info-label {
  font-size: 11px; font-weight: 700; color: #94a3b8;
  text-transform: uppercase; letter-spacing: .4px;
  display: block; margin-bottom: 3px;
}
.cal-info-val {
  font-size: 13px; font-weight: 600; color: #0f172a;
}

/* ── Especialidades multi-select ── */
.ver-ms-field {
  position: relative; display: flex; align-items: center;
  min-height: 46px; padding: 0 10px 0 14px;
  border: 1.5px solid #e2e8f0; border-radius: 10px;
  background: #f8fafc; cursor: pointer;
  transition: border-color .15s, box-shadow .15s;
  user-select: none; gap: 8px;
}
.ver-ms-field:hover { border-color: #2563eb; }
.ver-ms-field.open  { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,.12); }
.ver-ms-placeholder { flex: 1; font-size: 13px; color: #94a3b8; }
.ver-ms-label       { flex: 1; font-size: 13px; color: #0f172a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ver-ms-icons       { display: flex; align-items: center; gap: 4px; flex-shrink: 0; }
.ver-ms-clear {
  background: none; border: none; color: #94a3b8;
  font-size: 18px; line-height: 1; padding: 2px 4px; cursor: pointer;
  display: flex; align-items: center; transition: color .15s;
}
.ver-ms-clear:hover { color: #475569; }
.ver-ms-chevron { width: 16px; height: 16px; color: #64748b; transition: transform .2s ease; flex-shrink: 0; }
.ver-ms-chevron.rotated { transform: rotate(180deg); }

.ver-ms-dropdown {
  position: absolute; top: calc(100% + 4px); left: 0; right: 0;
  background: #fff; border: 1px solid #e2e8f0; border-radius: 10px;
  box-shadow: 0 6px 24px rgba(0,0,0,.12); z-index: 50; overflow: hidden;
}
.ver-ms-header {
  display: flex; align-items: center; gap: 8px;
  padding: 8px 10px; border-bottom: 1px solid #f1f5f9;
}
.ver-ms-search {
  flex: 1; padding: 6px 10px; border: 1px solid #e2e8f0;
  border-radius: 6px; font-size: 13px; outline: none;
  background: #f8fafc; font-family: inherit;
  transition: border-color .15s;
}
.ver-ms-search:focus { border-color: #2563eb; }
.ver-ms-close {
  background: none; border: none; color: #94a3b8;
  font-size: 18px; padding: 2px 6px; cursor: pointer;
  transition: color .15s; flex-shrink: 0;
}
.ver-ms-close:hover { color: #374151; }
.ver-ms-options { max-height: 220px; overflow-y: auto; }
.ver-ms-option {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 14px; font-size: 13px; color: #374151;
  cursor: pointer; transition: background .1s;
}
.ver-ms-option:hover  { background: #f0f9ff; }
.ver-ms-option.checked { background: #dbeafe; color: #1d4ed8; }
.ver-ms-option-label { font-size: 13px; }
.ver-ms-empty { padding: 16px; text-align: center; font-size: 13px; color: #9ca3af; }

.ver-ms-checkbox {
  width: 20px; height: 20px; border: 2px solid #cbd5e1;
  border-radius: 4px; display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; transition: border-color .15s, background .15s;
  background: #fff; cursor: pointer;
}
.ver-ms-checkbox.checked { border-color: #2563eb; background: #2563eb; }
.ver-ms-checkbox.partial { border-color: #2563eb; background: #2563eb; }
.ver-ms-partial { width: 10px; height: 2px; background: #fff; border-radius: 1px; display: block; }

/* ── Servicios que ofreces ── */
.ver-chips-hint {
  padding: 12px 14px; background: #f8fafc;
  border: 1.5px dashed #cbd5e1; border-radius: 10px;
  font-size: 13px; color: #94a3b8;
}
.ver-service-group { margin-bottom: 12px; }
.ver-group-label {
  font-size: 11px; font-weight: 700; color: #2563eb;
  text-transform: uppercase; letter-spacing: .5px; margin-bottom: 8px;
}
.ver-service-chips { display: flex; flex-wrap: wrap; gap: 8px; }
.ver-service-chip {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 7px 14px; border: 2px solid #e2e8f0;
  border-radius: 999px; background: #fff;
  font-size: 12px; font-weight: 600; color: #475569;
  cursor: pointer; font-family: inherit;
  transition: border-color .2s, background .2s, color .2s;
}
.ver-service-chip:hover { border-color: #2563eb; color: #2563eb; background: #eff6ff; }
.ver-service-chip.selected { border-color: #2563eb; background: #2563eb; color: #fff; }
.ver-chip-check { font-size: 11px; font-weight: 900; }

.drawer-overlay-enter-active, .drawer-overlay-leave-active { transition: opacity .25s ease }
.drawer-overlay-enter-active > div:last-child, .drawer-overlay-leave-active > div:last-child { transition: transform .25s ease }
.drawer-overlay-enter-from > div:last-child, .drawer-overlay-leave-to > div:last-child { transform: translateX(-100%) }
.drawer-overlay-enter-from, .drawer-overlay-leave-to { opacity: 0 }

/* ── Modal transitions ── */
.modal-enter-active, .modal-leave-active { transition: opacity .2s ease }
.modal-enter-from, .modal-leave-to       { opacity: 0 }
.expand-enter-active { transition: max-height .3s ease, opacity .25s ease; max-height: 300px; }
.expand-leave-active { transition: max-height .2s ease, opacity .15s ease; max-height: 300px; }
.expand-enter-from, .expand-leave-to { max-height: 0; opacity: 0; }
.card-enter-active, .card-leave-active { transition: opacity .25s ease, transform .25s ease; }
.card-enter-from   { opacity: 0; transform: translateY(-8px) scale(0.98); }
.card-leave-to     { opacity: 0; transform: translateX(-12px); }
.fade-enter-active, .fade-leave-active { transition: opacity .2s ease, transform .2s ease; }
.fade-enter-from { opacity: 0; transform: translateY(6px) scale(0.98); }
.fade-leave-to   { opacity: 0; transform: scale(0.97); }

/* ── Mapa Leaflet ── */
#pro-map {
  width: 100%; height: 240px;
  border-radius: 16px; overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,.1);
  flex-shrink: 0; position: relative; z-index: 1;
}

/* ── Solicitudes header ── */
.req-header { display: flex; justify-content: space-between; align-items: center; }
.req-title  { font-size: 18px; font-weight: 800; margin: 0 0 3px; }
.req-subtitle { font-size: 13px; color: #64748b; margin: 0; }
.live-badge {
  display: flex; align-items: center; gap: 6px;
  background: #dcfce7; color: #166534;
  font-size: 11px; font-weight: 700;
  padding: 6px 12px; border-radius: 20px;
  text-transform: uppercase; letter-spacing: .3px;
}
.live-dot {
  width: 7px; height: 7px; background: #16a34a; border-radius: 50%;
  animation: livePulse 1.4s ease-in-out infinite;
}
@keyframes livePulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(1.5)} }

/* ── Skeleton ── */
.skeleton-list  { display: flex; flex-direction: column; gap: 12px; }
.skeleton-card  { background: white; border: 1px solid #f1f5f9; border-radius: 16px; padding: 18px; display: flex; flex-direction: column; gap: 10px; }
.skeleton-line  { height: 14px; border-radius: 6px; background: linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; }
.skeleton-line.short { height: 11px; }
.skeleton-line.w-90 { width: 90%; }
.skeleton-line.w-60 { width: 60%; }
.skeleton-line.w-40 { width: 40%; }
@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

/* ── Empty ── */
.req-empty-state { text-align: center; padding: 48px 24px; background: #f8fafc; border-radius: 16px; border: 1.5px dashed #e2e8f0; color: #94a3b8; }
.req-empty-icon  { width: 52px; height: 52px; border-radius: 14px; background: #f1f5f9; display: flex; align-items: center; justify-content: center; margin: 0 auto 12px; }
.req-empty-title { font-size: 14px; font-weight: 700; color: #64748b; margin: 0 0 4px; }

/* ── Card group ── */
.card-group { display: flex; flex-direction: column; gap: 12px; }

/* ── Request card ── */
.request-card {
  background: white; border: 1.5px solid #e2e8f0; border-radius: 16px; padding: 16px;
  transition: box-shadow .2s; position: relative;
}
.request-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,.07); }
.request-new { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,.07); }
.new-badge {
  position: absolute; top: 12px; right: 12px;
  background: #eff6ff; color: #1d4ed8;
  font-size: 10px; font-weight: 800; letter-spacing: .5px; text-transform: uppercase;
  padding: 3px 9px; border-radius: 6px; border: 1px solid #bfdbfe;
}
.request-top { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; padding-right: 52px; }
.service-icon-wrap { width: 34px; height: 34px; border-radius: 10px; background: #eff6ff; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.request-service { font-weight: 700; font-size: 14px; flex: 1; }
.request-budget  { font-weight: 800; font-size: 18px; color: #2563eb; letter-spacing: -.5px; }
.request-description { font-size: 13px; color: #475569; line-height: 1.5; margin: 0 0 10px; }
.request-meta { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 14px; }
.meta-chip { display: inline-flex; align-items: center; gap: 5px; background: #f8fafc; border: 1px solid #e2e8f0; color: #64748b; font-size: 12px; padding: 4px 10px; border-radius: 8px; }
.chip-people { background: #eff6ff; border-color: #bfdbfe; color: #1d4ed8; font-weight: 600; }
.request-divider { height: 1px; background: #f1f5f9; margin-bottom: 14px; }
.request-footer { display: flex; justify-content: space-between; align-items: center; gap: 10px; flex-wrap: wrap; }
.req-client-info { display: flex; align-items: center; gap: 8px; }
.req-client-avatar { width: 32px; height: 32px; border-radius: 8px; background: #e0e7ff; color: #3730a3; font-size: 11px; font-weight: 800; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.req-client-name { font-size: 13px; font-weight: 600; color: #334155; }
.req-actions { display: flex; gap: 6px; align-items: center; flex-wrap: wrap; flex: 1; justify-content: flex-end; }
.btn-distance { background: #ecfeff; color: #0e7490; border: 1px solid #a5f3fc; padding: 8px 12px; border-radius: 8px; font-size: 12px; font-weight: 700; cursor: pointer; font-family: inherit; }
.btn-detail   { background: #eef2ff; color: #3730a3; border: 1px solid #c7d2fe; padding: 8px 12px; border-radius: 8px; font-size: 12px; font-weight: 700; cursor: pointer; font-family: inherit; }
.btn-accept-req {
  background: linear-gradient(135deg, #1d4ed8, #2563eb); color: white; border: none;
  padding: 10px 20px; border-radius: 10px; font-size: 13px; font-weight: 700;
  cursor: pointer; font-family: inherit;
  transition: opacity .15s, transform .15s, box-shadow .15s;
}
.btn-accept-req:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 4px 14px rgba(37,99,235,.35); }
.btn-accept-req:disabled { opacity: .55; cursor: not-allowed; }

/* ── Modal detalles solicitud ── */
.modal-overlay-req {
  position: fixed; inset: 0; background: rgba(0,0,0,.4);
  display: flex; justify-content: center; align-items: center; z-index: 999;
}
.modal-pro { background: white; width: 340px; border-radius: 18px; padding: 18px; animation: scaleIn .2s ease; }
@keyframes scaleIn { from{transform:scale(.9);opacity:0} to{transform:scale(1);opacity:1} }
.modal-pro-header { display: flex; gap: 12px; align-items: center; margin-bottom: 14px; }
.avatar-big { width: 44px; height: 44px; border-radius: 12px; background: #2563eb; color: white; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 16px; flex-shrink: 0; }
.service-tag { font-size: 12px; color: #64748b; margin: 0; }
.modal-pro-body { display: flex; flex-direction: column; gap: 10px; }
.info-card-req { background: #f8fafc; padding: 10px; border-radius: 10px; font-size: 12px; }
.info-card-req span { font-weight: 600; color: #64748b; margin-bottom: 3px; display: block; }
.info-card-req p { margin: 0; color: #334155; }
.info-row-req { display: flex; gap: 8px; }
.mini-card-req { flex: 1; background: #eef2ff; padding: 10px; border-radius: 10px; text-align: center; font-size: 12px; }
.price-card-req { background: linear-gradient(135deg, #1d4ed8, #2563eb); color: white; text-align: center; padding: 12px; border-radius: 12px; font-size: 18px; font-weight: 800; }
.modal-pro-actions { display: flex; justify-content: space-between; margin-top: 14px; gap: 8px; }
.btn-modal-cerrar { background: #e5e7eb; border: none; padding: 10px 16px; border-radius: 8px; cursor: pointer; font-family: inherit; font-weight: 600; font-size: 13px; }
.btn-ver-ruta { background: #22c55e; color: white; border: none; padding: 10px 16px; border-radius: 8px; cursor: pointer; font-family: inherit; font-weight: 700; font-size: 13px; }

/* ── Mis Trabajos top bar ── */
.trabajos-top-bar { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
.trabajos-tabs    { display: flex; gap: 8px; background: #f1f5f9; padding: 4px; border-radius: 12px; width: fit-content; }
.tab-btn {
  display: flex; align-items: center; gap: 6px;
  padding: 8px 18px; border-radius: 9px; border: none;
  background: transparent; font-size: 13px; font-weight: 700; color: #64748b;
  cursor: pointer; transition: background .2s, color .2s; font-family: inherit;
}
.tab-btn.active { background: white; color: #2563eb; box-shadow: 0 1px 6px rgba(0,0,0,.08); }
.tab-badge { background: #2563eb; color: white; font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 20px; }
.tab-btn:not(.active) .tab-badge { background: #94a3b8; }
.trabajos-controls { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.sort-group { display: flex; align-items: center; gap: 5px; }
.sort-lbl   { font-size: 11px; font-weight: 700; color: #94a3b8; white-space: nowrap; }
.sort-chip  { font-size: 11px; font-weight: 700; color: #64748b; background: #f1f5f9; border: 1.5px solid transparent; padding: 5px 10px; border-radius: 8px; cursor: pointer; font-family: inherit; transition: all .15s; white-space: nowrap; }
.sort-chip.active { background: #eff6ff; color: #2563eb; border-color: #bfdbfe; }
.view-toggle { display: flex; background: #f1f5f9; border-radius: 9px; padding: 3px; gap: 2px; }
.vt-btn { display: flex; align-items: center; justify-content: center; width: 30px; height: 28px; border: none; background: transparent; border-radius: 7px; cursor: pointer; color: #94a3b8; transition: all .15s; }
.vt-btn.active { background: white; color: #2563eb; box-shadow: 0 1px 4px rgba(0,0,0,.08); }

/* ── Jobs grid ── */
.jobs-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; align-items: start; }
@media (max-width: 900px) { .jobs-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 480px) { .jobs-grid { grid-template-columns: 1fr; } }

/* ── Job card ── */
.job-card { background: white; border: 1.5px solid #e2e8f0; border-radius: 16px; padding: 16px; position: relative; transition: box-shadow .2s; }
.job-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,.07); }
.job-card.completed { border-color: #bbf7d0; background: #f0fdf4; }
.card-top-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
.job-id-badge { font-size: 11px; font-weight: 800; color: #94a3b8; }
.status-pill { font-size: 10px; font-weight: 800; letter-spacing: .5px; text-transform: uppercase; padding: 3px 9px; border-radius: 6px; }
.status-pill.accepted  { background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; }
.status-pill.completed { background: #dcfce7; color: #166534; border: 1px solid #86efac; }
.card-body-cols { display: flex; gap: 12px; align-items: center; }
.card-body-left { flex: 1; min-width: 0; }
.card-body-right { flex-shrink: 0; display: flex; align-items: center; }
.job-head { display: flex; align-items: center; gap: 8px; }
.svc-icon { width: 28px; height: 28px; border-radius: 8px; background: #eff6ff; display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: #2563eb; }
.job-svc  { font-size: 13px; font-weight: 800; color: #0f172a; line-height: 1.3; }
.job-budget { font-weight: 800; font-size: 16px; color: #2563eb; margin: 4px 0; }
.job-desc { font-size: 12px; color: #64748b; line-height: 1.5; margin: 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.job-chips { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 6px; }
.chip { display: inline-flex; align-items: center; gap: 4px; font-size: 10px; font-weight: 600; color: #64748b; background: #f8fafc; border: 1px solid #e2e8f0; padding: 3px 8px; border-radius: 6px; white-space: nowrap; }
.chip-virtual { background: #f0fdf4; border-color: #bbf7d0; color: #15803d; }
.job-divider { height: 1px; background: #e2e8f0; margin: 10px 0; }
.trabajos-client-info  { display: flex; align-items: center; gap: 8px; }
.trabajos-client-avatar { width: 28px; height: 28px; border-radius: 7px; background: #e0e7ff; color: #3730a3; font-size: 10px; font-weight: 800; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.trabajos-client-avatar.sm { width: 22px; height: 22px; font-size: 9px; border-radius: 5px; }
.trabajos-client-name  { font-size: 12px; font-weight: 600; color: #334155; display: block; }
.trabajos-client-phone { font-size: 10px; color: #64748b; }
.card-actions { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 12px; }
.btn-chat-job { position: relative; background: #f0fdf4; color: #15803d; border: 1px solid #86efac; padding: 7px 13px; border-radius: 10px; font-size: 12px; font-weight: 600; cursor: pointer; transition: background .15s; display: inline-flex; align-items: center; gap: 5px; font-family: inherit; }
.btn-chat-job:hover { background: #dcfce7; }
.chat-unread-badge { display: inline-flex; align-items: center; justify-content: center; background: #ef4444; color: #fff; font-size: 10px; font-weight: 800; min-width: 18px; height: 18px; border-radius: 9px; padding: 0 4px; }
.btn-evidence-job { background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; padding: 8px 12px; border-radius: 10px; font-size: 12px; font-weight: 700; cursor: pointer; font-family: inherit; }
.btn-complete-job { background: linear-gradient(135deg, #1d4ed8, #2563eb); color: white; border: none; padding: 9px 16px; border-radius: 10px; font-size: 12px; font-weight: 700; cursor: pointer; font-family: inherit; }
.btn-view-ev-job  { background: #f0fdf4; color: #166534; border: 1px solid #86efac; padding: 8px 12px; border-radius: 10px; font-size: 12px; font-weight: 700; cursor: pointer; font-family: inherit; }
.btn-rate-client-job { background: #fefce8; color: #92400e; border: 1px solid #fde68a; padding: 7px 12px; border-radius: 10px; font-size: 12px; font-weight: 700; cursor: pointer; font-family: inherit; }
.rated-badge-job { font-size: 11px; font-weight: 700; color: #166534; background: #f0fdf4; border: 1px solid #86efac; padding: 5px 10px; border-radius: 8px; }

/* ── List view ── */
.list-view-jobs { display: flex; flex-direction: column; gap: 4px; }
.list-header-jobs { display: grid; grid-template-columns: 2fr 1fr 1.2fr 0.8fr 1fr 0.7fr 28px; gap: 8px; padding: 6px 14px; font-size: 10px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: .5px; }
.list-item-wrap-job { display: flex; flex-direction: column; }
.list-row-job { display: grid; grid-template-columns: 2fr 1fr 1.2fr 0.8fr 1fr 0.7fr 28px; gap: 8px; align-items: center; padding: 10px 14px; background: white; border: 1.5px solid #f1f5f9; border-radius: 12px; cursor: pointer; transition: box-shadow .15s, border-color .15s; }
.list-row-job:hover { box-shadow: 0 2px 10px rgba(0,0,0,.06); border-color: #e2e8f0; }
.list-row-job.is-expanded { border-color: #bfdbfe; border-bottom-left-radius: 0; border-bottom-right-radius: 0; }
.lr-svc { display: flex; align-items: center; gap: 8px; min-width: 0; }
.lr-icon { width: 26px; height: 26px; border-radius: 7px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.lr-icon.accepted { background: #eff6ff; color: #2563eb; }
.lr-icon.completed { background: #dcfce7; color: #15803d; }
.lr-id { font-size: 10px; font-weight: 700; color: #94a3b8; margin-left: 5px; }
.lr-name { font-size: 12px; font-weight: 700; color: #0f172a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.lr-mini-desc { font-size: 10px; color: #94a3b8; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.lr-date { display: flex; flex-direction: column; gap: 1px; font-size: 11px; color: #475569; font-weight: 600; }
.lr-time { font-size: 10px; color: #94a3b8; font-weight: 400; }
.lr-addr { font-size: 11px; color: #64748b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.lr-budget { font-size: 13px; font-weight: 800; color: #2563eb; }
.lr-client { display: flex; align-items: center; gap: 6px; min-width: 0; }
.lr-client-name { font-size: 11px; font-weight: 600; color: #334155; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.lr-pill-job { font-size: 9px; font-weight: 800; letter-spacing: .4px; text-transform: uppercase; padding: 3px 7px; border-radius: 5px; white-space: nowrap; }
.lr-pill-job.accepted  { background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; }
.lr-pill-job.completed { background: #dcfce7; color: #166534; border: 1px solid #86efac; }
.lr-arrow-job { display: flex; align-items: center; justify-content: center; color: #94a3b8; transition: transform .2s; }
.lr-arrow-job.open { transform: rotate(180deg); }
.row-detail-job { background: #f8fafc; border: 1.5px solid #bfdbfe; border-top: none; border-bottom-left-radius: 12px; border-bottom-right-radius: 12px; padding: 12px 14px; overflow: hidden; }
.rd-desc { font-size: 12px; color: #475569; line-height: 1.5; margin: 0 0 10px; }
.rd-actions { display: flex; gap: 8px; flex-wrap: wrap; }
@media (max-width: 860px) { .hide-sm { display: none !important; } .list-header-jobs, .list-row-job { grid-template-columns: 2fr 1fr 0.8fr 0.7fr 28px; } }
@media (max-width: 480px) { .list-header-jobs, .list-row-job { grid-template-columns: 2fr 1fr 0.7fr 28px; } .trabajos-top-bar { flex-direction: column; align-items: flex-start; } }

/* ── Pagination ── */
.trabajos-pagination { display: flex; align-items: center; justify-content: center; gap: 8px; padding-top: 4px; }
.pg-btn { font-size: 12px; font-weight: 700; color: #2563eb; background: #eff6ff; border: 1.5px solid #bfdbfe; padding: 7px 14px; border-radius: 9px; cursor: pointer; font-family: inherit; transition: background .15s; white-space: nowrap; }
.pg-btn:disabled { opacity: .35; cursor: not-allowed; }
.pg-btn:not(:disabled):hover { background: #dbeafe; }
.pg-numbers { display: flex; gap: 4px; }
.pg-num { width: 32px; height: 32px; border-radius: 8px; border: 1.5px solid #e2e8f0; background: white; font-size: 12px; font-weight: 700; color: #64748b; cursor: pointer; font-family: inherit; transition: all .15s; }
.pg-num.active { background: #2563eb; border-color: #2563eb; color: white; }
.pg-num:not(.active):hover { background: #f8fafc; border-color: #cbd5e1; }

/* ── Modal overlay fullscreen ── */
.modal-overlay-full { position: fixed; inset: 0; background: rgba(0,0,0,.45); display: flex; justify-content: center; align-items: flex-end; z-index: 999; }
.modal-center { align-items: center !important; }

/* ── Modal código ── */
.modal-code { background: white; width: 100%; max-width: 360px; border-radius: 20px 20px 0 0; padding: 28px 24px; animation: slideUp .25s ease; }
@keyframes slideUp { from{transform:translateY(60px);opacity:0} to{transform:translateY(0);opacity:1} }
.modal-code-header { display: flex; gap: 14px; align-items: flex-start; margin-bottom: 24px; }
.code-icon { font-size: 28px; width: 48px; height: 48px; background: #eff6ff; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.modal-code-header h3 { font-size: 16px; font-weight: 800; margin: 0 0 4px; color: #0f172a; }
.modal-code-header p  { font-size: 12px; color: #64748b; margin: 0; line-height: 1.4; }
.code-inputs { display: flex; gap: 8px; justify-content: center; margin-bottom: 8px; }
.digit-input { width: 44px; height: 54px; border: 2px solid #e2e8f0; border-radius: 12px; text-align: center; font-size: 22px; font-weight: 800; color: #1e293b; font-family: inherit; transition: border-color .2s, box-shadow .2s; outline: none; background: #f8fafc; }
.digit-input:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,.1); background: white; }
.digit-input.filled { border-color: #2563eb; background: #eff6ff; color: #1d4ed8; }
.code-error { text-align: center; font-size: 12px; font-weight: 600; color: #dc2626; margin: 4px 0 12px; min-height: 18px; }
.modal-code-actions { display: flex; gap: 8px; margin-top: 16px; }
.btn-cancel-code { flex: 1; padding: 12px; border: 1.5px solid #e2e8f0; background: white; border-radius: 10px; font-size: 14px; font-weight: 700; color: #64748b; cursor: pointer; font-family: inherit; }
.btn-verify-code { flex: 2; padding: 12px; background: linear-gradient(135deg, #1d4ed8, #2563eb); color: white; border: none; border-radius: 10px; font-size: 14px; font-weight: 700; cursor: pointer; font-family: inherit; transition: opacity .15s; }
.btn-verify-code:disabled { opacity: .45; cursor: not-allowed; }

/* ── Modal evidencias ── */
.modal-evidence { background: white; width: 100%; max-width: 480px; border-radius: 20px 20px 0 0; padding: 20px; max-height: 85vh; overflow-y: auto; animation: slideUp .25s ease; }
.modal-ev-header-row { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; }
.modal-ev-header-row h3 { font-size: 16px; font-weight: 800; margin: 0 0 3px; }
.modal-ev-header-row p  { font-size: 12px; color: #64748b; margin: 0; }
.btn-modal-close-ev { background: #f1f5f9; border: none; width: 32px; height: 32px; border-radius: 8px; font-size: 14px; cursor: pointer; flex-shrink: 0; }
.evidences-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(110px, 1fr)); gap: 10px; margin-bottom: 16px; }
.evidence-item { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 8px; text-align: center; }
.ev-preview { width: 100%; height: 80px; object-fit: cover; border-radius: 6px; margin-bottom: 6px; }
.ev-file-icon { font-size: 32px; margin-bottom: 6px; }
.ev-note  { font-size: 11px; color: #475569; margin: 0 0 3px; }
.ev-date  { font-size: 10px; color: #94a3b8; }
.no-evidences { font-size: 13px; color: #94a3b8; text-align: center; padding: 16px 0; }
.upload-section { border-top: 1px solid #f1f5f9; padding-top: 16px; display: flex; flex-direction: column; gap: 10px; }
.upload-title { font-size: 13px; font-weight: 700; color: #334155; margin: 0; }
.file-drop-ev { display: flex; align-items: center; justify-content: center; border: 2px dashed #cbd5e1; border-radius: 12px; padding: 20px; cursor: pointer; font-size: 13px; color: #64748b; transition: border-color .2s, background .2s; text-align: center; }
.file-drop-ev:hover { border-color: #2563eb; background: #eff6ff; }
.file-drop-ev.has-file { border-color: #22c55e; background: #f0fdf4; }
.file-selected-ev { color: #15803d; font-weight: 700; }
.note-input-ev { width: 100%; padding: 10px 12px; border: 1.5px solid #e2e8f0; border-radius: 10px; font-size: 13px; font-family: inherit; color: #334155; resize: none; box-sizing: border-box; transition: border-color .2s; outline: none; }
.note-input-ev:focus { border-color: #2563eb; }
.btn-upload-ev { background: linear-gradient(135deg, #1d4ed8, #2563eb); color: white; border: none; padding: 12px; border-radius: 10px; font-size: 14px; font-weight: 700; cursor: pointer; font-family: inherit; transition: opacity .15s; }
.btn-upload-ev:disabled { opacity: .5; cursor: not-allowed; }

/* ── Modal calificación ── */
.modal-rating { background: white; width: 90%; max-width: 460px; border-radius: 24px; box-shadow: 0 24px 60px rgba(0,0,0,.2); animation: scaleIn .22s cubic-bezier(.34,1.4,.64,1); overflow: hidden; }
.rating-body  { padding: 20px 28px 28px; display: flex; flex-direction: column; align-items: center; gap: 14px; }
.stars-row    { display: flex; gap: 10px; justify-content: center; }
.star-btn { font-size: 44px; background: none; border: none; color: #e2e8f0; cursor: pointer; padding: 0; transition: color .15s, transform .12s; line-height: 1; }
.star-btn.filled { color: #f59e0b; }
.star-btn:hover  { transform: scale(1.2); color: #fbbf24; }
.stars-label { font-size: 14px; font-weight: 700; color: #f59e0b; min-height: 20px; margin: 0; text-align: center; }
.rating-comment { width: 100%; padding: 11px 14px; border-radius: 12px; border: 1.5px solid #e2e8f0; font-size: 14px; font-family: inherit; color: #0f172a; resize: none; outline: none; box-sizing: border-box; transition: border-color .15s; }
.rating-comment:focus { border-color: #f59e0b; }
.btn-submit-rating { width: 100%; padding: 14px; background: linear-gradient(135deg, #d97706, #f59e0b); color: white; border: none; border-radius: 12px; font-size: 15px; font-weight: 800; cursor: pointer; font-family: inherit; transition: opacity .15s, transform .15s; }
.btn-submit-rating:hover:not(:disabled) { opacity: .9; transform: translateY(-1px); }
.btn-submit-rating:disabled { opacity: .45; cursor: not-allowed; }
</style>

<style>
/* ── Leaflet marker global (fuera de scoped) ── */
.client-marker { position: relative; width: 30px; height: 30px; }
.client-core {
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 26px; height: 26px;
  background: #f59e0b; border: 2.5px solid white; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  z-index: 2; box-shadow: 0 2px 8px rgba(245,158,11,.45);
}
.client-ring {
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%,-50%);
  width: 44px; height: 44px;
  background: rgba(245,158,11,.25); border-radius: 50%;
  animation: clientPulse 1.8s ease-out infinite; z-index: 1;
}
@keyframes clientPulse {
  0%   { transform: translate(-50%,-50%) scale(.5); opacity: 1; }
  100% { transform: translate(-50%,-50%) scale(2.2); opacity: 0; }
}
/* Fix z-index conflicto Leaflet dentro del panel */
.leaflet-pane, .leaflet-top, .leaflet-bottom { z-index: 1 !important; }

/* ══════════════════════════════════════════════════════
   DARK MODE — Clases CSS custom de ProfPanel
   ══════════════════════════════════════════════════════ */

/* Tab bar */
html.dark .prp-root .tab-bar { background: rgba(255,255,255,0.06) !important; }
html.dark .prp-root .tab-btn { color: rgba(255,255,255,0.45); }
html.dark .prp-root .tab-btn.active { background: rgba(255,255,255,0.12) !important; color: #93c5fd !important; box-shadow: 0 1px 4px rgba(0,0,0,0.3); }
html.dark .prp-root .tab-badge { background: #2563eb; }
html.dark .prp-root .tab-btn:not(.active) .tab-badge { background: rgba(255,255,255,0.2); }

/* Sort chips */
html.dark .prp-root .sort-chip { background: rgba(255,255,255,0.07) !important; color: rgba(255,255,255,0.55); border-color: transparent; }
html.dark .prp-root .sort-chip.active { background: rgba(37,99,235,0.2) !important; color: #93c5fd !important; border-color: rgba(37,99,235,0.4); }

/* View toggle */
html.dark .prp-root .view-toggle { background: rgba(255,255,255,0.07) !important; }
html.dark .prp-root .vt-btn { color: rgba(255,255,255,0.4); }
html.dark .prp-root .vt-btn.active { background: rgba(255,255,255,0.14) !important; color: #93c5fd !important; }

/* Job cards */
html.dark .prp-root .job-card { background: #1e293b !important; border-color: rgba(255,255,255,0.1) !important; }
html.dark .prp-root .job-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.4); }
html.dark .prp-root .job-card.completed { background: rgba(16,185,129,0.08) !important; border-color: rgba(16,185,129,0.25) !important; }
html.dark .prp-root .job-id-badge { color: rgba(255,255,255,0.35); }
html.dark .prp-root .job-svc { color: #f1f5f9 !important; }
html.dark .prp-root .job-budget { color: #93c5fd !important; }
html.dark .prp-root .job-desc { color: rgba(255,255,255,0.5) !important; }
html.dark .prp-root .svc-icon { background: rgba(37,99,235,0.15) !important; }

/* Chips */
html.dark .prp-root .chip { background: rgba(255,255,255,0.06) !important; border-color: rgba(255,255,255,0.1) !important; color: rgba(255,255,255,0.5); }
html.dark .prp-root .chip-virtual { background: rgba(16,185,129,0.1) !important; border-color: rgba(16,185,129,0.25) !important; color: #34d399; }

/* Status pills */
html.dark .prp-root .status-pill.accepted  { background: rgba(29,78,216,0.2)  !important; color: #93c5fd !important; border-color: rgba(29,78,216,0.35) !important; }
html.dark .prp-root .status-pill.completed { background: rgba(22,101,52,0.2)  !important; color: #86efac !important; border-color: rgba(22,101,52,0.35) !important; }

/* Req-header title */
html.dark .prp-root .req-title { color: #f1f5f9 !important; }

/* Sort label */
html.dark .prp-root .sort-lbl { color: rgba(255,255,255,0.35); }

/* ── Trabajos tabs bar (fix: clase real es .trabajos-tabs, no .tab-bar) ── */
html.dark .prp-root .trabajos-tabs { background: rgba(255,255,255,0.06) !important; }

/* ── Request cards (Solicitudes disponibles) ── */
html.dark .prp-root .request-card { background: #1e293b !important; border-color: rgba(255,255,255,0.1) !important; }
html.dark .prp-root .request-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.4) !important; }
html.dark .prp-root .request-new { border-color: #3b82f6 !important; box-shadow: 0 0 0 3px rgba(59,130,246,0.1) !important; }
html.dark .prp-root .new-badge { background: rgba(37,99,235,0.2) !important; color: #93c5fd !important; border-color: rgba(37,99,235,0.35) !important; }
html.dark .prp-root .service-icon-wrap { background: rgba(37,99,235,0.15) !important; }
html.dark .prp-root .request-service { color: #f1f5f9 !important; }
html.dark .prp-root .request-description { color: rgba(255,255,255,0.6) !important; }
html.dark .prp-root .meta-chip { background: rgba(255,255,255,0.07) !important; border-color: rgba(255,255,255,0.1) !important; color: rgba(255,255,255,0.55) !important; }
html.dark .prp-root .chip-people { background: rgba(37,99,235,0.15) !important; border-color: rgba(37,99,235,0.3) !important; color: #93c5fd !important; }
html.dark .prp-root .request-divider { background: rgba(255,255,255,0.07) !important; }
html.dark .prp-root .req-client-avatar { background: rgba(55,48,163,0.3) !important; color: #a5b4fc !important; }
html.dark .prp-root .req-client-name { color: rgba(255,255,255,0.75) !important; }
html.dark .prp-root .btn-distance { background: rgba(6,182,212,0.12) !important; color: #22d3ee !important; border-color: rgba(6,182,212,0.25) !important; }
html.dark .prp-root .btn-detail { background: rgba(99,102,241,0.12) !important; color: #a5b4fc !important; border-color: rgba(99,102,241,0.25) !important; }

/* ── Modal detalle solicitud ── */
html.dark .prp-root .modal-pro { background: #1e293b !important; }
html.dark .prp-root .service-tag { color: rgba(255,255,255,0.5) !important; }
html.dark .prp-root .info-card-req { background: rgba(255,255,255,0.06) !important; }
html.dark .prp-root .info-card-req span { color: rgba(255,255,255,0.45) !important; }
html.dark .prp-root .info-card-req p { color: rgba(255,255,255,0.8) !important; }
html.dark .prp-root .mini-card-req { background: rgba(99,102,241,0.12) !important; }
html.dark .prp-root .btn-modal-cerrar { background: rgba(255,255,255,0.1) !important; color: rgba(255,255,255,0.7) !important; }
</style>

<script setup>
import { ref, reactive, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'
import professionalService from '@/services/professionalService'
import categoryService from '@/services/categoryService'
import chatService from '@/services/chatService'
import api from '@/services/api'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import AppSidebar from '../components/AppSidebar.vue'
import StatCard   from '../components/StatCard.vue'
import ChatModal  from '../components/ChatModal.vue'

const emit = defineEmits(['logout'])
const authStore   = useAuthStore()
const themeStore  = useThemeStore()
const isDark      = computed(() => themeStore.isDark)
const firstName   = computed(() => authStore.user?.name?.split(' ')[0] ?? 'Profesional')
const fullName    = computed(() => authStore.user?.name ?? 'Profesional')
const userInitial = computed(() => (authStore.user?.name ?? 'P')[0].toUpperCase())

// ─── Toast ───────────────────────────────────────────────────────────────────
const toasts  = ref([])
let toastSeq  = 0
const showToast = (message, type = 'info') => {
  const id = ++toastSeq
  toasts.value.push({ id, message, type })
  setTimeout(() => { toasts.value = toasts.value.filter(t => t.id !== id) }, 3500)
}

const page              = ref('Inicio')
const mobileSidebarOpen = ref(false)
const available         = ref(true)
const msgText    = ref('')
const activeConv = ref(null)

const today = new Date().toLocaleDateString('es-CO', { weekday:'long', year:'numeric', month:'long', day:'numeric' })

const SVG = {
  home:   `<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>`,
  card:   `<rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>`,
  svc:    `<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>`,
  cal:    `<rect width="18" height="18" x="3" y="4" rx="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="11" y2="11"/>`,
  calDot: `<rect width="18" height="18" x="3" y="4" rx="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="11" y2="11"/><circle cx="8" cy="16" r="1" fill="currentColor"/><circle cx="12" cy="16" r="1" fill="currentColor"/><circle cx="16" cy="16" r="1" fill="currentColor"/>`,
  msg:    `<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>`,
  money:  `<line x1="12" x2="12" y1="1" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>`,
  chart:  `<line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/>`,
  set:    `<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>`,
  help:   `<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>`,
  star:   `<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>`,
  check:  `<polyline points="20 6 9 17 4 12"/>`,
  trend:  `<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>`,
  drop:   `<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>`,
  scis:   `<circle cx="6" cy="6" r="3"/><circle cx="18" cy="18" r="3"/><line x1="20" x2="4" y1="4" y2="20"/>`,
  book:   `<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/>`,
  tool:   `<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>`,
  clock:  `<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>`,
  bell:   `<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>`,
  prof:   `<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/>`,
}

const totalUnreadMessages = computed(() => Object.values(unreadChats.value).reduce((s, n) => s + n, 0))

// ── Notificaciones panel ──────────────────────────────────────────────────────
const notifPanelOpen = ref(false)
const notifBtnRef    = ref(null)
const notifItems     = computed(() =>
  Object.entries(unreadChats.value)
    .filter(([, count]) => count > 0)
    .map(([jobId, count]) => {
      const job = jobs.value.find(j => j.id === Number(jobId))
      return {
        jobId:       Number(jobId),
        job:         job ?? { id: Number(jobId) },
        count,
        clientName:  job?.client_name  ?? 'Cliente',
        serviceName: job?.service_name ?? 'Solicitud #' + jobId,
      }
    })
)
const onNotifOutside = (e) => {
  if (notifBtnRef.value && !notifBtnRef.value.contains(e.target)) notifPanelOpen.value = false
}

// ── Rating del profesional ────────────────────────────────────────────────────
const profAvgRating   = ref(0)
const profReviewCount = ref(0)

const navItems = computed(() => [
  { name:'Inicio',              label:'Inicio',    iconSvg: SVG.home   },
  { name:'Perfil profesional',  label:'Perfil',    iconSvg: SVG.prof   },
  { name:'Mis servicios',       label:'Servicios', iconSvg: SVG.svc    },
  { name:'Mis Trabajos',        label:'Trabajos',  iconSvg: SVG.cal,   badge: totalUnreadMessages.value || undefined },
  { name:'Calendario',          label:'Calendario',iconSvg: SVG.calDot },
  { divider: true },
  { name:'Mis ingresos',        label:'Ingresos',  iconSvg: SVG.money  },
  { name:'Datos de pago',       label:'D. Pago',   iconSvg: SVG.card ?? `<rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>` },
  { name:'Estadísticas',        label:'Stats',     iconSvg: SVG.chart  },
  { divider: true },
  { name:'Configuración',       label:'Ajustes',   iconSvg: SVG.set    },
  { name:'Ayuda',               label:'Ayuda',     iconSvg: SVG.help   },
])

const stats = reactive([
  { label:'Reservas hoy',     value:'5',        iconSvg: SVG.cal,   iconBg:'bg-purple-50', iconColor:'#7c3aed', trend:20 },
  { label:'Ingresos hoy',     value:'$320.000', iconSvg: SVG.money, iconBg:'bg-blue-50',   iconColor:'#2563ff', trend:15 },
  { label:'Servicios activos',value:'8',        iconSvg: SVG.svc,   iconBg:'bg-teal-50',   iconColor:'#0891b2', link:'Ver mis servicios' },
  { label:'Total reseñas',    value:'4.9',      iconSvg: SVG.star,  iconBg:'bg-amber-50',  iconColor:'#f59e0b', link:'Ver reseñas' },
])

// ─── Available requests ───────────────────────────────────────────────────────
const availableRequests = ref([])
let availPollTimer  = null
let heartbeatTimer  = null
let unreadPollTimer = null
const unreadChats   = ref({})

// ─── Mapa Leaflet ─────────────────────────────────────────────────────────────
const mapRef        = ref(null)
const reqLoading    = ref(true)
const accepting     = ref(null)
const showDetailsModal = ref(false)
const selectedRequest  = ref(null)
let mapInstance     = null
let mapMarkers      = []
let routeLayer      = null
let mapPrevIds      = []
let cityCenter      = { lat: 4.7110, lng: -74.0721 }
const myLocation    = ref(null)

const subtitleText = computed(() => {
  const n = availableRequests.value.length
  if (n > 0) return n + ' solicitud' + (n > 1 ? 'es' : '') + ' cerca tuyo'
  return 'Tu zona y servicio'
})

const getInitials = (name = '') =>
  (name || '?').split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()

const getMyLocation = () => {
  if (!navigator.geolocation) return
  navigator.geolocation.getCurrentPosition(
    (pos) => { myLocation.value = { lat: pos.coords.latitude, lng: pos.coords.longitude } },
    () => { /* silencioso */ }
  )
}

const createClientIcon = () => L.divIcon({
  className: '',
  html: `<div class="client-marker"><div class="client-ring"></div><div class="client-core"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" width="12" height="12"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div></div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 15],
})

const initMap = async () => {
  if (!mapRef.value) return
  if (mapInstance) { mapInstance.remove(); mapInstance = null }
  try {
    const profile = await api.get('/professional/dashboard')
    const cityId  = profile.data?.professional?.city_id
    if (cityId) {
      const res  = await api.get(`/cities/${cityId}`)
      const city = res.data
      cityCenter = { lat: city.lat || 4.7110, lng: city.lng || -74.0721 }
    }
  } catch { /* usar defecto */ }
  mapInstance = L.map(mapRef.value, { zoomControl: false }).setView([cityCenter.lat, cityCenter.lng], 13)
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '© CARTO', subdomains: 'abcd', maxZoom: 19
  }).addTo(mapInstance)
  L.control.zoom({ position: 'bottomright' }).addTo(mapInstance)
  setTimeout(() => { if (mapInstance) mapInstance.invalidateSize() }, 300)
}

const drawRoute = async (from, to) => {
  try {
    if (routeLayer && mapInstance) mapInstance.removeLayer(routeLayer)
    const url = `https://router.project-osrm.org/route/v1/driving/${from.lng},${from.lat};${to.lng},${to.lat}?overview=full&geometries=geojson`
    const res  = await fetch(url, { headers: { Accept: 'application/json' } })
    if (!res.ok) { showToast(`Error OSRM: ${res.status}`, 'error'); return }
    const data  = await res.json()
    const route = data.routes[0].geometry
    routeLayer  = L.geoJSON(route, { style: { color: '#2563eb', weight: 5, opacity: 0.9 } }).addTo(mapInstance)
    mapInstance.fitBounds(routeLayer.getBounds())
  } catch { showToast('No se pudo trazar la ruta', 'error') }
}

const getCoordsFromAddress = async (address, city) => {
  try {
    const res  = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address + ', ' + (city || 'Colombia'))}`)
    const data = await res.json()
    if (data.length > 0) return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }
    return null
  } catch { return null }
}

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R    = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a    = Math.sin(dLat/2)*Math.sin(dLat/2) +
               Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)*Math.sin(dLon/2)
  return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))).toFixed(2)
}

const viewDistance = async (req) => {
  if (!myLocation.value) { showToast('Ubicación no disponible — activa el GPS', 'error'); return }
  let lat = req.lat; let lng = req.lng
  if (!lat || !lng) {
    if (!req.address) { showToast('Servicio virtual — sin ubicación física', 'error'); return }
    const coords = await getCoordsFromAddress(req.address, req.city_name)
    if (!coords) { showToast('No se pudo ubicar la dirección', 'error'); return }
    lat = coords.lat; lng = coords.lng
  }
  const dist = calculateDistance(myLocation.value.lat, myLocation.value.lng, lat, lng)
  showToast(`Distancia: ${dist} km`, 'success')
  drawRoute(myLocation.value, { lat, lng })
}

const openReqDetails = (req) => {
  selectedRequest.value = req
  showDetailsModal.value = true
}

const viewRouteFromModal = (req) => {
  showDetailsModal.value = false
  viewDistance(req)
}

const loadAvailableRequests = async () => {
  try {
    const res = await api.get('/professional/requests/available')
    const newData = res.data
    const newIds  = newData.map(r => r.id)
    const addedIds = newIds.filter(id => !mapPrevIds.includes(id))
    newData.forEach(r => { r.isNew = addedIds.includes(r.id) })
    mapPrevIds = newIds
    if (Array.isArray(newData)) availableRequests.value = newData

    if (mapInstance) {
      mapMarkers.forEach(m => mapInstance.removeLayer(m))
      mapMarkers = []
      newData.forEach(req => {
        const lat = req.lat || cityCenter.lat
        const lng = req.lng || cityCenter.lng
        const marker = L.marker([lat, lng], { icon: createClientIcon() })
          .addTo(mapInstance)
          .bindPopup(`<div style="min-width:140px;font-family:inherit"><strong style="font-size:13px">${req.service_name || 'Servicio'}</strong><br><strong style="color:#2563eb;font-size:14px">$${Number(req.budget).toLocaleString('es-CO')}</strong></div>`)
        mapMarkers.push(marker)
      })
    }
  } catch { /* ignore */ }
  finally { reqLoading.value = false }
}

const acceptAvailable = async (req) => {
  try {
    accepting.value = req.id
    await api.post(`/professional/requests/${req.id}/accept`)
    availableRequests.value = availableRequests.value.filter(r => r.id !== req.id)
    showToast('✓ Solicitud aceptada — contacta al cliente', 'success')
    await loadJobs()
  } catch (e) {
    if (e.response?.status === 404) {
      showToast('Esta solicitud ya fue tomada por otro profesional', 'error')
      loadAvailableRequests()
    } else {
      showToast('Error al aceptar la solicitud', 'error')
    }
  } finally { accepting.value = null }
}

const acceptRequest = async (id) => {
  try {
    await api.post(`/professional/requests/${id}/accept`)
    availableRequests.value = availableRequests.value.filter(r => r.id !== id)
    showToast('Solicitud aceptada correctamente', 'success')
    await loadAcceptedRequests()
  } catch { showToast('Error al aceptar la solicitud', 'error') }
}

// ─── Mis Trabajos ─────────────────────────────────────────────────────────────
const trabajosTabs        = [{ key: 'accepted', label: 'En curso' }, { key: 'completed', label: 'Completados' }]
const trabajosTab         = ref('accepted')
const trabajosView        = ref('grid')
const trabajosSort        = ref('recent')
const trabajosPage        = ref(1)
const expandedJobId       = ref(null)
const trabajosLoading     = ref(true)
const jobs                = ref([])
const jobChatRequest      = ref(null)
const chatModalOpen       = ref(false)
const jobEvidences        = ref([])
const selectedJobForEvid  = ref(null)
const ratingClientName    = ref('')

const trabajosSortOptions = [
  { key: 'recent', label: 'Más recientes' },
  { key: 'date',   label: 'Por fecha' },
  { key: 'name',   label: 'Alfabéticamente' },
]

const countByTrabajosTab  = (key) => jobs.value.filter(j => j.status === key).length
const trabajosStatusLabel = (s) => ({ accepted: 'En curso', completed: 'Completado' }[s] || s)
const starLabel           = (n) => ['', 'Muy malo', 'Regular', 'Bueno', 'Muy bueno', 'Excelente'][n] || ''

const trabajosFiltered = computed(() => jobs.value.filter(j => j.status === trabajosTab.value))
const trabajosSorted   = computed(() => {
  const arr = [...trabajosFiltered.value]
  if (trabajosSort.value === 'name') return arr.sort((a, b) => a.service_name.localeCompare(b.service_name))
  if (trabajosSort.value === 'date') return arr.sort((a, b) => new Date(a.service_date) - new Date(b.service_date))
  return arr.sort((a, b) => b.id - a.id)
})
const trabajosPerPage    = computed(() => trabajosView.value === 'grid' ? 6 : 10)
const trabajosTotalPages = computed(() => Math.max(1, Math.ceil(trabajosSorted.value.length / trabajosPerPage.value)))
const trabajosPaginated  = computed(() => {
  const start = (trabajosPage.value - 1) * trabajosPerPage.value
  return trabajosSorted.value.slice(start, start + trabajosPerPage.value)
})

const setTrabajosTab  = (key)  => { trabajosTab.value = key; trabajosPage.value = 1; expandedJobId.value = null }
const setTrabajosSort = (key)  => { trabajosSort.value = key; trabajosPage.value = 1 }
const setTrabajosView = (mode) => { trabajosView.value = mode; trabajosPage.value = 1; expandedJobId.value = null }
const toggleJobExpand = (id)   => { expandedJobId.value = expandedJobId.value === id ? null : id }

const openJobChat = (job) => {
  jobChatRequest.value = job
  chatModalOpen.value  = true
}

const openJobEvidence = async (job) => {
  selectedJobForEvid.value = job
  jobEvidences.value       = []
  evidFile.value           = null
  evidNote.value           = ''
  showEvidModal.value      = true
  try {
    const res = await api.get(`/professional/requests/${job.id}/evidences`)
    jobEvidences.value = res.data
  } catch { showToast('Error al cargar evidencias', 'error') }
}

const openJobCode = (job) => {
  codeRequestId.value = job.id
  codeDigits.value    = ['', '', '', '', '', '']
  codeError.value     = ''
  showCodeModal.value = true
  setTimeout(() => { digitRefs.value[0]?.focus() }, 100)
}

const openJobRating = (job) => {
  ratingRequestId.value = job.id
  ratingClientName.value = job.client_name || 'el cliente'
  ratingScore.value     = 0
  ratingComment.value   = ''
  showRatingModal.value = true
}

const loadJobs = async () => {
  try {
    const res  = await api.get('/professional/requests/accepted')
    const list = res.data
    await Promise.all(
      list.filter(j => j.status === 'completed').map(async (j) => {
        try {
          const { data } = await api.get(`/professional/requests/${j.id}/my-rating`)
          j._rated = data.rated
        } catch { j._rated = false }
      })
    )
    jobs.value = list

    // Sync allReservations for stats
    allReservations.splice(0, allReservations.length, ...list.map(r => ({
      id:           r.id,
      client:       r.client_name  ?? '—',
      client_name:  r.client_name  ?? '—',
      client_phone: r.client_phone ?? '',
      service:      r.service_name ?? '—',
      service_name: r.service_name ?? '—',
      date:         r.service_date ? new Date(r.service_date).toLocaleDateString('es-CO') : '—',
      time:         r.service_time ?? '',
      price:        Number(r.budget ?? 0).toLocaleString('es-CO'),
      budget:       r.budget ?? 0,
      status:       r.status === 'accepted' ? 'Confirmada' : r.status === 'completed' ? 'Completada' : 'Pendiente',
      rawStatus:    r.status,
      address:      r.address ?? '',
      description:  r.description ?? '',
      service_date: r.service_date ?? '',
      service_time: r.service_time ?? '',
      people_count: r.people_count ?? 1,
      company_name: r.company_name ?? '',
      iconSvg:      SVG.check,
      iconColor:    '#10b981',
      gradient:     'linear-gradient(135deg,#d1fae5,#6ee7b7)',
    })))
    buildConvs()
  } catch { showToast('Error al cargar trabajos', 'error') }
  finally { trabajosLoading.value = false }
}

const loadAcceptedRequests = async () => {
  try {
    const { data } = await api.get('/professional/requests/accepted')
    if (Array.isArray(data)) {
      allReservations.splice(0, allReservations.length, ...data.map(r => ({
        id:           r.id,
        client:       r.client_name  ?? '—',
        client_phone: r.client_phone ?? '',
        service:      r.service_name ?? '—',
        date:         r.service_date ? new Date(r.service_date).toLocaleDateString('es-CO') : '—',
        time:         r.service_time ?? '',
        price:        Number(r.budget ?? 0).toLocaleString('es-CO'),
        status:       r.status === 'accepted' ? 'Confirmada' : r.status === 'completed' ? 'Completada' : 'Pendiente',
        rawStatus:    r.status,
        address:      r.address ?? '',
        people_count: r.people_count ?? 1,
        company_name: r.company_name ?? '',
        iconSvg:      SVG.check,
        iconColor:    '#10b981',
        gradient:     'linear-gradient(135deg,#d1fae5,#6ee7b7)',
      })))
    } else {
      allReservations.splice(0)
    }
  } catch { /* keep existing */ }
  buildConvs()
}

const loadUnreadChats = async () => {
  try {
    const { data } = await api.get('/chat/unreads')
    unreadChats.value = data ?? {}
  } catch { /* ignore */ }
}

const nextRes = computed(() =>
  availableRequests.value.slice(0, 3).map(r => ({
    id:        r.id,
    service:   r.service_name ?? '—',
    client:    r.client_name  ?? 'Cliente',
    time:      [r.service_date, r.service_time].filter(Boolean).join(' · '),
    budget:    '$' + Number(r.budget ?? 0).toLocaleString('es-CO'),
    status:    'Disponible',
    canAccept: true,
    iconSvg:   SVG.clock,
    iconColor: '#2563ff',
    gradient:  'linear-gradient(135deg,#dbeafe,#93c5fd)',
  }))
)

// SVG chart (week income)
const weekData = [100, 280, 200, 260, 230, 330, 310] // $k
const yMax = 400, lp = 52, tp = 20, W = 458, H = 140
const chartPts = weekData.map((v, i) => ({
  x: lp + (i / 6) * W,
  y: tp + (1 - v / yMax) * H,
}))
const gridY = [20, 55, 90, 125, 160]
const chartLine = chartPts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
const chartFill = chartLine + ` L${chartPts[6].x},160 L${chartPts[0].x},160 Z`

// Month chart (stats page)
const monthData = [180, 320, 280, 450, 390, 520, 480, 610, 580, 720, 650, 840]
const mlp = 64, mW = 716, mH = 140
const monthPts = monthData.map((v, i) => ({
  x: mlp + (i / 11) * mW,
  y: 20 + (1 - v / 1000) * mH,
}))
const monthLine = monthPts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
const monthFill = monthLine + ` L${monthPts[11].x},160 L${monthPts[0].x},160 Z`

const allReservations = reactive([
  { id:1, client:'María González',  service:'Limpieza',  date:'Hoy, 10am',   price:'80.000',  status:'Confirmada', iconSvg:SVG.check, iconColor:'#10b981', gradient:'linear-gradient(135deg,#d1fae5,#6ee7b7)' },
  { id:2, client:'Laura Rodríguez', service:'Manicure',  date:'Hoy, 2pm',    price:'50.000',  status:'Confirmada', iconSvg:SVG.scis,  iconColor:'#db2777', gradient:'linear-gradient(135deg,#fce7f3,#fbcfe8)' },
  { id:3, client:'Camilo Pérez',    service:'Clases',    date:'Mañana, 9am', price:'120.000', status:'Pendiente',  iconSvg:SVG.book,  iconColor:'#2563ff', gradient:'linear-gradient(135deg,#dbeafe,#93c5fd)' },
  { id:4, client:'Ana Torres',      service:'Plomería',  date:'15 May',      price:'90.000',  status:'Completada', iconSvg:SVG.drop,  iconColor:'#0ea5e9', gradient:'linear-gradient(135deg,#e0f2fe,#bae6fd)' },
])

const reservaClass = (s) => ({
  'Confirmada': 'bg-emerald-100 text-emerald-700',
  'Pendiente':  'bg-amber-100 text-amber-700',
  'Completada': 'bg-blue-100 text-blue-700',
}[s] || 'bg-slate-100 text-slate-500')

const myServices = reactive([
  { id:1, name:'Limpieza a domicilio',  category:'Limpieza',  price_raw:50000, price:'50.000', rating:'4.9', iconSvg:SVG.check, iconColor:'#10b981', gradient:'linear-gradient(135deg,#d1fae5,#6ee7b7)', active:true  },
  { id:2, name:'Manicure y pedicure',   category:'Belleza',   price_raw:35000, price:'35.000', rating:'4.8', iconSvg:SVG.scis,  iconColor:'#db2777', gradient:'linear-gradient(135deg,#fce7f3,#fbcfe8)', active:true  },
  { id:3, name:'Clases personalizadas', category:'Educación', price_raw:60000, price:'60.000', rating:'4.9', iconSvg:SVG.book,  iconColor:'#2563ff', gradient:'linear-gradient(135deg,#dbeafe,#93c5fd)', active:false },
])

// ─── My services CRUD ─────────────────────────────────────────────────────────
const showSvcModal  = ref(false)
const editingSvc    = ref(null)
const svcForm       = reactive({ name: '', description: '', price: 0, category: '', active: true })
const svcSaving     = ref(false)

const openSvcModal = (svc) => {
  editingSvc.value    = svc
  svcForm.name        = svc?.name        ?? ''
  svcForm.description = svc?.description ?? ''
  svcForm.price       = svc?.price_raw   ?? 0
  svcForm.category    = svc?.category    ?? ''
  svcForm.active      = svc?.active      ?? true
  showSvcModal.value  = true
}

const saveSvc = async () => {
  if (!svcForm.name.trim()) { showToast('El nombre es requerido', 'error'); return }
  svcSaving.value = true
  try {
    if (editingSvc.value) {
      await api.put(`/professional/services/${editingSvc.value.id}`, svcForm)
      const idx = myServices.findIndex(s => s.id === editingSvc.value.id)
      if (idx !== -1) {
        myServices[idx].name        = svcForm.name
        myServices[idx].description = svcForm.description
        myServices[idx].price_raw   = svcForm.price
        myServices[idx].price       = Number(svcForm.price).toLocaleString('es-CO')
        myServices[idx].category    = svcForm.category
        myServices[idx].active      = svcForm.active
      }
      showToast('Servicio actualizado', 'success')
    } else {
      const { data } = await api.post('/professional/services', svcForm)
      myServices.push({
        id:          data?.id ?? Date.now(),
        name:        svcForm.name,
        description: svcForm.description,
        price_raw:   svcForm.price,
        price:       Number(svcForm.price).toLocaleString('es-CO'),
        category:    svcForm.category,
        rating:      '—',
        iconSvg:     SVG.svc,
        iconColor:   '#2563ff',
        gradient:    'linear-gradient(135deg,#dbeafe,#93c5fd)',
        active:      svcForm.active,
      })
      showToast('Servicio publicado', 'success')
    }
    showSvcModal.value = false
  } catch { showToast('Error al guardar el servicio', 'error') }
  finally { svcSaving.value = false }
}

const toggleSvcStatus = async (svc) => {
  const prev = svc.active
  svc.active = !svc.active
  try {
    await api.put(`/professional/services/${svc.id}`, { active: svc.active })
    showToast(svc.active ? 'Servicio activado' : 'Servicio pausado', 'success')
  } catch { svc.active = prev; showToast('Error al cambiar estado', 'error') }
}

const convs = ref([
  { id:1, name:'María González',  initial:'M', color:'#10b981', last:'Perfecto, ahí estaré', time:'10:30', unread:2 },
  { id:2, name:'Laura Rodríguez', initial:'L', color:'#db2777', last:'Muchas gracias!',       time:'09:15', unread:1 },
  { id:3, name:'Camilo Pérez',    initial:'C', color:'#2563ff', last:'¿Puede el martes?',     time:'Ayer',  unread:0 },
])

const messages = ref([
  { id:1, text:'Hola, confirmo cita para mañana.', mine:false, time:'10:15' },
  { id:2, text:'Perfecto, ahí estaré.',            mine:true,  time:'10:18' },
  { id:3, text:'¿Trae herramientas?',              mine:false, time:'10:20' },
  { id:4, text:'Sí, llevo todo lo necesario.',     mine:true,  time:'10:22' },
  { id:5, text:'Perfecto, ahí estaré.',            mine:false, time:'10:30' },
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
        time: m.created_at ? new Date(m.created_at).toLocaleTimeString('es-CO',{hour:'2-digit',minute:'2-digit'}) : m.time ?? '',
      }))
    }
  } catch { /* ignore */ }
}

watch(activeConv, (conv) => {
  clearInterval(chatPollTimer)
  if (conv) {
    loadMessages(conv.id)
    chatPollTimer = setInterval(() => loadMessages(conv.id), 6000)
  }
})

onUnmounted(() => {
  clearInterval(chatPollTimer)
  clearInterval(availPollTimer)
  clearInterval(heartbeatTimer)
  clearInterval(unreadPollTimer)
  document.removeEventListener('click', onVerCatOutside)
  document.removeEventListener('click', onNotifOutside)
  if (mapInstance) { mapInstance.remove(); mapInstance = null }
})

watch(page, async (val) => {
  if (val === 'Inicio') {
    await nextTick()
    if (!mapInstance) {
      await initMap()
      getMyLocation()
    }
  }
})

const rawEarnings   = ref([])
const incomeHistory = reactive([
  { id:1, service:'Limpieza a domicilio',  client:'María G.',  date:'13 May 2026', amount:'$80.000'  },
  { id:2, service:'Manicure y pedicure',   client:'Laura R.',  date:'12 May 2026', amount:'$50.000'  },
  { id:3, service:'Clases personalizadas', client:'Camilo P.', date:'10 May 2026', amount:'$120.000' },
  { id:4, service:'Plomería',              client:'Ana T.',    date:'08 May 2026', amount:'$90.000'  },
])

const INCOME_MOBILE_PG = 5
const incomeMobilePage = ref(1)
const incomeMobilePagedItems = computed(() => {
  const start = (incomeMobilePage.value - 1) * INCOME_MOBILE_PG
  return incomeHistory.slice(start, start + INCOME_MOBILE_PG)
})
const incomeMobileTotalPages = computed(() => Math.ceil(incomeHistory.length / INCOME_MOBILE_PG))

// ─── Estadísticas ─────────────────────────────────────────────────────────────
// Helpers de formato y escala
const fmtAmt = (v) => {
  if (v >= 1000000) return '$' + (v / 1000000).toFixed(v % 1000000 === 0 ? 0 : 1) + 'M'
  if (v >= 1000)    return '$' + Math.round(v / 1000) + 'k'
  return '$' + Math.round(v)
}
const niceMax = (v) => {
  if (v === 0) return 500000
  const mag  = Math.pow(10, Math.floor(Math.log10(v)))
  const norm = v / mag
  const n    = norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 5 ? 5 : 10
  return n * mag
}
const buildGrid = (maxVal, rows = 5) => {
  const nice  = niceMax(maxVal)
  const step  = nice / (rows - 1)
  const ys    = Array.from({ length: rows }, (_, i) => 20 + (i / (rows - 1)) * 150)
  const lbls  = Array.from({ length: rows }, (_, i) => fmtAmt(nice - i * step))
  return { y: ys, labels: lbls, nice }
}
const buildPts = (values, nice, xMin = 64, xMax = 780, yTop = 20, yBot = 170) => {
  const n = values.length
  return values.map((v, i) => ({
    x: xMin + (i / Math.max(n - 1, 1)) * (xMax - xMin),
    y: yBot - (Math.min(v, nice) / nice) * (yBot - yTop),
  }))
}
const buildLine = (pts) => pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
const buildFill = (pts, yBot = 170) => {
  if (!pts.length) return ''
  return buildLine(pts) + ` L${pts[pts.length-1].x},${yBot} L${pts[0].x},${yBot} Z`
}

// Datos mensuales (año actual, por net_amount de completados)
const statsMonthValues = computed(() => {
  const year   = new Date().getFullYear()
  const months = Array(12).fill(0)
  rawEarnings.value.forEach(e => {
    if (!e.service_date) return
    const d = new Date(e.service_date + 'T00:00:00')
    if (d.getFullYear() !== year) return
    months[d.getMonth()] += Number(e.net_amount ?? 0)
  })
  return months
})
const statsMonthGrid = computed(() => buildGrid(Math.max(...statsMonthValues.value, 1)))
const statsMonthPts  = computed(() => buildPts(statsMonthValues.value, statsMonthGrid.value.nice))
const statsMonthLine = computed(() => buildLine(statsMonthPts.value))
const statsMonthFill = computed(() => buildFill(statsMonthPts.value))

// Datos semanales (semana actual Lun-Dom)
const statsWeekValues = computed(() => {
  const now      = new Date()
  const dow      = (now.getDay() + 6) % 7
  const monday   = new Date(now)
  monday.setDate(now.getDate() - dow)
  monday.setHours(0, 0, 0, 0)
  const days = Array(7).fill(0)
  rawEarnings.value.forEach(e => {
    if (!e.service_date) return
    const d    = new Date(e.service_date + 'T00:00:00')
    const diff = Math.round((d - monday) / 86400000)
    if (diff >= 0 && diff < 7) days[diff] += Number(e.net_amount ?? 0)
  })
  return days
})
const statsWeekGrid = computed(() => buildGrid(Math.max(...statsWeekValues.value, 1)))
const statsWeekPts  = computed(() => buildPts(statsWeekValues.value, statsWeekGrid.value.nice))
const statsWeekLine = computed(() => buildLine(statsWeekPts.value))
const statsWeekFill = computed(() => buildFill(statsWeekPts.value))

// Tooltip
const statsTooltip = reactive({ visible: false, label: '', value: '', x: 0, y: 0 })
const showStatsTip = (pt, label, val) => {
  statsTooltip.visible = true
  statsTooltip.label   = label
  statsTooltip.value   = fmtAmt(val)
  statsTooltip.x       = pt.x
  statsTooltip.y       = pt.y
}

// Resumen summary refs (populated from earnings call)
const statsTotalEarned  = computed(() => {
  const sum = rawEarnings.value.filter(e => e.status === 'completed').reduce((a, e) => a + Number(e.net_amount ?? 0), 0)
  return '$' + sum.toLocaleString('es-CO')
})
const statsTotalJobs   = computed(() => rawEarnings.value.filter(e => e.status === 'completed').length)
const statsPendingJobs = computed(() => rawEarnings.value.filter(e => e.status !== 'completed').length)

const profSummary = reactive([
  { label:'Trabajos completados', value:'—',  iconBg:'bg-blue-50',    iconColor:'#2563ff', iconSvg: SVG.check },
  { label:'Ingresos netos',       value:'—',  iconBg:'bg-emerald-50', iconColor:'#10b981', iconSvg: SVG.trend },
  { label:'Trabajos pendientes',  value:'—',  iconBg:'bg-amber-50',  iconColor:'#f59e0b', iconSvg: SVG.clock },
])

// ─── Perfil profesional / Verificación ───────────────────────────────────────
const verCategories     = ref([])
const verAllServices    = ref([])
const verCities         = ref([])
const verIsVerified     = ref(false)
const verStatus         = ref('pending')
const verPhotoPreview   = ref(null)
const verExistingFiles  = reactive({ photo: null, identity_card: null, professional_card: null, professional_title: null })
const verCatOpen        = ref(false)
const verCatSearch      = ref('')
const verCatDropdownRef = ref(null)
const verSaving         = ref(false)
const verForm = reactive({
  category_ids: [], service_ids: [], document_number: '',
  phone: '', bio: '', address: '', city_id: '',
  identity_card: null, professional_card: null, professional_title: null, photo: null,
})

const verStatusLabel = computed(() =>
  verIsVerified.value       ? 'Verificado'
  : verStatus.value === 'under_review' ? 'En revisión'
  : 'Pendiente de verificación'
)
const verDotClass = computed(() =>
  verIsVerified.value       ? 'bg-emerald-500'
  : verStatus.value === 'under_review' ? 'bg-amber-500'
  : 'bg-slate-400'
)
const verFilteredCats = computed(() =>
  verCatSearch.value
    ? verCategories.value.filter(c => c.name.toLowerCase().includes(verCatSearch.value.toLowerCase()))
    : verCategories.value
)
const verSelectedCatLabel = computed(() => {
  const n = verForm.category_ids.length
  if (n === 0) return 'Seleccionar especialidades...'
  if (n === 1) return verCategories.value.find(c => c.id === verForm.category_ids[0])?.name ?? '1 seleccionada'
  return `${n} especialidades seleccionadas`
})
const verCategoriesWithServices = computed(() =>
  verForm.category_ids
    .map(cid => {
      const cat = verCategories.value.find(c => Number(c.id) === Number(cid))
      if (!cat) return null
      return { ...cat, services: verAllServices.value.filter(s => Number(s.category_id) === Number(cid)) }
    })
    .filter(Boolean)
)

const verAllCatsSelected = computed(() =>
  verCategories.value.length > 0 && verForm.category_ids.length === verCategories.value.length
)
const toggleVerAllCategories = () => {
  if (verAllCatsSelected.value) {
    verForm.category_ids = []
    verForm.service_ids  = []
  } else {
    verForm.category_ids = verCategories.value.map(c => c.id)
    verForm.service_ids  = [...new Set(verAllServices.value.map(s => s.id))]
  }
}
const toggleVerCategory = (id) => {
  const idx = verForm.category_ids.indexOf(id)
  if (idx === -1) {
    verForm.category_ids.push(id)
    verAllServices.value
      .filter(s => Number(s.category_id) === id)
      .forEach(s => { if (!verForm.service_ids.includes(s.id)) verForm.service_ids.push(s.id) })
  } else {
    verForm.category_ids.splice(idx, 1)
    const toRemove = verAllServices.value.filter(s => Number(s.category_id) === id).map(s => s.id)
    verForm.service_ids = verForm.service_ids.filter(sid => !toRemove.includes(sid))
  }
}
const toggleVerService = (id) => {
  const idx = verForm.service_ids.indexOf(id)
  idx === -1 ? verForm.service_ids.push(id) : verForm.service_ids.splice(idx, 1)
}
const handleVerFile = (field, file) => {
  verForm[field] = file ?? null
  if (field === 'photo' && file) verPhotoPreview.value = URL.createObjectURL(file)
}
const verDocFileName = (url) => {
  if (!url) return ''
  const parts = url.split('/')
  return decodeURIComponent(parts[parts.length - 1])
}
const onVerCatOutside = (e) => {
  if (verCatDropdownRef.value && !verCatDropdownRef.value.contains(e.target)) verCatOpen.value = false
}

const loadVerProfile = async () => {
  try {
    const [catsRes, svcsRes, citiesRes, profRes] = await Promise.all([
      categoryService.getAllProfesional(),
      api.get('/services'),
      api.get('/cities'),
      api.get('/professional/dashboard'),
    ])
    if (Array.isArray(catsRes.data))   verCategories.value  = catsRes.data
    if (Array.isArray(svcsRes.data))   verAllServices.value = svcsRes.data
    if (Array.isArray(citiesRes.data)) verCities.value      = citiesRes.data

    const prof = profRes.data?.professional ?? profRes.data
    if (prof) {
      verIsVerified.value     = !!prof.is_verified
      verStatus.value         = prof.status ?? 'pending'
      verForm.document_number = prof.document_number ?? ''
      verForm.phone           = prof.phone           ?? authStore.user?.phone ?? ''
      verForm.bio             = prof.bio             ?? ''
      verForm.address         = prof.address         ?? ''
      verForm.city_id         = prof.city_id         ?? ''
      // API devuelve category_ids / service_ids como arrays planos de IDs
      verForm.category_ids = Array.isArray(prof.category_ids)
        ? prof.category_ids.map(Number)
        : Array.isArray(prof.categories)
          ? prof.categories.map(c => Number(c.id ?? c))
          : []
      verForm.service_ids = Array.isArray(prof.service_ids)
        ? prof.service_ids.map(Number)
        : Array.isArray(prof.services)
          ? prof.services.map(s => Number(s.id ?? s))
          : []

      const base = (import.meta.env.VITE_API_URL ?? '').replace('/api', '') + '/storage/'
      if (prof.photo)              verExistingFiles.photo              = base + prof.photo
      if (prof.identity_card)      verExistingFiles.identity_card      = base + prof.identity_card
      if (prof.professional_card)  verExistingFiles.professional_card  = base + prof.professional_card
      if (prof.professional_title) verExistingFiles.professional_title = base + prof.professional_title

      // Rating del dashboard si el backend lo devuelve
      if (prof.avg_rating != null)   profAvgRating.value   = Number(prof.avg_rating)
      if (prof.review_count != null) profReviewCount.value = Number(prof.review_count)
    }

    // Calcular rating desde trabajos completados si el dashboard no lo trae
    if (profAvgRating.value === 0) {
      try {
        const earningsRes = await api.get('/professional/earnings')
        const completed   = (earningsRes.data?.earnings ?? []).filter(e => e.status === 'completed')
        // El backend no devuelve scores individuales aún, pero reservamos la lógica
        if (completed.length > 0 && completed[0].score != null) {
          const sum = completed.reduce((a, e) => a + Number(e.score), 0)
          profAvgRating.value   = Math.round((sum / completed.length) * 10) / 10
          profReviewCount.value = completed.length
        }
      } catch { /* ignore */ }
    }
  } catch { /* keep defaults */ }
}

const saveVerProfile = async () => {
  verSaving.value = true
  try {
    const fd = new FormData()
    verForm.category_ids.forEach(id => fd.append('category_ids[]', id))
    verForm.service_ids.forEach(id  => fd.append('service_ids[]',  id))
    fd.append('document_number', verForm.document_number)
    fd.append('phone',           verForm.phone)
    fd.append('bio',             verForm.bio)
    fd.append('address',         verForm.address)
    fd.append('city_id',         verForm.city_id)
    if (verForm.identity_card)      fd.append('identity_card',      verForm.identity_card)
    if (verForm.professional_card)  fd.append('professional_card',  verForm.professional_card)
    if (verForm.professional_title) fd.append('professional_title', verForm.professional_title)
    if (verForm.photo)              fd.append('photo',              verForm.photo)
    await api.post('/professional/profile', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
    showToast('Perfil actualizado correctamente', 'success')
    await loadVerProfile()
  } catch { showToast('Error al guardar el perfil', 'error') }
  finally { verSaving.value = false }
}

// ─── Calendario ───────────────────────────────────────────────────────────────
const calYear  = ref(new Date().getFullYear())
const calMonth = ref(new Date().getMonth()) // 0-based

const MONTH_NAMES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
const calMonthLabel = computed(() => `${MONTH_NAMES[calMonth.value]} ${calYear.value}`)

const prevCalMonth = () => {
  if (calMonth.value === 0) { calMonth.value = 11; calYear.value-- }
  else calMonth.value--
}
const nextCalMonth = () => {
  if (calMonth.value === 11) { calMonth.value = 0; calYear.value++ }
  else calMonth.value++
}

// Genera las celdas del mes (42 slots, lunes primero)
const calCells = computed(() => {
  const y = calYear.value, m = calMonth.value
  const firstDay = new Date(y, m, 1).getDay()        // 0=Sun
  const offset   = (firstDay + 6) % 7               // Monday-first offset
  const daysInMonth  = new Date(y, m + 1, 0).getDate()
  const daysInPrev   = new Date(y, m, 0).getDate()
  const todayStr = new Date().toISOString().slice(0, 10)

  const cells = []
  const total = Math.ceil((offset + daysInMonth) / 7) * 7

  for (let i = 0; i < total; i++) {
    if (i < offset) {
      const d = daysInPrev - offset + i + 1
      cells.push({ day: d, inMonth: false, dateStr: '', isToday: false })
    } else if (i < offset + daysInMonth) {
      const d = i - offset + 1
      const dateStr = `${y}-${String(m + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`
      cells.push({ day: d, inMonth: true, dateStr, isToday: dateStr === todayStr })
    } else {
      const d = i - offset - daysInMonth + 1
      cells.push({ day: d, inMonth: false, dateStr: '', isToday: false })
    }
  }
  return cells
})

// Map de date → jobs para acceso rápido
const calJobsMap = computed(() => {
  const map = {}
  jobs.value.forEach(j => {
    if (!j.service_date) return
    const dateStr = j.service_date.slice(0, 10)
    if (!map[dateStr]) map[dateStr] = []
    map[dateStr].push(j)
  })
  return map
})
const calDayJobs = (dateStr) => calJobsMap.value[dateStr] ?? []

// Modal
const calModalOpen    = ref(false)
const calModalJob     = ref(null)
const calModalDateStr = ref('')
const calModalDate    = computed(() => {
  if (!calModalDateStr.value) return ''
  const d = new Date(calModalDateStr.value + 'T00:00:00')
  return d.toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
})

const openCalDay = (cell) => {
  const dayJobs = calDayJobs(cell.dateStr)
  if (!dayJobs.length) return
  calModalDateStr.value = cell.dateStr
  calModalJob.value     = dayJobs[0]
  calModalOpen.value    = true
}

// ─── Profile form ─────────────────────────────────────────────────────────────
const profForm = reactive({ name: '', email: '', phone: '', city: '', description: '' })
const profSaving = ref(false)

const saveProfile = async () => {
  profSaving.value = true
  try {
    await professionalService.saveProfile(profForm)
    authStore.updateUser({ name: profForm.name, email: profForm.email })
    showToast('Perfil actualizado correctamente', 'success')
  } catch { showToast('Error al guardar el perfil', 'error') }
  finally { profSaving.value = false }
}

// ─── Payment data form ────────────────────────────────────────────────────────
const payForm = reactive({
  bank: null, account_type: 'ahorros', account_number: '', account_holder: '', account_id: '', nequi_phone: ''
})
const paySaving = ref(false)
const banks = ref([
  {id:'bancolombia',  code:'BANCOLOMBIA',          name:'Bancolombia'},
  {id:'bogota',       code:'BANCO_BOGOTA',          name:'Banco de Bogotá'},
  {id:'davivienda',   code:'DAVIVIENDA',            name:'Davivienda'},
  {id:'bbva',         code:'BBVA',                  name:'BBVA Colombia'},
  {id:'popular',      code:'BANCO_POPULAR',         name:'Banco Popular'},
  {id:'occidente',    code:'BANCO_OCCIDENTE',       name:'Banco de Occidente'},
  {id:'av_villas',    code:'AV_VILLAS',             name:'Banco AV Villas'},
  {id:'itau',         code:'ITAU',                  name:'Itaú Colombia'},
  {id:'scotiabank',   code:'SCOTIABANK_COLPATRIA',  name:'Scotiabank Colpatria'},
  {id:'falabella',    code:'FALABELLA',             name:'Banco Falabella'},
  {id:'caja_social',  code:'CAJA_SOCIAL',           name:'Banco Caja Social'},
  {id:'agrario',      code:'BANCO_AGRARIO',         name:'Banco Agrario'},
])

const savePayData = async (method = 'bank_transfer') => {
  paySaving.value = true
  try {
    let payload
    if (method === 'nequi' || method === 'daviplata') {
      if (!payForm.nequi_phone) { showToast('Ingresa el número de celular', 'error'); paySaving.value = false; return }
      payload = {
        payment_method: method,
        id_type:        'CC',
        id_number:      payForm.account_id || '0',
        full_name:      payForm.account_holder || fullName.value,
        email:          authStore.user?.email ?? '',
        account_number: payForm.nequi_phone,
      }
    } else {
      if (!payForm.bank)           { showToast('Selecciona un banco', 'error'); paySaving.value = false; return }
      if (!payForm.account_number) { showToast('Ingresa el número de cuenta', 'error'); paySaving.value = false; return }
      const bankObj = typeof payForm.bank === 'object' ? payForm.bank : { id: String(payForm.bank), name: String(payForm.bank), code: '' }
      payload = {
        payment_method: 'bank_transfer',
        id_type:        'CC',
        id_number:      payForm.account_id || '0',
        full_name:      payForm.account_holder || fullName.value,
        email:          authStore.user?.email ?? '',
        account_number: payForm.account_number,
        bank_id:        bankObj.id,
        bank_name:      bankObj.name,
        bank_code:      bankObj.code ?? '',
        account_type:   (payForm.account_type ?? 'ahorros').toUpperCase(),
      }
    }
    await api.post('/professional/payment-info', payload)
    showToast('Datos de pago guardados correctamente', 'success')
  } catch (e) { showToast(e?.response?.data?.message ?? 'Error al guardar los datos de pago', 'error') }
  finally { paySaving.value = false }
}

const loadBanks = async () => {
  try {
    const { data } = await api.get('/professional/banks')
    if (data?.banks && Array.isArray(data.banks) && data.banks.length) banks.value = data.banks
  } catch { /* keep defaults */ }
}

// ─── Computed stats Mis reservas ──────────────────────────────────────────────
const statPendientes  = computed(() => allReservations.filter(r => r.rawStatus === 'accepted').length)
const statCompletadas = computed(() => allReservations.filter(r => r.rawStatus === 'completed').length)

// ─── Build chat conversations from accepted/completed reservations ────────────
const buildConvs = () => {
  const colors = ['#10b981','#db2777','#2563ff','#7c3aed','#f59e0b']
  convs.value = allReservations
    .filter(r => r.rawStatus === 'accepted' || r.rawStatus === 'completed')
    .map((r, i) => ({
      id:      r.id,
      name:    r.client,
      initial: (r.client || 'C')[0].toUpperCase(),
      color:   colors[i % colors.length],
      last:    r.service,
      time:    r.date,
      unread:  unreadChats.value[r.id] ?? 0,
    }))
}

// ─── Code verification modal (6 inputs) ──────────────────────────────────────
const showCodeModal  = ref(false)
const codeRequestId  = ref(null)
const codeDigits     = ref(['', '', '', '', '', ''])
const digitRefs      = ref([])
const codeError      = ref('')
const codeSubmitting = ref(false)
const fullCode       = computed(() => codeDigits.value.join(''))

const onDigitInput = (i) => {
  codeDigits.value[i] = codeDigits.value[i].replace(/\D/, '')
  codeError.value = ''
  if (codeDigits.value[i] && i < 5) digitRefs.value[i + 1]?.focus()
}
const onBackspace = (i) => {
  if (!codeDigits.value[i] && i > 0) { codeDigits.value[i - 1] = ''; digitRefs.value[i - 1]?.focus() }
}
const onPaste = (e) => {
  const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
  text.split('').forEach((char, i) => { codeDigits.value[i] = char })
  digitRefs.value[Math.min(text.length, 5)]?.focus()
}

const submitCode = async () => {
  if (fullCode.value.length < 6) return
  codeSubmitting.value = true
  codeError.value      = ''
  try {
    await api.post(`/professional/requests/${codeRequestId.value}/verify-code`, { code: fullCode.value })
    const found = jobs.value.find(j => j.id === codeRequestId.value)
    if (found) found.status = 'completed'
    showCodeModal.value = false
    showToast('✓ Trabajo completado y aprobado', 'success')
    await loadJobs()
  } catch (e) {
    codeError.value  = e.response?.data?.message || 'Código incorrecto'
    codeDigits.value = ['', '', '', '', '', '']
    setTimeout(() => digitRefs.value[0]?.focus(), 50)
  } finally { codeSubmitting.value = false }
}

// ─── Evidence modal ───────────────────────────────────────────────────────────
const showEvidModal  = ref(false)
const evidFile       = ref(null)
const evidNote       = ref('')
const evidSubmitting = ref(false)

const submitEvidence = async () => {
  if (!evidFile.value) { showToast('Selecciona un archivo', 'error'); return }
  evidSubmitting.value = true
  try {
    const fd = new FormData()
    fd.append('file', evidFile.value)
    fd.append('note', evidNote.value)
    const res = await api.post(`/professional/requests/${selectedJobForEvid.value.id}/evidences`, fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    jobEvidences.value.unshift({
      id:        res.data.id,
      file_url:  res.data.file_url,
      file_type: evidFile.value.type.startsWith('image') ? 'image' : 'file',
      note:      evidNote.value,
      created_at: 'Ahora',
    })
    evidFile.value = null
    evidNote.value = ''
    showToast('✓ Evidencia subida', 'success')
  } catch { showToast('Error al enviar la evidencia', 'error') }
  finally { evidSubmitting.value = false }
}

// ─── Rating modal ─────────────────────────────────────────────────────────────
const showRatingModal  = ref(false)
const ratingRequestId  = ref(null)
const ratingScore      = ref(0)
const ratingComment    = ref('')
const ratingSubmitting = ref(false)

const submitRating = async () => {
  if (ratingScore.value === 0) return
  ratingSubmitting.value = true
  try {
    await api.post(`/professional/requests/${ratingRequestId.value}/rate-client`, {
      score:   ratingScore.value,
      comment: ratingComment.value,
    })
    const found = jobs.value.find(j => j.id === ratingRequestId.value)
    if (found) found._rated = true
    showRatingModal.value = false
    showToast('¡Calificación enviada!', 'success')
  } catch (e) {
    showToast(e?.response?.data?.message ?? 'Error al enviar la calificación', 'error')
  } finally { ratingSubmitting.value = false }
}

// ─── Welcome modal ────────────────────────────────────────────────────────────
const showWelcomeModal = ref(false)
const closeWelcomeModal = () => {
  showWelcomeModal.value = false
  localStorage.removeItem('newProfessionalRegistered')
}

const faqs = reactive([
  { id:1, q:'¿Cómo recibo mis pagos?',        a:'Los pagos se depositan en tu cuenta cada lunes de la semana siguiente al servicio completado.', open:false },
  { id:2, q:'¿Cómo mejorar mi calificación?', a:'Responde rápido, llega puntual y pide a tus clientes que te califiquen.', open:false },
  { id:3, q:'¿Cómo acepto más solicitudes?',  a:'Mantén tu disponibilidad activa y responde en los primeros 5 minutos.', open:false },
])

onMounted(async () => {
  // Pre-fill profile form
  if (authStore.user) {
    profForm.name  = authStore.user.name  ?? ''
    profForm.email = authStore.user.email ?? ''
    profForm.phone = authStore.user.phone ?? ''
    profForm.city  = authStore.user.city  ?? ''
    profForm.description = authStore.user.description ?? ''
  }

  // Dashboard stats
  try {
    const { data } = await professionalService.getDashboard()
    if (data) {
      if (data.reservas_hoy !== undefined)       stats[0].value = String(data.reservas_hoy)
      if (data.ingresos_hoy !== undefined)       stats[1].value = '$' + Number(data.ingresos_hoy).toLocaleString('es-CO')
      if (data.servicios_activos !== undefined)  stats[2].value = String(data.servicios_activos)
      if (data.promedio_reseñas !== undefined)   stats[3].value = String(data.promedio_reseñas)
    }
  } catch { /* keep defaults */ }

  // Earnings + income history
  try {
    const { data } = await api.get('/professional/earnings')
    if (data) {
      if (data.summary) {
        profSummary[0].value = String(data.summary.total_jobs    ?? 0)
        profSummary[1].value = '$' + Number(data.summary.total_earned  ?? 0).toLocaleString('es-CO')
        profSummary[2].value = String(data.summary.pending_jobs  ?? 0)
      }
      if (Array.isArray(data.earnings) && data.earnings.length) {
        rawEarnings.value = data.earnings
        incomeHistory.splice(0, incomeHistory.length, ...data.earnings.map(p => ({
          id:      p.id,
          service: p.service_name ?? '—',
          client:  p.client_name  ?? '—',
          date:    p.service_date ? new Date(p.service_date + 'T00:00:00').toLocaleDateString('es-CO') : '—',
          amount:  '$' + Number(p.net_amount ?? 0).toLocaleString('es-CO'),
          status:  p.status ?? 'completed',
        })))
      }
    }
  } catch { /* keep defaults */ }

  // Accepted reservations / Jobs
  await loadJobs()

  // Banks list (primero, para poder mapear bank_id a objeto en payment_info)
  await loadBanks()

  // Payment data
  try {
    const { data } = await api.get('/professional/payment-info')
    const info = data?.payment_info ?? null
    if (info) {
      const isNequi = info.payment_method === 'nequi' || info.payment_method === 'daviplata'
      payForm.bank           = banks.value.find(b => b.id === info.bank_id) ?? null
      payForm.account_type   = (info.account_type  ?? 'AHORROS').toLowerCase()
      payForm.account_number = isNequi ? '' : (info.account_number ?? '')
      payForm.account_holder = info.full_name  ?? ''
      payForm.account_id     = info.id_number  ?? ''
      payForm.nequi_phone    = isNequi ? (info.account_number ?? '') : ''
    }
  } catch { /* ignore */ }

  // Map + geolocation (solo si estamos en Inicio)
  if (page.value === 'Inicio') {
    await initMap()
    getMyLocation()
  }

  // Available requests polling (every 5 s)
  await loadAvailableRequests()
  availPollTimer = setInterval(loadAvailableRequests, 5000)

  // Heartbeat (every 30 s)
  heartbeatTimer = setInterval(async () => {
    try { await api.get('/heartbeat') } catch { /* ignore */ }
  }, 30000)

  // Unread chat counts polling (every 5 s)
  await loadUnreadChats()
  unreadPollTimer = setInterval(loadUnreadChats, 5000)

  // Welcome modal for newly registered professionals
  if (localStorage.getItem('newProfessionalRegistered')) {
    showWelcomeModal.value = true
  }

  // Construir conversaciones desde las reservas aceptadas/completadas
  buildConvs()

  // My services
  try {
    const { data } = await api.get('/professional/services')
    const list = Array.isArray(data) ? data : data?.data
    if (Array.isArray(list) && list.length) {
      const gradients = [
        'linear-gradient(135deg,#d1fae5,#6ee7b7)',
        'linear-gradient(135deg,#fce7f3,#fbcfe8)',
        'linear-gradient(135deg,#dbeafe,#93c5fd)',
        'linear-gradient(135deg,#fef3c7,#fde68a)',
        'linear-gradient(135deg,#ede9fe,#c4b5fd)',
      ]
      myServices.splice(0, myServices.length, ...list.map((s, i) => ({
        id:          s.id,
        name:        s.name,
        description: s.description ?? '',
        category:    s.category_name ?? s.category?.name ?? '—',
        price_raw:   Number(s.price ?? 0),
        price:       Number(s.price ?? 0).toLocaleString('es-CO'),
        rating:      s.rating ? String(s.rating) : '—',
        iconSvg:     SVG.svc,
        iconColor:   '#2563ff',
        gradient:    gradients[i % gradients.length],
        active:      s.active ?? true,
      })))
    }
  } catch { /* keep mock */ }

  // Professional profile & verification
  await loadVerProfile()
  document.addEventListener('click', onVerCatOutside)
  document.addEventListener('click', onNotifOutside)
})
</script>
