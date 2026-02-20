export const useCategoriesStore = defineStore('categories', {
  state: () => ({
    categories: [] as any[],
    currentCategory: null as any | null,
    loaded: false,
  }),

  getters: {
    emergencyCategories: (state) => state.categories.filter((c: any) => c.type === 'emergency'),
    projectCategories: (state) => state.categories.filter((c: any) => c.type === 'project'),
  },

  actions: {
    async fetchAll() {
      if (this.loaded) return;
      const config = useRuntimeConfig();
      const data: any = await $fetch(`${config.public.apiBase}/categories`);
      this.categories = data.data;
      this.loaded = true;
    },

    async fetchById(id: string | number) {
      const config = useRuntimeConfig();
      const data: any = await $fetch(`${config.public.apiBase}/categories/${id}`);
      this.currentCategory = data.data;
      return data.data;
    },
  },
});
