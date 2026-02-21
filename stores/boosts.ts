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
        const config = useRuntimeConfig();
        const data: any = await $fetch(`${config.public.apiBase}/boosts/types`);
        this.boostTypes = data.data;
      } catch { /* ignore */ }
    },

    async fetchActiveBoosts() {
      try {
        const authStore = useAuthStore();
        const config = useRuntimeConfig();
        const data: any = await $fetch(`${config.public.apiBase}/boosts/active`, {
          headers: { Authorization: `Bearer ${authStore.token}` },
        });
        this.activeBoosts = data.data;
      } catch { /* ignore */ }
    },

    async purchaseBoost(boostTypeId: number) {
      const authStore = useAuthStore();
      const config = useRuntimeConfig();
      const data: any = await $fetch(`${config.public.apiBase}/boosts/purchase`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authStore.token}` },
        body: { boostTypeId },
      });
      await this.fetchActiveBoosts();
      return data.data;
    },

    // ─── Admin CRUD ───
    async adminFetchBoostTypes() {
      this.loading = true;
      try {
        const authStore = useAuthStore();
        const config = useRuntimeConfig();
        const data: any = await $fetch(`${config.public.apiBase}/admin/boost-types`, {
          headers: { Authorization: `Bearer ${authStore.token}` },
        });
        this.boostTypes = data.data;
      } finally {
        this.loading = false;
      }
    },

    async adminCreateBoostType(body: any) {
      const authStore = useAuthStore();
      const config = useRuntimeConfig();
      const data: any = await $fetch(`${config.public.apiBase}/admin/boost-types`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authStore.token}` },
        body,
      });
      return data.data;
    },

    async adminUpdateBoostType(id: number, body: any) {
      const authStore = useAuthStore();
      const config = useRuntimeConfig();
      const data: any = await $fetch(`${config.public.apiBase}/admin/boost-types/${id}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${authStore.token}` },
        body,
      });
      return data.data;
    },

    async adminDeleteBoostType(id: number) {
      const authStore = useAuthStore();
      const config = useRuntimeConfig();
      await $fetch(`${config.public.apiBase}/admin/boost-types/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authStore.token}` },
      });
    },
  },
});
