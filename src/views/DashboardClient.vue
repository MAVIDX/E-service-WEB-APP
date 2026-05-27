<template>
  <div class="h-screen overflow-hidden">
    <ClientePanel @logout="authStore.logout()" />
  </div>
</template>

<script setup>
import ClientePanel from '@/panels/ClientePanel.vue'
import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()
const isDev = import.meta.env.DEV
</script>
