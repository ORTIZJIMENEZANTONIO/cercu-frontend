<template>
  <header class="app-header">
    <nav class="header-nav">
      <div class="container header-inner">
        <!-- Logo -->
        <NuxtLink to="/" class="header-logo">
          <div class="header-logo-mark">
            <Icon name="mdi:map-marker-check" size="18" />
          </div>
          <span class="header-logo-text">CERCU</span>
        </NuxtLink>

        <!-- Desktop nav -->
        <div v-if="!authStore.isProfessional && !authStore.isAdmin" class="header-links d-none d-md-flex">
          <template v-if="authStore.isAuthenticated">
            <NuxtLink to="/solicitudes" class="header-link">
              <Icon name="mdi:clipboard-text-clock" size="16" class="me-1" />
              Mis solicitudes
            </NuxtLink>
            <NuxtLink to="/solicitar" class="header-link">
              <Icon name="mdi:plus-circle" size="16" class="me-1" />
              Solicitar
            </NuxtLink>
          </template>
          <template v-else>
            <NuxtLink to="/categorias" class="header-link">Categorias</NuxtLink>
            <NuxtLink to="/buscar" class="header-link">Buscar</NuxtLink>
          </template>
        </div>

        <!-- Desktop actions -->
        <div class="header-actions d-none d-md-flex">
          <template v-if="authStore.isAuthenticated">
            <NuxtLink v-if="authStore.isProfessional" to="/pro" class="header-link">
              <Icon name="mdi:briefcase" size="16" class="me-1" />
              Pro
            </NuxtLink>
            <NuxtLink v-if="authStore.isAdmin" to="/admin" class="header-link">
              <Icon name="mdi:shield-crown" size="16" class="me-1" />
              Admin
            </NuxtLink>
            <button class="header-user" @click="userMenuOpen = !userMenuOpen">
              <div class="header-user-avatar">
                {{ (authStore.user?.name || authStore.user?.phone || 'U').charAt(0).toUpperCase() }}
              </div>
              <Icon name="mdi:chevron-down" size="14" />
            </button>
            <Transition name="scale">
              <div v-if="userMenuOpen" class="header-dropdown" v-click-outside="() => userMenuOpen = false">
                <div class="header-dropdown-info">
                  <strong>{{ authStore.user?.name || 'Usuario' }}</strong>
                  <span>{{ authStore.user?.phone }}</span>
                </div>
                <div class="header-dropdown-divider" />
                <NuxtLink to="/cuenta" class="header-dropdown-item" @click="userMenuOpen = false">
                  <Icon name="mdi:account-edit" size="16" />
                  Mi cuenta
                </NuxtLink>
                <NuxtLink v-if="authStore.isProfessional" to="/pro/perfil" class="header-dropdown-item" @click="userMenuOpen = false">
                  <Icon name="mdi:briefcase-edit" size="16" />
                  Perfil profesional
                </NuxtLink>
                <NuxtLink
                  v-if="!authStore.isProfessional && !authStore.hasProfessionalProfile"
                  to="/pro/onboarding"
                  class="header-dropdown-item"
                  @click="userMenuOpen = false"
                >
                  <Icon name="mdi:account-hard-hat" size="16" />
                  Ser profesional
                </NuxtLink>
                <div class="header-dropdown-divider" />
                <button class="header-dropdown-item header-dropdown-item--danger" @click="handleLogout">
                  <Icon name="mdi:logout" size="16" />
                  Cerrar sesion
                </button>
              </div>
            </Transition>
          </template>
          <template v-else>
            <NuxtLink to="/auth/login" class="btn-header-ghost">Iniciar sesion</NuxtLink>
            <NuxtLink to="/auth/registro" class="btn-header-solid">
              <Icon name="mdi:account-plus" size="16" class="me-1" />
              Registrate
            </NuxtLink>
          </template>
        </div>

        <!-- Mobile hamburger -->
        <button class="header-hamburger d-md-none" @click="mobileOpen = !mobileOpen" :class="{ open: mobileOpen }">
          <span /><span /><span />
        </button>
      </div>
    </nav>

    <!-- Mobile drawer -->
    <Transition name="slide-right">
      <div v-if="mobileOpen" class="mobile-overlay" @click.self="mobileOpen = false">
        <div class="mobile-drawer">
          <div class="mobile-drawer-header">
            <NuxtLink to="/" class="header-logo" @click="mobileOpen = false">
              <div class="header-logo-mark">
                <Icon name="mdi:map-marker-check" size="18" />
              </div>
              <span class="header-logo-text">CERCU</span>
            </NuxtLink>
            <button class="mobile-close" @click="mobileOpen = false">
              <Icon name="mdi:close" size="22" />
            </button>
          </div>

          <nav class="mobile-nav">
            <template v-if="!authStore.isProfessional && !authStore.isAdmin">
              <template v-if="authStore.isAuthenticated">
                <NuxtLink to="/solicitudes" class="mobile-nav-link mobile-nav-link--highlight" @click="mobileOpen = false">
                  <Icon name="mdi:clipboard-text-clock" size="20" />
                  Mis solicitudes
                </NuxtLink>
                <NuxtLink to="/solicitar" class="mobile-nav-link" @click="mobileOpen = false">
                  <Icon name="mdi:plus-circle" size="20" />
                  Solicitar servicio
                </NuxtLink>
              </template>
              <template v-else>
                <NuxtLink to="/categorias" class="mobile-nav-link" @click="mobileOpen = false">
                  <Icon name="mdi:view-grid" size="20" />
                  Categorias
                </NuxtLink>
                <NuxtLink to="/buscar" class="mobile-nav-link" @click="mobileOpen = false">
                  <Icon name="mdi:magnify" size="20" />
                  Buscar
                </NuxtLink>
                <NuxtLink to="/solicitar" class="mobile-nav-link mobile-nav-link--highlight" @click="mobileOpen = false">
                  <Icon name="mdi:plus-circle" size="20" />
                  Solicitar servicio
                </NuxtLink>
              </template>
            </template>

            <template v-if="authStore.isAuthenticated">
              <div class="mobile-nav-divider" />
              <NuxtLink v-if="authStore.isProfessional" to="/pro" class="mobile-nav-link" @click="mobileOpen = false">
                <Icon name="mdi:briefcase" size="20" />
                Dashboard Pro
              </NuxtLink>
              <NuxtLink v-if="authStore.isProfessional" to="/pro/perfil" class="mobile-nav-link" @click="mobileOpen = false">
                <Icon name="mdi:briefcase-edit" size="20" />
                Perfil profesional
              </NuxtLink>
              <NuxtLink v-if="authStore.isAdmin" to="/admin" class="mobile-nav-link" @click="mobileOpen = false">
                <Icon name="mdi:shield-crown" size="20" />
                Admin
              </NuxtLink>
              <div class="mobile-nav-divider" />
              <NuxtLink to="/cuenta" class="mobile-nav-link" @click="mobileOpen = false">
                <Icon name="mdi:account-edit" size="20" />
                Mi cuenta
              </NuxtLink>
              <NuxtLink
                v-if="!authStore.isProfessional && !authStore.hasProfessionalProfile"
                to="/pro/onboarding"
                class="mobile-nav-link mobile-nav-link--highlight"
                @click="mobileOpen = false"
              >
                <Icon name="mdi:account-hard-hat" size="20" />
                Ser profesional
              </NuxtLink>
              <button class="mobile-nav-link mobile-nav-link--danger" @click="handleLogout">
                <Icon name="mdi:logout" size="20" />
                Cerrar sesion
              </button>
            </template>
            <template v-else>
              <div class="mobile-nav-divider" />
              <NuxtLink to="/auth/login" class="mobile-nav-link" @click="mobileOpen = false">
                <Icon name="mdi:login" size="20" />
                Iniciar sesion
              </NuxtLink>
              <NuxtLink to="/auth/registro" class="mobile-nav-link" @click="mobileOpen = false">
                <Icon name="mdi:account-plus" size="20" />
                Crear cuenta
              </NuxtLink>
            </template>
          </nav>
        </div>
      </div>
    </Transition>
  </header>
