<template>
  <div :class="['font-sans min-h-screen relative', isDark ? 'bg-[#0d1b2e] text-white' : 'bg-white text-[#0f172a]']">

    <!-- BG blobs -->
    <div aria-hidden="true" class="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <template v-if="isDark">
        <div class="hero-blob hero-blob-1"></div>
        <div class="hero-blob hero-blob-2"></div>
        <div class="hero-blob hero-blob-3"></div>
        <div class="hero-grid"></div>
      </template>
      <template v-else>
        <div class="light-blob light-blob-1"></div>
        <div class="light-blob light-blob-2"></div>
      </template>
    </div>

    <!-- ── NAVBAR ── -->
    <header :class="['fixed top-0 inset-x-0 z-50 transition-all duration-300',
      scrollY > 60
        ? (isDark ? 'bg-[#0d1b2e]/90 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/20'
                  : 'bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-sm')
        : 'bg-transparent']">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <a href="#inicio" @click.prevent="scrollTo('inicio')" class="flex items-center gap-2 flex-shrink-0">
          <img src="/images/logo-services-sin-fondo.png" alt="e-service" class="h-9 w-auto" />
        </a>

        <nav class="hidden md:flex items-center gap-6 flex-1 justify-center">
          <a v-for="l in navLinks" :key="l.id" @click.prevent="scrollTo(l.id)"
            :class="['text-sm font-semibold cursor-pointer transition-colors',
              isDark ? 'text-white/65 hover:text-white' : 'text-slate-500 hover:text-slate-900']">
            {{ l.label }}
          </a>
        </nav>

        <div class="flex items-center gap-2">
          <button @click="themeStore.toggle()"
            :class="['w-9 h-9 rounded-xl flex items-center justify-center text-sm transition-all',
              isDark ? 'bg-white/10 hover:bg-white/15' : 'bg-slate-100 hover:bg-slate-200']">
            {{ isDark ? '☀️' : '🌙' }}
          </button>
          <RouterLink to="/login"
            :class="['hidden sm:inline-flex px-4 py-2 rounded-xl text-sm font-semibold transition-all',
              isDark ? 'text-white/75 hover:text-white hover:bg-white/10' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100']">
            Iniciar sesión
          </RouterLink>
          <RouterLink to="/login"
            class="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-white lp-btn-gradient">
            Empezar gratis
          </RouterLink>
          <button @click="mobileOpen = !mobileOpen"
            :class="['md:hidden w-9 h-9 rounded-xl flex items-center justify-center transition-all',
              isDark ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-700']">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path v-if="!mobileOpen" stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
              <path v-else stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>

      <Transition enter-active-class="transition-all duration-200" enter-from-class="opacity-0 -translate-y-2"
                  leave-active-class="transition-all duration-150" leave-to-class="opacity-0 -translate-y-2">
        <div v-if="mobileOpen"
          :class="['md:hidden px-4 pb-4 pt-2 border-t flex flex-col gap-1',
            isDark ? 'border-white/10 bg-[#0d1b2e]/95 backdrop-blur-xl' : 'border-slate-100 bg-white/95 backdrop-blur-xl']">
          <a v-for="l in navLinks" :key="l.id" @click.prevent="scrollTo(l.id); mobileOpen=false"
            :class="['px-3 py-2.5 rounded-lg text-sm font-semibold cursor-pointer',
              isDark ? 'text-white/80 hover:bg-white/10' : 'text-slate-700 hover:bg-slate-50']">{{ l.label }}</a>
          <div class="pt-2 flex flex-col gap-2">
            <RouterLink to="/login" @click="mobileOpen=false"
              :class="['px-3 py-2.5 rounded-lg text-sm font-semibold text-center border',
                isDark ? 'border-white/15 text-white/80' : 'border-slate-200 text-slate-700']">
              Iniciar sesión
            </RouterLink>
            <RouterLink to="/login" @click="mobileOpen=false"
              class="px-3 py-2.5 rounded-lg text-sm font-bold text-white text-center lp-btn-gradient">
              Empezar gratis
            </RouterLink>
          </div>
        </div>
      </Transition>
    </header>

    <!-- ── HERO ── -->
    <section id="inicio" class="relative min-h-screen flex items-center pt-16 overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-[#0d1b2e] via-[#0f2645] to-[#1a1040]">
        <div aria-hidden="true" class="absolute inset-0 overflow-hidden">
          <div class="hero-blob hero-blob-1"></div>
          <div class="hero-blob hero-blob-2"></div>
          <div class="hero-blob hero-blob-3"></div>
          <div class="hero-grid"></div>
        </div>
      </div>

      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-16 grid lg:grid-cols-2 gap-12 items-center w-full">
        <!-- Left -->
        <div class="text-white">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-sm font-semibold mb-6">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{{ statsDisplay.professionals }}+ profesionales activos</span>
          </div>

          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.1] mb-5">
            Encuentra y contrata<br>
            <span class="grad-text">servicios profesionales</span><br>
            en segundos
          </h1>

          <p class="text-lg text-white/60 mb-8 max-w-lg leading-relaxed">
            Conectamos clientes con los mejores profesionales. Plomería, electricidad, limpieza, tecnología y más — todo verificado y seguro.
          </p>

          <div class="flex flex-wrap gap-3 mb-10">
            <RouterLink to="/login"
              class="inline-flex items-center gap-2 px-7 py-4 rounded-2xl font-bold text-white text-[15px] lp-btn-gradient shadow-xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:-translate-y-0.5 transition-all">
              Solicitar servicio
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>
            </RouterLink>
            <RouterLink to="/login"
              class="inline-flex items-center gap-2 px-7 py-4 rounded-2xl font-bold text-white text-[15px] border-2 border-white/20 hover:border-white/40 hover:bg-white/5 transition-all">
              Ofrecer servicios
            </RouterLink>
          </div>

          <div class="flex flex-wrap gap-6">
            <div class="flex items-center gap-2.5">
              <div class="flex -space-x-2">
                <div v-for="(g,i) in avatarGrads" :key="i" class="w-8 h-8 rounded-full border-2 border-[#0f2645]" :style="{background:g}"></div>
              </div>
              <div>
                <p class="text-white font-bold text-sm leading-tight">10K+ usuarios</p>
                <p class="text-white/45 text-xs">satisfechos</p>
              </div>
            </div>
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-full bg-amber-400/15 flex items-center justify-center">⭐</div>
              <div>
                <p class="text-white font-bold text-sm leading-tight">4.9 / 5.0</p>
                <p class="text-white/45 text-xs">valoración media</p>
              </div>
            </div>
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-full bg-emerald-400/15 flex items-center justify-center">🛡️</div>
              <div>
                <p class="text-white font-bold text-sm leading-tight">100% seguro</p>
                <p class="text-white/45 text-xs">pago garantizado</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Phone mockup -->
        <div class="hidden lg:flex justify-center items-center">
          <div class="relative">
            <div class="absolute inset-0 bg-gradient-to-b from-[#7ec8f5]/25 via-[#c084f5]/20 to-[#f472b6]/15 blur-3xl rounded-full scale-125 pointer-events-none"></div>
            <!-- Phone -->
            <div class="relative w-[260px] h-[520px] rounded-[40px] bg-[#0a1628] border-[3px] border-white/20 shadow-2xl shadow-black/50 overflow-hidden flex flex-col">
              <div class="flex items-center justify-between px-5 pt-4 pb-1 flex-shrink-0">
                <span class="text-white/50 text-[10px] font-bold">9:41</span>
                <div class="w-3.5 h-2.5 border border-white/30 rounded-sm overflow-hidden"><div class="h-full w-3/4 bg-white/60"></div></div>
              </div>
              <div class="flex items-center justify-between px-4 py-2 border-b border-white/5 flex-shrink-0">
                <img src="/images/logo-services-sin-fondo.png" alt="" class="h-5 w-auto" />
                <div class="w-7 h-7 rounded-full lp-btn-gradient flex items-center justify-center"><span class="text-white text-[10px] font-bold">J</span></div>
              </div>
              <div class="mx-4 mt-2.5 px-3 py-2 bg-white/8 rounded-xl flex items-center gap-2 flex-shrink-0">
                <svg class="w-3 h-3 text-white/30 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path stroke-linecap="round" d="m21 21-4.35-4.35"/></svg>
                <span class="text-white/30 text-[11px]">¿Qué servicio necesitas?</span>
              </div>
              <div class="px-4 mt-2.5 flex-shrink-0">
                <p class="text-white/50 text-[10px] font-semibold mb-1.5">Categorías</p>
                <div class="grid grid-cols-4 gap-1.5">
                  <div v-for="c in phoneCats" :key="c.l" class="flex flex-col items-center gap-0.5 p-1.5 bg-white/6 rounded-xl">
                    <span class="text-sm leading-none">{{ c.e }}</span>
                    <span class="text-white/40 text-[8px] text-center leading-tight">{{ c.l }}</span>
                  </div>
                </div>
              </div>
              <div class="px-4 mt-2.5 flex-shrink-0">
                <p class="text-white/50 text-[10px] font-semibold mb-1.5">Destacados</p>
                <div class="bg-gradient-to-r from-[#7ec8f5]/12 to-[#c084f5]/12 border border-white/8 rounded-xl p-2 flex items-center gap-2 mb-1.5">
                  <div class="w-7 h-7 rounded-lg bg-gradient-to-br from-[#7ec8f5] to-[#c084f5] flex items-center justify-center text-xs flex-shrink-0">🧹</div>
                  <div class="flex-1 min-w-0">
                    <p class="text-white text-[10px] font-bold leading-tight">Limpieza del hogar</p>
                    <p class="text-white/35 text-[9px]">⭐ 4.9 · María G.</p>
                  </div>
                  <span class="text-[#7ec8f5] text-[10px] font-bold flex-shrink-0">$45K</span>
                </div>
                <div class="bg-gradient-to-r from-[#f472b6]/12 to-[#c084f5]/12 border border-white/8 rounded-xl p-2 flex items-center gap-2">
                  <div class="w-7 h-7 rounded-lg bg-gradient-to-br from-[#f472b6] to-[#c084f5] flex items-center justify-center text-xs flex-shrink-0">⚡</div>
                  <div class="flex-1 min-w-0">
                    <p class="text-white text-[10px] font-bold leading-tight">Electricista certif.</p>
                    <p class="text-white/35 text-[9px]">⭐ 4.8 · Carlos L.</p>
                  </div>
                  <span class="text-[#f472b6] text-[10px] font-bold flex-shrink-0">$80K</span>
                </div>
              </div>
              <div class="mt-auto flex items-center justify-around px-3 py-2.5 bg-[#0a1628]/80 border-t border-white/5 flex-shrink-0">
                <span class="text-[#7ec8f5]">🏠</span>
                <span class="text-white/25">🔍</span>
                <span class="text-white/25">📋</span>
                <span class="text-white/25">💬</span>
                <span class="text-white/25">👤</span>
              </div>
            </div>
            <!-- Floating cards -->
            <div class="absolute -left-16 top-24 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-3 py-2.5 shadow-xl fc-1">
              <div class="flex items-center gap-2">
                <div class="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center text-sm">🛡️</div>
                <div><p class="text-white text-[11px] font-bold">Pago seguro</p><p class="text-white/45 text-[9px]">Wompi protegido</p></div>
              </div>
            </div>
            <div class="absolute -right-18 bottom-28 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-3 py-2.5 shadow-xl fc-2">
              <div class="flex items-center gap-2">
                <div class="w-7 h-7 rounded-lg bg-[#7ec8f5]/20 flex items-center justify-center text-sm">⚡</div>
                <div><p class="text-white text-[11px] font-bold">Respuesta rápida</p><p class="text-white/45 text-[9px]">Promedio &lt;30 min</p></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Scroll cue -->
      <a href="#stats" @click.prevent="scrollTo('stats')"
        class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-50 hover:opacity-80 transition-opacity cursor-pointer">
        <span class="text-white text-xs">Descubrir más</span>
        <div class="w-5 h-8 border-2 border-white/30 rounded-full flex justify-center pt-1.5">
          <div class="w-1 h-2 bg-white rounded-full scroll-pip"></div>
        </div>
      </a>
    </section>

    <!-- ── STATS ── -->
    <section id="stats" :class="['py-14 relative z-10', isDark ? 'bg-[#060d1a]' : 'bg-slate-50']">
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-5">
          <div v-for="s in statCards" :key="s.label"
            :class="['rounded-2xl p-6 text-center border transition-transform hover:-translate-y-0.5',
              isDark ? 'bg-white/5 border-white/8' : 'bg-white border-slate-100 shadow-sm']">
            <p class="text-3xl font-black mb-1 grad-text">{{ s.value }}</p>
            <p :class="['text-sm font-medium', isDark ? 'text-white/50' : 'text-slate-500']">{{ s.label }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ── HOW IT WORKS ── -->
    <section id="como-funciona" :class="['py-20 relative z-10', isDark ? 'bg-[#0d1b2e]' : 'bg-white']">
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <div class="text-center mb-14">
          <span :class="['text-xs font-bold uppercase tracking-widest', isDark ? 'text-[#7ec8f5]' : 'text-blue-500']">Proceso simple</span>
          <h2 :class="['text-3xl sm:text-4xl font-black mt-2', isDark ? 'text-white' : 'text-slate-900']">¿Cómo funciona?</h2>
          <p :class="['mt-3 text-base max-w-xl mx-auto', isDark ? 'text-white/50' : 'text-slate-500']">
            En tres pasos conectamos tus necesidades con el profesional ideal.
          </p>
        </div>
        <div class="grid md:grid-cols-3 gap-7">
          <div v-for="(step, i) in steps" :key="i"
            :class="['relative rounded-2xl p-7 border text-center transition-all hover:-translate-y-1',
              isDark ? 'bg-white/5 border-white/10 hover:bg-white/7' : 'bg-slate-50 border-slate-100 hover:shadow-md']">
            <div class="absolute top-4 right-5 text-[11px] font-black grad-text">PASO {{ i+1 }}</div>
            <div class="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center text-2xl" :style="{background: step.bg}">{{ step.icon }}</div>
            <h3 :class="['text-lg font-black mb-2', isDark ? 'text-white' : 'text-slate-900']">{{ step.title }}</h3>
            <p :class="['text-sm leading-relaxed', isDark ? 'text-white/50' : 'text-slate-500']">{{ step.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ── CATEGORIES ── -->
    <section id="categorias" :class="['py-20 relative z-10', isDark ? 'bg-[#060d1a]' : 'bg-slate-50']">
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <div class="text-center mb-12">
          <span :class="['text-xs font-bold uppercase tracking-widest', isDark ? 'text-[#c084f5]' : 'text-purple-500']">Explora</span>
          <h2 :class="['text-3xl sm:text-4xl font-black mt-2', isDark ? 'text-white' : 'text-slate-900']">Servicios disponibles</h2>
          <p :class="['mt-3 text-base max-w-xl mx-auto', isDark ? 'text-white/50' : 'text-slate-500']">
            {{ categories.length || '...' }} categorías activas con profesionales listos para ayudarte.
          </p>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          <template v-if="catsLoading">
            <div v-for="i in 8" :key="i" :class="['h-28 rounded-2xl animate-pulse', isDark ? 'bg-white/8' : 'bg-slate-200']"></div>
          </template>
          <template v-else>
            <div v-for="cat in categories" :key="cat.id"
              :class="['group rounded-2xl p-5 border cursor-default transition-all hover:-translate-y-1',
                isDark ? 'bg-white/5 border-white/8 hover:bg-white/9 hover:border-white/18' : 'bg-white border-slate-100 hover:border-slate-200 hover:shadow-md']">
              <div class="w-12 h-12 rounded-xl mb-3 flex items-center justify-center text-2xl" :style="{background: cat.catBg}">{{ cat.emoji }}</div>
              <h3 :class="['font-bold text-[15px] mb-0.5 leading-tight', isDark ? 'text-white' : 'text-slate-900']">{{ cat.name }}</h3>
              <p :class="['text-xs', isDark ? 'text-white/40' : 'text-slate-400']">{{ cat.services_count ?? 0 }} servicios</p>
            </div>
          </template>
        </div>

        <div class="text-center mt-8">
          <RouterLink to="/login"
            :class="['inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold border-2 transition-all',
              isDark ? 'border-white/18 text-white hover:border-white/35 hover:bg-white/5' : 'border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50']">
            Ver todos los servicios
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- ── SOCIAL PROOF ── -->
    <section class="py-20 relative z-10 overflow-hidden bg-gradient-to-br from-[#0d1b2e] via-[#0f2645] to-[#1a1040]">
      <div aria-hidden="true" class="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div class="hero-blob hero-blob-1"></div>
        <div class="hero-blob hero-blob-2"></div>
      </div>
      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <div class="text-center mb-12">
          <span class="text-xs font-bold uppercase tracking-widest text-[#f472b6]">Confianza comprobada</span>
          <h2 class="text-3xl sm:text-4xl font-black mt-2 text-white">Lo que dicen nuestros usuarios</h2>
        </div>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="t in testimonials" :key="t.name"
            class="bg-white/7 backdrop-blur border border-white/12 rounded-2xl p-6 hover:border-white/22 transition-all hover:-translate-y-0.5">
            <div class="flex mb-3">
              <span v-for="i in 5" :key="i" class="text-amber-400 text-sm">★</span>
            </div>
            <p class="text-white/70 text-sm leading-relaxed mb-5">"{{ t.text }}"</p>
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-full flex items-center justify-center font-black text-white text-sm flex-shrink-0" :style="{background: t.bg}">{{ t.name[0] }}</div>
              <div><p class="text-white font-semibold text-sm">{{ t.name }}</p><p class="text-white/40 text-xs">{{ t.role }}</p></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── PRICING ── -->
    <section id="precios" :class="['py-20 relative z-10', isDark ? 'bg-[#0d1b2e]' : 'bg-white']">
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <div class="text-center mb-14">
          <span :class="['text-xs font-bold uppercase tracking-widest', isDark ? 'text-[#7ec8f5]' : 'text-blue-500']">Transparente</span>
          <h2 :class="['text-3xl sm:text-4xl font-black mt-2', isDark ? 'text-white' : 'text-slate-900']">Sin sorpresas en el precio</h2>
          <p :class="['mt-3 text-base max-w-xl mx-auto', isDark ? 'text-white/50' : 'text-slate-500']">Modelo simple y justo para clientes y profesionales.</p>
        </div>
        <div class="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div v-for="plan in plans" :key="plan.name"
            :class="['relative rounded-2xl p-7 border transition-all hover:-translate-y-1',
              plan.popular
                ? 'bg-gradient-to-b from-[#7ec8f5]/12 to-[#c084f5]/12 border-[#7ec8f5]/40 shadow-xl'
                : (isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-100')]">
            <div v-if="plan.popular"
              class="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-black text-white lp-btn-gradient">
              MÁS POPULAR
            </div>
            <div class="text-3xl mb-3">{{ plan.icon }}</div>
            <h3 :class="['font-black text-xl mb-1', isDark ? 'text-white' : 'text-slate-900']">{{ plan.name }}</h3>
            <p :class="['text-sm mb-5', isDark ? 'text-white/45' : 'text-slate-500']">{{ plan.desc }}</p>
            <div class="flex items-end gap-1 mb-6">
              <span :class="['text-4xl font-black', isDark ? 'text-white' : 'text-slate-900']">{{ plan.price }}</span>
              <span :class="['text-sm mb-1.5', isDark ? 'text-white/40' : 'text-slate-400']">{{ plan.period }}</span>
            </div>
            <ul class="flex flex-col gap-2.5 mb-7">
              <li v-for="f in plan.features" :key="f" :class="['flex items-start gap-2 text-sm', isDark ? 'text-white/65' : 'text-slate-600']">
                <svg class="w-4 h-4 mt-0.5 flex-shrink-0 text-emerald-400" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>
                {{ f }}
              </li>
            </ul>
            <RouterLink to="/login"
              :class="['block text-center py-3 rounded-xl text-sm font-bold transition-all',
                plan.popular
                  ? 'text-white lp-btn-gradient hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5'
                  : (isDark ? 'bg-white/10 text-white hover:bg-white/15' : 'bg-slate-100 text-slate-700 hover:bg-slate-200')]">
              {{ plan.cta }}
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <!-- ── CTA ── -->
    <section :class="['py-20 relative z-10', isDark ? 'bg-[#060d1a]' : 'bg-slate-50']">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <h2 :class="['text-3xl sm:text-5xl font-black mb-5 leading-tight', isDark ? 'text-white' : 'text-slate-900']">
          ¿Listo para empezar?
        </h2>
        <p :class="['text-lg mb-9', isDark ? 'text-white/55' : 'text-slate-500']">
          Únete a miles de clientes y profesionales que ya confían en e-service.
        </p>
        <div class="flex flex-wrap justify-center gap-4">
          <RouterLink to="/login"
            class="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white text-[15px] lp-btn-gradient shadow-xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:-translate-y-0.5 transition-all">
            Registrarse gratis
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>
          </RouterLink>
          <RouterLink to="/login"
            :class="['inline-flex items-center px-8 py-4 rounded-2xl font-bold text-[15px] border-2 transition-all',
              isDark ? 'border-white/20 text-white hover:border-white/40 hover:bg-white/5' : 'border-slate-300 text-slate-700 hover:bg-slate-100']">
            Iniciar sesión
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- ── FOOTER ── -->
    <footer class="py-12 bg-[#040810] border-t border-white/8 relative z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <div>
            <img src="/images/logo-services-sin-fondo.png" alt="e-service" class="h-9 w-auto mb-3" />
            <p class="text-slate-400 text-sm leading-relaxed">La plataforma líder para contratar y ofrecer servicios profesionales en Colombia.</p>
          </div>
          <div v-for="col in footerCols" :key="col.title">
            <h4 class="text-white font-bold text-sm mb-4">{{ col.title }}</h4>
            <ul class="flex flex-col gap-2.5">
              <li v-for="l in col.links" :key="l"><a href="#" class="text-slate-400 text-sm hover:text-white transition-colors">{{ l }}</a></li>
            </ul>
          </div>
        </div>
        <div class="border-t border-white/8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p class="text-slate-500 text-sm">© {{ new Date().getFullYear() }} e-service. Todos los derechos reservados.</p>
          <div class="flex items-center gap-2">
            <a v-for="s in socials" :key="s" href="#"
              class="w-8 h-8 rounded-lg bg-white/7 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/12 transition-all text-xs font-bold">{{ s }}</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useThemeStore } from '@/stores/theme'
