# E-Service — Plataforma de Servicios Profesionales

Plataforma web que conecta clientes con profesionales en Colombia. Permite publicar, contratar y gestionar servicios de manera profesional, con pagos integrados, chat en tiempo real y un panel de administración completo.

---

## Stack Tecnológico

| Categoría | Tecnología | Versión |
|---|---|---|
| Framework UI | Vue.js | 3.5.34 |
| Build Tool | Vite | 8.0.12 |
| Router | Vue Router | 5.0.7 |
| Estado Global | Pinia | 3.0.4 |
| HTTP Client | Axios | 1.16.1 |
| Mapas | Leaflet | 1.9.4 |
| Estilos | Tailwind CSS | 3.4.19 |
| PostCSS | postcss | 8.5.14 |
| Autoprefixer | autoprefixer | 10.5.0 |
| PWA | vite-plugin-pwa | 1.3.0 |
| Plugin Vue | @vitejs/plugin-vue | 6.0.6 |

### Backend (externo, requerido)
- **API REST** en `http://127.0.0.1:8000/api` (Django / FastAPI — repositorio separado)
- **Pasarela de pago:** Wompi (procesador colombiano)

---

## Base de Datos

La base de datos es gestionada íntegramente por el backend. El frontend **no se conecta directamente** a ninguna base de datos.

| Aspecto | Detalle |
|---|---|
| Tipo | Relacional (administrada por el backend Django/FastAPI) |
| Conexión Frontend | No aplica — toda persistencia va vía API REST |
| Autenticación | Token Bearer almacenado en `localStorage` |
| Persistencia local | `localStorage` del navegador para sesión, rol, tema |

**Claves de `localStorage` utilizadas:**

| Clave | Tipo | Descripción |
|---|---|---|
| `token` | string | Bearer token para autorización en la API |
| `isAuthenticated` | boolean | Estado de sesión activa |
| `userRole` | string | `client`, `professional` o `admin` |
| `user` | JSON string | Objeto con datos del usuario |
| `theme` | string | Preferencia de tema (`dark`/`light`) |

---

## Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
VITE_API_URL=http://127.0.0.1:8000/api
VITE_WOMPI_PUBLIC_KEY=pub_test_WqYjTKRgA291JFUvTMpbnKvPfKbruS3N
```

| Variable | Descripción |
|---|---|
| `VITE_API_URL` | URL base del backend REST |
| `VITE_WOMPI_PUBLIC_KEY` | Llave pública de Wompi para pagos (modo test) |

---

## Cómo Levantar el Proyecto

### Requisitos previos

- Node.js >= 18
- npm >= 9
- Backend de la API corriendo en `http://127.0.0.1:8000`

### Instalación y desarrollo

```bash
# Clonar el repositorio
git clone <url-del-repo>
cd E-service-WEB-APP

# Instalar dependencias
npm install

# Crear archivo de variables de entorno
cp .env.example .env  # o crear el archivo .env manualmente

# Iniciar servidor de desarrollo
npm run dev
```

La aplicación quedará disponible en: **http://localhost:5173**

### Comandos disponibles

```bash
npm run dev       # Servidor de desarrollo con HMR (Hot Module Replacement)
npm run build     # Build de producción → carpeta dist/
npm run preview   # Previsualizar el build de producción localmente
```

### Build de producción

```bash
npm run build
```

Los archivos generados en `dist/` son estáticos y pueden ser desplegados en cualquier CDN o servidor web (Nginx, Apache, Vercel, Netlify, etc.).

---

## Arquitectura del Proyecto

