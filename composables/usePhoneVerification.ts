export function usePhoneVerification() {
  const config = useRuntimeConfig();
  const phone = ref('');
  const otpCode = ref('');
  const otpSent = ref(false);
  const verified = ref(false);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const cooldown = ref(0);

  let cooldownInterval: ReturnType<typeof setInterval> | null = null;

  async function sendOtp() {
    if (cooldown.value > 0) return;
    loading.value = true;
    error.value = null;

    try {
      await $fetch(`${config.public.apiBase}/auth/request-otp`, {
        method: 'POST',
        body: { phone: `+52${phone.value}` },
      });
      otpSent.value = true;
      startCooldown(60);
    } catch (e: any) {
      error.value = e?.data?.error?.message || 'Error al enviar OTP';
    } finally {
      loading.value = false;
    }
  }

  async function verifyOtp() {
    loading.value = true;
    error.value = null;

    try {
      const data: any = await $fetch(`${config.public.apiBase}/auth/verify-otp`, {
        method: 'POST',
        body: { phone: `+52${phone.value}`, code: otpCode.value },
      });
      verified.value = true;
      return data.data;
    } catch (e: any) {
      error.value = e?.data?.error?.message || 'Codigo incorrecto';
      return null;
    } finally {
      loading.value = false;
    }
  }

  function startCooldown(seconds: number) {
    cooldown.value = seconds;
    cooldownInterval = setInterval(() => {
      cooldown.value--;
      if (cooldown.value <= 0 && cooldownInterval) {
        clearInterval(cooldownInterval);
      }
    }, 1000);
  }

  onUnmounted(() => {
    if (cooldownInterval) clearInterval(cooldownInterval);
  });

  return { phone, otpCode, otpSent, verified, loading, error, cooldown, sendOtp, verifyOtp };
}
