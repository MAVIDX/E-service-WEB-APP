<template>
  <div class="login-page">
    <!-- Background orbs -->
    <div class="login-bg">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="orb orb-3"></div>
      <div class="grid-overlay"></div>
    </div>

    <div class="relative z-10 w-full max-w-[470px] mx-auto px-4 py-10">
      <!-- Logo -->
      <div class="text-center mb-9">
        <div class="flex flex-col items-center gap-2 mb-3">
          <img src="/images/logo-services-sin-fondo.png" alt="e-service" class="h-20 w-auto object-contain drop-shadow-lg" />
        </div>
      </div>

      <!-- Card -->
      <div class="login-card">
        <div class="card-bar"></div>

        <!-- Tabs -->
        <div class="flex bg-white/[0.06] rounded-[14px] p-1 gap-1 mb-6">
          <button
            type="button"
            @click="isLogin = true"
            :class="['flex-1 py-3 rounded-[11px] text-sm font-semibold transition-all', isLogin ? 'bg-gradient-to-r from-[#7ec8f5] to-[#c084f5] text-white shadow-lg' : 'text-white/50 hover:text-white']"
          >Iniciar sesión</button>
          <button
            type="button"
            @click="isLogin = false"
            :class="['flex-1 py-3 rounded-[11px] text-sm font-semibold transition-all', !isLogin ? 'bg-gradient-to-r from-[#7ec8f5] to-[#c084f5] text-white shadow-lg' : 'text-white/50 hover:text-white']"
          >Crear cuenta</button>
        </div>

        <p class="text-sm text-white/50 mb-7">
          {{ isLogin ? 'Ingresa tus credenciales para continuar' : 'Únete a nuestra comunidad de profesionales' }}
        </p>

        <!-- Role selector (register only) -->
        <div v-if="!isLogin" class="flex flex-col gap-2.5 mb-7">
          <div
            v-for="r in roles" :key="r.value"
            @click="selectedRole = r.value"
            :class="['flex items-center gap-3 p-3.5 rounded-[14px] border-[1.5px] cursor-pointer transition-all',
              selectedRole === r.value ? 'bg-[#7ec8f5]/12 border-[#7ec8f5] shadow-[0_0_18px_rgba(126,200,245,0.2)]' : 'bg-white/5 border-white/10 hover:bg-white/9']"
          >
            <div class="w-10 h-10 rounded-full bg-gradient-to-br from-[#7ec8f5] to-[#c084f5] flex items-center justify-center text-xl flex-shrink-0">{{ r.icon }}</div>
            <div class="flex-1">
              <p class="text-white font-bold text-[15px] leading-tight">{{ r.name }}</p>
              <p class="text-white/45 text-xs">{{ r.desc }}</p>
            </div>
            <div :class="['w-5 h-5 rounded-full bg-gradient-to-br from-[#7ec8f5] to-[#c084f5] flex items-center justify-center text-white text-xs font-black transition-opacity', selectedRole === r.value ? 'opacity-100' : 'opacity-0']">✓</div>
          </div>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="flex flex-col gap-5">
          <div v-if="!isLogin" class="flex flex-col gap-1.5">
            <label class="text-[13px] font-semibold text-white/75 pl-0.5">Nombre completo</label>
            <div class="input-wrap">
              <svg viewBox="0 0 24 24" class="input-icon" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
              <input type="text" v-model="formData.name" placeholder="Juan Pérez" class="input-field" required />
            </div>
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-[13px] font-semibold text-white/75 pl-0.5">Correo electrónico</label>
            <div class="input-wrap">
              <svg viewBox="0 0 24 24" class="input-icon" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
              <input type="email" v-model="formData.email" placeholder="tu@email.com" class="input-field" required />
            </div>
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-[13px] font-semibold text-white/75 pl-0.5">Contraseña</label>
            <div class="input-wrap">
              <svg viewBox="0 0 24 24" class="input-icon" fill="none" stroke="#fbbf24" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <input :type="showPassword ? 'text' : 'password'" v-model="formData.password" placeholder="••••••••" class="input-field" required />
              <button type="button" @click="showPassword = !showPassword" class="input-icon opacity-40 hover:opacity-80 transition-opacity cursor-pointer text-white">
                <svg v-if="showPassword" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>
                </svg>
                <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" x2="23" y1="1" y2="23"/>
                </svg>
              </button>
            </div>
          </div>

          <div v-if="isLogin" class="flex justify-between items-center -mt-1">
            <label class="flex items-center gap-2 text-white/65 text-[13px] cursor-pointer">
              <input type="checkbox" v-model="rememberMe" class="w-4 h-4 accent-[#7ec8f5] cursor-pointer" />
              <span>Recordarme</span>
            </label>
            <a href="#" class="text-[13px] font-semibold text-[#7ec8f5] hover:text-[#c084f5] transition-colors">¿Olvidaste tu contraseña?</a>
          </div>

          <div v-if="errorMessage" class="bg-[#f472b6]/12 border border-[#f472b6]/35 text-[#fca5c0] rounded-[10px] p-3 text-center text-[13px] font-medium">
            ⚠️ {{ errorMessage }}
          </div>

          <button type="submit" :disabled="isLoading" class="submit-btn mt-1.5">
            <span>{{ isLoading ? 'Cargando…' : (isLogin ? 'Iniciar Sesión' : 'Crear Cuenta') }}</span>
            <span class="text-lg transition-transform group-hover:translate-x-1">{{ isLoading ? '⏳' : '→' }}</span>
          </button>
        </form>

        <!-- Social -->
        <div class="relative text-center my-7">
          <div class="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-white/10"></div>
          <span class="relative bg-white/[0.06] px-5 py-1.5 text-white/45 text-[12px] font-semibold rounded-full backdrop-blur-sm">O continúa con</span>
        </div>

        <button class="w-full flex items-center justify-center gap-2.5 py-3.5 bg-white/7 border-[1.5px] border-white/12 rounded-[13px] text-white text-sm font-semibold hover:bg-white/11 hover:border-[#7ec8f5]/30 hover:-translate-y-0.5 transition-all">
          <svg viewBox="0 0 24 24" class="w-5 h-5 flex-shrink-0">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continuar con Google
        </button>

        <p class="text-center mt-6 text-white/55 text-[13px]">
          <span v-if="isLogin">¿No tienes cuenta? <a @click="isLogin = false" class="gradient-link cursor-pointer">Regístrate</a></span>
          <span v-else>¿Ya tienes cuenta? <a @click="isLogin = true" class="gradient-link cursor-pointer">Inicia sesión</a></span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const isLogin       = ref(true)
