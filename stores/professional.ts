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

    async updateCategories(categoryIds: number[]) {
      const authStore = useAuthStore();
      const config = useRuntimeConfig();
      const data: any = await $fetch(`${config.public.apiBase}/professionals/categories`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${authStore.token}` },
        body: { categoryIds },
      });
      this.profile = data.data;
    },

    async getWorkPhotos() {
      const authStore = useAuthStore();
      const config = useRuntimeConfig();
      const data: any = await $fetch(`${config.public.apiBase}/professionals/work-photos`, {
        headers: { Authorization: `Bearer ${authStore.token}` },
      });
      return data.data;
    },

    async uploadWorkPhotos(categoryId: number, files: File[]) {
      const authStore = useAuthStore();
      const config = useRuntimeConfig();
      const formData = new FormData();
      for (const file of files) {
        formData.append('photos', file);
      }
      const data: any = await $fetch(`${config.public.apiBase}/professionals/work-photos/${categoryId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authStore.token}` },
        body: formData,
      });
      return data.data;
    },

    async deleteWorkPhoto(photoId: number) {
      const authStore = useAuthStore();
      const config = useRuntimeConfig();
      await $fetch(`${config.public.apiBase}/professionals/work-photos/${photoId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authStore.token}` },
      });
    },

    async requestProfileChange(fieldName: string, requestedValue: string) {
      const authStore = useAuthStore();
      const config = useRuntimeConfig();
      const data: any = await $fetch(`${config.public.apiBase}/professionals/profile-changes`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authStore.token}` },
        body: { fieldName, requestedValue },
      });
      return data.data;
    },

    async getPendingChanges() {
      const authStore = useAuthStore();
      const config = useRuntimeConfig();
      const data: any = await $fetch(`${config.public.apiBase}/professionals/profile-changes`, {
        headers: { Authorization: `Bearer ${authStore.token}` },
      });
      return data.data;
    },
  },
});