```
src/
├── main.js                        # Punto de entrada, registra Vue + Pinia + Router
├── App.vue                        # Componente raíz con <router-view>
├── style.css                      # Estilos globales + sistema dark mode
├── assets/                        # Imágenes estáticas (hero.png, logos)
│
├── router/
│   └── index.js                   # Rutas, guards de navegación, RBAC
│
├── stores/
│   ├── auth.js                    # Estado de autenticación (Pinia)
│   └── theme.js                   # Estado del tema dark/light (Pinia)
│
├── services/
│   ├── api.js                     # Instancia Axios con interceptor de Bearer token
│   ├── adminService.js            # Endpoints de administración
│   ├── categoryService.js         # Endpoints de categorías
│   ├── chatService.js             # Endpoints de mensajería
│   ├── professionalService.js     # Endpoints de profesionales
│   ├── serviceService.js          # Endpoints de servicios
│   └── userService.js             # Endpoints de gestión de usuarios
│
├── components/
│   ├── AppSidebar.vue             # Sidebar de navegación reutilizable
│   ├── ChatModal.vue              # Modal de mensajería en tiempo real
│   ├── ServiceCard.vue            # Tarjeta de servicio
│   └── StatCard.vue               # Tarjeta de estadística/KPI
│
├── views/
│   ├── LandingPage.vue            # Página pública de inicio (marketing)
│   ├── Login.vue                  # Login + Registro (tabs + selección de rol)
│   ├── DashboardClient.vue        # Wrapper → ClientePanel
│   ├── DashboardProfessional.vue  # Wrapper → ProfPanel
│   └── DashboardAdmin.vue         # Wrapper → AdminPanel
│
└── panels/
    ├── ClientePanel.vue           # Dashboard completo de cliente
    ├── ProfPanel.vue              # Dashboard completo de profesional
    ├── AdminPanel.vue             # Dashboard principal de admin
    └── admin/
        ├── AdminUsers.vue         # CRUD de usuarios
        ├── AdminCategories.vue    # Gestión de categorías
        ├── AdminServices.vue      # Catálogo de servicios
        ├── AdminPayments.vue      # Historial y gestión de pagos
        ├── AdminReports.vue       # Reportes y analíticas
        ├── AdminLogs.vue          # Logs de actividad del sistema
        ├── AdminSubAdmins.vue     # Gestión de sub-administradores
        ├── AdminSettings.vue      # Configuración de la plataforma
        ├── AdminSupport.vue       # Sistema de soporte / tickets
        ├── AdminLiveServices.vue  # Monitoreo en tiempo real
        └── useAdminToast.js       # Composable de notificaciones toast
```

---

## Rutas y Control de Acceso

| Ruta | Componente | Auth | Rol requerido |
|---|---|---|---|
| `/` | LandingPage | No | Público |
| `/login` | Login | No | Público |
| `/dashboard` | Redirect | Sí | Auto-redirect por rol |
| `/dashboard/client` | DashboardClient | Sí | `client` |
| `/dashboard/professional` | DashboardProfessional | Sí | `professional` |
| `/dashboard/admin` | DashboardAdmin | Sí | `admin` |

**Guards de navegación:**
- Usuarios no autenticados son redirigidos a `/login`
- Usuarios autenticados que acceden a `/login` son redirigidos a su dashboard
- Acceso a dashboard de rol incorrecto es bloqueado
- Módulos de admin requieren verificación de super-admin para permisos granulares

---

## Flujo de la Aplicación

### Flujo Cliente

```
LandingPage → Login (registro como Cliente) → /dashboard/client
    ├── Inicio: Buscar y filtrar servicios por categoría
    ├── Crear solicitud de servicio → asignación a profesional
    ├── Mis Solicitudes: pendientes / en curso / completadas
    ├── Mensajes: chat en tiempo real con el profesional
    ├── Perfil: gestión de datos personales
    └── Soporte: ayuda y contacto
```

### Flujo Profesional

```
LandingPage → Login (registro como Profesional) → /dashboard/professional
    ├── Inicio: Mapa interactivo con solicitudes activas en tiempo real
    ├── Mis Servicios: crear / editar / eliminar servicios propios
    ├── Mis Trabajos: trabajos aceptados + chat con clientes
    ├── Perfil: datos profesionales, especialidades, calificaciones
    └── Pagos: historial de ganancias + solicitud de retiro
```

### Flujo Administrador

```
Login (admin) → /dashboard/admin
    ├── Panel Principal: 6 KPIs + 4 gráficas (usuarios, servicios, ingresos, estado de solicitudes)
    ├── Usuarios: CRUD completo, filtros por rol/estado/especialidad, exportar CSV
    ├── Servicios: catálogo, filtros, acciones en lote
    ├── Solicitudes: seguimiento y monitoreo
    ├── Pagos: historial Wompi, estado de liquidación, reconciliación
    ├── Reportes: analíticas con rangos de fecha personalizados
    ├── Logs: auditoría de actividad del sistema
    ├── Categorías: CRUD de categorías de servicios
    ├── Sub-Admins: crear admins secundarios con permisos granulares
    ├── Configuración: tasa de comisión, llaves Wompi, modo mantenimiento
    └── Soporte: gestión de tickets de ayuda
```

