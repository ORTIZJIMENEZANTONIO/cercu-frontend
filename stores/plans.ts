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
        const config = useRuntimeConfig();
        const data: any = await $fetch(`${config.public.apiBase}/plans`);
        this.plans = data.data;
      } finally {
        this.loading = false;
      }
    },

    async fetchCurrentSubscription() {
      try {
        const authStore = useAuthStore();
        const config = useRuntimeConfig();
        const data: any = await $fetch(`${config.public.apiBase}/subscriptions/current`, {
          headers: { Authorization: `Bearer ${authStore.token}` },
        });
        this.currentSubscription = data.data;
      } catch (e: any) {
        if (e?.statusCode === 404 || e?.status === 404) {
          this.currentSubscription = null;
        }
      }
    },

    async subscribe(planId: number) {
      const authStore = useAuthStore();
      const config = useRuntimeConfig();
      const data: any = await $fetch(`${config.public.apiBase}/subscriptions/subscribe`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authStore.token}` },
        body: { planId },
      });
      this.currentSubscription = data.data;
      return data.data;
    },

    async cancelSubscription() {
      const authStore = useAuthStore();
      const config = useRuntimeConfig();
      await $fetch(`${config.public.apiBase}/subscriptions/cancel`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authStore.token}` },
      });
      await this.fetchCurrentSubscription();
    },

    async changePlan(planId: number) {
      const authStore = useAuthStore();
      const config = useRuntimeConfig();
      const data: any = await $fetch(`${config.public.apiBase}/subscriptions/change-plan`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authStore.token}` },
        body: { planId },
      });
      this.currentSubscription = data.data;
      return data.data;
    },

    // ─── Admin CRUD ───
    async adminFetchPlans() {
      this.loading = true;
      try {
        const authStore = useAuthStore();
        const config = useRuntimeConfig();
        const data: any = await $fetch(`${config.public.apiBase}/admin/plans`, {
          headers: { Authorization: `Bearer ${authStore.token}` },
        });
        this.plans = data.data;
      } finally {
        this.loading = false;
      }
    },

    async adminCreatePlan(body: any) {
      const authStore = useAuthStore();
      const config = useRuntimeConfig();
      const data: any = await $fetch(`${config.public.apiBase}/admin/plans`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authStore.token}` },
        body,
      });
      return data.data;
    },

    async adminUpdatePlan(id: number, body: any) {
      const authStore = useAuthStore();
      const config = useRuntimeConfig();
      const data: any = await $fetch(`${config.public.apiBase}/admin/plans/${id}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${authStore.token}` },
        body,
      });
      return data.data;
    },

    async adminDeletePlan(id: number) {
      const authStore = useAuthStore();
      const config = useRuntimeConfig();
      await $fetch(`${config.public.apiBase}/admin/plans/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authStore.token}` },
      });
    },

    // ─── Admin ConfigKV ───
    async adminGetConfig(key: string) {
      const authStore = useAuthStore();
      const config = useRuntimeConfig();
      const data: any = await $fetch(`${config.public.apiBase}/admin/config/${key}`, {
        headers: { Authorization: `Bearer ${authStore.token}` },
      });
      return data.data;
    },

    async adminSetConfig(key: string, value: string, description?: string) {
      const authStore = useAuthStore();
      const config = useRuntimeConfig();
      const data: any = await $fetch(`${config.public.apiBase}/admin/config/${key}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${authStore.token}` },
        body: { value, description },
      });
      return data.data;
    },
  },
});