import api from '@/services/api'

const themeStore  = useThemeStore()
const isDark      = computed(() => themeStore.isDark)
const mobileOpen  = ref(false)
const scrollY     = ref(0)
const catsLoading = ref(true)
const categories  = ref([])
const rawStats    = ref({ professionals: 0, services: 0 })

const navLinks = [
  { id: 'inicio',        label: 'Inicio' },
  { id: 'como-funciona', label: 'Cómo funciona' },
  { id: 'categorias',    label: 'Servicios' },
  { id: 'precios',       label: 'Precios' },
]

const avatarGrads = [
  'linear-gradient(135deg,#7ec8f5,#c084f5)',
  'linear-gradient(135deg,#f472b6,#c084f5)',
  'linear-gradient(135deg,#34d399,#7ec8f5)',
  'linear-gradient(135deg,#fbbf24,#f472b6)',
]

const phoneCats = [
  { e:'🔧', l:'Plomería' }, { e:'⚡', l:'Electr.' },
  { e:'🧹', l:'Limpieza' }, { e:'🎨', l:'Pintura' },
  { e:'💻', l:'Tech' },     { e:'🌿', l:'Jardín' },
  { e:'🔒', l:'Segur.' },   { e:'🪚', l:'Carpint.' },
]

const catMeta = (name) => {
  const n = name.toLowerCase()
  if (n.includes('plom') || n.includes('agua'))     return { emoji:'🔧', catBg:'linear-gradient(135deg,#06b6d4,#0891b2)' }
  if (n.includes('elect'))                           return { emoji:'⚡', catBg:'linear-gradient(135deg,#f59e0b,#d97706)' }
  if (n.includes('limp') || n.includes('aseo'))      return { emoji:'🧹', catBg:'linear-gradient(135deg,#10b981,#059669)' }
  if (n.includes('pint') || n.includes('decorac'))   return { emoji:'🎨', catBg:'linear-gradient(135deg,#ec4899,#db2777)' }
  if (n.includes('carp') || n.includes('mueble'))    return { emoji:'🪚', catBg:'linear-gradient(135deg,#92400e,#b45309)' }
  if (n.includes('jard') || n.includes('plant'))     return { emoji:'🌿', catBg:'linear-gradient(135deg,#22c55e,#16a34a)' }
  if (n.includes('tec')  || n.includes('comp'))      return { emoji:'💻', catBg:'linear-gradient(135deg,#3b82f6,#2563eb)' }
  if (n.includes('bell') || n.includes('estet'))     return { emoji:'💆', catBg:'linear-gradient(135deg,#f472b6,#ec4899)' }
  if (n.includes('mascot'))                          return { emoji:'🐾', catBg:'linear-gradient(135deg,#a78bfa,#7c3aed)' }
  if (n.includes('chef') || n.includes('cocin'))     return { emoji:'👨‍🍳', catBg:'linear-gradient(135deg,#f97316,#ea580c)' }
  if (n.includes('mudanz') || n.includes('flete'))   return { emoji:'🚚', catBg:'linear-gradient(135deg,#64748b,#475569)' }
  if (n.includes('segur') || n.includes('cerraj'))   return { emoji:'🔒', catBg:'linear-gradient(135deg,#ef4444,#dc2626)' }
  if (n.includes('aire')  || n.includes('ac '))      return { emoji:'❄️', catBg:'linear-gradient(135deg,#7ec8f5,#0ea5e9)' }
  return { emoji:'⚙️', catBg:'linear-gradient(135deg,#7ec8f5,#c084f5)' }
}