---

## Módulos Principales

### Autenticación (`src/stores/auth.js`)

Store de Pinia con las siguientes acciones:

| Acción | Descripción |
|---|---|
| `initAuth()` | Restaura sesión desde `localStorage` al cargar la app |
| `login(email, password, role)` | Autenticación con selección de rol |
| `register(name, email, password, role)` | Registro de nuevos usuarios |
| `logout()` | Limpia sesión y redirige a `/login` |
| `updateUser(userData)` | Actualiza caché del usuario |

### API Service (`src/services/api.js`)

- Base URL configurable via `VITE_API_URL`
- Interceptor que inyecta `Authorization: Bearer {token}` en cada request
- Módulos separados por dominio: admin, categorías, chat, profesionales, servicios, usuarios

### Chat en Tiempo Real (`src/components/ChatModal.vue`)

- Polling periódico de mensajes nuevos
- Avatares con colores únicos por usuario
- Formato de timestamps en español
- Indicador de mensajes no leídos
- Compatible con el sistema de notificaciones

### Mapas (`src/panels/ProfPanel.vue`)

- Leaflet.js para mapa interactivo
- Visualización de solicitudes de servicio activas por ubicación
- Panel de profesional con stream en vivo

### Sistema de Temas

- Dark mode activado por defecto (`isDark: true`)
- Toggle persistido en `localStorage`
- Más de 200 líneas de overrides CSS para dark mode
- Paleta: Slate + acentos azul/púrpura/rosa
- Gradiente principal: Cyan → Purple → Pink

### PWA (Progressive Web App)

- Service worker con auto-update
- Instalable en dispositivos móviles
- Modo standalone (sin barra del navegador)
- `theme_color: #2563ff`

---

## Integración de Pagos — Wompi

| Campo | Valor |
|---|---|
| Procesador | Wompi (Colombia) |
| Modo actual | Test (`pub_test_*`) |
| Variable env | `VITE_WOMPI_PUBLIC_KEY` |
| Panel admin | `AdminPayments.vue` |

El módulo de pagos registra historial de transacciones, estado de liquidación y permite reconciliación desde el panel de administración.

---

## Changelog — Historial de Cambios

### v0.0.0 — 2026-05-26 (commit `78e2fe2`)

**Entrega inicial completa del frontend. Todos los módulos implementados desde cero.**

#### Features implementadas

- **Landing Page:** página pública con hero, CTAs, estadísticas de servicios, sección de características, dark/light mode, menú responsive para móvil
- **Login / Registro:** tabs de login y registro, selección de rol (Cliente/Profesional), validación de formularios, manejo de errores, botón OAuth Google (placeholder), diseño glassmorphism
- **Dashboard Cliente:**
  - Búsqueda y filtrado de servicios por categoría
  - Tarjetas de servicio con precio, calificación y categoría
  - Gestión de solicitudes con tabs (pendientes / en progreso / completadas)
  - Vista grid y lista switchable
  - Ordenamiento y paginación
  - Chat en tiempo real con profesionales
  - Gestión de perfil de usuario
  - Sistema de soporte
  - Sistema de notificaciones
- **Dashboard Profesional:**
  - Mapa interactivo (Leaflet) con solicitudes activas
  - Stream en vivo de solicitudes entrantes
  - Gestión de servicios propios (crear / editar / eliminar)
  - Seguimiento de trabajos aceptados
  - Chat integrado con clientes
  - Panel de pagos y retiros
  - Gestión de perfil con especialidades y calificaciones
  - Panel de notificaciones
- **Dashboard Administrador:**
  - 6 tarjetas KPI con tendencias
  - 4 gráficas: crecimiento de usuarios, distribución de servicios, ingresos, estado de solicitudes
  - CRUD completo de usuarios con filtros avanzados y exportación CSV
  - Gestión de categorías de servicios
  - Catálogo de servicios con acciones en lote
  - Tracking de solicitudes
  - Panel de pagos con integración Wompi
  - Reportes con rangos de fecha personalizados
  - Logs de auditoría del sistema
  - Gestión de sub-administradores con permisos granulares
  - Configuración de plataforma (comisión, llaves de pago, modo mantenimiento)
  - Sistema de soporte / tickets
  - Monitoreo en tiempo real de servicios activos con mapa
