<template>
  <div>
    <div ref="cardEl" class="card auth-card" :class="{ 'anim-in': mounted }">
      <div class="card-body p-4">
        <div class="text-center mb-4">
          <div class="auth-icon mx-auto mb-3">
            <Icon name="mdi:account-hard-hat" size="28" class="text-brand" />
          </div>
          <h2 class="h5 fw-bold">Registrate como profesional</h2>
          <p class="text-muted small mb-0">Recibe solicitudes de trabajo cerca de ti</p>
        </div>

        <!-- Google Sign-In -->
        <GoogleSignInButton
          :name="name"
          :date-of-birth="dateOfBirth"
          class="mb-3"
          @success="handleGoogleSuccess"
          @error="handleGoogleError"
        />

        <div class="divider-text mb-3">
          <span>o registrate con telefono</span>
        </div>

        <Transition name="step-slide-left" mode="out-in">
          <div v-if="!otpSent" key="info-step">
            <AppInput
              v-model="name"
              label="Nombre o razon social"
              placeholder="Tu nombre o negocio"
              class="mb-3"
            />
            <AppInput
              v-model="email"
              label="Correo electronico (opcional)"
              placeholder="tu@email.com"
              type="email"
              class="mb-3"
            />
            <AppDateInput
              v-model="dateOfBirth"
              label="Fecha de nacimiento"
              :max-date="maxDob"
              hint="Debes tener al menos 18 anos"
              class="mb-3"
            />
            <PhoneInput
              v-model="phone"
              label="Numero de telefono"
              :error="error"
            />
            <AppButton
              variant="primary"
              block
              :loading="loading"
              class="mt-3"
              @click="sendOtp"
            >
              <Icon name="mdi:send" class="me-1" />
              Continuar
            </AppButton>
          </div>

          <div v-else key="otp-step">
            <p class="text-center text-muted mb-3">
              Codigo enviado a <strong>+52 {{ phone }}</strong>
            </p>
            <OtpInput v-model="otpCode" :error="otpError" @complete="verify" />
            <AppButton
              variant="primary"
              block
              :loading="loading"
              class="mt-3"
              @click="verify"
            >
              <Icon name="mdi:check" class="me-1" />
              Verificar
            </AppButton>
            <button
              class="btn btn-link btn-sm w-100 mt-2"
              :disabled="cooldown > 0"
              @click="sendOtp"
            >
              {{ cooldown > 0 ? `Reenviar en ${cooldown}s` : 'Reenviar codigo' }}
            </button>
          </div>
        </Transition>

        <hr class="my-4" />
        <p class="text-center text-muted mb-0 small">
          Ya tienes cuenta?
          <NuxtLink to="/auth/login" class="fw-semibold text-brand">Inicia sesion</NuxtLink>
        </p>
      </div>
    </div>

    <!-- Pro Benefits -->
    <div class="pro-benefits" :class="{ 'anim-in': mounted }">
      <div v-for="(benefit, i) in benefits" :key="i" class="pro-benefit">
        <div class="pro-benefit-icon">
          <Icon :name="benefit.icon" size="18" />
        </div>
        <div>
          <strong>{{ benefit.title }}</strong>
          <span>{{ benefit.desc }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'auth' })

const authStore = useAuthStore()
const toast = useToast()
const { wiggle } = useAnimations()

const cardEl = ref<HTMLElement>()
const mounted = ref(false)

const name = ref('')
const email = ref('')
const dateOfBirth = ref('')
const phone = ref('')
const otpCode = ref('')
const otpSent = ref(false)
const loading = ref(false)
const error = ref('')
const otpError = ref('')
const cooldown = ref(0)

// Max DOB = 18 years ago
const maxDob = computed(() => {
  const d = new Date()
  d.setFullYear(d.getFullYear() - 18)
  return d.toISOString().split('T')[0]
})

let cooldownTimer: ReturnType<typeof setInterval>

