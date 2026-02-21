<template>
  <button
    class="btn btn-google w-100"
    :disabled="loading"
    @click="handleClick"
  >
    <span v-if="loading" class="spinner-border spinner-border-sm me-2" />
    <svg v-else class="google-icon me-2" width="20" height="20" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
    Continuar con Google
  </button>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  success: [data: { credential: string; user: any; isNewUser: boolean }]
  error: [error: Error]
}>()

const props = defineProps<{
  name?: string
  dateOfBirth?: string
}>()

const authStore = useAuthStore()
const { initGoogle, promptOneTap } = useGoogleAuth()
const loading = ref(false)

async function handleClick() {
  loading.value = true
  try {
    await initGoogle()

    // Use Google One Tap / popup
    const credential = await new Promise<string>((resolve, reject) => {
      if (!window.google) {
        reject(new Error('Google GSI not available'))
        return
      }

      window.google.accounts.id.initialize({
        client_id: useRuntimeConfig().public.googleClientId,
        callback: (response: { credential: string }) => {
          resolve(response.credential)
        },
        auto_select: false,
      })

      window.google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // If One Tap is blocked, reject so we can handle it
          reject(new Error('Google Sign-In was dismissed'))
        }
      })
    })

    const result = await authStore.googleLogin(credential, props.name, props.dateOfBirth)
    emit('success', { credential, user: result.user, isNewUser: result.isNewUser })
  } catch (e: any) {
    emit('error', e)
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.btn-google {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.625rem 1rem;
  font-size: 0.9rem;
  font-weight: 500;
  font-family: 'Inter', sans-serif;
  color: $neutral-700;
  background: $neu-bg;
  border: none;
  border-radius: 12px;
  box-shadow: $neu-shadow-md;
  transition: box-shadow 0.2s ease, transform 0.2s ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: $neu-shadow-lg;
  }

  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: $neu-inset-sm;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.google-icon {
  flex-shrink: 0;
}
</style>