- **Sistema de autenticación:** Pinia store, Bearer token, guards de navegación RBAC, persistencia en `localStorage`
- **Sistema de temas:** dark/light mode global, persistido, +200 overrides CSS
- **PWA:** service worker, manifest, modo instalable
- **API Service Layer:** 7 módulos de servicios, interceptor de autenticación automático
- **Componentes reutilizables:** AppSidebar, ChatModal, ServiceCard, StatCard
- **Build optimizado:** chunks separados para vendor (Vue/Pinia/Router) y Leaflet

#### Configuración inicial

- Vite 8 con Vue 3 plugin y PWA plugin
- Tailwind CSS 3 con dark mode por clase
- Path alias `@` → `./src`
- Dev server en puerto 5173 con host expuesto
- Chunk size warning en 1000 KB

---

## Endpoints API consumidos

| Método | Endpoint | Módulo | Descripción |
|---|---|---|---|
| POST | `/auth/login` | auth | Autenticación |
| POST | `/auth/register` | auth | Registro |
| GET | `/categories` | categoryService | Categorías públicas |
| GET | `/professionals` | professionalService | Listado de profesionales |
| GET | `/professional/dashboard` | professionalService | Dashboard del profesional |
| POST | `/professional/profile` | professionalService | Guardar perfil |
| GET | `/chat/{requestId}` | chatService | Mensajes de una solicitud |
| POST | `/chat/{requestId}` | chatService | Enviar mensaje |
| GET | `/chat/unreads` | chatService | Mensajes no leídos |
| GET | `/admin/users` | userService | Listar usuarios |
| POST | `/admin/users` | userService | Crear usuario |
| PUT | `/admin/users/{id}` | userService | Actualizar usuario |
| DELETE | `/admin/users/{id}` | userService | Eliminar usuario |
| POST | `/admin/users/bulk` | userService | Acción masiva en usuarios |
| GET | `/admin/categories` | categoryService | Categorías (admin) |
| POST | `/admin/categories` | categoryService | Crear categoría |
| PUT | `/admin/categories/{id}` | categoryService | Actualizar categoría |
| DELETE | `/admin/categories/{id}` | categoryService | Eliminar categoría |
| GET | `/admin/services` | serviceService | Servicios (admin) |
| POST | `/admin/services` | serviceService | Crear servicio |
| PUT | `/admin/services/{id}` | serviceService | Actualizar servicio |
| DELETE | `/admin/services/{id}` | serviceService | Eliminar servicio |
| GET | `/admin/stats` | adminService | Estadísticas del sistema |
| GET | `/admin/reports` | adminService | Reportes |
| GET | `/admin/payments` | adminService | Pagos |
| GET | `/admin/live-services` | adminService | Servicios en tiempo real |
| GET | `/admin/logs` | adminService | Logs del sistema |
| GET | `/admin/sub-admins` | adminService | Sub-administradores |
| POST | `/admin/sub-admins` | adminService | Crear sub-admin |
| PUT | `/admin/sub-admins/{id}` | adminService | Actualizar sub-admin |
| DELETE | `/admin/sub-admins/{id}` | adminService | Eliminar sub-admin |

---

## Convenciones del Proyecto

- **Lenguaje:** Español (UI, variables, comentarios)
- **Moneda:** Peso colombiano (COP)
- **Locale de fechas:** `es-CO`
- **Roles:** `client`, `professional`, `admin`
- **Componentes de panel:** sufijo `Panel.vue` (ClientePanel, ProfPanel, AdminPanel)
- **Componentes de admin:** prefijo `Admin` (AdminUsers, AdminCategories, etc.)
- **Stores:** solo `auth.js` y `theme.js` — el resto es estado local con `ref`/`reactive`

---

## Responsive y Accesibilidad

- Diseño **mobile-first** con Tailwind
- Sidebar colapsable en móvil (hamburger menu)
- Breakpoints: `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px)
- Modo oscuro accesible con alto contraste
- Soporte táctil en componentes de navegación

---

## Autores

| Nombre | Contacto | Rol |
|---|---|---|
| MAVIDX | MAVIDX0@GMAIL.COM | Inicialización del repositorio |
