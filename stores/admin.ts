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
        const authStore = useAuthStore();
        const config = useRuntimeConfig();
        const data: any = await $fetch(`${config.public.apiBase}/admin/summary`, {
          headers: { Authorization: `Bearer ${authStore.token}` },
        });
        this.summary = data.data;
      } catch {
        // Summary stays null — dashboard shows cards without stats
      }
    },

    async fetchUsers(query: Record<string, any> = {}) {
      this.loading = true;
      try {
        const authStore = useAuthStore();
        const config = useRuntimeConfig();
        const params = new URLSearchParams(query as any).toString();
        const data: any = await $fetch(`${config.public.apiBase}/admin/users?${params}`, {
          headers: { Authorization: `Bearer ${authStore.token}` },
        });
        this.users = data.data;
        this.pagination = data.pagination;
      } finally {
        this.loading = false;
      }
    },

    async fetchProfessionals(query: Record<string, any> = {}) {
      this.loading = true;
      try {
        const authStore = useAuthStore();
        const config = useRuntimeConfig();
        const params = new URLSearchParams(query as any).toString();
        const data: any = await $fetch(`${config.public.apiBase}/admin/professionals?${params}`, {
          headers: { Authorization: `Bearer ${authStore.token}` },
        });
        this.professionals = data.data;
        this.pagination = data.pagination;
      } finally {
        this.loading = false;
      }
    },

    async fetchLeads(query: Record<string, any> = {}) {
      this.loading = true;
      try {
        const authStore = useAuthStore();
        const config = useRuntimeConfig();
        const params = new URLSearchParams(query as any).toString();
        const data: any = await $fetch(`${config.public.apiBase}/admin/leads?${params}`, {
          headers: { Authorization: `Bearer ${authStore.token}` },
        });
        this.leads = data.data;
        this.pagination = data.pagination;
      } finally {
        this.loading = false;
      }
    },

    async blockUser(userId: string, reason: string) {
      const authStore = useAuthStore();
      const config = useRuntimeConfig();
      await $fetch(`${config.public.apiBase}/admin/users/${userId}/block`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authStore.token}` },
        body: { reason },
      });
    },

    async approveProfessional(userId: string) {
      const authStore = useAuthStore();
      const config = useRuntimeConfig();
      await $fetch(`${config.public.apiBase}/admin/professionals/${userId}/approve`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authStore.token}` },
      });
    },

    // ─── Categories ─────────────────────────────────────────
    async fetchCategories() {
      this.loading = true;
      try {
        const authStore = useAuthStore();
        const config = useRuntimeConfig();
        const data: any = await $fetch(`${config.public.apiBase}/admin/categories`, {
          headers: { Authorization: `Bearer ${authStore.token}` },
        });
        this.categories = data.data;
      } finally {
        this.loading = false;
      }
    },

    async createCategory(body: any) {
      const authStore = useAuthStore();
      const config = useRuntimeConfig();
      const data: any = await $fetch(`${config.public.apiBase}/admin/categories`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authStore.token}` },
        body,
      });
      return data.data;
    },

    async updateCategory(id: number, body: any) {
      const authStore = useAuthStore();
      const config = useRuntimeConfig();
      const data: any = await $fetch(`${config.public.apiBase}/admin/categories/${id}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${authStore.token}` },
        body,
      });
      return data.data;
    },

    async deleteCategory(id: number) {
      const authStore = useAuthStore();
      const config = useRuntimeConfig();
      await $fetch(`${config.public.apiBase}/admin/categories/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authStore.token}` },
      });
    },

    async addChip(categoryId: number, body: any) {
      const authStore = useAuthStore();
      const config = useRuntimeConfig();
      const data: any = await $fetch(`${config.public.apiBase}/admin/categories/${categoryId}/chips`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authStore.token}` },
        body,
      });
      return data.data;
    },

    async updateChip(chipId: number, body: any) {
      const authStore = useAuthStore();
      const config = useRuntimeConfig();
      const data: any = await $fetch(`${config.public.apiBase}/admin/chips/${chipId}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${authStore.token}` },
        body,
      });
      return data.data;
    },

    async deleteChip(chipId: number) {
      const authStore = useAuthStore();
      const config = useRuntimeConfig();
      await $fetch(`${config.public.apiBase}/admin/chips/${chipId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authStore.token}` },
      });
    },

    async addField(categoryId: number, body: any) {
      const authStore = useAuthStore();
      const config = useRuntimeConfig();
      const data: any = await $fetch(`${config.public.apiBase}/admin/categories/${categoryId}/fields`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authStore.token}` },
        body,
      });
      return data.data;
    },

    async updateField(fieldId: number, body: any) {
      const authStore = useAuthStore();
      const config = useRuntimeConfig();
      const data: any = await $fetch(`${config.public.apiBase}/admin/fields/${fieldId}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${authStore.token}` },
        body,
      });
      return data.data;
    },

    async deleteField(fieldId: number) {
      const authStore = useAuthStore();
      const config = useRuntimeConfig();
      await $fetch(`${config.public.apiBase}/admin/fields/${fieldId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authStore.token}` },
      });
    },

    async setPricing(categoryId: number, body: any) {
      const authStore = useAuthStore();
      const config = useRuntimeConfig();
      const data: any = await $fetch(`${config.public.apiBase}/admin/categories/${categoryId}/pricing`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authStore.token}` },
        body,
      });
      return data.data;
    },

    async deletePricing(pricingId: number) {
      const authStore = useAuthStore();
      const config = useRuntimeConfig();
      await $fetch(`${config.public.apiBase}/admin/pricing/${pricingId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authStore.token}` },
      });
    },

    // ─── Pending Profile Changes ────────────────────────────
    async fetchPendingChanges() {
      const authStore = useAuthStore();
      const config = useRuntimeConfig();
      const data: any = await $fetch(`${config.public.apiBase}/admin/pending-changes`, {
        headers: { Authorization: `Bearer ${authStore.token}` },
      });
      this.pendingChanges = data.data;
    },

    async approveChange(changeId: number) {
      const authStore = useAuthStore();
      const config = useRuntimeConfig();
      await $fetch(`${config.public.apiBase}/admin/pending-changes/${changeId}/approve`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authStore.token}` },
      });
    },

    async rejectChange(changeId: number, adminNotes?: string) {
      const authStore = useAuthStore();
      const config = useRuntimeConfig();
      await $fetch(`${config.public.apiBase}/admin/pending-changes/${changeId}/reject`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authStore.token}` },
        body: { adminNotes },
      });
    },
  },
});
