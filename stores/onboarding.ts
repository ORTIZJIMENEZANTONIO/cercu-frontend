export const useOnboardingStore = defineStore('onboarding', {
  state: () => ({
    step: 1,
    businessName: '',
    description: '',
    categoryIds: [] as number[],
    baseLat: null as number | null,
    baseLng: null as number | null,
    serviceRadiusKm: 10,
    schedule: [] as { dayOfWeek: number; startTime: string; endTime: string }[],
    submitting: false,
  }),

  actions: {
    nextStep() {
      if (this.step < 4) this.step++;
    },

    prevStep() {
      if (this.step > 1) this.step--;
    },

    async submit() {
      this.submitting = true;
      try {
        const authStore = useAuthStore();
        const config = useRuntimeConfig();
        const data: any = await $fetch(`${config.public.apiBase}/professionals/onboard`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${authStore.token}` },
          body: {
            businessName: this.businessName,
            description: this.description,
            baseLat: this.baseLat,
            baseLng: this.baseLng,
            serviceRadiusKm: this.serviceRadiusKm,
            categoryIds: this.categoryIds,
            schedule: this.schedule,
          },
        });
        return data;
      } finally {
        this.submitting = false;
      }
    },

    reset() {
      this.step = 1;
      this.businessName = '';
      this.description = '';
      this.categoryIds = [];
      this.baseLat = null;
      this.baseLng = null;
      this.serviceRadiusKm = 10;
      this.schedule = [];
    },
  },
});
