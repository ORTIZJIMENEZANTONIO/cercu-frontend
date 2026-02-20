export const useAdminStore = defineStore('admin', {
  state: () => ({
    users: [] as any[],
    professionals: [] as any[],
    leads: [] as any[],
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
  },
});
