<template>
  <div ref="cardEl" class="card auth-card" :class="{ 'anim-in': mounted }">
    <div class="card-body p-4">
      <div class="text-center mb-4">
        <div class="auth-icon mx-auto mb-3">
          <Icon name="mdi:lock-open" size="28" class="text-brand" />
        </div>
        <h2 class="h5 fw-bold">Iniciar sesion</h2>
      </div>

      <!-- Google Sign-In -->
      <GoogleSignInButton
        class="mb-3"
        @success="handleGoogleSuccess"
        @error="handleGoogleError"
      />

      <div class="divider-text mb-3">
        <span>o ingresa con telefono</span>
      </div>

      <Transition name="step-slide-left" mode="out-in">
        <div v-if="!otpSent" key="phone-step">
          <PhoneInput v-model="phone" label="Numero de telefono" :error="phoneError" />
          <AppButton
            variant="primary"
            block
            :loading="loading"
            class="mt-3"
            @click="handleSendOtp"
          >
            <Icon name="mdi:send" class="me-1" />
            Enviar codigo
          </AppButton>
        </div>

        <div v-else key="otp-step">
          <p class="text-center text-muted mb-3">
            Ingresa el codigo enviado a <strong>+52 {{ phone }}</strong>
          </p>
          <OtpInput
            v-model="otpCode"
            label="Codigo de verificacion"
            :error="otpError"
            @complete="handleVerify"
          />
          <AppButton
            variant="primary"
            block
            :loading="loading"
            class="mt-3"
            @click="handleVerify"
          >
            <Icon name="mdi:check" class="me-1" />
            Verificar
          </AppButton>
          <button
            class="btn btn-link btn-sm w-100 mt-2"
            :disabled="cooldown > 0"
            @click="handleSendOtp"
          >
            {{ cooldown > 0 ? `Reenviar en ${cooldown}s` : 'Reenviar codigo' }}
          </button>
        </div>
      </Transition>

      <hr class="my-4" />
      <p class="text-center text-muted mb-0 small">
        No tienes cuenta?
        <NuxtLink to="/auth/registro" class="fw-semibold text-brand">Registrate</NuxtLink>
      </p>
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

const phone = ref('')
const otpCode = ref('')
const otpSent = ref(false)
const loading = ref(false)
const phoneError = ref('')
const otpError = ref('')
const cooldown = ref(0)

let cooldownTimer: ReturnType<typeof setInterval>

onMounted(() => {
  requestAnimationFrame(() => {
    mounted.value = true
  })
})

function handleGoogleSuccess({ user, isNewUser }: { credential: string; user: any; isNewUser: boolean }) {
  toast.success(isNewUser ? 'Cuenta creada con Google' : 'Sesion iniciada con Google')
  navigateTo(authStore.isProfessional ? '/pro' : '/solicitudes')
}

function handleGoogleError(err: Error) {
  toast.error('No se pudo iniciar sesion con Google')
}

async function handleSendOtp() {
  if (phone.value.length < 10) {
    phoneError.value = 'Ingresa un numero valido de 10 digitos'
    if (cardEl.value) wiggle(cardEl.value)
    return
  }
  phoneError.value = ''
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
    phoneError.value = e?.data?.error?.message || 'Error al enviar codigo'
    if (cardEl.value) wiggle(cardEl.value)
  } finally {
    loading.value = false
  }
}

async function handleVerify() {
  if (otpCode.value.length < 4) return
  loading.value = true
  otpError.value = ''

  try {
    await authStore.login(`+52${phone.value}`, otpCode.value)
    toast.success('Sesion iniciada')
    navigateTo(authStore.isProfessional ? '/pro' : '/solicitudes')
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
  background: $neu-bg;
  border: none;
  border-radius: 16px;
  box-shadow: $neu-shadow-lg;
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
  background: $neu-bg;
  box-shadow: $neu-shadow-sm;
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
    height: 2px;
    background: none;
    box-shadow: inset 0 1px 2px $neu-shadow-dark, inset 0 -1px 2px $neu-shadow-light;
  }
}
</style>
