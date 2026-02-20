<template>
  <div class="container py-4">
    <div class="container-narrow">
      <h1 class="solicitar-title" :class="{ 'anim-in': mounted }">Solicitar servicio</h1>
      <StepIndicator :current-step="store.step" :total-steps="4" />

      <div class="step-container">
        <!-- Step 1: Category + Chips -->
        <Transition :name="stepTransition" mode="out-in">
          <div v-if="store.step === 1" key="step1" class="card card-step p-4">
            <h5 class="fw-semibold mb-3">
              <Icon name="mdi:clipboard-text" class="text-brand me-2" />
              Que servicio necesitas?
            </h5>
            <AppSelect
              v-model="store.categoryId"
              label="Categoria"
              :options="categoryOptions"
              placeholder="Selecciona una categoria"
              class="mb-3"
            />

            <template v-if="selectedCategory">
              <Transition name="slide-up" appear>
                <ChipSelector
                  v-model="store.chipIds"
                  :chips="selectedCategory.chips || []"
                  label="Tipo de servicio (selecciona al menos 1)"
                  :error="store.chipIds.length === 0 ? 'Selecciona al menos un servicio' : ''"
                />
              </Transition>

              <!-- Conditional fields -->
              <TransitionGroup name="slide-up">
                <div v-for="field in visibleConditionalFields" :key="field.id" class="mt-3">
                  <AppSelect
                    v-if="field.fieldType === 'select'"
                    :model-value="getFieldValue(field.id)"
                    :label="field.label"
                    :options="field.options || []"
                    placeholder="Selecciona"
                    @update:model-value="setFieldValue(field.id, $event)"
                  />
                  <AppInput
                    v-else
                    :model-value="getFieldValue(field.id)"
                    :label="field.label"
                    @update:model-value="setFieldValue(field.id, $event as string)"
                  />
                </div>
              </TransitionGroup>
            </template>

            <AppButton
              variant="primary"
              block
              class="mt-4"
              :disabled="!store.canProceedStep1"
              @click="goNext"
            >
              Continuar
              <Icon name="mdi:arrow-right" class="ms-1" />
            </AppButton>
          </div>
        </Transition>

        <!-- Step 2: Description + Photos -->
        <Transition :name="stepTransition" mode="out-in">
          <div v-if="store.step === 2" key="step2" class="card card-step p-4">
            <h5 class="fw-semibold mb-3">
              <Icon name="mdi:text-box" class="text-brand me-2" />
              Describe tu problema
            </h5>
            <AppTextarea
              v-model="store.description"
              label="Descripcion"
              placeholder="Describe el problema con detalle..."
              :rows="4"
              :max-length="500"
              hint="Minimo 20 caracteres (o 10 con foto)"
              class="mb-3"
            />

            <PhotoUploader v-model="store.photos" label="Fotos (opcional)" :max="4" />

            <div class="d-flex gap-2 mt-4">
              <AppButton variant="outline-primary" @click="goBack">
                <Icon name="mdi:arrow-left" class="me-1" />
                Atras
              </AppButton>
              <AppButton variant="primary" class="flex-grow-1" :disabled="!store.canProceedStep2" @click="goNext">
                Continuar
                <Icon name="mdi:arrow-right" class="ms-1" />
              </AppButton>
            </div>
          </div>
        </Transition>

        <!-- Step 3: Location -->
        <Transition :name="stepTransition" mode="out-in">
          <div v-if="store.step === 3" key="step3" class="card card-step p-4">
            <h5 class="fw-semibold mb-3">
              <Icon name="mdi:map-marker" class="text-brand me-2" />
              Donde necesitas el servicio?
            </h5>
            <AppButton variant="outline-primary" class="mb-3 btn-press" icon="mdi:crosshairs-gps" @click="useMyLocation">
              Usar mi ubicacion
            </AppButton>

            <MapPicker
              :model-value="store.lat && store.lng ? { lat: store.lat, lng: store.lng } : null"
              @update:model-value="handleLocationPick"
            />

            <AppInput
              v-model="store.address"
              label="Direccion o referencia"
              placeholder="Col. Roma Norte, CDMX"
              class="mt-3"
            />

            <div class="d-flex gap-2 mt-4">
              <AppButton variant="outline-primary" @click="goBack">
                <Icon name="mdi:arrow-left" class="me-1" />
                Atras
              </AppButton>
              <AppButton variant="primary" class="flex-grow-1" :disabled="!store.canProceedStep3" @click="goNext">
                Continuar
                <Icon name="mdi:arrow-right" class="ms-1" />
              </AppButton>
            </div>
          </div>
        </Transition>

        <!-- Step 4: Urgency + Phone verification -->
        <Transition :name="stepTransition" mode="out-in">
          <div v-if="store.step === 4" key="step4" class="card card-step p-4">
            <h5 class="fw-semibold mb-3">
              <Icon name="mdi:clock-fast" class="text-brand me-2" />
              Urgencia y contacto
            </h5>

            <div class="mb-3">
              <label class="form-label">Cuando lo necesitas?</label>
              <div class="d-flex flex-column gap-2">
                <label
                  v-for="tier in urgencyTiers"
                  :key="tier.value"
                  class="urgency-option form-check card p-3"
                  :class="{ 'urgency-option--selected': store.urgencyTier === tier.value }"
                >
                  <input
                    v-model="store.urgencyTier"
                    type="radio"
                    :value="tier.value"
                    class="form-check-input me-2"
                  />
                  <span class="fw-semibold">{{ tier.label }}</span>
                  <span class="text-muted small ms-2">{{ tier.desc }}</span>
                  <Icon v-if="tier.value === 'immediate'" name="mdi:flash" class="ms-auto text-danger" />
                </label>
              </div>
            </div>

            <AppInput
              v-model="store.preferredSchedule"
              label="Horario preferido (opcional)"
              placeholder="Manana entre 10-12"
              class="mb-3"
            />

            <template v-if="!authStore.isAuthenticated">
              <hr />
              <h6 class="fw-semibold mb-2">
                <Icon name="mdi:phone-check" class="text-brand me-2" />
                Verificacion de telefono
              </h6>
              <PhoneInput v-model="phoneInput" label="Tu telefono" class="mb-2" />
              <Transition name="slide-up">
                <OtpInput v-if="phoneOtpSent" v-model="otpInput" @complete="verifyAndSubmit" />
              </Transition>
              <AppButton
                v-if="!phoneOtpSent"
                variant="outline-primary"
                block
                :loading="phoneLoading"
                @click="sendPhoneOtp"
              >
                Enviar codigo
              </AppButton>
            </template>

            <div class="d-flex gap-2 mt-4">
              <AppButton variant="outline-primary" @click="goBack">
                <Icon name="mdi:arrow-left" class="me-1" />
                Atras
              </AppButton>
              <AppButton
                variant="primary"
                class="flex-grow-1"
                :loading="store.submitting"
                :disabled="!authStore.isAuthenticated && !store.phoneVerified"
                @click="handleSubmit"
              >
                <Icon name="mdi:send" class="me-1" />
                Enviar solicitud
              </AppButton>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const store = useServiceRequestStore()