const showPassword  = ref(false)
const rememberMe    = ref(false)
const selectedRole  = ref('client')
const isLoading     = ref(false)
const errorMessage  = ref('')

const formData = ref({ name: '', email: '', password: '' })

const roles = [
  { value: 'client',       name: 'Cliente',       icon: '👤', desc: 'Busco contratar servicios' },
  { value: 'professional', name: 'Profesional',   icon: '💼', desc: 'Ofrezco mis servicios' },
]

const handleSubmit = async () => {
  isLoading.value     = true
  errorMessage.value  = ''
  try {
    const result = isLogin.value
      ? await authStore.login(formData.value.email, formData.value.password, selectedRole.value)
      : await authStore.register(formData.value.name, formData.value.email, formData.value.password, selectedRole.value)
    if (!result.success) errorMessage.value = result.error
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  font-family: 'Outfit', -apple-system, sans-serif;
}

.login-bg {
  position: fixed;
  inset: 0;
  background: linear-gradient(135deg, #0d1b2e 0%, #0f2645 50%, #1a1040 100%);
  z-index: 0;
}

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(140px);
  opacity: 0.35;
  animation: orbFloat 22s infinite ease-in-out;
}
.orb-1 { width: 600px; height: 600px; background: #7ec8f5; top: -200px; right: -100px; }
.orb-2 { width: 500px; height: 500px; background: #c084f5; bottom: -150px; left: -100px; animation-delay: -9s; }
.orb-3 { width: 420px; height: 420px; background: #f472b6; top: 50%; left: 50%; transform: translate(-50%, -50%); animation-delay: -4s; }

@keyframes orbFloat {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33%       { transform: translate(70px, -90px) scale(1.08); }
  66%       { transform: translate(-55px, 75px) scale(0.93); }
}

.orb-3 { animation-name: orbFloat3; }
@keyframes orbFloat3 {
  0%, 100% { transform: translate(-50%, -50%) scale(1); }
  33%       { transform: translate(calc(-50% + 70px), calc(-50% - 90px)) scale(1.08); }
  66%       { transform: translate(calc(-50% - 55px), calc(-50% + 75px)) scale(0.93); }
}

.grid-overlay {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(rgba(126,200,245,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(126,200,245,0.04) 1px, transparent 1px);
  background-size: 55px 55px;
}

.login-card {
  background: rgba(255,255,255,0.07);
  backdrop-filter: blur(40px) saturate(170%);
  border: 1px solid rgba(126,200,245,0.18);
  border-radius: 28px;
  padding: 44px 40px;
  position: relative;
  box-shadow: 0 24px 70px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08);
}
.login-card:hover { border-color: rgba(126,200,245,0.32); }

.card-bar {
  position: absolute;
  top: 0; left: 24px; right: 24px;
  height: 3px;
  border-radius: 0 0 4px 4px;
  background: linear-gradient(90deg, #f472b6, #c084f5, #7ec8f5);
}

.form-input {
  width: 100%;
  padding: 14px 18px;
  background: rgba(255,255,255,0.07);
  border: 1.5px solid rgba(255,255,255,0.1);
  border-radius: 13px;
  color: white;
  font-size: 15px;
  font-weight: 500;
  outline: none;
  font-family: inherit;
  transition: all 0.25s;
}
.form-input::placeholder { color: rgba(255,255,255,0.28); }
.form-input:focus {
  background: rgba(126,200,245,0.1);
  border-color: #7ec8f5;
  box-shadow: 0 0 0 3px rgba(126,200,245,0.15);
}

/* Wrapper de inputs con ícono — evita conflicto de especificidad CSS vs Tailwind */
.input-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 13px 16px;
  background: rgba(255,255,255,0.07);
  border: 1.5px solid rgba(255,255,255,0.1);
  border-radius: 13px;
  transition: all 0.25s;
}
.input-wrap:focus-within {
  background: rgba(126,200,245,0.1);
  border-color: #7ec8f5;
  box-shadow: 0 0 0 3px rgba(126,200,245,0.15);
}
.input-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}
.input-field {
  flex: 1;
  min-width: 0;
  background: transparent;
  border: none;
  outline: none;
  color: white;
  font-size: 15px;
  font-weight: 500;
  font-family: inherit;
}
.input-field::placeholder { color: rgba(255,255,255,0.28); }

.submit-btn {
  width: 100%;
  padding: 17px 32px;
  background: linear-gradient(135deg, #7ec8f5 0%, #c084f5 55%, #f472b6 100%);
  border: none;
  border-radius: 13px;
  color: white;
  font-size: 16px;
  font-weight: 800;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.25s;
  box-shadow: 0 8px 28px rgba(126,200,245,0.35);
  font-family: inherit;
}
.submit-btn:hover { transform: translateY(-2px); box-shadow: 0 14px 38px rgba(126,200,245,0.45); filter: brightness(1.08); }
.submit-btn:disabled { opacity: 0.65; cursor: not-allowed; transform: none; filter: none; }

.gradient-link {
  background: linear-gradient(90deg, #7ec8f5, #c084f5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
  text-decoration: none;
}
.gradient-link:hover { text-decoration: underline; }

@media (max-width: 520px) {
  .login-card { padding: 36px 24px; }
}
</style>
