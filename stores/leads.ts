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
        const { $api } = useNuxtApp();
        const data: any = await $api('/users/leads');
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
        const { $api } = useNuxtApp();
        const data: any = await $api('/professionals/leads');
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
      const { $api } = useNuxtApp();
      const data: any = await $api(`/professionals/leads/${leadId}/preview`);
      this.currentLead = data.data;
      return data.data;
    },

    async takeLead(leadId: number) {
      const { $api } = useNuxtApp();
      const data: any = await $api(`/professionals/leads/${leadId}/take`, { method: 'POST' });
      return data.data;
    },

    async declineLead(leadId: number) {
      const { $api } = useNuxtApp();
      await $api(`/professionals/leads/${leadId}/decline`, { method: 'POST' });
    },
  },
});
