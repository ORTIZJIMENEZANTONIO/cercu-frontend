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
        const { $api } = useNuxtApp();
        const data: any = await $api('/gamification/dashboard');
        this.dashboard = data.data;
      } catch { /* ignore */ } finally {
        this.loading = false;
      }
    },

    async fetchAchievements() {
      try {
        const { $api } = useNuxtApp();
        const data: any = await $api('/gamification/achievements');
        this.achievements = data.data;
      } catch { /* ignore */ }
    },

    async fetchMissions() {
      try {
        const { $api } = useNuxtApp();
        const data: any = await $api('/gamification/missions');
        this.missions = data.data;
      } catch { /* ignore */ }
    },

    async fetchXpHistory() {
      try {
        const { $api } = useNuxtApp();
        const data: any = await $api('/gamification/xp-history');
        this.xpHistory = data.data;
      } catch { /* ignore */ }
    },

    async fetchTrustScore() {
      try {
        const { $api } = useNuxtApp();
        const data: any = await $api('/gamification/trust-score');
        this.trustScore = data.data;
      } catch { /* ignore */ }
    },

    // ─── Admin: Levels ───
    async adminFetchLevels() {
      this.loading = true;
      try {
        const { $api } = useNuxtApp();
        const data: any = await $api('/admin/levels');
        this.levels = data.data;
      } finally {
        this.loading = false;
      }
    },

    async adminUpdateLevel(id: number, body: any) {
      const { $api } = useNuxtApp();
      const data: any = await $api(`/admin/levels/${id}`, { method: 'PATCH', body });
      return data.data;
    },

    // ─── Admin: Achievements ───
    async adminFetchAchievements() {
      this.loading = true;
      try {
        const { $api } = useNuxtApp();
        const data: any = await $api('/admin/achievements');
        this.achievementTemplates = data.data;
      } finally {
        this.loading = false;
      }
    },

    async adminCreateAchievement(body: any) {
      const { $api } = useNuxtApp();
      const data: any = await $api('/admin/achievements', { method: 'POST', body });
      return data.data;
    },

    async adminUpdateAchievement(id: number, body: any) {
      const { $api } = useNuxtApp();
      const data: any = await $api(`/admin/achievements/${id}`, { method: 'PATCH', body });
      return data.data;
    },

    async adminDeleteAchievement(id: number) {
      const { $api } = useNuxtApp();
      await $api(`/admin/achievements/${id}`, { method: 'DELETE' });
    },

    // ─── Admin: Mission Templates ───
    async adminFetchMissionTemplates() {
      this.loading = true;
      try {
        const { $api } = useNuxtApp();
        const data: any = await $api('/admin/mission-templates');
        this.missionTemplates = data.data;
      } finally {
        this.loading = false;
      }
    },

    async adminCreateMissionTemplate(body: any) {
      const { $api } = useNuxtApp();
      const data: any = await $api('/admin/mission-templates', { method: 'POST', body });
      return data.data;
    },

    async adminUpdateMissionTemplate(id: number, body: any) {
      const { $api } = useNuxtApp();
      const data: any = await $api(`/admin/mission-templates/${id}`, { method: 'PATCH', body });
      return data.data;
    },

    async adminDeleteMissionTemplate(id: number) {
      const { $api } = useNuxtApp();
      await $api(`/admin/mission-templates/${id}`, { method: 'DELETE' });
    },

    // ─── Admin: XP Grant ───
    async adminGrantXP(userId: string, amount: number, notes?: string) {
      const { $api } = useNuxtApp();
      const data: any = await $api('/admin/xp/grant', { method: 'POST', body: { userId, amount, notes } });
      return data.data;
    },
  },
});
