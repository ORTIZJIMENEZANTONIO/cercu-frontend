<template>
  <div class="container py-5">
        <div class="container-narrow">
          <div class="ob-header text-center mb-4" :class="{ 'anim-in': mounted }">
            <h1 class="h3 fw-bold text-brand-gradient">CERCU Pro</h1>
            <p class="text-muted">Completa tu perfil para empezar a recibir leads</p>
          </div>
          <StepIndicator :current-step="store.step" :total-steps="4" />

          <!-- Step 1: Business info -->
          <Transition :name="stepTransition" mode="out-in">
            <div v-if="store.step === 1" key="ob-step1" class="card card-step p-4">
              <h5 class="fw-semibold mb-3">
                <Icon name="mdi:store" class="text-brand me-2" />
                Informacion del negocio
              </h5>
              <AppInput v-model="store.businessName" label="Nombre del negocio" placeholder="Mi Plomeria Express" class="mb-3" />
              <AppTextarea v-model="store.description" label="Descripcion (opcional)" :rows="3" placeholder="Describete brevemente..." class="mb-3" />
              <AppButton variant="primary" block :disabled="!store.businessName" @click="goNext">
                Continuar
                <Icon name="mdi:arrow-right" class="ms-1" />
              </AppButton>
            </div>
          </Transition>

          <!-- Step 2: Categories -->
          <Transition :name="stepTransition" mode="out-in">
            <div v-if="store.step === 2" key="ob-step2" class="card card-step p-4">
              <h5 class="fw-semibold mb-3">
                <Icon name="mdi:tools" class="text-brand me-2" />
                Que servicios ofreces?
              </h5>
              <div class="d-flex flex-wrap gap-2 mb-4">
                <button
                  v-for="cat in categories"
                  :key="cat.id"
                  type="button"
                  class="btn-chip chip-bounce"
                  :class="{ active: store.categoryIds.includes(cat.id) }"
                  @click="toggleCategory(cat.id)"
                >
                  <Icon :name="cat.icon || 'mdi:wrench'" class="me-1" />
                  {{ cat.name }}
                </button>
              </div>
              <div class="d-flex gap-2">
                <AppButton variant="outline-primary" @click="goBack">
                  <Icon name="mdi:arrow-left" class="me-1" />
                  Atras
                </AppButton>
                <AppButton variant="primary" class="flex-grow-1" :disabled="store.categoryIds.length === 0" @click="goNext">
                  Continuar
                  <Icon name="mdi:arrow-right" class="ms-1" />
                </AppButton>
              </div>
            </div>
          </Transition>

          <!-- Step 3: Coverage -->
          <Transition :name="stepTransition" mode="out-in">
            <div v-if="store.step === 3" key="ob-step3" class="card card-step p-4">
              <h5 class="fw-semibold mb-3">
                <Icon name="mdi:map-marker-radius" class="text-brand me-2" />
                Zona de cobertura
              </h5>
              <p class="text-muted small">Selecciona tu ubicacion base y radio de servicio</p>
              <MapPicker
                :model-value="store.baseLat && store.baseLng ? { lat: store.baseLat, lng: store.baseLng } : null"
                :radius="store.serviceRadiusKm"
                @update:model-value="handleLocation"
              />
              <div class="mt-3">
                <label class="form-label d-flex justify-content-between">
                  <span>Radio de servicio</span>
                  <strong class="text-brand">{{ store.serviceRadiusKm }}km</strong>
                </label>
                <input
                  v-model.number="store.serviceRadiusKm"
                  type="range"
                  class="form-range"
                  min="1"
                  max="25"
                />
              </div>
              <div class="d-flex gap-2 mt-3">
                <AppButton variant="outline-primary" @click="goBack">
                  <Icon name="mdi:arrow-left" class="me-1" />
                  Atras
                </AppButton>
                <AppButton variant="primary" class="flex-grow-1" :disabled="!store.baseLat" @click="goNext">
                  Continuar
                  <Icon name="mdi:arrow-right" class="ms-1" />
                </AppButton>
              </div>
            </div>
          </Transition>

          <!-- Step 4: Schedule + Submit -->
          <Transition :name="stepTransition" mode="out-in">
            <div v-if="store.step === 4" key="ob-step4" class="card card-step p-4">
              <h5 class="fw-semibold mb-3">
                <Icon name="mdi:calendar-clock" class="text-brand me-2" />
                Horario de trabajo
              </h5>
              <div v-for="day in days" :key="day.value" class="schedule-row d-flex align-items-center gap-2 mb-2">
                <div style="width: 80px;" class="fw-semibold small">{{ day.label }}</div>
                <input type="time" v-model="scheduleForm[day.value].start" class="form-control form-control-sm input-glow" style="width: 120px;" />
                <span class="text-muted">a</span>
                <input type="time" v-model="scheduleForm[day.value].end" class="form-control form-control-sm input-glow" style="width: 120px;" />
                <div class="form-check form-switch">
                  <input type="checkbox" v-model="scheduleForm[day.value].active" class="form-check-input" />
                </div>
              </div>
              <div class="d-flex gap-2 mt-4">
                <AppButton variant="outline-primary" @click="goBack">
                  <Icon name="mdi:arrow-left" class="me-1" />
                  Atras
                </AppButton>
                <AppButton variant="primary" class="flex-grow-1" :loading="store.submitting" @click="handleSubmit">
                  <Icon name="mdi:check-circle" class="me-1" />
                  Completar registro
                </AppButton>
              </div>
            </div>
          </Transition>
        </div>
      </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'blank', middleware: ['auth'] })

