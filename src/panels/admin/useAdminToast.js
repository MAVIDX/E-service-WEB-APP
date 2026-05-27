import { ref } from 'vue'

// Estado de módulo: compartido entre todas las instancias del composable
const toasts = ref([])
let seq = 0

export function useAdminToast() {
  const showToast = (message, type = 'info') => {
    const id = ++seq
    toasts.value.push({ id, message, type })
    setTimeout(() => {
      toasts.value = toasts.value.filter(t => t.id !== id)
    }, 3500)
  }

  const removeToast = (id) => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  return { toasts, showToast, removeToast }
}