const benefits = [
  { icon: 'mdi:map-marker-radius', title: 'Clientes cerca', desc: 'Recibe leads de tu zona' },
  { icon: 'mdi:cash-multiple', title: 'Paga por lead', desc: 'Sin suscripciones' },
  { icon: 'mdi:shield-check', title: 'Perfil verificado', desc: 'Genera confianza' },
]

onMounted(() => {
  requestAnimationFrame(() => {
    mounted.value = true
  })
})

function handleGoogleSuccess({ user, isNewUser }: { credential: string; user: any; isNewUser: boolean }) {
  if (!isNewUser && authStore.isProfessional) {
    toast.success('Bienvenido de vuelta')
    navigateTo('/pro')
  } else {
    toast.success(isNewUser ? 'Cuenta creada con Google' : 'Completa tu perfil profesional')
    navigateTo('/pro/onboarding')
  }
}

function handleGoogleError(err: Error) {
  toast.error('No se pudo registrar con Google')
}

async function sendOtp() {
  if (phone.value.length < 10) {
    error.value = 'Ingresa un numero valido de 10 digitos'
    if (cardEl.value) wiggle(cardEl.value)
    return
  }
  error.value = ''
  loading.value = true
  try {
    const config = useRuntimeConfig()
    await $fetch(`${config.public.apiBase}/auth/request-otp`, {
      method: 'POST',
      body: { phone: `+52${phone.value}` },
    })
    otpSent.value = true
    startCooldown(60)
    toast.success('Codigo enviado (use 1234 en modo demo)')
  } catch (e: any) {
    error.value = e?.data?.error?.message || 'Error al enviar codigo'
    if (cardEl.value) wiggle(cardEl.value)
  } finally {
    loading.value = false
  }
}

async function verify() {
  if (otpCode.value.length < 4) return
  loading.value = true
  otpError.value = ''
  try {
    const result = await authStore.login(`+52${phone.value}`, otpCode.value, name.value, email.value, dateOfBirth.value)
    if (result.isNewUser) {
      toast.success('Cuenta creada')
      navigateTo('/pro/onboarding')
    } else if (authStore.isProfessional) {
      toast.success('Bienvenido de vuelta')
      navigateTo('/pro')
    } else {
      toast.success('Bienvenido! Completa tu perfil profesional')
      navigateTo('/pro/onboarding')
    }
  } catch (e: any) {
    otpError.value = e?.data?.error?.message || 'Codigo incorrecto'
    if (cardEl.value) wiggle(cardEl.value)
  } finally {
    loading.value = false
  }
}

function startCooldown(sec: number) {
  cooldown.value = sec
  clearInterval(cooldownTimer)
  cooldownTimer = setInterval(() => {
    cooldown.value--
    if (cooldown.value <= 0) clearInterval(cooldownTimer)
  }, 1000)
}

onUnmounted(() => clearInterval(cooldownTimer))
</script>

<style lang="scss" scoped>
.auth-card {
  border: 1px solid $neutral-100;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);

  &.anim-in {
    opacity: 1;
    transform: translateY(0);
  }
}

.auth-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: rgba($cercu-indigo, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
}

.text-brand {
  color: $cercu-indigo;
}

.divider-text {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: $neutral-400;
  font-size: 0.8rem;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: $neutral-200;
  }
}

// ─── Pro Benefits ───
.pro-benefits {
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.5s ease 0.3s, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.3s;

  &.anim-in {
    opacity: 1;
    transform: translateY(0);
  }
}

.pro-benefit {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: white;
  border: 1px solid $neutral-100;
  border-radius: 12px;

  strong {
    display: block;
    font-size: 0.8rem;
    color: $neutral-800;
    line-height: 1.3;
  }

  span {
    font-size: 0.75rem;
    color: $neutral-500;
  }
}

.pro-benefit-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba($cercu-indigo, 0.08);
  color: $cercu-indigo;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
</style>