const statsDisplay = computed(() => ({
  professionals: rawStats.value.professionals || '...',
  services: rawStats.value.services || '...',
  categories: categories.value.length || '...',
}))

const statCards = computed(() => [
  { value: `${statsDisplay.value.professionals}+`, label: 'Profesionales verificados' },
  { value: `${statsDisplay.value.services}+`,      label: 'Servicios disponibles' },
  { value: `${statsDisplay.value.categories}+`,    label: 'Categorías activas' },
  { value: '4.9★',                                 label: 'Valoración media' },
])

const steps = [
  { icon:'🔍', title:'Busca el servicio',    desc:'Explora profesionales verificados por categoría o ubicación en tu ciudad.', bg:'linear-gradient(135deg,#7ec8f5,#3b82f6)' },
  { icon:'📋', title:'Solicita y coordina', desc:'Envía tu solicitud, chatea con el profesional y acuerda horario y precio.', bg:'linear-gradient(135deg,#c084f5,#7c3aed)' },
  { icon:'✅', title:'Recibe y califica',   desc:'El trabajo se realiza con garantía. Paga seguro y deja tu valoración.', bg:'linear-gradient(135deg,#f472b6,#c084f5)' },
]

const testimonials = [
  { name:'Laura Martínez', role:'Cliente — Bogotá',   text:'Encontré un electricista certificado en menos de 30 minutos. El servicio fue excelente y el pago muy seguro.', bg:'linear-gradient(135deg,#7ec8f5,#3b82f6)' },
  { name:'Carlos Herrera', role:'Profesional — Medellín', text:'Como plomero independiente, e-service me ha dado una cartera estable de clientes. Totalmente recomendado.', bg:'linear-gradient(135deg,#f472b6,#c084f5)' },
  { name:'Ana Gómez',      role:'Cliente — Cali',     text:'El proceso es súper fácil. Solicité limpieza del hogar y en el mismo día tenía todo listo. Increíble plataforma.', bg:'linear-gradient(135deg,#34d399,#10b981)' },
]

