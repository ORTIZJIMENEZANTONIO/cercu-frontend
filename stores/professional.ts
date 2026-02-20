export const useProfessionalStore = defineStore('professional', {
  state: () => ({
    profile: null as any | null,
    profileMissing: false,
    loading: false,
  }),

  actions: {
    async fetchProfile() {
      this.loading = true;
      this.profileMissing = false;
      try {
        const authStore = useAuthStore();
        const config = useRuntimeConfig();
        const data: any = await $fetch(`${config.public.apiBase}/professionals/profile`, {
          headers: { Authorization: `Bearer ${authStore.token}` },
        });
        this.profile = data.data;
      } catch (e: any) {
        if (e?.response?.status === 404 || e?.status === 404 || e?.statusCode === 404) {
          this.profileMissing = true;
        }
        throw e;
      } finally {
        this.loading = false;
      }
    },

    async updateProfile(updates: any) {
      const authStore = useAuthStore();
      const config = useRuntimeConfig();
      const data: any = await $fetch(`${config.public.apiBase}/professionals/profile`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${authStore.token}` },
        body: updates,
      });
      this.profile = data.data;
    },

    async toggleAvailability(isAvailable: boolean) {
      const authStore = useAuthStore();
      const config = useRuntimeConfig();
      await $fetch(`${config.public.apiBase}/professionals/availability`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${authStore.token}` },
        body: { isAvailable },
      });
      if (this.profile) this.profile.isAvailable = isAvailable;
    },
  },
});