const categoriesStore = useCategoriesStore()
const authStore = useAuthStore()
const toast = useToast()
const geo = useGeolocation()
const route = useRoute()

const mounted = ref(false)
const phoneInput = ref('')
const otpInput = ref('')
const phoneOtpSent = ref(false)
const phoneLoading = ref(false)
const stepDirection = ref<'left' | 'right'>('left')

const stepTransition = computed(() =>
  `step-slide-${stepDirection.value}`
)

const urgencyTiers = [
  { value: 'standard', label: 'Estandar', desc: 'En los proximos dias' },
  { value: 'today', label: 'Hoy', desc: 'Lo necesito hoy' },
  { value: 'immediate', label: 'Inmediato', desc: 'Es una emergencia' },
]

const categoryOptions = computed(() =>
  categoriesStore.categories.map((c: any) => ({ value: c.id, label: c.name }))
)

const selectedCategory = computed(() =>
  categoriesStore.categories.find((c: any) => c.id === Number(store.categoryId))
)

const visibleConditionalFields = computed(() => {
  if (!selectedCategory.value?.conditionalFields) return []
  const selectedSlugs = (selectedCategory.value.chips || [])
    .filter((ch: any) => store.chipIds.includes(ch.id))
    .map((ch: any) => ch.slug)

  return selectedCategory.value.conditionalFields.filter((f: any) => {
    if (!f.showWhenChipSlugs || f.showWhenChipSlugs.length === 0) return true
    return f.showWhenChipSlugs.some((s: string) => selectedSlugs.includes(s))
  })
})

