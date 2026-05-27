<template>
  <div class="space-y-5">

    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <p class="font-black text-[#0f172a]">Administradores</p>
        <p class="text-sm text-slate-400 mt-0.5">Gestiona accesos al panel de administración</p>
      </div>
      <button @click="openCreate"
        class="bg-[#0d4f5c] text-white text-[13px] font-bold px-5 py-2.5 rounded-xl hover:opacity-90 transition">
        + Nuevo Admin
      </button>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="bg-white border border-slate-100 rounded-2xl p-4 flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
          <svg viewBox="0 0 24 24" class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        </div>
        <div>
          <p class="text-2xl font-black text-[#0f172a] leading-none">{{ admins.length }}</p>
          <p class="text-[11px] text-slate-400 font-semibold mt-0.5">Sub-admins</p>
        </div>
      </div>
      <div class="bg-white border border-slate-100 rounded-2xl p-4 flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
          <svg viewBox="0 0 24 24" class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <div>
          <p class="text-2xl font-black text-[#0f172a] leading-none">{{ admins.filter(a => a.is_active).length }}</p>
          <p class="text-[11px] text-slate-400 font-semibold mt-0.5">Activos</p>
        </div>
      </div>
      <div class="bg-white border border-slate-100 rounded-2xl p-4 flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
          <svg viewBox="0 0 24 24" class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="15" x2="9" y1="9" y2="15"/><line x1="9" x2="15" y1="9" y2="15"/></svg>
        </div>
        <div>
          <p class="text-2xl font-black text-[#0f172a] leading-none">{{ admins.filter(a => !a.is_active).length }}</p>
          <p class="text-[11px] text-slate-400 font-semibold mt-0.5">Inactivos</p>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-16">
      <svg class="animate-spin w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
    </div>

    <!-- Empty -->
    <div v-else-if="!admins.length" class="bg-white border border-slate-100 rounded-2xl flex flex-col items-center justify-center py-16 text-slate-300">
      <svg viewBox="0 0 24 24" class="w-12 h-12 mb-3" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
      <p class="text-[13px] font-semibold">No hay sub-administradores</p>
      <button @click="openCreate" class="mt-4 bg-[#0d4f5c] text-white text-[12px] font-bold px-4 py-2 rounded-xl hover:opacity-90 transition">Crear sub-administrador</button>
    </div>

    <!-- Table -->
    <div v-else class="bg-white border border-slate-100 rounded-2xl overflow-hidden">
      <!-- Toolbar -->
      <div class="flex items-center justify-between px-5 py-4 border-b border-slate-100 gap-4">
        <div class="flex items-center gap-2 flex-1 max-w-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5">
          <svg viewBox="0 0 24 24" class="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/></svg>
          <input v-model="search" type="text" placeholder="Buscar por nombre o correo…" class="flex-1 bg-transparent outline-none text-[13px] text-[#0f172a] placeholder:text-slate-400" />
          <button v-if="search" @click="search = ''" class="text-slate-400 hover:text-slate-600 text-sm leading-none">×</button>
        </div>
        <span class="text-[12px] text-slate-400 font-semibold">{{ filtered.length }} resultado{{ filtered.length !== 1 ? 's' : '' }}</span>
      </div>

      <!-- Empty filter result -->
      <div v-if="!filtered.length" class="px-5 py-8 text-center text-slate-300 text-[13px]">
        No se encontraron administradores con "{{ search }}"
      </div>

      <template v-else>
        <!-- Mobile cards (< md) -->
        <div class="md:hidden divide-y divide-slate-50">
          <div v-for="admin in admMobilePagedItems" :key="admin.id" class="p-4 space-y-3">
            <div class="flex items-center justify-between gap-2">
              <div class="flex items-center gap-2.5">
                <img :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${admin.name}`"
                  class="w-10 h-10 rounded-xl border border-slate-200 flex-shrink-0" alt="" />
                <div>
                  <p class="font-bold text-[#0f172a] text-[13px]">{{ admin.name }}</p>
                  <p class="text-[10px] text-slate-400">{{ admin.email }}</p>
                </div>
              </div>
              <span :class="['inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full flex-shrink-0',
                admin.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600']">
                <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
                {{ admin.is_active ? 'Activo' : 'Inactivo' }}
              </span>
            </div>
            <div class="flex flex-wrap gap-1">
              <template v-for="(perms, mod) in admin.modules" :key="mod">
                <span v-if="perms?.enabled"
                  class="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-md">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0"></span>
                  {{ moduleLabel(mod) }}
                </span>
              </template>
              <span v-if="!Object.values(admin.modules ?? {}).some(p => p?.enabled)" class="text-[11px] text-slate-300">Sin accesos</span>
            </div>
            <p class="text-[10px] text-slate-400">Creado: {{ fmtDate(admin.created_at) }}</p>
            <div class="flex gap-2 pt-2 border-t border-slate-50">
              <button @click="openEdit(admin)"
                class="flex-1 py-2 rounded-xl bg-blue-50 text-blue-700 text-[12px] font-semibold hover:bg-blue-100 transition">
                Editar
              </button>
              <button @click="toggleStatus(admin)"
                :class="['flex-1 py-2 rounded-xl text-[12px] font-semibold transition', admin.is_active ? 'bg-amber-50 text-amber-700 hover:bg-amber-100' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100']">
                {{ admin.is_active ? 'Inhabilitar' : 'Habilitar' }}
              </button>
              <button @click="askDelete(admin)"
                class="px-3 py-2 rounded-xl bg-red-50 text-red-600 text-[12px] font-semibold hover:bg-red-100 transition">
                <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>
              </button>
            </div>
          </div>
        </div>
        <!-- Mobile pagination -->
        <div v-if="admMobileTotalPages > 1" class="md:hidden flex items-center justify-center gap-3 px-4 py-3 border-t border-slate-100">
          <button :disabled="admMobilePage <= 1" @click="admMobilePage--"
            class="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 text-sm font-bold disabled:opacity-30 hover:bg-slate-200 transition">‹</button>
          <span class="text-[12px] text-slate-500 font-semibold">{{ admMobilePage }} / {{ admMobileTotalPages }}</span>
          <button :disabled="admMobilePage >= admMobileTotalPages" @click="admMobilePage++"
            class="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 text-sm font-bold disabled:opacity-30 hover:bg-slate-200 transition">›</button>
        </div>

        <!-- Desktop table (≥ md) -->
        <div class="hidden md:block overflow-x-auto">
        <table class="w-full text-sm min-w-[560px]">
          <thead class="bg-slate-50">
            <tr>
              <th v-for="h in ['Administrador','Módulos','Estado','Creado','Acciones']" :key="h"
                class="text-left px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wide">{{ h }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            <tr v-for="admin in filtered" :key="admin.id" class="hover:bg-slate-50 transition">
              <td class="px-5 py-4">
                <div class="flex items-center gap-3">
                  <img :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${admin.name}`"
                    class="w-9 h-9 rounded-xl border border-slate-200 flex-shrink-0" alt="" />
                  <div>
                    <p class="font-bold text-[#0f172a] text-[13px]">{{ admin.name }}</p>
                    <p class="text-[11px] text-slate-400">{{ admin.email }}</p>
                  </div>
                </div>
              </td>
              <td class="px-5 py-4">
                <div class="flex flex-wrap gap-1">
                  <template v-for="(perms, mod) in admin.modules" :key="mod">
                    <span v-if="perms?.enabled"
                      class="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-md"
                      :title="`${moduleLabel(mod)}: ${activePerms(perms).join(', ')}`">
                      <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0"></span>
                      {{ moduleLabel(mod) }}
                      <span class="bg-emerald-200/60 text-emerald-800 px-1 rounded text-[9px] font-black tracking-wide">{{ activePermsShort(perms) }}</span>
                    </span>
                  </template>
                  <span v-if="!Object.values(admin.modules ?? {}).some(p => p?.enabled)" class="text-[11px] text-slate-300">Sin accesos</span>
                </div>
              </td>
              <td class="px-5 py-4">
                <span :class="['inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full',
                  admin.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600']">
                  <span class="w-1.5 h-1.5 rounded-full bg-current flex-shrink-0"></span>
                  {{ admin.is_active ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td class="px-5 py-4 text-[12px] text-slate-400">{{ fmtDate(admin.created_at) }}</td>
              <td class="px-5 py-4">
                <div class="flex gap-2">
                  <button @click="openEdit(admin)" title="Editar"
                    class="w-8 h-8 rounded-lg bg-blue-50 hover:bg-blue-100 flex items-center justify-center transition">
                    <svg viewBox="0 0 24 24" class="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </button>
                  <button @click="toggleStatus(admin)" :title="admin.is_active ? 'Inhabilitar' : 'Habilitar'"
                    :class="['w-8 h-8 rounded-lg flex items-center justify-center transition',
                      admin.is_active ? 'bg-amber-50 hover:bg-amber-100' : 'bg-emerald-50 hover:bg-emerald-100']">
                    <svg v-if="admin.is_active" viewBox="0 0 24 24" class="w-3.5 h-3.5 text-amber-600" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="15" x2="9" y1="9" y2="15"/><line x1="9" x2="15" y1="9" y2="15"/></svg>
                    <svg v-else viewBox="0 0 24 24" class="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </button>
                  <button @click="askDelete(admin)" title="Eliminar"
                    class="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center transition">
                    <svg viewBox="0 0 24 24" class="w-3.5 h-3.5 text-red-500" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        </div>
      </template>
    </div>

    <!-- ── Modal Crear / Editar ── -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="modal.open" class="fixed inset-0 z-[150] flex items-center justify-center p-4" style="background:rgba(15,23,42,0.6);" @click.self="closeModal">
          <div class="bg-white rounded-3xl shadow-2xl w-full max-w-[540px] flex flex-col max-h-[90vh] overflow-hidden">

            <!-- Modal header -->
            <div class="flex items-center justify-between px-6 py-5 border-b border-slate-100 flex-shrink-0">
              <div>
                <p class="font-black text-[#0f172a]">{{ modal.mode === 'create' ? 'Nuevo Sub-Admin' : 'Editar Admin' }}</p>
                <p class="text-[12px] text-slate-400 mt-0.5">
                  {{ modal.mode === 'create' ? 'Crea una cuenta y define sus accesos' : `Editando permisos de ${modal.adminName}` }}
                </p>
              </div>
              <button @click="closeModal" class="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition text-lg">×</button>
            </div>

            <!-- Modal body -->
            <div class="overflow-y-auto flex-1 p-6 space-y-5">

              <!-- Datos de cuenta -->
              <div class="space-y-3">
                <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Datos de cuenta</p>
                <div>
                  <label class="block text-[12px] font-bold text-slate-500 mb-1">Nombre completo *</label>
                  <input v-model="form.name" type="text" placeholder="Ej: Carlos López"
                    :class="['w-full border rounded-xl px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-teal-500/30', errors.name ? 'border-red-400' : 'border-slate-200']" />
                  <p v-if="errors.name" class="text-[11px] text-red-500 mt-1">{{ errors.name }}</p>
                </div>
                <template v-if="modal.mode === 'create'">
                  <div>
                    <label class="block text-[12px] font-bold text-slate-500 mb-1">Correo electrónico *</label>
                    <input v-model="form.email" type="email" placeholder="correo@ejemplo.com"
                      :class="['w-full border rounded-xl px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-teal-500/30', errors.email ? 'border-red-400' : 'border-slate-200']" />
                    <p v-if="errors.email" class="text-[11px] text-red-500 mt-1">{{ errors.email }}</p>
                  </div>
                  <div>
                    <label class="block text-[12px] font-bold text-slate-500 mb-1">Contraseña *</label>
                    <div class="relative">
                      <input v-model="form.password" :type="showPwd ? 'text' : 'password'" placeholder="Mínimo 8 caracteres"
                        :class="['w-full border rounded-xl px-3 py-2.5 pr-10 text-[13px] focus:outline-none focus:ring-2 focus:ring-teal-500/30', errors.password ? 'border-red-400' : 'border-slate-200']" />
                      <button type="button" @click="showPwd = !showPwd"
                        class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs">
                        {{ showPwd ? 'Ocultar' : 'Ver' }}
                      </button>
                    </div>
                    <p v-if="errors.password" class="text-[11px] text-red-500 mt-1">{{ errors.password }}</p>
                  </div>
                </template>
              </div>

              <!-- Módulos -->
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Acceso a módulos</p>
                  <span class="text-[11px] text-[#0d4f5c] font-bold">
                    {{ Object.values(form.modules).filter(m => m?.enabled).length }} / {{ availableModules.length }} activos
                  </span>
                </div>
                <div class="space-y-2">
                  <div v-for="mod in availableModules" :key="mod"
                    :class="['border rounded-xl overflow-hidden transition-colors', form.modules[mod]?.enabled ? 'border-[#0d4f5c]/30' : 'border-slate-200']">
                    <!-- Module header -->
                    <div @click="toggleModule(mod)"
                      :class="['flex items-center gap-3 px-4 py-3 cursor-pointer select-none',
                        form.modules[mod]?.enabled ? 'bg-[#0d4f5c]/5' : 'bg-slate-50 hover:bg-slate-100']">
                      <span class="text-lg flex-shrink-0">{{ moduleIcon(mod) }}</span>
                      <div class="flex-1 min-w-0">
                        <p class="text-[13px] font-bold text-[#0f172a]">{{ moduleLabel(mod) }}</p>
                        <p class="text-[11px] text-slate-400">{{ moduleDesc(mod) }}</p>
                      </div>
                      <!-- Toggle -->
                      <div :class="['w-10 h-5 rounded-full relative flex-shrink-0 transition-colors', form.modules[mod]?.enabled ? 'bg-[#0d4f5c]' : 'bg-slate-200']">
                        <span class="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all"
                          :style="{ left: form.modules[mod]?.enabled ? '22px' : '2px' }"></span>
                      </div>
                    </div>
                    <!-- Granular perms -->
                    <div v-if="form.modules[mod]?.enabled" class="flex flex-wrap gap-2 px-4 py-2.5 bg-slate-50 border-t border-slate-100">
                      <label v-for="perm in modulePerms(mod)" :key="perm"
                        class="flex items-center gap-1.5 cursor-pointer select-none" @click.stop>
                        <input type="checkbox" :checked="form.modules[mod][perm]"
                          @change="form.modules[mod][perm] = $event.target.checked"
                          class="rounded accent-[#0d4f5c] w-3.5 h-3.5 cursor-pointer" />
                        <span :class="['text-[12px] font-semibold', form.modules[mod][perm] ? 'text-[#0d4f5c]' : 'text-slate-400']">
                          {{ permLabel(perm) }}
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Error general -->
              <div v-if="modal.error" class="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-800 text-[12px] font-semibold px-4 py-3 rounded-xl">
                <span>⚠</span> {{ modal.error }}
              </div>
            </div>

            <!-- Modal footer -->
            <div class="flex justify-end gap-3 px-6 py-4 border-t border-slate-100 flex-shrink-0">
              <button @click="closeModal" :disabled="modal.saving"
                class="px-5 py-2.5 rounded-xl border border-slate-200 text-[13px] text-slate-600 hover:bg-slate-50 transition disabled:opacity-50">
                Cancelar
              </button>
              <button @click="submitForm" :disabled="modal.saving"
                class="px-5 py-2.5 rounded-xl bg-[#0d4f5c] text-white text-[13px] font-bold hover:opacity-90 transition disabled:opacity-60">
                <svg v-if="modal.saving" class="inline animate-spin w-3.5 h-3.5 mr-1.5" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                {{ modal.saving ? 'Guardando…' : modal.mode === 'create' ? 'Crear administrador' : 'Guardar cambios' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ── Modal Confirmar Eliminación ── -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="deleteModal.open" class="fixed inset-0 z-[150] flex items-center justify-center p-4" style="background:rgba(15,23,42,0.6);" @click.self="deleteModal.open = false">
          <div class="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 space-y-4">
            <div>
              <p class="font-black text-[#0f172a]">Eliminar administrador</p>
              <p class="text-[12px] text-slate-400 mt-0.5">Esta acción no se puede deshacer</p>
            </div>
            <div class="flex items-center gap-3 bg-slate-50 rounded-2xl p-4">
              <img :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${deleteModal.admin?.name}`"
                class="w-11 h-11 rounded-xl border border-slate-200 flex-shrink-0" alt="" />
              <div>
                <p class="font-bold text-[#0f172a] text-[13px]">{{ deleteModal.admin?.name }}</p>
                <p class="text-[11px] text-slate-400">{{ deleteModal.admin?.email }}</p>
              </div>
            </div>
            <p class="text-[12px] text-slate-500 bg-amber-50 border-l-2 border-amber-400 px-3 py-2.5 rounded-r-xl leading-relaxed">
              Se eliminarán su cuenta y todos sus permisos. Sus sesiones activas serán revocadas.
            </p>
            <div class="flex gap-3 pt-1">
              <button @click="deleteModal.open = false" class="flex-1 border border-slate-200 text-[13px] text-slate-600 font-semibold py-2.5 rounded-xl hover:bg-slate-50 transition">
                Cancelar
              </button>
              <button @click="executeDelete" :disabled="deleteModal.saving"
                class="flex-1 bg-red-600 text-white text-[13px] font-bold py-2.5 rounded-xl hover:bg-red-700 transition disabled:opacity-60">
                {{ deleteModal.saving ? 'Eliminando…' : 'Sí, eliminar' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import api from '@/services/api'
import { useAdminToast } from './useAdminToast'

const { showToast } = useAdminToast()

const admins            = ref([])
const availableModules  = ref([])
const modulePermissions = ref({})
const loading           = ref(true)
const search            = ref('')
const showPwd           = ref(false)

const MODULE_META = {
  dashboard:     { label: 'Dashboard',         icon: '📊', desc: 'Ver estadísticas generales' },
  users:         { label: 'Usuarios',          icon: '👥', desc: 'Gestionar clientes y profesionales' },
  categories:    { label: 'Categorías',        icon: '🏷️', desc: 'Administrar categorías y servicios' },
  payments:      { label: 'Pagos',             icon: '💳', desc: 'Gestionar cobros y dispersiones' },
  services:      { label: 'Servicios',         icon: '🔧', desc: 'Crear y editar servicios' },
  reports:       { label: 'Reportes',          icon: '📈', desc: 'Ver reportes operativos y financieros' },
  auditory:      { label: 'Auditoría',         icon: '🔍', desc: 'Historial de acciones del sistema' },
  live_services: { label: 'Servicios en Vivo', icon: '🔴', desc: 'Monitoreo en tiempo real de la operación' },
}

const moduleLabel = (mod) => MODULE_META[mod]?.label ?? mod
const moduleIcon  = (mod) => MODULE_META[mod]?.icon  ?? '📁'
const moduleDesc  = (mod) => MODULE_META[mod]?.desc  ?? ''

const PERM_LABELS = { read: 'Leer', write: 'Crear', edit: 'Editar', delete: 'Eliminar' }
const PERM_SHORT  = { read: 'R', write: 'C', edit: 'E', delete: 'D' }
const permLabel   = (p) => PERM_LABELS[p] ?? p
const modulePerms = (mod) => modulePermissions.value[mod] ?? ['read']
const activePerms = (permsObj) =>
  Object.keys(PERM_LABELS).filter(p => permsObj[p]).map(p => PERM_LABELS[p])
const activePermsShort = (permsObj) =>
  Object.keys(PERM_SHORT).filter(p => permsObj[p]).map(p => PERM_SHORT[p]).join('')

const fmtDate = (d) => {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
}

const filtered = computed(() => {
  if (!search.value.trim()) return admins.value
  const q = search.value.toLowerCase()
  return admins.value.filter(a =>
    a.name.toLowerCase().includes(q) || a.email.toLowerCase().includes(q)
  )
})

const ADM_MOBILE_PG = 6
const admMobilePage = ref(1)
const admMobilePagedItems = computed(() => {
  const start = (admMobilePage.value - 1) * ADM_MOBILE_PG
  return filtered.value.slice(start, start + ADM_MOBILE_PG)
})
const admMobileTotalPages = computed(() => Math.ceil(filtered.value.length / ADM_MOBILE_PG))
watch(search, () => { admMobilePage.value = 1 })

// ── Modal state ────────────────────────────────────────────
const modal = reactive({ open: false, mode: 'create', saving: false, error: '', editId: null, adminName: '' })
const errors = reactive({ name: '', email: '', password: '' })
const form = reactive({ name: '', email: '', password: '', modules: {} })
const deleteModal = reactive({ open: false, saving: false, admin: null })

// ── Module init ────────────────────────────────────────────
const initModules = (existing = {}) => {
  const mods = {}
  availableModules.value.forEach(m => {
    const perms = modulePermissions.value[m] ?? ['read']
    const ex = existing[m]
    if (ex && typeof ex === 'object') {
      mods[m] = { ...ex }
    } else {
      const enabled = !!ex
      const entry = { enabled }
      perms.forEach(p => { entry[p] = enabled && p === 'read' })
      mods[m] = entry
    }
    perms.forEach(p => { if (mods[m][p] === undefined) mods[m][p] = false })
  })
  return mods
}

const toggleModule = (mod) => {
  const cur = form.modules[mod]
  if (!cur) return
  cur.enabled = !cur.enabled
  if (cur.enabled) {
    const perms = modulePermissions.value[mod] ?? ['read']
    if (!perms.some(p => cur[p])) cur.read = true
  }
}

// ── Fetch ──────────────────────────────────────────────────
const fetchAdmins = async () => {
  loading.value = true
  try {
    const { data } = await api.get('/admin/sub-admins')
    admins.value            = data.admins ?? []
    availableModules.value  = data.modules ?? []
    modulePermissions.value = data.module_permissions ?? {}
  } catch {
    showToast('Error al cargar los administradores', 'error')
  } finally {
    loading.value = false
  }
}

onMounted(fetchAdmins)

// ── Validate ───────────────────────────────────────────────
const validate = () => {
  errors.name = errors.email = errors.password = ''
  let ok = true
  if (!form.name.trim()) { errors.name = 'El nombre es obligatorio.'; ok = false }
  if (modal.mode === 'create') {
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) { errors.email = 'Ingresa un correo válido.'; ok = false }
    if (form.password.length < 8) { errors.password = 'La contraseña debe tener al menos 8 caracteres.'; ok = false }
  }
  return ok
}

// ── Open / Close ───────────────────────────────────────────
const openCreate = () => {
  Object.assign(form, { name: '', email: '', password: '', modules: initModules() })
  Object.assign(modal, { open: true, mode: 'create', error: '', editId: null, adminName: '' })
  errors.name = errors.email = errors.password = ''
  showPwd.value = false
}

const openEdit = (admin) => {
  Object.assign(form, { name: admin.name, email: '', password: '', modules: initModules(admin.modules) })
  Object.assign(modal, { open: true, mode: 'edit', error: '', editId: admin.id, adminName: admin.name })
  errors.name = errors.email = errors.password = ''
}

const closeModal = () => { if (!modal.saving) modal.open = false }

// ── Submit ─────────────────────────────────────────────────
const submitForm = async () => {
  if (!validate()) return
  modal.error = ''
  modal.saving = true
  try {
    if (modal.mode === 'create') {
      const { data } = await api.post('/admin/sub-admins', {
        name: form.name, email: form.email, password: form.password, modules: form.modules,
      })
      admins.value.unshift(data.admin)
      showToast(`${data.admin.name} creado correctamente`, 'success')
    } else {
      const { data } = await api.put(`/admin/sub-admins/${modal.editId}`, {
        name: form.name, modules: form.modules,
      })
      const idx = admins.value.findIndex(a => a.id === modal.editId)
      if (idx !== -1) admins.value[idx] = data.admin
      showToast('Permisos actualizados correctamente', 'success')
    }
    modal.open = false
  } catch (e) {
    modal.error = e.response?.data?.message ?? 'Error al guardar. Intenta de nuevo.'
  } finally {
    modal.saving = false
  }
}

// ── Toggle status ──────────────────────────────────────────
const toggleStatus = async (admin) => {
  try {
    const { data } = await api.put(`/admin/sub-admins/${admin.id}`, { is_active: !admin.is_active })
    const idx = admins.value.findIndex(a => a.id === admin.id)
    if (idx !== -1) admins.value[idx] = data.admin
    showToast(data.admin.is_active ? 'Administrador habilitado' : 'Administrador inhabilitado', 'success')
  } catch (e) {
    showToast(e.response?.data?.message ?? 'Error al cambiar estado', 'error')
  }
}

// ── Delete ─────────────────────────────────────────────────
const askDelete = (admin) => {
  deleteModal.admin = admin
  deleteModal.saving = false
  deleteModal.open = true
}

const executeDelete = async () => {
  deleteModal.saving = true
  try {
    await api.delete(`/admin/sub-admins/${deleteModal.admin.id}`)
    admins.value = admins.value.filter(a => a.id !== deleteModal.admin.id)
    showToast(`${deleteModal.admin.name} eliminado`, 'success')
    deleteModal.open = false
  } catch (e) {
    showToast(e.response?.data?.message ?? 'Error al eliminar', 'error')
    deleteModal.open = false
  } finally {
    deleteModal.saving = false
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .2s ease }
.fade-enter-from, .fade-leave-to { opacity: 0 }
</style>
