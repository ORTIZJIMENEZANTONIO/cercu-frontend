<template>
  <div>
    <div class="page-header" :class="{ 'anim-in': mounted }">
      <h1 class="page-title">Configuracion</h1>
      <p class="page-subtitle">Ajusta tu disponibilidad y cuenta</p>
    </div>

    <div class="settings-grid">
        <!-- Availability -->
        <div class="settings-card" :class="{ 'anim-in': mounted }">
          <div class="settings-card-header">
            <div class="settings-card-icon settings-card-icon--green">
              <Icon name="mdi:broadcast" size="20" />
            </div>
            <div>
              <h5 class="settings-card-title">Disponibilidad</h5>
              <p class="settings-card-desc">Controla cuando recibes leads</p>
            </div>
          </div>
          <div class="settings-card-body">
            <div class="setting-row">
              <div class="setting-info">
                <span class="setting-label">Recibir leads</span>
                <span class="setting-hint">Apareces en resultados de busqueda</span>
              </div>
              <label class="toggle-switch">
                <input
                  type="checkbox"
                  :checked="proStore.profile?.isAvailable"
                  @change="toggleAvailable"
                />
                <span class="toggle-slider" />
              </label>
            </div>
            <div class="setting-row">
              <div class="setting-info">
                <span class="setting-label">Fuera de horario</span>
                <span class="setting-hint">Recibe leads urgentes 24/7</span>
              </div>
              <label class="toggle-switch">
                <input
                  type="checkbox"
                  :checked="proStore.profile?.receiveOutsideHours"
                />
                <span class="toggle-slider" />
              </label>
            </div>
          </div>
        </div>

        <!-- Wallet -->
        <div class="settings-card" :class="{ 'anim-in': mounted }" style="transition-delay: 0.1s">
          <div class="settings-card-header">
            <div class="settings-card-icon settings-card-icon--indigo">
              <Icon name="mdi:wallet" size="20" />
            </div>
            <div>
              <h5 class="settings-card-title">Wallet</h5>
              <p class="settings-card-desc">Tu saldo para tomar leads</p>
            </div>
          </div>
          <div class="settings-card-body">
            <div class="btn btn-wallet">
              <Icon name="mdi:cash-multiple" class="me-2" size="18" />
              Wallet
              <span class="ms-auto badge-soon">Proximamente</span>
            </div>
          </div>
        </div>

        <!-- Account -->
        <div class="settings-card" :class="{ 'anim-in': mounted }" style="transition-delay: 0.2s">
          <div class="settings-card-header">
            <div class="settings-card-icon settings-card-icon--neutral">
              <Icon name="mdi:account-cog" size="20" />
            </div>
            <div>
              <h5 class="settings-card-title">Cuenta</h5>
              <p class="settings-card-desc">Administra tu sesion</p>
            </div>
          </div>
          <div class="settings-card-body">
            <button class="btn btn-logout btn-press" @click="handleLogout">
              <Icon name="mdi:logout" class="me-2" size="18" />
              Cerrar sesion
            </button>
          </div>
        </div>
      </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'professional', middleware: ['role'] })

const proStore = useProfessionalStore()
const authStore = useAuthStore()
const toast = useToast()
const mounted = ref(false)

onMounted(async () => {
  requestAnimationFrame(() => {
    mounted.value = true
  })
  try {
    await proStore.fetchProfile()
  } catch {}
  if (proStore.profileMissing && !authStore.isAdmin) {
    return navigateTo('/pro/onboarding')
  }
})

async function toggleAvailable() {
  const newVal = !proStore.profile?.isAvailable
  await proStore.toggleAvailability(newVal)
  toast.success(newVal ? 'Disponible' : 'No disponible')
}

function handleLogout() {
  authStore.logout()
  navigateTo('/')
}
</script>

<style lang="scss" scoped>
// ─── Page Header ───
.page-header {
  margin-bottom: 1.25rem;
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);

  &.anim-in {
    opacity: 1;
    transform: translateY(0);
  }

  @media (min-width: 768px) {
    margin-bottom: 1.5rem;
  }
}

.page-title {
  font-family: $headings-font-family;
  font-size: 1.375rem;
  font-weight: 700;
  color: $neutral-900;
  margin-bottom: 0.25rem;

  @media (min-width: 768px) {
    font-size: 1.5rem;
  }
}

.page-subtitle {
  font-size: 0.875rem;
  color: $neutral-500;
  margin-bottom: 0;
}

// ─── Settings Grid ───
.settings-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 640px;
}

// ─── Settings Card ───
.settings-card {
  background: white;
  border: 1px solid $neutral-100;
  border-radius: 16px;
  overflow: hidden;
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);

  &.anim-in {
    opacity: 1;
    transform: translateY(0);
  }
}

.settings-card-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.25rem 1.25rem 0;

  @media (min-width: 768px) {
    padding: 1.5rem 1.5rem 0;
  }
}

.settings-card-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &--green {
    background: rgba($success, 0.1);
    color: $success;
  }

  &--indigo {
    background: rgba($cercu-indigo, 0.08);
    color: $cercu-indigo;
  }

  &--neutral {
    background: $neutral-100;
    color: $neutral-500;
  }
}

.settings-card-title {
  font-size: 1rem;
  font-weight: 600;
  color: $neutral-800;
  margin-bottom: 0.125rem;
}

.settings-card-desc {
  font-size: 0.8rem;
  color: $neutral-400;
  margin-bottom: 0;
}

.settings-card-body {
  padding: 1.25rem;

  @media (min-width: 768px) {
    padding: 1.5rem;
  }
}

// ─── Setting Row ───
.setting-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 0;

  &:not(:last-child) {
    border-bottom: 1px solid $neutral-50;
  }
}

.setting-info {
  display: flex;
  flex-direction: column;
}

.setting-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: $neutral-800;
}

.setting-hint {
  font-size: 0.75rem;
  color: $neutral-400;
  margin-top: 0.125rem;
}

// ─── Toggle Switch ───
.toggle-switch {
  position: relative;
  width: 48px;
  height: 28px;
  cursor: pointer;
  flex-shrink: 0;

  input {
    opacity: 0;
    width: 0;
    height: 0;
    position: absolute;
  }

  .toggle-slider {
    position: absolute;
    inset: 0;
    background: $neutral-200;
    border-radius: 999px;
    transition: background 0.25s ease;

    &::before {
      content: '';
      position: absolute;
      top: 3px;
      left: 3px;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: white;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
      transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
  }

  input:checked + .toggle-slider {
    background: $cercu-indigo;

    &::before {
      transform: translateX(20px);
    }
  }
}

// ─── Buttons ───
.btn-wallet {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: $cercu-indigo;
  background: rgba($cercu-indigo, 0.04);
  border: 1px solid rgba($cercu-indigo, 0.15);
  border-radius: 12px;
  text-decoration: none;
  cursor: default;
}

.badge-soon {
  font-size: 0.65rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
  background: rgba($warning, 0.1);
  color: $warning;
}

.btn-logout {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: $danger;
  background: rgba($danger, 0.04);
  border: 1px solid rgba($danger, 0.15);
  border-radius: 12px;
  transition: background 0.2s ease, border-color 0.2s ease;

  &:hover {
    background: rgba($danger, 0.08);
    border-color: rgba($danger, 0.25);
  }
}
</style>
