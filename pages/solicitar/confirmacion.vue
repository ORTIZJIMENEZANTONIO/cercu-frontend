<template>
  <div class="container py-5">
    <div class="container-narrow text-center">
      <div class="confirm-icon" :class="{ 'anim-in': mounted }">
        <div class="success-circle d-inline-flex align-items-center justify-content-center position-relative">
          <Icon name="mdi:check" size="44" class="text-white" />
          <div ref="celebrationContainer" class="celebration-container" />
        </div>
      </div>

      <h1 class="confirm-title" :class="{ 'anim-in': mounted }">Solicitud enviada!</h1>
      <p class="confirm-subtitle" :class="{ 'anim-in': mounted }">
        Tu solicitud fue recibida. Estamos buscando profesionales cerca de ti.
        Te notificaremos cuando un profesional tome tu solicitud.
      </p>

      <div class="confirm-card" :class="{ 'anim-in': mounted }">
        <h6 class="fw-semibold mb-3">Proximos pasos:</h6>
        <ul class="list-unstyled mb-0">
          <li v-for="(step, i) in nextSteps" :key="i" class="next-step d-flex align-items-start mb-2">
            <Icon :name="step.icon" class="text-brand me-2 mt-1" />
            <span>{{ step.text }}</span>
          </li>
        </ul>
      </div>

      <div class="confirm-actions" :class="{ 'anim-in': mounted }">
        <NuxtLink to="/solicitudes" class="btn btn-outline-primary btn-press">Ver mis solicitudes</NuxtLink>
        <NuxtLink to="/solicitar" class="btn btn-primary btn-press">Solicitar otro servicio</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { celebrationBurst } = useAnimations()

const celebrationContainer = ref<HTMLElement>()
const mounted = ref(false)

const nextSteps = [
  { icon: 'mdi:numeric-1-circle', text: 'Profesionales cercanos recibiran tu solicitud' },
  { icon: 'mdi:numeric-2-circle', text: 'Un profesional tomara tu caso y te contactara' },
  { icon: 'mdi:numeric-3-circle', text: 'Coordinan la visita a tu domicilio' },
]

onMounted(() => {
  requestAnimationFrame(() => {
    mounted.value = true
  })

  // Trigger celebration after animations settle
  setTimeout(() => {
    if (celebrationContainer.value) {
      celebrationBurst(celebrationContainer.value)
    }
  }, 600)
})

useHead({ title: 'Solicitud enviada - CERCU' })
</script>

<style lang="scss" scoped>
.container-narrow {
  max-width: 560px;
  margin: 0 auto;
}

.confirm-icon {
  margin-bottom: 1.5rem;
  opacity: 0;
  transform: translateY(20px) scale(0.8);
  transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);

  &.anim-in {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.success-circle {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  background: linear-gradient(135deg, $success 0%, darken($success, 10%) 100%);
  box-shadow: 0 8px 32px rgba($success, 0.35);
}

.celebration-container {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.confirm-title {
  font-family: $headings-font-family;
  font-size: 1.5rem;
  font-weight: 700;
  color: $neutral-900;
  margin-bottom: 0.75rem;
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.5s ease 0.1s, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.1s;

  &.anim-in {
    opacity: 1;
    transform: translateY(0);
  }
}

.confirm-subtitle {
  font-size: 0.9rem;
  color: $neutral-500;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.5s ease 0.2s, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.2s;

  &.anim-in {
    opacity: 1;
    transform: translateY(0);
  }
}

.confirm-card {
  background: white;
  border: 1px solid $neutral-100;
  border-radius: 16px;
  padding: 1.25rem;
  text-align: left;
  margin-bottom: 1.5rem;
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.5s ease 0.3s, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.3s;

  &.anim-in {
    opacity: 1;
    transform: translateY(0);
  }
}

.confirm-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.5s ease 0.4s, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.4s;

  &.anim-in {
    opacity: 1;
    transform: translateY(0);
  }
}

.next-step {
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba($neutral-200, 0.5);

  &:last-child {
    border-bottom: none;
  }
}

.text-brand {
  color: $cercu-indigo;
}
</style>
