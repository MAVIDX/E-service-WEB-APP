<template>
  <aside
    class="h-full flex flex-col py-6 px-5"
    :class="dark ? 'bg-[#071126] text-white' : 'bg-white text-slate-700'"
  >
    <!-- Logo -->
    <div class="flex items-center gap-2.5 mb-8 px-1">
      <div
        class="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        :class="dark ? 'bg-white/10' : 'bg-blue-50'"
      >
        <svg viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" :stroke="dark ? '#93c5fd' : '#2563ff'">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      </div>
      <div class="flex-1 min-w-0">
        <h1 class="text-[15px] font-black leading-tight" :class="dark ? 'text-white' : 'text-[#2563ff]'">e-service</h1>
        <p class="text-[9px] font-bold uppercase tracking-wider leading-tight" :class="dark ? 'text-cyan-400' : 'text-cyan-500'">Profesionales a tu alcance</p>
      </div>
      <!-- Mobile close button -->
      <button
        v-if="showClose"
        @click="$emit('closeMobile')"
        class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
        :class="dark ? 'hover:bg-white/10 text-white/60 hover:text-white' : 'hover:bg-slate-100 text-slate-400 hover:text-slate-600'"
      >
        <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 6 6 18M6 6l12 12"/>
        </svg>
      </button>
    </div>

    <!-- Nav -->
    <nav class="flex-1 space-y-0.5 overflow-y-auto">
      <template v-for="item in items" :key="item.name || 'divider'">
        <div v-if="item.divider" class="my-2 border-t" :class="dark ? 'border-white/10' : 'border-slate-100'" />
        <button
          v-else
          @click="$emit('navigate', item.name)"
          :class="[
            'w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all text-sm',
            activePage === item.name
              ? (dark ? 'bg-white/15 text-white font-semibold' : 'bg-blue-50 text-[#2563ff] font-semibold')
              : (dark ? 'text-white/55 hover:bg-white/10 hover:text-white' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700')
          ]"
        >
          <span class="flex items-center gap-3">
            <span class="w-[18px] h-[18px] flex items-center justify-center flex-shrink-0">
              <svg v-if="item.iconSvg" viewBox="0 0 24 24" class="w-[17px] h-[17px]" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" v-html="item.iconSvg" />
              <span v-else class="text-sm leading-none">{{ item.icon }}</span>
            </span>
            {{ item.label ?? item.name }}
          </span>
          <span
            v-if="item.badge"
            class="min-w-[18px] h-[18px] px-1 rounded-full bg-purple-500 text-white text-[9px] font-bold flex items-center justify-center flex-shrink-0"
          >{{ item.badge }}</span>
        </button>
      </template>
    </nav>

    <!-- Footer -->
    <div class="mt-4 pt-4 border-t" :class="dark ? 'border-white/10' : 'border-slate-100'">
      <slot name="footer">
        <button
          @click="$emit('logout')"
          :class="['text-xs font-medium flex items-center gap-2', dark ? 'text-white/40 hover:text-white' : 'text-slate-400 hover:text-slate-600']"
        >
          <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" x2="9" y1="12" y2="12"/>
          </svg>
          Cerrar sesión
        </button>
      </slot>
    </div>
  </aside>
</template>

<script setup>
defineProps({
  items:      { type: Array,  required: true },
  activePage: { type: String, default: '' },
  dark:       { type: Boolean, default: false },
  showClose:  { type: Boolean, default: false },
})
defineEmits(['navigate', 'logout', 'closeMobile'])
</script>
