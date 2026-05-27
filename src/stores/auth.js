import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'

const extractError = (error, fallback = 'Error inesperado') => {
  const errors = error.response?.data?.errors
  if (errors) return Object.values(errors).flat().join(' · ')
  return error.response?.data?.message || error.message || fallback
}

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()

  const user            = ref(null)
  const token           = ref(null)
  const role            = ref(null)
  const isAuthenticated = ref(false)

  const isClient       = computed(() => role.value === 'client')
  const isProfessional = computed(() => role.value === 'professional')
  const isAdmin        = computed(() => role.value === 'admin')

  const initAuth = () => {
    const storedAuth  = localStorage.getItem('isAuthenticated')
    const storedRole  = localStorage.getItem('userRole')
    const storedToken = localStorage.getItem('token')
    const storedUser  = localStorage.getItem('user')
    if (storedAuth === 'true' && storedRole && storedToken) {
      isAuthenticated.value = true
      role.value            = storedRole
      token.value           = storedToken
      user.value            = storedUser ? JSON.parse(storedUser) : null
    }
  }

  const login = async (email, password, selectedRole) => {
    try {
      const { data } = await api.post('/login', { email, password, role: selectedRole })
      if (data.success) {
        user.value            = data.user
        token.value           = data.token
        role.value            = data.role
        isAuthenticated.value = true
        localStorage.setItem('isAuthenticated', 'true')
        localStorage.setItem('userRole',        data.role)
        localStorage.setItem('token',           data.token)
        localStorage.setItem('user',            JSON.stringify(data.user))
        router.push(`/dashboard/${data.role}`)
        return { success: true }
      }
      throw new Error(data.message || 'Login failed')
    } catch (error) {
      const message = extractError(error, 'Error al iniciar sesión')
      return { success: false, error: message }
    }
  }

  const register = async (name, email, password, selectedRole) => {
    try {
      const { data } = await api.post('/register', { name, email, password, role: selectedRole })
      if (data.success) {
        if (selectedRole === 'professional') {
          localStorage.setItem('newProfessionalRegistered', 'true')
        }
        return await login(email, password, selectedRole)
      }
      throw new Error(data.message || 'Registration failed')
    } catch (error) {
      const message = extractError(error, 'Error al registrarse')
      return { success: false, error: message }
    }
  }

  const logout = async () => {
    try {
      await api.post('/logout')
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    } finally {
      user.value            = null
      token.value           = null
      role.value            = null
      isAuthenticated.value = false
      localStorage.removeItem('isAuthenticated')
      localStorage.removeItem('userRole')
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      router.push('/login')
    }
  }

  const updateUser = (userData) => {
    user.value = { ...user.value, ...userData }
    localStorage.setItem('user', JSON.stringify(user.value))
  }

  return {
    user, token, role, isAuthenticated,
    isClient, isProfessional, isAdmin,
    initAuth, login, register, logout, updateUser,
  }
})
