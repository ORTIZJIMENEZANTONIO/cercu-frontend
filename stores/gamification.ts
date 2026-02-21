export const useGamificationStore = defineStore('gamification', {
  state: () => ({
    dashboard: null as any | null,
    achievements: [] as any[],
    missions: [] as any[],
    xpHistory: [] as any[],
    trustScore: null as any | null,
    loading: false,
    // Admin
    levels: [] as any[],
    achievementTemplates: [] as any[],
    missionTemplates: [] as any[],
  }),

  getters: {
    currentLevel: (state) => state.dashboard?.currentLevel || 1,
    levelName: (state) => state.dashboard?.levelName || 'Novato',
    totalXP: (state) => state.dashboard?.totalXP || 0,
    xpProgress: (state) => {
      if (!state.dashboard) return 0;
      const current = state.dashboard.xpForCurrentLevel || 0;
      const next = state.dashboard.xpForNextLevel;
      if (!next) return 100;
      const progress = ((state.dashboard.totalXP - current) / (next - current)) * 100;
      return Math.min(100, Math.max(0, progress));
    },
    earnedAchievements: (state) => state.achievements.filter((a: any) => a.earned),
    lockedAchievements: (state) => state.achievements.filter((a: any) => !a.earned),
    activeMissions: (state) => state.missions.filter((m: any) => m.status === 'in_progress'),
    completedMissions: (state) => state.missions.filter((m: any) => m.status === 'completed'),
  },

  actions: {
    async fetchDashboard() {
      this.loading = true;
      try {
        const authStore = useAuthStore();
        const config = useRuntimeConfig();
        const data: any = await $fetch(`${config.public.apiBase}/gamification/dashboard`, {
          headers: { Authorization: `Bearer ${authStore.token}` },
        });
        this.dashboard = data.data;
      } catch { /* ignore */ } finally {
        this.loading = false;
      }
    },

    async fetchAchievements() {
      try {
        const authStore = useAuthStore();
        const config = useRuntimeConfig();
        const data: any = await $fetch(`${config.public.apiBase}/gamification/achievements`, {
          headers: { Authorization: `Bearer ${authStore.token}` },
        });
        this.achievements = data.data;
      } catch { /* ignore */ }
    },

    async fetchMissions() {
      try {
        const authStore = useAuthStore();
        const config = useRuntimeConfig();
        const data: any = await $fetch(`${config.public.apiBase}/gamification/missions`, {
          headers: { Authorization: `Bearer ${authStore.token}` },
        });
        this.missions = data.data;
      } catch { /* ignore */ }
    },

    async fetchXpHistory() {
      try {
        const authStore = useAuthStore();
        const config = useRuntimeConfig();
        const data: any = await $fetch(`${config.public.apiBase}/gamification/xp-history`, {
          headers: { Authorization: `Bearer ${authStore.token}` },
        });
        this.xpHistory = data.data;
      } catch { /* ignore */ }
    },

    async fetchTrustScore() {
      try {
        const authStore = useAuthStore();
        const config = useRuntimeConfig();
        const data: any = await $fetch(`${config.public.apiBase}/gamification/trust-score`, {
          headers: { Authorization: `Bearer ${authStore.token}` },
        });
        this.trustScore = data.data;
      } catch { /* ignore */ }
    },

    // ─── Admin: Levels ───
    async adminFetchLevels() {
      this.loading = true;
      try {
        const authStore = useAuthStore();
        const config = useRuntimeConfig();
        const data: any = await $fetch(`${config.public.apiBase}/admin/levels`, {
          headers: { Authorization: `Bearer ${authStore.token}` },
        });
        this.levels = data.data;
      } finally {
        this.loading = false;
      }
    },

    async adminUpdateLevel(id: number, body: any) {
      const authStore = useAuthStore();
      const config = useRuntimeConfig();
      const data: any = await $fetch(`${config.public.apiBase}/admin/levels/${id}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${authStore.token}` },
        body,
      });
      return data.data;
    },

    // ─── Admin: Achievements ───
    async adminFetchAchievements() {
      this.loading = true;
      try {
        const authStore = useAuthStore();
        const config = useRuntimeConfig();
        const data: any = await $fetch(`${config.public.apiBase}/admin/achievements`, {
          headers: { Authorization: `Bearer ${authStore.token}` },
        });
        this.achievementTemplates = data.data;
      } finally {
        this.loading = false;
      }
    },

    async adminCreateAchievement(body: any) {
      const authStore = useAuthStore();
      const config = useRuntimeConfig();
      const data: any = await $fetch(`${config.public.apiBase}/admin/achievements`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authStore.token}` },
        body,
      });
      return data.data;
    },

    async adminUpdateAchievement(id: number, body: any) {
      const authStore = useAuthStore();
      const config = useRuntimeConfig();
      const data: any = await $fetch(`${config.public.apiBase}/admin/achievements/${id}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${authStore.token}` },
        body,
      });
      return data.data;
    },

    async adminDeleteAchievement(id: number) {
      const authStore = useAuthStore();
      const config = useRuntimeConfig();
      await $fetch(`${config.public.apiBase}/admin/achievements/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authStore.token}` },
      });
    },

    // ─── Admin: Mission Templates ───
    async adminFetchMissionTemplates() {
      this.loading = true;
      try {
        const authStore = useAuthStore();
        const config = useRuntimeConfig();
        const data: any = await $fetch(`${config.public.apiBase}/admin/mission-templates`, {
          headers: { Authorization: `Bearer ${authStore.token}` },
        });
        this.missionTemplates = data.data;
      } finally {
        this.loading = false;
      }
    },

    async adminCreateMissionTemplate(body: any) {
      const authStore = useAuthStore();
      const config = useRuntimeConfig();
      const data: any = await $fetch(`${config.public.apiBase}/admin/mission-templates`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authStore.token}` },
        body,
      });
      return data.data;
    },

    async adminUpdateMissionTemplate(id: number, body: any) {
      const authStore = useAuthStore();
      const config = useRuntimeConfig();
      const data: any = await $fetch(`${config.public.apiBase}/admin/mission-templates/${id}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${authStore.token}` },
        body,
      });
      return data.data;
    },

    async adminDeleteMissionTemplate(id: number) {
      const authStore = useAuthStore();
      const config = useRuntimeConfig();
      await $fetch(`${config.public.apiBase}/admin/mission-templates/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authStore.token}` },
      });
    },

    // ─── Admin: XP Grant ───
    async adminGrantXP(userId: string, amount: number, notes?: string) {
      const authStore = useAuthStore();
      const config = useRuntimeConfig();
      const data: any = await $fetch(`${config.public.apiBase}/admin/xp/grant`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authStore.token}` },
        body: { userId, amount, notes },
      });
      return data.data;
    },
  },
});
