export const useAdminStore = defineStore('admin', {
  state: () => ({
    users: [] as any[],
    professionals: [] as any[],
    leads: [] as any[],
    categories: [] as any[],
    pendingChanges: [] as any[],
    summary: null as any | null,
    pagination: {
      page: 1,
      totalPages: 1,
      total: 0,
    },
    loading: false,
  }),

  actions: {
    async fetchSummary() {
      try {
        const { $api } = useNuxtApp();
        const data: any = await $api('/admin/summary');
        this.summary = data.data;
      } catch {
        // Summary stays null — dashboard shows cards without stats
      }
    },

    async fetchUsers(query: Record<string, any> = {}) {
      this.loading = true;
      try {
        const { $api } = useNuxtApp();
        const params = new URLSearchParams(query as any).toString();
        const data: any = await $api(`/admin/users?${params}`);
        this.users = data.data;
        this.pagination = data.pagination;
      } finally {
        this.loading = false;
      }
    },

    async fetchProfessionals(query: Record<string, any> = {}) {
      this.loading = true;
      try {
        const { $api } = useNuxtApp();
        const params = new URLSearchParams(query as any).toString();
        const data: any = await $api(`/admin/professionals?${params}`);
        this.professionals = data.data;
        this.pagination = data.pagination;
      } finally {
        this.loading = false;
      }
    },

    async fetchLeads(query: Record<string, any> = {}) {
      this.loading = true;
      try {
        const { $api } = useNuxtApp();
        const params = new URLSearchParams(query as any).toString();
        const data: any = await $api(`/admin/leads?${params}`);
        this.leads = data.data;
        this.pagination = data.pagination;
      } finally {
        this.loading = false;
      }
    },

    async blockUser(userId: string, reason: string) {
      const { $api } = useNuxtApp();
      await $api(`/admin/users/${userId}/block`, { method: 'POST', body: { reason } });
    },

    async approveProfessional(userId: string) {
      const { $api } = useNuxtApp();
      await $api(`/admin/professionals/${userId}/approve`, { method: 'POST' });
    },

    // ─── Categories ─────────────────────────────────────────
    async fetchCategories() {
      this.loading = true;
      try {
        const { $api } = useNuxtApp();
        const data: any = await $api('/admin/categories');
        this.categories = data.data;
      } finally {
        this.loading = false;
      }
    },

    async createCategory(body: any) {
      const { $api } = useNuxtApp();
      const data: any = await $api('/admin/categories', { method: 'POST', body });
      return data.data;
    },

    async updateCategory(id: number, body: any) {
      const { $api } = useNuxtApp();
      const data: any = await $api(`/admin/categories/${id}`, { method: 'PATCH', body });
      return data.data;
    },

    async deleteCategory(id: number) {
      const { $api } = useNuxtApp();
      await $api(`/admin/categories/${id}`, { method: 'DELETE' });
    },

    async addChip(categoryId: number, body: any) {
      const { $api } = useNuxtApp();
      const data: any = await $api(`/admin/categories/${categoryId}/chips`, { method: 'POST', body });
      return data.data;
    },

    async updateChip(chipId: number, body: any) {
      const { $api } = useNuxtApp();
      const data: any = await $api(`/admin/chips/${chipId}`, { method: 'PATCH', body });
      return data.data;
    },

    async deleteChip(chipId: number) {
      const { $api } = useNuxtApp();
      await $api(`/admin/chips/${chipId}`, { method: 'DELETE' });
    },

    async addField(categoryId: number, body: any) {
      const { $api } = useNuxtApp();
      const data: any = await $api(`/admin/categories/${categoryId}/fields`, { method: 'POST', body });
      return data.data;
    },

    async updateField(fieldId: number, body: any) {
      const { $api } = useNuxtApp();
      const data: any = await $api(`/admin/fields/${fieldId}`, { method: 'PATCH', body });
      return data.data;
    },

    async deleteField(fieldId: number) {
      const { $api } = useNuxtApp();
      await $api(`/admin/fields/${fieldId}`, { method: 'DELETE' });
    },

    async setPricing(categoryId: number, body: any) {
      const { $api } = useNuxtApp();
      const data: any = await $api(`/admin/categories/${categoryId}/pricing`, { method: 'POST', body });
      return data.data;
    },

    async deletePricing(pricingId: number) {
      const { $api } = useNuxtApp();
      await $api(`/admin/pricing/${pricingId}`, { method: 'DELETE' });
    },

    // ─── Pending Profile Changes ────────────────────────────
    async fetchPendingChanges() {
      const { $api } = useNuxtApp();
      const data: any = await $api('/admin/pending-changes');
      this.pendingChanges = data.data;
    },

    async approveChange(changeId: number) {
      const { $api } = useNuxtApp();
      await $api(`/admin/pending-changes/${changeId}/approve`, { method: 'POST' });
    },

    async rejectChange(changeId: number, adminNotes?: string) {
      const { $api } = useNuxtApp();
      await $api(`/admin/pending-changes/${changeId}/reject`, { method: 'POST', body: { adminNotes } });
    },
  },
});