const plans = [
  {
    icon:'👤', name:'Cliente', popular:false, price:'Gratis', period:'siempre',
    desc:'Para quien necesita contratar servicios',
    features:['Solicitudes ilimitadas','Chat en tiempo real','Seguimiento en vivo','Pago seguro Wompi','Calificaciones y reseñas'],
    cta:'Empezar gratis',
  },
  {
    icon:'💼', name:'Profesional', popular:true, price:'10%', period:'por servicio completado',
    desc:'Para quien ofrece servicios en la plataforma',
    features:['Perfil verificado','Aparece en búsquedas','Cobro garantizado','Dispersión automática','Soporte prioritario'],
    cta:'Registrarme como profesional',
  },
  {
    icon:'🏢', name:'Empresa', popular:false, price:'Custom', period:'según volumen',
    desc:'Para empresas con necesidades frecuentes',
    features:['Todo del plan Cliente','Dashboard empresarial','Facturación centralizada','Múltiples usuarios','Account manager'],
    cta:'Contactar ventas',
  },
]

const footerCols = [
  { title:'Plataforma', links:['Cómo funciona','Categorías','Profesionales','Precios'] },
  { title:'Empresa',    links:['Sobre nosotros','Blog','Prensa','Trabaja con nosotros'] },
  { title:'Soporte',    links:['Centro de ayuda','Contacto','Privacidad','Términos de uso'] },
]

