<template>
  <div class="error-page">
    <div class="error-container" :class="{ 'anim-in': mounted }">
      <div class="error-icon-wrap">
        <div class="error-icon" :class="is404 ? 'error-icon--404' : 'error-icon--500'">
          <Icon :name="is404 ? 'mdi:map-marker-question' : 'mdi:alert-circle'" size="40" />
        </div>
      </div>

      <div class="error-code">{{ error?.statusCode || 500 }}</div>

      <h1 class="error-title">
        {{ is404 ? 'Pagina no encontrada' : 'Algo salio mal' }}
      </h1>

      <p class="error-message">
        {{ is404
          ? 'La pagina que buscas no existe o fue movida.'
          : (error?.message || 'Ocurrio un error inesperado. Intenta de nuevo.')
        }}
      </p>

      <div class="error-actions">
        <button class="btn btn-error-primary btn-press" @click="handleError">
          <Icon name="mdi:home" class="me-2" size="18" />
          Volver al inicio
        </button>
        <button v-if="!is404" class="btn btn-error-secondary btn-press" @click="retry">
          <Icon name="mdi:refresh" class="me-2" size="18" />
          Reintentar
        </button>
      </div>
    </div>

    <!-- Background decorations -->
    <div class="error-bg-decor">
      <div class="error-bg-circle error-bg-circle--1" />
      <div class="error-bg-circle error-bg-circle--2" />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  error: {
    statusCode: number
    message: string
  }
}>()

const mounted = ref(false)
const is404 = computed(() => props.error?.statusCode === 404)

onMounted(() => {
  requestAnimationFrame(() => {
    mounted.value = true
  })
})

function handleError() {
  clearError({ redirect: '/' })
}

function retry() {
  clearError()
  window.location.reload()
}
</script>

<style lang="scss" scoped>
.error-page {
  min-height: 100vh;
  min-height: 100dvh;
  background: $neutral-50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
}

.error-container {
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 420px;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);

  &.anim-in {
    opacity: 1;
    transform: translateY(0);
  }
}

.error-icon-wrap {
  margin-bottom: 1.5rem;
}

.error-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &--404 {
    background: rgba($cercu-indigo, 0.08);
    color: $cercu-indigo;
  }

  &--500 {
    background: rgba($cercu-coral, 0.08);
    color: $cercu-coral;
  }
}

.error-code {
  font-family: $headings-font-family;
  font-size: 4rem;
  font-weight: 800;
  color: $neutral-200;
  line-height: 1;
  margin-bottom: 0.5rem;

  @media (min-width: 768px) {
    font-size: 5rem;
  }
}

.error-title {
  font-family: $headings-font-family;
  font-size: 1.375rem;
  font-weight: 700;
  color: $neutral-900;
  margin-bottom: 0.75rem;

  @media (min-width: 768px) {
    font-size: 1.5rem;
  }
}

.error-message {
  font-size: 0.9rem;
  color: $neutral-500;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.error-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: center;

  @media (min-width: 480px) {
    flex-direction: row;
    justify-content: center;
  }
}

.btn-error-primary {
  display: inline-flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  font-size: 0.9rem;
  border-radius: 12px;
  background: $cercu-indigo;
  color: white;
  border: none;
  box-shadow: 0 4px 14px rgba($cercu-indigo, 0.25);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba($cercu-indigo, 0.35);
  }
}

.btn-error-secondary {
  display: inline-flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  font-size: 0.9rem;
  border-radius: 12px;
  background: white;
  color: $neutral-700;
  border: 1px solid $neutral-200;
  transition: background 0.2s ease, border-color 0.2s ease;

  &:hover {
    background: $neutral-50;
    border-color: $neutral-300;
  }
}

// ─── Background Decorations ───
.error-bg-decor {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.error-bg-circle {
  position: absolute;
  border-radius: 50%;

  &--1 {
    top: -120px;
    right: -80px;
    width: 300px;
    height: 300px;
    background: rgba($cercu-indigo, 0.03);
  }

  &--2 {
    bottom: -80px;
    left: -60px;
    width: 220px;
    height: 220px;
    background: rgba($cercu-coral, 0.03);
  }
}
</style>