</template>

<script setup lang="ts">
defineProps<{ isAdmin?: boolean }>()

const authStore = useAuthStore()
const mobileOpen = ref(false)
const userMenuOpen = ref(false)

const vClickOutside = {
  mounted(el: HTMLElement, binding: any) {
    const handler = (e: Event) => {
      if (!el.contains(e.target as Node)) binding.value()
    }
    ;(el as any).__clickOutside = handler
    setTimeout(() => document.addEventListener('click', handler), 0)
  },
  unmounted(el: HTMLElement) {
    document.removeEventListener('click', (el as any).__clickOutside)
  }
}

function handleLogout() {
  mobileOpen.value = false
  userMenuOpen.value = false
  authStore.logout()
  navigateTo('/')
}

watch(mobileOpen, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
})
</script>

<style lang="scss" scoped>
// ─── Header bar ───
.header-nav {
  position: sticky;
  top: 0;
  z-index: 1030;
  background: $neu-bg;
  box-shadow: $neu-shadow-md;
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;

  @media (min-width: 768px) {
    height: 64px;
  }
}

// ─── Logo ───
.header-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
}

.header-logo-mark {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: $cercu-indigo;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: $neu-shadow-sm;
}

.header-logo-text {
  font-family: $headings-font-family;
  font-size: 1.25rem;
  font-weight: 700;
  color: $neutral-900;
  letter-spacing: -0.02em;
}

// ─── Desktop links ───
.header-links {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-left: 2rem;
}