const socials = ['f', 'in', 'ig']

const scrollTo = (id) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  mobileOpen.value = false
}

const onScroll = () => { scrollY.value = window.scrollY }

const loadData = async () => {
  const [catsRes, profsRes, svcsRes] = await Promise.allSettled([
    api.get('/categories'),
    api.get('/professionals'),
    api.get('/services'),
  ])
  if (catsRes.status === 'fulfilled') {
    categories.value = (catsRes.value.data || []).map(c => ({ ...c, ...catMeta(c.name) }))
  }
  if (profsRes.status === 'fulfilled') rawStats.value.professionals = (profsRes.value.data || []).length
  if (svcsRes.status === 'fulfilled')  rawStats.value.services = (svcsRes.value.data || []).length
  catsLoading.value = false
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  loadData()
})
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<style scoped>
/* Gradient button */
.lp-btn-gradient {
  background: linear-gradient(135deg, #7ec8f5 0%, #c084f5 55%, #f472b6 100%);
  transition: all 0.22s;
}
.lp-btn-gradient:hover { filter: brightness(1.08); }

/* Gradient text */
.grad-text {
  background: linear-gradient(135deg, #7ec8f5 0%, #c084f5 50%, #f472b6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Dark bg blobs */
.hero-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  animation: blobFloat 24s infinite ease-in-out;
}
.hero-blob-1 { width: 700px; height: 700px; background: #7ec8f5; top: -200px; right: -150px; opacity: 0.3; }
.hero-blob-2 { width: 600px; height: 600px; background: #c084f5; bottom: -200px; left: -100px; opacity: 0.25; animation-duration: 20s; animation-direction: reverse; }
.hero-blob-3 { width: 500px; height: 500px; background: #f472b6; top: 40%; left: 40%; opacity: 0.2; animation-duration: 28s; animation-delay: 5s; }
@keyframes blobFloat {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33%       { transform: translate(60px, -80px) scale(1.08); }
  66%       { transform: translate(-50px, 60px) scale(0.94); }
}

.hero-grid {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(126,200,245,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(126,200,245,0.03) 1px, transparent 1px);
  background-size: 60px 60px;
}

/* Light bg blobs */
.light-blob { position: absolute; border-radius: 50%; filter: blur(120px); }
.light-blob-1 { width: 600px; height: 600px; background: #dbeafe; opacity: 0.6; top: -100px; right: -100px; animation: blobFloat 24s infinite ease-in-out; }
.light-blob-2 { width: 500px; height: 500px; background: #ede9fe; opacity: 0.5; bottom: -150px; left: -50px; animation: blobFloat 20s infinite ease-in-out reverse; }

/* Floating cards */
.fc-1 { animation: fc1 6s ease-in-out infinite; }
.fc-2 { animation: fc2 7s ease-in-out infinite 2s; }
@keyframes fc1 { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
@keyframes fc2 { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(8px);  } }

/* Scroll pip */
.scroll-pip { animation: scrollPip 2s ease-in-out infinite; }
@keyframes scrollPip {
  0%, 100% { transform: translateY(0); opacity: 1; }
  50%       { transform: translateY(8px); opacity: 0.3; }
}
</style>
