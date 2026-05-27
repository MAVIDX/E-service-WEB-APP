<template>
  <div class="h-screen overflow-hidden">
    <AdminPanel @logout="authStore.logout()" />
  </div>
</template>

<script setup>
import AdminPanel from '@/panels/AdminPanel.vue'
import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()
const isDev = import.meta.env.DEV
</script>
