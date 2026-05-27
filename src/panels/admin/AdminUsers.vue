<template>
  <div class="space-y-5">

    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
          <svg viewBox="0 0 24 24" class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        </div>
        <div>
          <p class="font-black text-[#0f172a]">Gestión de Usuarios</p>
          <p class="text-[12px] text-slate-400">
            <span class="bg-[#0d4f5c] text-white text-[10px] font-bold px-2 py-0.5 rounded-full mr-1.5">{{ pagination.total }} usuarios registrados</span>
            Actualizado: {{ lastUpdated }}
          </p>
        </div>
      </div>
      <div class="flex gap-2">
        <button @click="fetchUsers" :disabled="loading"
          class="flex items-center gap-1.5 border border-slate-200 text-[12px] font-semibold text-slate-600 px-4 py-2 rounded-xl hover:bg-slate-50 transition disabled:opacity-50">
          <svg viewBox="0 0 24 24" :class="['w-3.5 h-3.5', loading ? 'animate-spin' : '']" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-.4-6.15"/></svg>
          Actualizar
        </button>
        <button @click="exportCSV" :disabled="exporting"
          class="flex items-center gap-1.5 bg-[#0d4f5c] text-white text-[12px] font-bold px-4 py-2 rounded-xl hover:opacity-90 transition disabled:opacity-60">
          <svg viewBox="0 0 24 24" class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
          {{ exporting ? 'Exportando…' : 'Exportar' }}
        </button>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div v-for="s in statsRow" :key="s.label"
        class="bg-white border border-slate-100 rounded-2xl p-5 flex items-start justify-between gap-3">
        <div class="flex-1 min-w-0">
          <p class="text-[12px] font-medium text-slate-500 leading-tight">{{ s.label }}</p>
          <p class="text-[22px] font-black text-[#0f172a] mt-1.5 leading-tight">{{ s.value }}</p>
          <p class="text-[12px] text-slate-400 mt-1.5">{{ s.sub }}</p>
        </div>
        <div :class="['w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 text-xl', s.iconBg]">
          {{ s.icon }}
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white border border-slate-100 rounded-2xl p-4 space-y-3">
      <div class="flex flex-wrap items-center gap-3">
        <!-- Search -->
        <div class="flex items-center gap-2 flex-1 min-w-[180px] max-w-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
          <svg viewBox="0 0 24 24" class="w-3.5 h-3.5 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/></svg>
          <input v-model="filters.search" @input="onSearchInput" type="text" placeholder="Buscar por nombre o email…"
            class="flex-1 bg-transparent outline-none text-[12px] text-[#0f172a] placeholder:text-slate-400" />
          <button v-if="filters.search" @click="filters.search = ''; fetchUsers()" class="text-slate-400 hover:text-slate-600 text-sm">×</button>
        </div>

        <!-- Role tabs -->
        <div class="flex gap-1">
          <button v-for="r in roleFilters" :key="r.value" @click="setRoleFilter(r.value)"
            :class="['flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition',
              filters.role === r.value ? 'bg-[#0d4f5c] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200']">
            <span>{{ r.icon }}</span>
            <span>{{ r.label }}</span>
            <span :class="['text-[10px] font-black px-1.5 py-0.5 rounded-full', filters.role === r.value ? 'bg-white/20' : 'bg-slate-200']">{{ r.count }}</span>
          </button>
        </div>

        <!-- Status tabs -->
        <div class="flex gap-1">
          <button v-for="s in statusFilters" :key="s.value" @click="setStatusFilter(s.value)"
            :class="['flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition',
              filters.status === s.value ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200']">
            <span class="w-1.5 h-1.5 rounded-full flex-shrink-0" :class="s.dotColor"></span>
            {{ s.label }}
          </button>
        </div>

        <!-- Specialty -->
        <select v-if="specialties.length" v-model="filters.specialty" @change="setSpecialtyFilter"
          class="px-3 py-1.5 rounded-xl border border-slate-200 text-[12px] text-slate-600 focus:outline-none bg-white">
          <option value="">Todas las especialidades</option>
          <option v-for="sp in specialties" :key="sp.id" :value="sp.id">{{ sp.name }}</option>
        </select>

        <!-- Per page -->
        <select v-model="filters.perPage" @change="fetchUsers"
          class="px-3 py-1.5 rounded-xl border border-slate-200 text-[12px] text-slate-600 focus:outline-none bg-white ml-auto">
          <option :value="10">10 / pág</option>
          <option :value="25">25 / pág</option>
          <option :value="50">50 / pág</option>
        </select>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading && !users.length" class="flex justify-center py-16">
      <svg class="animate-spin w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
    </div>

    <!-- Error -->
    <div v-else-if="fetchError" class="bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 px-5 py-4 text-red-700 text-[13px]">
      <span>⚠</span> {{ fetchError }}
      <button @click="fetchUsers" class="ml-auto text-red-600 font-bold hover:underline">Reintentar</button>
    </div>

    <!-- Empty -->
    <div v-else-if="!loading && !users.length" class="bg-white border border-slate-100 rounded-2xl flex flex-col items-center justify-center py-14 text-slate-300">
      <svg viewBox="0 0 24 24" class="w-10 h-10 mb-3" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/></svg>
      <p class="text-[13px] font-semibold">No se encontraron usuarios</p>
      <button @click="clearFilters" class="mt-3 text-[12px] text-[#0d4f5c] font-bold hover:underline">Limpiar filtros</button>
    </div>

    <!-- Cards mobile / Table desktop -->
    <div v-else>

      <!-- Mobile cards (< md) -->
      <div class="md:hidden space-y-3">
        <div v-for="u in users" :key="u.id"
          class="bg-white border border-slate-100 rounded-2xl p-4 space-y-3">
          <!-- top row -->
          <div class="flex items-center justify-between gap-2">
            <div class="flex items-center gap-2.5">
              <div class="relative flex-shrink-0">
                <img :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name}`" class="w-11 h-11 rounded-xl border border-slate-200" :alt="u.name" />
                <span :class="['absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white', u.email_verified_at ? 'bg-emerald-500' : 'bg-slate-300']"></span>
              </div>
              <div>
                <p class="font-bold text-[#0f172a] text-[13px] leading-tight">{{ u.name }}</p>
                <p class="text-[10px] text-slate-400">#{{ String(u.id).padStart(4, '0') }}</p>
              </div>
            </div>
            <span :class="['inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full flex-shrink-0',
              u.role === 'professional' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700']">
              {{ u.role === 'professional' ? '💼 Prof.' : '👤 Cliente' }}
            </span>
          </div>
          <!-- info grid -->
          <div class="grid grid-cols-2 gap-y-2.5 text-[12px]">
            <div class="col-span-2">
              <p class="text-[10px] text-slate-400 uppercase tracking-wide font-bold">Email</p>
              <p class="text-slate-600 truncate">{{ u.email }}</p>
            </div>
            <div>
              <p class="text-[10px] text-slate-400 uppercase tracking-wide font-bold">Estado</p>
              <span :class="['inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full mt-0.5',
                u.role === 'professional'
                  ? (u.professional?.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700')
                  : 'bg-slate-100 text-slate-500']">
                <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
                {{ u.role === 'professional' ? (u.professional?.status === 'approved' ? 'Aprobado' : 'Pendiente') : '—' }}
              </span>
            </div>
            <div>
              <p class="text-[10px] text-slate-400 uppercase tracking-wide font-bold">Registrado</p>
              <p class="text-[#0f172a]">{{ formatDate(u.created_at) }}</p>
            </div>
            <div v-if="u.role === 'professional'" class="col-span-2">
              <p class="text-[10px] text-slate-400 uppercase tracking-wide font-bold">Especialidad</p>
              <div class="flex flex-wrap gap-1 mt-0.5">
                <template v-if="u.professional?.categories?.length">
                  <span v-for="cat in u.professional.categories" :key="cat.id"
                    class="bg-cyan-100 text-cyan-700 text-[10px] font-bold px-2 py-0.5 rounded-md">{{ cat.name }}</span>
                </template>
                <span v-else class="bg-cyan-100 text-cyan-700 text-[10px] font-bold px-2 py-0.5 rounded-md">
                  {{ u.professional?.category?.name || '—' }}
                </span>
              </div>
            </div>
          </div>
          <!-- actions -->
          <div class="flex gap-2 pt-2 border-t border-slate-50">
            <button @click="openDetail(u)"
              class="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-100 text-slate-600 text-[12px] font-semibold hover:bg-slate-200 transition">
              <svg viewBox="0 0 24 24" class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              Ver
            </button>
            <button v-if="u.role === 'professional' && u.professional?.status !== 'approved'"
              @click="verifyProfessional(u)" :disabled="verifyingId === u.id"
              class="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-emerald-50 text-emerald-700 text-[12px] font-semibold hover:bg-emerald-100 transition disabled:opacity-50">
              ✓ Verificar
            </button>
          </div>
        </div>
      </div>

      <!-- Desktop table (≥ md) -->
      <div class="hidden md:block bg-white border border-slate-100 rounded-2xl overflow-hidden">
        <div class="overflow-x-auto">
        <table class="w-full text-sm min-w-[640px]">
          <thead class="bg-slate-50">
            <tr>
              <th class="px-4 py-3 w-10">
                <input type="checkbox" :checked="allSelected" @change="toggleSelectAll" class="rounded accent-[#0d4f5c]" />
              </th>
              <th @click="setSort('name')" class="text-left px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wide cursor-pointer select-none hover:text-slate-600">
                Usuario {{ sortIcon('name') }}
              </th>
              <th @click="setSort('email')" class="text-left px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wide cursor-pointer select-none hover:text-slate-600">
                Email {{ sortIcon('email') }}
              </th>
              <th class="text-left px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wide">Especialidad</th>
              <th class="text-left px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wide">Rol</th>
              <th class="text-left px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wide">Estado</th>
              <th @click="setSort('created_at')" class="text-left px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wide cursor-pointer select-none hover:text-slate-600">
                Registrado {{ sortIcon('created_at') }}
              </th>
              <th class="text-left px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wide">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            <tr v-for="u in users" :key="u.id" :class="['hover:bg-slate-50 transition', selectedIds.includes(u.id) ? 'bg-blue-50/50' : '']">
              <td class="px-4 py-3">
                <input type="checkbox" :checked="selectedIds.includes(u.id)" @change="toggleSelect(u.id)" class="rounded accent-[#0d4f5c]" />
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center gap-2.5">
                  <div class="relative flex-shrink-0">
                    <img :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name}`" class="w-9 h-9 rounded-xl border border-slate-200" :alt="u.name" />
                    <span :class="['absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white', u.email_verified_at ? 'bg-emerald-500' : 'bg-slate-300']"></span>
                  </div>
                  <div>
                    <p class="font-bold text-[#0f172a] text-[13px] leading-tight">{{ u.name }}</p>
                    <p class="text-[10px] text-slate-400">#{{ String(u.id).padStart(4, '0') }}</p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 text-[12px] text-slate-500">{{ u.email }}</td>
              <td class="px-4 py-3">
                <template v-if="u.role === 'professional'">
                  <template v-if="u.professional?.categories?.length">
                    <span v-for="cat in u.professional.categories" :key="cat.id"
                      class="inline-block bg-cyan-100 text-cyan-700 text-[10px] font-bold px-2 py-0.5 rounded-md mr-1">{{ cat.name }}</span>
                  </template>
                  <span v-else class="bg-cyan-100 text-cyan-700 text-[10px] font-bold px-2 py-0.5 rounded-md">
                    {{ u.professional?.category?.name || '—' }}
                  </span>
                </template>
                <span v-else class="text-[11px] text-slate-400">No aplica</span>
              </td>
              <td class="px-4 py-3">
                <span :class="['inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full',
                  u.role === 'professional' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700']">
                  {{ u.role === 'professional' ? '💼 Profesional' : '👤 Cliente' }}
                </span>
              </td>
              <td class="px-4 py-3">
                <span :class="['inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full',
                  u.role === 'professional'
                    ? (u.professional?.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700')
                    : 'bg-slate-100 text-slate-500']">
                  <span class="w-1.5 h-1.5 rounded-full bg-current flex-shrink-0"></span>
                  {{ u.role === 'professional' ? (u.professional?.status === 'approved' ? 'Aprobado' : 'Pendiente') : 'No requerido' }}
                </span>
              </td>
              <td class="px-4 py-3">
                <p class="text-[12px] text-[#0f172a]">{{ formatDate(u.created_at) }}</p>
                <p class="text-[10px] text-slate-400">{{ timeAgo(u.created_at) }}</p>
              </td>
              <td class="px-4 py-3">
                <div class="flex gap-1.5">
                  <button @click="openDetail(u)" title="Ver detalle"
                    class="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition">
                    <svg viewBox="0 0 24 24" class="w-3.5 h-3.5 text-slate-600" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  </button>
                  <button v-if="u.role === 'professional' && u.professional?.status !== 'approved'"
                    @click="verifyProfessional(u)" :disabled="verifyingId === u.id"
                    title="Verificar profesional" class="w-7 h-7 rounded-lg bg-emerald-50 hover:bg-emerald-100 flex items-center justify-center transition disabled:opacity-50">
                    <svg viewBox="0 0 24 24" class="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        </div>
      </div>

    </div>

    <!-- Bulk bar -->
    <div v-if="selectedIds.length" class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#0f172a] text-white rounded-2xl px-5 py-3 flex items-center gap-4 shadow-2xl">
      <span class="text-[13px] font-bold">{{ selectedIds.length }} seleccionados</span>
      <div class="flex gap-2">
        <button @click="bulkAction('activate')" class="text-[12px] font-bold px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 transition">Activar</button>
        <button @click="bulkAction('deactivate')" class="text-[12px] font-bold px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 transition">Desactivar</button>
        <button @click="bulkAction('delete')" class="text-[12px] font-bold px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 transition">Eliminar</button>
      </div>
      <button @click="selectedIds = []" class="text-slate-400 hover:text-white text-lg leading-none">×</button>
    </div>

    <!-- Pagination -->
    <div v-if="!loading && users.length" class="flex items-center justify-between">
      <span class="text-[12px] text-slate-400">
        Mostrando {{ paginationFrom }}–{{ paginationTo }} de {{ pagination.total }}
      </span>
      <div class="flex gap-1">
        <button class="w-8 h-8 rounded-lg bg-white border border-slate-200 text-[12px] hover:bg-slate-50 transition disabled:opacity-30" :disabled="pagination.currentPage === 1" @click="goToPage(1)">«</button>
        <button class="w-8 h-8 rounded-lg bg-white border border-slate-200 text-[12px] hover:bg-slate-50 transition disabled:opacity-30" :disabled="pagination.currentPage === 1" @click="goToPage(pagination.currentPage - 1)">‹</button>
        <button v-for="p in visiblePages" :key="p"
          :class="['w-8 h-8 rounded-lg text-[12px] font-semibold border transition',
            p === pagination.currentPage ? 'bg-[#0d4f5c] text-white border-[#0d4f5c]' : 'bg-white border-slate-200 hover:bg-slate-50',
            p === '…' ? 'pointer-events-none text-slate-300' : '']"
          @click="p !== '…' && goToPage(p)">{{ p }}</button>
        <button class="w-8 h-8 rounded-lg bg-white border border-slate-200 text-[12px] hover:bg-slate-50 transition disabled:opacity-30" :disabled="pagination.currentPage === pagination.lastPage" @click="goToPage(pagination.currentPage + 1)">›</button>
        <button class="w-8 h-8 rounded-lg bg-white border border-slate-200 text-[12px] hover:bg-slate-50 transition disabled:opacity-30" :disabled="pagination.currentPage === pagination.lastPage" @click="goToPage(pagination.lastPage)">»</button>
      </div>
    </div>

    <!-- ── Modal: Detalle ── -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showDetail" class="fixed inset-0 z-[150] flex items-center justify-center p-4" style="background:rgba(15,23,42,0.6);" @click.self="showDetail = false">
          <div class="bg-white rounded-3xl shadow-2xl w-full max-w-md flex flex-col max-h-[90vh] overflow-hidden">
            <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
              <p class="font-black text-[#0f172a]">Detalle del Usuario</p>
              <button @click="showDetail = false" class="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition text-lg">×</button>
            </div>
            <div class="overflow-y-auto flex-1 p-6 space-y-5" v-if="selectedUser">
              <!-- Avatar + name + role -->
              <div class="flex items-center gap-4">
                <img :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedUser.name}`"
                  class="w-14 h-14 rounded-2xl border border-slate-200 flex-shrink-0" :alt="selectedUser.name" />
                <div>
                  <p class="font-black text-[#0f172a] text-lg">{{ selectedUser.name }}</p>
                  <span :class="['inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full mt-1',
                    selectedUser.role === 'professional' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700']">
                    {{ selectedUser.role === 'professional' ? '💼 Profesional' : '👤 Cliente' }}
                  </span>
                </div>
              </div>

              <!-- Info grid -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Email</p>
                  <p class="text-[13px] text-[#0f172a] mt-0.5">{{ selectedUser.email }}</p>
                </div>
                <div>
                  <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Estado</p>
                  <span :class="['inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full mt-1',
                    selectedUser.role === 'professional'
                      ? (selectedUser.professional?.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700')
                      : 'bg-slate-100 text-slate-500']">
                    <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
                    {{ selectedUser.role === 'professional'
                      ? (selectedUser.professional?.status === 'approved' ? 'Aprobado' : 'Pendiente')
                      : 'No requerido' }}
                  </span>
                </div>
                <div>
                  <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wide">ID de usuario</p>
                  <p class="text-[13px] text-[#0f172a] mt-0.5">#{{ String(selectedUser.id).padStart(4, '0') }}</p>
                </div>
                <div>
                  <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Registrado</p>
                  <p class="text-[13px] text-[#0f172a] mt-0.5">{{ formatDate(selectedUser.created_at) }}</p>
                </div>
                <div v-if="selectedUser.role === 'professional'">
                  <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Verificado el</p>
                  <p class="text-[13px] text-[#0f172a] mt-0.5">{{ selectedUser.professional?.verified_at ? formatDate(selectedUser.professional.verified_at) : '—' }}</p>
                </div>
                <div v-if="selectedUser.role === 'professional' && (selectedUser.professional?.categories?.length || selectedUser.professional?.category)" class="col-span-2">
                  <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">Especialidades</p>
                  <div class="flex flex-wrap gap-1">
                    <template v-if="selectedUser.professional?.categories?.length">
                      <span v-for="cat in selectedUser.professional.categories" :key="cat.id"
                        class="bg-cyan-100 text-cyan-700 text-[11px] font-bold px-2.5 py-0.5 rounded-full">{{ cat.name }}</span>
                    </template>
                    <span v-else class="bg-cyan-100 text-cyan-700 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                      {{ selectedUser.professional?.category?.name || '—' }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Datos profesionales -->
              <div v-if="selectedUser.role === 'professional' && selectedUser.professional" class="space-y-4">
                <p class="font-black text-[#0f172a] text-[13px]">Datos Profesionales</p>
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Documento</p>
                    <p class="text-[13px] text-[#0f172a] mt-0.5">{{ selectedUser.professional.document_number || '—' }}</p>
                  </div>
                  <div>
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Teléfono</p>
                    <p class="text-[13px] text-[#0f172a] mt-0.5">{{ selectedUser.professional.phone || '—' }}</p>
                  </div>
                  <div class="col-span-2">
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Dirección</p>
                    <p class="text-[13px] text-[#0f172a] mt-0.5">{{ selectedUser.professional.address || '—' }}</p>
                  </div>
                </div>

                <!-- Documentos -->
                <div>
                  <p class="font-black text-[#0f172a] text-[13px] mb-2">Documentos</p>
                  <div class="grid grid-cols-2 gap-2">
                    <div v-for="doc in professionalDocs(selectedUser.professional)" :key="doc.label"
                      class="border border-slate-100 rounded-xl overflow-hidden bg-slate-50">
                      <!-- Preview -->
                      <div class="h-24 flex items-center justify-center bg-slate-100">
                        <img v-if="isImage(doc.path)" :src="storageUrl(doc.path)"
                          class="w-full h-full object-cover" :alt="doc.label"
                          @error="(e) => { e.target.style.display='none' }" />
                        <div v-else-if="isPdf(doc.path)" class="flex flex-col items-center gap-1">
                          <svg viewBox="0 0 24 24" class="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                          <span class="text-[10px] font-black text-red-500 bg-red-100 px-1.5 py-0.5 rounded">PDF</span>
                        </div>
                        <div v-else class="text-slate-300 text-2xl">—</div>
                      </div>
                      <!-- Footer -->
                      <div class="px-2.5 py-2 flex items-center justify-between gap-1">
                        <span class="text-[10px] font-semibold text-slate-600 truncate">{{ doc.label }}</span>
                        <a v-if="doc.path" :href="storageUrl(doc.path)" :download="`${doc.label}.${fileExt(doc.path)}`" target="_blank"
                          class="flex items-center gap-0.5 text-[10px] font-bold text-[#0d4f5c] hover:underline flex-shrink-0">
                          <svg viewBox="0 0 24 24" class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                          Descargar
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- Footer -->
            <div class="flex justify-end gap-3 px-6 py-4 border-t border-slate-100 flex-shrink-0">
              <button @click="showDetail = false" class="px-5 py-2.5 rounded-xl border border-slate-200 text-[13px] text-slate-600 hover:bg-slate-50 transition">Cerrar</button>
              <button v-if="selectedUser?.role === 'professional' && selectedUser?.professional?.status === 'approved'"
                @click="verifyProfessional(selectedUser)" :disabled="verifyingId === selectedUser?.id"
                class="px-5 py-2.5 rounded-xl bg-amber-100 text-amber-700 text-[13px] font-bold hover:bg-amber-200 transition disabled:opacity-60">
                🔒 Quitar verificación
              </button>
              <button @click="openEdit(selectedUser); showDetail = false"
                class="px-5 py-2.5 rounded-xl bg-[#0d4f5c] text-white text-[13px] font-bold hover:opacity-90 transition">
                Editar
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ── Modal: Edit ── -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showEdit" class="fixed inset-0 z-[150] flex items-center justify-center p-4" style="background:rgba(15,23,42,0.6);" @click.self="showEdit = false">
          <div class="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 space-y-4">
            <div class="flex items-center justify-between">
              <p class="font-black text-[#0f172a]">Editar Usuario</p>
              <button @click="showEdit = false" class="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition text-lg">×</button>
            </div>
            <div v-if="editForm" class="space-y-3">
              <div>
                <label class="block text-[12px] font-bold text-slate-500 mb-1">Nombre</label>
                <input v-model="editForm.name" class="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-teal-500/30" />
              </div>
              <div>
                <label class="block text-[12px] font-bold text-slate-500 mb-1">Email</label>
                <input v-model="editForm.email" type="email" class="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-teal-500/30" />
              </div>
              <div>
                <label class="block text-[12px] font-bold text-slate-500 mb-1">Rol</label>
                <select v-model="editForm.role" class="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-teal-500/30 bg-white">
                  <option value="client">Cliente</option>
                  <option value="professional">Profesional</option>
                </select>
              </div>
              <p v-if="editError" class="text-[12px] text-red-500">⚠ {{ editError }}</p>
            </div>
            <div class="flex gap-3 pt-1">
              <button @click="showEdit = false" class="flex-1 border border-slate-200 text-[13px] text-slate-600 font-semibold py-2.5 rounded-xl hover:bg-slate-50 transition">Cancelar</button>
              <button @click="saveEdit" :disabled="saving" class="flex-1 bg-[#0d4f5c] text-white text-[13px] font-bold py-2.5 rounded-xl hover:opacity-90 transition disabled:opacity-60">
                {{ saving ? 'Guardando…' : 'Guardar cambios' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import userService from '@/services/userService'
import api from '@/services/api'
import { useAdminToast } from './useAdminToast'

const { showToast } = useAdminToast()

const storageUrl = (path) => `${(import.meta.env.VITE_API_URL ?? '').replace('/api', '')}/storage/${path}`
const fileExt    = (path) => path?.split('.').pop().toLowerCase() ?? ''
const isPdf      = (path) => fileExt(path) === 'pdf'
const isImage    = (path) => ['jpg','jpeg','png','webp'].includes(fileExt(path))

const professionalDocs = (pro) => [
  { path: pro.identity_card,       label: 'DNI / Documento' },
  { path: pro.professional_card,   label: 'Carné profesional' },
  { path: pro.professional_title,  label: 'Título profesional' },
  { path: pro.photo,               label: 'Foto' },
].filter(d => d.path)

// ── State ──────────────────────────────────────────────────
const users      = ref([])
const loading    = ref(false)
const fetchError = ref('')
const lastUpdated = ref('—')
const specialties = ref([])

const filters = ref({ search: '', role: 'all', status: 'all', specialty: '', perPage: 10, sort: 'created_at', dir: 'desc' })
const pagination = ref({ total: 0, currentPage: 1, lastPage: 1, perPage: 10 })
const statsCache = ref({ total: 0, clients: 0, professionals: 0, verified: 0 })

const selectedIds = ref([])
const verifyingId = ref(null)
const exporting   = ref(false)
const saving      = ref(false)

const showDetail = ref(false)
const showEdit   = ref(false)
const selectedUser = ref(null)
const editForm     = ref(null)
const editError    = ref('')

// ── Computed ───────────────────────────────────────────────
const statsRow = computed(() => [
  { icon: '👥', label: 'Usuarios totales',  value: statsCache.value.total,         iconBg: 'bg-blue-50',    sub: `${statsCache.value.clients} clientes · ${statsCache.value.professionals} profesionales` },
  { icon: '👤', label: 'Clientes',          value: statsCache.value.clients,       iconBg: 'bg-emerald-50', sub: 'usuarios clientes' },
  { icon: '💼', label: 'Profesionales',     value: statsCache.value.professionals, iconBg: 'bg-amber-50',   sub: 'proveedores de servicio' },
  { icon: '✅', label: 'Verificados',       value: statsCache.value.verified,      iconBg: 'bg-teal-50',    sub: 'profesionales aprobados' },
])

const roleFilters = computed(() => [
  { value: 'all',          icon: '🌐', label: 'Todos',         count: statsCache.value.total },
  { value: 'client',       icon: '👤', label: 'Clientes',      count: statsCache.value.clients },
  { value: 'professional', icon: '💼', label: 'Profesionales', count: statsCache.value.professionals },
])

const statusFilters = [
  { value: 'all',      label: 'Todos',      dotColor: 'bg-slate-400' },
  { value: 'verified', label: 'Verificados', dotColor: 'bg-emerald-500' },
  { value: 'pending',  label: 'Pendientes',  dotColor: 'bg-amber-500' },
]

const allSelected = computed(() => users.value.length > 0 && users.value.every(u => selectedIds.value.includes(u.id)))

const paginationFrom = computed(() => Math.min((pagination.value.currentPage - 1) * pagination.value.perPage + 1, pagination.value.total))
const paginationTo   = computed(() => Math.min(pagination.value.currentPage * pagination.value.perPage, pagination.value.total))

const visiblePages = computed(() => {
  const { currentPage, lastPage } = pagination.value
  if (lastPage <= 7) return Array.from({ length: lastPage }, (_, i) => i + 1)
  if (currentPage <= 4) return [1, 2, 3, 4, 5, '…', lastPage]
  if (currentPage >= lastPage - 3) return [1, '…', lastPage - 4, lastPage - 3, lastPage - 2, lastPage - 1, lastPage]
  return [1, '…', currentPage - 1, currentPage, currentPage + 1, '…', lastPage]
})

// ── Sorting ────────────────────────────────────────────────
const setSort = (col) => {
  if (filters.value.sort === col) filters.value.dir = filters.value.dir === 'asc' ? 'desc' : 'asc'
  else { filters.value.sort = col; filters.value.dir = 'asc' }
  fetchUsers()
}
const sortIcon = (col) => filters.value.sort === col ? (filters.value.dir === 'asc' ? '↑' : '↓') : '↕'

// ── Helpers ────────────────────────────────────────────────
const formatDate = (d) => d ? new Date(d).toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'
const timeAgo = (d) => {
  if (!d) return ''
  const days = Math.floor((Date.now() - new Date(d)) / 86400000)
  if (days === 0) return 'hoy'
  if (days === 1) return 'ayer'
  if (days < 30) return `hace ${days}d`
  if (days < 365) return `hace ${Math.floor(days / 30)}m`
  return `hace ${Math.floor(days / 365)}a`
}

let searchTimeout = null
const onSearchInput = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => { pagination.value.currentPage = 1; fetchUsers() }, 400)
}

const setRoleFilter    = (v) => { filters.value.role = v; pagination.value.currentPage = 1; fetchUsers() }
const setStatusFilter  = (v) => { filters.value.status = v; pagination.value.currentPage = 1; fetchUsers() }
const setSpecialtyFilter = () => { pagination.value.currentPage = 1; fetchUsers() }
const goToPage         = (p) => { pagination.value.currentPage = p; fetchUsers() }
const clearFilters     = () => {
  filters.value = { search: '', role: 'all', status: 'all', specialty: '', perPage: 10, sort: 'created_at', dir: 'desc' }
  pagination.value.currentPage = 1
  fetchUsers()
}

const toggleSelectAll = () => {
  if (allSelected.value) selectedIds.value = []
  else selectedIds.value = users.value.map(u => u.id)
}
const toggleSelect = (id) => {
  const idx = selectedIds.value.indexOf(id)
  if (idx === -1) selectedIds.value.push(id)
  else selectedIds.value.splice(idx, 1)
}

// ── API ────────────────────────────────────────────────────
const fetchUsers = async () => {
  loading.value = true
  fetchError.value = ''
  try {
    const { data } = await userService.getUsers({
      page: pagination.value.currentPage,
      per_page: filters.value.perPage,
      search: filters.value.search,
      role: filters.value.role !== 'all' ? filters.value.role : undefined,
      status: filters.value.status !== 'all' ? filters.value.status : undefined,
      specialty: filters.value.specialty || undefined,
      sort: filters.value.sort,
      dir: filters.value.dir,
    })
    users.value = data.users?.data ?? data.data ?? []
    pagination.value.total = data.users?.total ?? data.total ?? 0
    pagination.value.lastPage = data.users?.last_page ?? data.last_page ?? 1
    pagination.value.currentPage = data.users?.current_page ?? data.current_page ?? 1
    pagination.value.perPage = data.users?.per_page ?? filters.value.perPage
    if (data.stats) statsCache.value = data.stats
    lastUpdated.value = new Date().toLocaleTimeString('es-CO')
  } catch {
    fetchError.value = 'Error al cargar usuarios'
  } finally {
    loading.value = false
  }
}

const loadSpecialties = async () => {
  try {
    const { data } = await api.get('/admin/users/specialties')
    if (data.success) specialties.value = data.specialties
  } catch { /* silencioso */ }
}

const openDetail = async (user) => {
  loading.value = true
  try {
    const { data } = await userService.getUser(user.id)
    selectedUser.value = data.success ? data.user : user
    showDetail.value = true
  } catch { selectedUser.value = user; showDetail.value = true }
  finally { loading.value = false }
}

const openEdit = (user) => {
  editForm.value = { ...user }
  editError.value = ''
  showEdit.value = true
}

const saveEdit = async () => {
  saving.value = true
  editError.value = ''
  try {
    await api.put(`/admin/users/${editForm.value.id}`, editForm.value)
    const idx = users.value.findIndex(u => u.id === editForm.value.id)
    if (idx !== -1) users.value[idx] = { ...users.value[idx], ...editForm.value }
    showEdit.value = false
    showToast('Usuario actualizado', 'success')
  } catch (e) {
    editError.value = e?.response?.data?.message ?? 'Error al guardar'
  } finally {
    saving.value = false
  }
}

const verifyProfessional = async (user) => {
  verifyingId.value = user.id
  try {
    const { data } = await api.patch(`/admin/users/${user.id}/verify-professional`)
    if (data.success) {
      const upd = { status: data.status, is_verified: data.is_verified, verified_at: data.verified_at }
      const idx = users.value.findIndex(u => u.id === user.id)
      if (idx !== -1 && users.value[idx].professional) Object.assign(users.value[idx].professional, upd)
      if (selectedUser.value?.id === user.id && selectedUser.value.professional) Object.assign(selectedUser.value.professional, upd)
      showToast(data.status === 'approved' ? 'Profesional verificado' : 'Verificación removida', 'success')
    }
  } catch (e) {
    const msg = e?.response?.data?.message ?? 'Error al verificar'
    showToast(msg, 'error')
  } finally {
    verifyingId.value = null
  }
}

const bulkAction = async (action) => {
  if (!selectedIds.value.length) return
  try {
    const { data } = await userService.bulkAction({ action, ids: selectedIds.value })
    if (data.success) {
      if (data.stats) statsCache.value = data.stats
      await fetchUsers()
      selectedIds.value = []
      showToast('Acción realizada correctamente', 'success')
    }
  } catch { showToast('Error al realizar la acción', 'error') }
}

const exportCSV = async () => {
  exporting.value = true
  try {
    const params = new URLSearchParams()
    if (filters.value.search) params.set('search', filters.value.search)
    if (filters.value.role !== 'all') params.set('role', filters.value.role)
    if (filters.value.status !== 'all') params.set('status', filters.value.status)
    if (filters.value.specialty) params.set('specialty', filters.value.specialty)
    const { data } = await api.get(`/admin/users/export?${params}`)
    if (!data.success || !data.users?.length) { showToast('No hay datos para exportar', 'error'); return }
    const headers = Object.keys(data.users[0])
    const rows    = data.users.map(u => headers.map(h => `"${String(u[h] ?? '').replace(/"/g, '""')}"`))
    const csv     = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob    = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
    const a       = document.createElement('a')
    a.href        = URL.createObjectURL(blob)
    a.download    = `usuarios_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(a.href)
  } catch { showToast('Error al exportar', 'error') }
  finally { exporting.value = false }
}

onMounted(() => {
  fetchUsers()
  loadSpecialties()
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .2s ease }
.fade-enter-from, .fade-leave-to { opacity: 0 }
</style>
