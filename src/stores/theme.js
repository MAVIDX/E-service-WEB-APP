import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const stored = localStorage.getItem('theme')
  const isDark = ref(stored ? stored === 'dark' : true)

  const toggle  = () => { isDark.value = !isDark.value }
  const setDark = (val) => { isDark.value = val }

  watch(isDark, (val) => {
    localStorage.setItem('theme', val ? 'dark' : 'light')
  }, { immediate: true })

  return { isDark, toggle, setDark }
})
