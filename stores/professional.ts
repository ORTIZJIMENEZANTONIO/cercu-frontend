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
        const { $api } = useNuxtApp();
        const data: any = await $api('/professionals/profile');
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
      const { $api } = useNuxtApp();
      const data: any = await $api('/professionals/profile', { method: 'PATCH', body: updates });
      this.profile = data.data;
    },

    async toggleAvailability(isAvailable: boolean) {
      const { $api } = useNuxtApp();
      await $api('/professionals/availability', { method: 'PATCH', body: { isAvailable } });
      if (this.profile) this.profile.isAvailable = isAvailable;
    },

    async updateCategories(categoryIds: number[]) {
      const { $api } = useNuxtApp();
      const data: any = await $api('/professionals/categories', { method: 'PUT', body: { categoryIds } });
      this.profile = data.data;
    },

    async getWorkPhotos() {
      const { $api } = useNuxtApp();
      const data: any = await $api('/professionals/work-photos');
      return data.data;
    },

    async uploadWorkPhotos(categoryId: number, files: File[]) {
      const { $api } = useNuxtApp();
      const formData = new FormData();
      for (const file of files) {
        formData.append('photos', file);
      }
      const data: any = await $api(`/professionals/work-photos/${categoryId}`, {
        method: 'POST',
        body: formData,
      });
      return data.data;
    },

    async deleteWorkPhoto(photoId: number) {
      const { $api } = useNuxtApp();
      await $api(`/professionals/work-photos/${photoId}`, { method: 'DELETE' });
    },

    async requestProfileChange(fieldName: string, requestedValue: string) {
      const { $api } = useNuxtApp();
      const data: any = await $api('/professionals/profile-changes', {
        method: 'POST',
        body: { fieldName, requestedValue },
      });
      return data.data;
    },

    async getPendingChanges() {
      const { $api } = useNuxtApp();
      const data: any = await $api('/professionals/profile-changes');
      return data.data;
    },
  },
});