onMounted(() => {
  requestAnimationFrame(() => {
    mounted.value = true
  })

  // Non-blocking fetch
  categoriesStore.fetchAll().catch(() => {})
  // Pre-select category from query param
  const catQuery = route.query.categoria as string
  if (catQuery) {
    nextTick(() => {
      const cat = categoriesStore.categories.find((c: any) => c.slug === catQuery)
      if (cat) store.categoryId = cat.id
    })
  }
})

function goNext() {
  stepDirection.value = 'left'
  store.nextStep()
}

function goBack() {
  stepDirection.value = 'right'
  store.prevStep()
}

function getFieldValue(fieldId: number) {
  return store.conditionalFields.find((f) => f.fieldId === fieldId)?.value || ''
}

function setFieldValue(fieldId: number, value: string | number) {
  const idx = store.conditionalFields.findIndex((f) => f.fieldId === fieldId)
  if (idx >= 0) {
    store.conditionalFields[idx].value = String(value)
  } else {
    store.conditionalFields.push({ fieldId, value: String(value) })
  }
}

function handleLocationPick(loc: { lat: number; lng: number }) {
  store.lat = loc.lat
  store.lng = loc.lng
  geo.reverseGeocode(loc.lat, loc.lng).then(() => {
    store.address = geo.address.value
  })
}

async function useMyLocation() {
  await geo.getCurrentPosition()
  if (geo.lat.value && geo.lng.value) {
    store.lat = geo.lat.value
    store.lng = geo.lng.value
    store.address = geo.address.value
  }
}

async function sendPhoneOtp() {
  phoneLoading.value = true
  try {
    const config = useRuntimeConfig()
    await $fetch(`${config.public.apiBase}/auth/request-otp`, {
      method: 'POST',
      body: { phone: `+52${phoneInput.value}` },
    })
    phoneOtpSent.value = true
    toast.info('Codigo enviado (use 1234)')
  } finally {
    phoneLoading.value = false
  }
}

async function verifyAndSubmit() {
  try {
    await authStore.login(`+52${phoneInput.value}`, otpInput.value)
    store.phoneVerified = true
    await handleSubmit()
  } catch {
    toast.error('Codigo incorrecto')
  }
}

async function handleSubmit() {
  try {
    await store.submit()
    toast.success('Solicitud enviada!')
    store.reset()
    navigateTo('/solicitar/confirmacion')
  } catch (e: any) {
    toast.error(e?.data?.error?.message || 'Error al enviar solicitud')
  }
}

useHead({ title: 'Solicitar servicio - CERCU' })
</script>

<style lang="scss" scoped>
.container-narrow {
  max-width: 560px;
  margin: 0 auto;
}

.solicitar-title {
  font-family: $headings-font-family;
  font-size: 1.375rem;
  font-weight: 700;
  text-align: center;
  color: $neutral-900;
  margin-bottom: 0.5rem;
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);

  &.anim-in {
    opacity: 1;
    transform: translateY(0);
  }
}

.card-step {
  border: 1px solid $neutral-100;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  border-radius: 16px;
}

.urgency-option {
  cursor: pointer;
  border: 2px solid $neutral-200;
  transition: border-color 0.25s ease, box-shadow 0.25s ease, transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);

  &:hover {
    border-color: $cercu-indigo-light;
  }

  &--selected {
    border-color: $cercu-indigo;
    box-shadow: 0 0 0 3px rgba($cercu-indigo, 0.1);
    transform: scale(1.01);
  }
}

.step-container {
  position: relative;
  min-height: 200px;
}

.text-brand {
  color: $cercu-indigo;
}
</style>