const store = useOnboardingStore()
const categoriesStore = useCategoriesStore()
const toast = useToast()

const mounted = ref(false)
const stepDirection = ref<'left' | 'right'>('left')

const stepTransition = computed(() => `step-slide-${stepDirection.value}`)

const categories = computed(() => categoriesStore.categories)

const days = [
  { value: 1, label: 'Lunes' },
  { value: 2, label: 'Martes' },
  { value: 3, label: 'Miercoles' },
  { value: 4, label: 'Jueves' },
  { value: 5, label: 'Viernes' },
  { value: 6, label: 'Sabado' },
  { value: 0, label: 'Domingo' },
]

const scheduleForm = reactive<Record<number, { start: string; end: string; active: boolean }>>({})
days.forEach((d) => {
  scheduleForm[d.value] = { start: '08:00', end: '18:00', active: d.value >= 1 && d.value <= 5 }
})

onMounted(() => {
  requestAnimationFrame(() => { mounted.value = true })
  categoriesStore.fetchAll().catch(() => {})
})

function goNext() {
  stepDirection.value = 'left'
  store.nextStep()
}

function goBack() {
  stepDirection.value = 'right'
  store.prevStep()
}

function toggleCategory(id: number) {
  const idx = store.categoryIds.indexOf(id)
  if (idx >= 0) {
    store.categoryIds.splice(idx, 1)
  } else {
    store.categoryIds.push(id)
  }
}

function handleLocation(loc: { lat: number; lng: number }) {
  store.baseLat = loc.lat
  store.baseLng = loc.lng
}

async function handleSubmit() {
  store.schedule = Object.entries(scheduleForm)
    .filter(([_, v]) => v.active)
    .map(([k, v]) => ({
      dayOfWeek: Number(k),
      startTime: v.start,
      endTime: v.end,
    }))

  try {
    await store.submit()
    // Refresh user data so role updates to 'professional'
    const authStore = useAuthStore()
    await authStore.fetchMe().catch(() => {})
    toast.success('Perfil creado! Bienvenido a CERCU Pro')
    store.reset()
    navigateTo('/pro')
  } catch (e: any) {
    toast.error(e?.data?.error?.message || 'Error al registrar')
  }
}
</script>

<style lang="scss" scoped>
.ob-header {
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);

  &.anim-in {
    opacity: 1;
    transform: translateY(0);
  }
}

.container-narrow {
  max-width: 560px;
  margin: 0 auto;
}

.text-brand-gradient {
  background: linear-gradient(135deg, $cercu-indigo 0%, $cercu-coral 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.card-step {
  border: none;
  box-shadow: $box-shadow;
  border-radius: $border-radius-xl;
}

.schedule-row {
  padding: 0.375rem 0;
  border-bottom: 1px solid $neutral-100;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba($cercu-indigo, 0.02);
    border-radius: $border-radius-sm;
  }

  &:last-child {
    border-bottom: none;
  }
}
</style>
