export const useLeadsStore = defineStore('leads', {
  state: () => ({
    leads: [] as any[],
    currentLead: null as any | null,
    loading: false,
    stats: {
      total: 0,
      pending: 0,
      taken: 0,
    },
    // User-side leads (solicitudes)
    userLeads: [] as any[],
    userLeadsLoading: false,
  }),

  actions: {
    async fetchUserLeads() {
      this.userLeadsLoading = true;
      try {
        const authStore = useAuthStore();
        const config = useRuntimeConfig();
        const data: any = await $fetch(`${config.public.apiBase}/users/leads`, {
          headers: { Authorization: `Bearer ${authStore.token}` },
        });
        this.userLeads = data.data || [];
      } catch (e: any) {
        if (e?.response?.status === 404 || e?.status === 404 || e?.statusCode === 404) {
          this.userLeads = [];
          return;
        }
        this.userLeads = [];
      } finally {
        this.userLeadsLoading = false;
      }
    },

    async fetchProLeads() {
      this.loading = true;
      try {
        const authStore = useAuthStore();
        const config = useRuntimeConfig();
        const data: any = await $fetch(`${config.public.apiBase}/professionals/leads`, {
          headers: { Authorization: `Bearer ${authStore.token}` },
        });
        this.leads = data.data;
        this.stats.total = this.leads.length;
        this.stats.pending = this.leads.filter((l: any) => l.status === 'pending' || l.status === 'viewed').length;
        this.stats.taken = this.leads.filter((l: any) => l.status === 'taken').length;
      } catch (e: any) {
        // 404 = no professional profile, leave leads empty
        if (e?.response?.status === 404 || e?.status === 404 || e?.statusCode === 404) {
          this.leads = [];
          return;
        }
        throw e;
      } finally {
        this.loading = false;
      }
    },

    async fetchLeadPreview(leadId: number) {
      const authStore = useAuthStore();
      const config = useRuntimeConfig();
      const data: any = await $fetch(`${config.public.apiBase}/professionals/leads/${leadId}/preview`, {
        headers: { Authorization: `Bearer ${authStore.token}` },
      });
      this.currentLead = data.data;
      return data.data;
    },

    async takeLead(leadId: number) {
      const authStore = useAuthStore();
      const config = useRuntimeConfig();
      const data: any = await $fetch(`${config.public.apiBase}/professionals/leads/${leadId}/take`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authStore.token}` },
      });
      return data.data;
    },

    async declineLead(leadId: number) {
      const authStore = useAuthStore();
      const config = useRuntimeConfig();
      await $fetch(`${config.public.apiBase}/professionals/leads/${leadId}/decline`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authStore.token}` },
      });
    },
  },
});
