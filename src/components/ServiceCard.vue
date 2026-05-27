<template>
  <div
    class="bg-white border border-[#eef2f7] rounded-2xl overflow-hidden cursor-pointer transition hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-100"
    @click="$emit('click')"
  >
    <div class="h-36 flex items-center justify-center text-5xl" :style="{ background: gradient }">
      {{ emoji }}
    </div>
    <div class="p-4">
      <p class="text-sm font-bold text-[#0f172a] truncate">{{ name }}</p>
      <p class="text-xs text-slate-500 mt-0.5 truncate">{{ category }}</p>
      <div class="flex items-center justify-between mt-3">
        <span class="text-sm font-black text-[#2563ff]">Desde ${{ price }}</span>
        <span class="flex items-center gap-1 text-xs text-slate-500">
          <span class="text-amber-400">★</span> {{ rating }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  name:     { type: String, required: true },
  category: { type: String, default: '' },
  price:    { type: [String, Number], required: true },
  rating:   { type: [String, Number], default: '4.8' },
  emoji:    { type: String, default: '🔧' },
  gradient: { type: String, default: 'linear-gradient(135deg,#eff6ff,#dbeafe)' },
})
defineEmits(['click'])
</script>
