export const usePlansStore = defineStore('plans', {
  state: () => ({
    plans: [] as any[],
    currentSubscription: null as any | null,
    loading: false,
  }),

  getters: {
    currentPlan: (state) => state.currentSubscription?.plan || null,
    isStarter: (state) => state.currentSubscription?.plan?.slug === 'starter' || !state.currentSubscription,
    isPremium: (state) => state.currentSubscription?.plan?.slug === 'premium',
  },

  actions: {
    async fetchPlans() {
      this.loading = true;
      try {
        const { $apiPublic } = useNuxtApp();
        const data: any = await $apiPublic('/plans');
        this.plans = data.data;
      } finally {
        this.loading = false;
      }
    },

    async fetchCurrentSubscription() {
      try {
        const { $api } = useNuxtApp();
        const data: any = await $api('/subscriptions/current');
        this.currentSubscription = data.data;
      } catch (e: any) {
        if (e?.statusCode === 404 || e?.status === 404) {
          this.currentSubscription = null;
        }
      }
    },

    async subscribe(planId: number) {
      const { $api } = useNuxtApp();
      const data: any = await $api('/subscriptions/subscribe', { method: 'POST', body: { planId } });
      this.currentSubscription = data.data;
      return data.data;
    },

    async cancelSubscription() {
      const { $api } = useNuxtApp();
      await $api('/subscriptions/cancel', { method: 'POST' });
      await this.fetchCurrentSubscription();
    },

    async changePlan(planId: number) {
      const { $api } = useNuxtApp();
      const data: any = await $api('/subscriptions/change-plan', { method: 'POST', body: { planId } });
      this.currentSubscription = data.data;
      return data.data;
    },

    // ─── Admin CRUD ───
    async adminFetchPlans() {
      this.loading = true;
      try {
        const { $api } = useNuxtApp();
        const data: any = await $api('/admin/plans');
        this.plans = data.data;
      } finally {
        this.loading = false;
      }
    },

    async adminCreatePlan(body: any) {
      const { $api } = useNuxtApp();
      const data: any = await $api('/admin/plans', { method: 'POST', body });
      return data.data;
    },

    async adminUpdatePlan(id: number, body: any) {
      const { $api } = useNuxtApp();
      const data: any = await $api(`/admin/plans/${id}`, { method: 'PATCH', body });
      return data.data;
    },

    async adminDeletePlan(id: number) {
      const { $api } = useNuxtApp();
      await $api(`/admin/plans/${id}`, { method: 'DELETE' });
    },

    // ─── Admin ConfigKV ───
    async adminGetConfig(key: string) {
      const { $api } = useNuxtApp();
      const data: any = await $api(`/admin/config/${key}`);
      return data.data;
    },

    async adminSetConfig(key: string, value: string, description?: string) {
      const { $api } = useNuxtApp();
      const data: any = await $api(`/admin/config/${key}`, { method: 'PUT', body: { value, description } });
      return data.data;
    },
  },
});