.header-link {
  display: flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: $neutral-600;
  text-decoration: none;
  border-radius: $border-radius;
  transition: color 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    color: $cercu-indigo;
    box-shadow: $neu-inset-sm;
  }

  &.router-link-active {
    color: $cercu-indigo;
    font-weight: 600;
  }
}

// ─── Desktop actions ───
.header-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: auto;
  position: relative;
}

.btn-header-ghost {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: $neutral-700;
  text-decoration: none;
  border-radius: $border-radius;
  box-shadow: $neu-shadow-sm;
  transition: color 0.2s ease, box-shadow 0.2s ease, transform 0.15s ease;

  &:hover {
    color: $cercu-indigo;
    transform: translateY(-1px);
    box-shadow: $neu-shadow-md;
  }
}

.btn-header-solid {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
  text-decoration: none;
  background: $cercu-indigo;
  border-radius: $border-radius;
  box-shadow: 4px 4px 10px rgba(darken($cercu-indigo, 15%), 0.5), -4px -4px 10px rgba(lighten($cercu-indigo, 20%), 0.4);
  transition: box-shadow 0.2s ease, transform 0.15s ease;

  &:hover {
    color: white;
    transform: translateY(-1px);
    box-shadow: 6px 6px 14px rgba(darken($cercu-indigo, 15%), 0.5), -6px -6px 14px rgba(lighten($cercu-indigo, 20%), 0.4);
  }

  &:active {
    transform: translateY(0);
    box-shadow: inset 3px 3px 6px rgba(darken($cercu-indigo, 15%), 0.5), inset -3px -3px 6px rgba(lighten($cercu-indigo, 20%), 0.4);
  }
}

// ─── User button & dropdown ───
.header-user {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.25rem;
  background: none;
  border: none;
  cursor: pointer;
  border-radius: 999px;
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: $neu-inset-sm;
  }
}

.header-user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: $cercu-indigo;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 700;
  box-shadow: $neu-shadow-sm;
}

.header-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  width: 220px;
  background: $neu-bg;
  border-radius: 12px;
  box-shadow: $neu-shadow-xl;
  border: none;
  overflow: hidden;
  z-index: 1040;
}

.header-dropdown-info {
  padding: 0.875rem 1rem;

  strong {
    display: block;
    font-size: 0.875rem;
    color: $neutral-900;
  }

  span {
    font-size: 0.75rem;
    color: $neutral-500;
  }
}

.header-dropdown-divider {
  height: 2px;
  background: none;
  box-shadow: inset 0 1px 2px $neu-shadow-dark, inset 0 -1px 2px $neu-shadow-light;
}

.header-dropdown-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: $neutral-700;
  background: none;
  border: none;
  cursor: pointer;
  transition: box-shadow 0.15s ease;

  &:hover {
    box-shadow: $neu-inset-sm;
  }

  &--danger {
    color: $danger;
    &:hover { box-shadow: $neu-inset-sm; }
  }
}

// ─── Mobile hamburger ───
.header-hamburger {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 36px;
  height: 36px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;

  span {
    display: block;
    width: 100%;
    height: 2px;
    background: $neutral-700;
    border-radius: 2px;
    transition: transform 0.3s ease, opacity 0.3s ease;
  }

  &.open {
    span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
    span:nth-child(2) { opacity: 0; }
    span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
  }
}

// ─── Mobile drawer ───
.mobile-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1040;
  backdrop-filter: blur(2px);
}

.mobile-drawer {
  position: absolute;
  top: 0;
  right: 0;
  width: 300px;
  max-width: 85vw;
  height: 100%;
  background: $neu-bg;
  box-shadow: $neu-shadow-xl;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.mobile-drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  box-shadow: inset 0 -2px 4px $neu-shadow-dark;
}

.mobile-close {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $neu-bg;
  border: none;
  border-radius: $border-radius;
  color: $neutral-500;
  cursor: pointer;
  box-shadow: $neu-shadow-sm;
  transition: box-shadow 0.15s ease;

  &:hover { box-shadow: $neu-inset-sm; }
}

.mobile-nav {
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.mobile-nav-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  font-size: 0.95rem;
  font-weight: 500;
  color: $neutral-700;
  text-decoration: none;
  border-radius: 10px;
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  transition: box-shadow 0.2s ease, color 0.2s ease;

  &:hover {
    box-shadow: $neu-inset-sm;
    color: $cercu-indigo;
  }

  &--highlight {
    color: $cercu-indigo;
    font-weight: 600;
    box-shadow: $neu-shadow-sm;
  }

  &--danger {
    color: $danger;
    &:hover { box-shadow: $neu-inset-sm; }
  }
}

.mobile-nav-divider {
  height: 2px;
  background: none;
  box-shadow: inset 0 1px 2px $neu-shadow-dark, inset 0 -1px 2px $neu-shadow-light;
  margin: 0.5rem 1rem;
}
</style>