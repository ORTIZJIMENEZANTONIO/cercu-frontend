export const useServiceRequestStore = defineStore('serviceRequest', {
  state: () => ({
    step: 1,
    categoryId: null as number | null,
    chipIds: [] as number[],
    conditionalFields: [] as { fieldId: number; value: string }[],
    description: '',
    photos: [] as string[],
    lat: null as number | null,
    lng: null as number | null,
    address: '',
    urgencyTier: 'standard' as string,
    preferredSchedule: '',
    phone: '',
    phoneVerified: false,
    submitting: false,
  }),

  getters: {
    canProceedStep1: (state) => !!state.categoryId && state.chipIds.length > 0,
    canProceedStep2: (state) => {
      const hasDesc = state.description.length >= 20;
      const hasDescWithPhoto = state.description.length >= 10 && state.photos.length > 0;
      return hasDesc || hasDescWithPhoto;
    },
    canProceedStep3: (state) => !!state.lat && !!state.lng,
    canProceedStep4: (state) => state.phoneVerified,
  },

  actions: {
    nextStep() {
      if (this.step < 4) this.step++;
    },

    prevStep() {
      if (this.step > 1) this.step--;
    },

    reset() {
      this.step = 1;
      this.categoryId = null;
      this.chipIds = [];
      this.conditionalFields = [];
      this.description = '';
      this.photos = [];
      this.lat = null;
      this.lng = null;
      this.address = '';
      this.urgencyTier = 'standard';
      this.preferredSchedule = '';
      this.phone = '';
      this.phoneVerified = false;
    },

    async submit() {
      this.submitting = true;
      try {
        const authStore = useAuthStore();
        const config = useRuntimeConfig();
        const data: any = await $fetch(`${config.public.apiBase}/leads`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${authStore.token}` },
          body: {
            categoryId: this.categoryId,
            urgencyTier: this.urgencyTier,
            description: this.description,
            lat: this.lat,
            lng: this.lng,
            address: this.address,
            photos: this.photos,
            chipIds: this.chipIds,
            conditionalFields: this.conditionalFields,
            preferredSchedule: this.preferredSchedule,
          },
        });
        return data;
      } finally {
        this.submitting = false;
      }
    },

    persistToStorage() {
      if (import.meta.client) {
        localStorage.setItem('cercu_request', JSON.stringify(this.$state));
      }
    },

    restoreFromStorage() {
      if (import.meta.client) {
        const saved = localStorage.getItem('cercu_request');
        if (saved) {
          const parsed = JSON.parse(saved);
          Object.assign(this, parsed);
        }
      }
    },
  },
});
