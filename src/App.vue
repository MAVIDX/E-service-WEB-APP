<template>
  <router-view />
</template>

<script setup>
import { watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'

const authStore  = useAuthStore()
const themeStore = useThemeStore()

authStore.initAuth()

const applyTheme = (dark) => document.documentElement.classList.toggle('dark', dark)

applyTheme(themeStore.isDark)
watch(() => themeStore.isDark, applyTheme)
</script>
