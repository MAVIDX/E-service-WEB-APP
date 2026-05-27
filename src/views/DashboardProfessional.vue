<template>
  <div class="h-screen overflow-hidden">
    <ProfPanel @logout="authStore.logout()" />
  </div>
</template>

<script setup>
import ProfPanel from '@/panels/ProfPanel.vue'
import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()
const isDev = import.meta.env.DEV
</script>
