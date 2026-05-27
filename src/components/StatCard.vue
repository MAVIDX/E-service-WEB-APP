<template>
  <div
    class="rounded-2xl p-5 flex items-start justify-between gap-3"
    :class="dark ? 'bg-white/5 border border-white/10' : 'bg-white border border-slate-100'"
  >
    <div class="flex-1 min-w-0">
      <p class="text-[12px] font-medium leading-tight" :class="dark ? 'text-white/50' : 'text-slate-500'">{{ label }}</p>
      <p class="text-[22px] font-black mt-1.5 leading-tight" :class="dark ? 'text-white' : 'text-[#0f172a]'">{{ value }}</p>
      <div class="mt-1.5 flex items-center gap-2 flex-wrap">
        <span v-if="trend !== undefined" class="text-[12px] font-semibold" :class="trend >= 0 ? 'text-emerald-500' : 'text-red-500'">
          {{ trend >= 0 ? '+' : '' }}{{ trend }}% vs ayer
        </span>
        <span v-if="sub" class="text-[12px] text-slate-400">{{ sub }}</span>
        <button v-if="link" class="text-[12px] text-[#2563ff] font-semibold hover:underline">{{ link }}</button>
      </div>
    </div>
    <div v-if="iconSvg" class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5" :class="iconBg">
      <svg viewBox="0 0 24 24" class="w-5 h-5" fill="none" :stroke="iconColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" v-html="iconSvg" />
    </div>
    <span v-else-if="icon" class="text-2xl flex-shrink-0 mt-0.5">{{ icon }}</span>
  </div>
</template>

<script setup>
defineProps({
  label:     { type: String, required: true },
  value:     { type: [String, Number], required: true },
  icon:      { type: String, default: '' },
  iconSvg:   { type: String, default: '' },
  iconBg:    { type: String, default: 'bg-blue-50' },
  iconColor: { type: String, default: '#2563ff' },
  trend:     { type: Number, default: undefined },
  sub:       { type: String, default: '' },
  link:      { type: String, default: '' },
  dark:      { type: Boolean, default: false },
})
</script>
