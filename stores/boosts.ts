export const useBoostsStore = defineStore('boosts', {
  state: () => ({
    boostTypes: [] as any[],
    activeBoosts: [] as any[],
    loading: false,
  }),

  getters: {
    hasActiveBoost: (state) => state.activeBoosts.length > 0,
    totalBoostBonus: (state) => state.activeBoosts.reduce((sum: number, b: any) => sum + b.scoreBonus, 0),
  },

  actions: {
    async fetchBoostTypes() {
      try {
        const { $apiPublic } = useNuxtApp();
        const data: any = await $apiPublic('/boosts/types');
        this.boostTypes = data.data;
      } catch { /* ignore */ }
    },

    async fetchActiveBoosts() {
      try {
        const { $api } = useNuxtApp();
        const data: any = await $api('/boosts/active');
        this.activeBoosts = data.data;
      } catch { /* ignore */ }
    },

    async purchaseBoost(boostTypeId: number) {
      const { $api } = useNuxtApp();
      const data: any = await $api('/boosts/purchase', { method: 'POST', body: { boostTypeId } });
      await this.fetchActiveBoosts();
      return data.data;
    },

    // ─── Admin CRUD ───
    async adminFetchBoostTypes() {
      this.loading = true;
      try {
        const { $api } = useNuxtApp();
        const data: any = await $api('/admin/boost-types');
        this.boostTypes = data.data;
      } finally {
        this.loading = false;
      }
    },

    async adminCreateBoostType(body: any) {
      const { $api } = useNuxtApp();
      const data: any = await $api('/admin/boost-types', { method: 'POST', body });
      return data.data;
    },

    async adminUpdateBoostType(id: number, body: any) {
      const { $api } = useNuxtApp();
      const data: any = await $api(`/admin/boost-types/${id}`, { method: 'PATCH', body });
      return data.data;
    },

    async adminDeleteBoostType(id: number) {
      const { $api } = useNuxtApp();
      await $api(`/admin/boost-types/${id}`, { method: 'DELETE' });
    },
  },
});
