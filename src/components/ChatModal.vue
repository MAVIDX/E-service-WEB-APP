<template>
  <Transition name="fade">
    <div v-if="modelValue" class="fixed inset-0 z-[150] flex items-end sm:items-center justify-center p-0 sm:p-4" style="background:rgba(15,23,42,0.65);" @click.self="close">
      <div class="bg-white w-full sm:max-w-lg sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden" style="height:min(90vh,580px)">

        <!-- Header -->
        <div class="flex items-center gap-3 px-5 py-4 border-b border-slate-100 flex-shrink-0">
          <div class="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0" :style="{background: avatarColor}">
            {{ initials(otherName) }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-bold text-[#0f172a] text-[14px] leading-tight">{{ otherName }}</p>
            <p class="text-[11px] font-semibold" :class="otherOnline ? 'text-emerald-500' : 'text-slate-400'">
              <span class="inline-block w-1.5 h-1.5 rounded-full mr-1 align-middle" :class="otherOnline ? 'bg-emerald-500' : 'bg-slate-300'"></span>
              {{ otherOnline ? 'En línea' : 'Desconectado' }}
            </p>
          </div>
          <p class="text-[11px] text-slate-400 truncate max-w-[120px] hidden sm:block">{{ serviceName }}</p>
          <button @click="close" class="w-8 h-8 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition flex-shrink-0">
            <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>

        <!-- Messages -->
        <div class="flex-1 overflow-y-auto p-5 space-y-3 bg-slate-50" ref="bodyRef">
          <div v-if="apiError" class="flex items-center gap-2 text-[12px] text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
            ⚠️ {{ apiError }}
          </div>
          <div v-if="loading && !messages.length" class="flex justify-center py-8">
            <svg class="animate-spin w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
          </div>
          <div v-else-if="!loading && !messages.length" class="flex flex-col items-center justify-center py-12 text-slate-300">
            <svg viewBox="0 0 24 24" class="w-12 h-12 mb-3" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            <p class="text-[13px]">No hay mensajes aún. ¡Empieza la conversación!</p>
          </div>
          <template v-else>
            <div v-for="msg in messages" :key="msg.id" :class="['flex', msg.is_mine ? 'justify-end' : 'justify-start']">
              <div :class="['max-w-[75%] px-4 py-2.5 rounded-2xl text-[13px]', msg.is_mine ? 'bg-[#2563ff] text-white rounded-br-sm' : 'bg-white text-[#0f172a] rounded-bl-sm shadow-sm border border-slate-100']">
                <p>{{ msg.message }}</p>
                <p :class="['text-[10px] mt-1', msg.is_mine ? 'text-blue-200' : 'text-slate-400']">{{ fmtTime(msg.created_at) }}</p>
              </div>
            </div>
          </template>
        </div>

        <!-- Input -->
        <div class="px-4 py-3 border-t border-slate-100 flex items-center gap-3 bg-white flex-shrink-0">
          <input
            v-model="newMessage"
            @keydown.enter.prevent="send"
            :disabled="sending"
            type="text"
            placeholder="Escribe un mensaje..."
            class="flex-1 bg-slate-50 rounded-xl px-4 py-2.5 text-[13px] outline-none border border-slate-200 focus:border-blue-400 transition disabled:opacity-60"
          />
          <button
            @click="send"
            :disabled="!newMessage.trim() || sending"
            class="w-10 h-10 rounded-xl bg-[#2563ff] flex items-center justify-center text-white hover:bg-blue-700 transition disabled:opacity-40 flex-shrink-0"
          >
            <svg viewBox="0 0 24 24" class="w-4 h-4" fill="currentColor"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
          </button>
        </div>

      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import chatService from '@/services/chatService'
import { useAuthStore } from '@/stores/auth'

const props = defineProps({
  modelValue:  { type: Boolean, required: true },
  requestId:   { type: [Number, String], default: null },
  otherName:   { type: String, default: 'Profesional' },
  serviceName: { type: String, default: '' },
})
const emit = defineEmits(['update:modelValue', 'read'])

const authStore   = useAuthStore()
const messages    = ref([])
const newMessage  = ref('')
const loading     = ref(false)
const sending     = ref(false)
const otherOnline = ref(false)
const apiError    = ref('')
const bodyRef     = ref(null)
let pollTimer     = null

const COLORS = ['#3b82f6','#10b981','#f43f5e','#7c3aed','#f59e0b','#0ea5e9']
const avatarColor = COLORS[String(props.requestId).split('').reduce((a, c) => a + c.charCodeAt(0), 0) % COLORS.length]

const initials = (name) =>
  (name || '?').split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()

const fmtTime = (d) => {
  if (!d) return ''
  return new Date(d).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
}

const scrollBottom = () => {
  nextTick(() => {
    if (bodyRef.value) bodyRef.value.scrollTop = bodyRef.value.scrollHeight
  })
}

const loadMessages = async () => {
  try {
    const { data } = await chatService.getMessages(props.requestId)
    const list = Array.isArray(data) ? data : (data?.messages ?? data?.data ?? [])
    const myId = authStore.user?.id
    messages.value = list.map(m => ({
      ...m,
      is_mine: m.is_mine ?? (m.sender_id === myId),
    }))
    otherOnline.value = data?.other_online ?? false
    apiError.value = ''
    scrollBottom()
  } catch (e) {
    apiError.value = e?.response?.data?.message ?? 'Error al cargar mensajes'
  }
}

const send = async () => {
  const text = newMessage.value.trim()
  if (!text || sending.value) return
  sending.value = true
  newMessage.value = ''
  try {
    await chatService.sendMessage(props.requestId, text)
    await loadMessages()
    apiError.value = ''
  } catch (e) {
    newMessage.value = text
    apiError.value = e?.response?.data?.message ?? 'Error al enviar'
  } finally {
    sending.value = false
  }
}

const close = () => {
  emit('update:modelValue', false)
  emit('read')
}

watch(() => props.modelValue, (open) => {
  if (open) {
    loading.value = true
    loadMessages().finally(() => { loading.value = false })
    pollTimer = setInterval(loadMessages, 3000)
  } else {
    clearInterval(pollTimer)
    pollTimer = null
    newMessage.value = ''
    apiError.value = ''
  }
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .2s ease }
.fade-enter-from, .fade-leave-to { opacity: 0 }
</style>
