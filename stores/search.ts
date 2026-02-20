export const useSearchStore = defineStore('search', {
  state: () => ({
    query: '',
    categorySlug: null as string | null,
    results: [] as any[],
    totalResults: 0,
    page: 1,
    loading: false,
    viewMode: 'list' as 'list' | 'map',
    filters: {
      urgency: null as string | null,
      maxDistance: null as number | null,
    },
  }),

  actions: {
    setQuery(query: string) {
      this.query = query;
      this.page = 1;
    },

    setCategory(slug: string | null) {
      this.categorySlug = slug;
      this.page = 1;
    },

    toggleViewMode() {
      this.viewMode = this.viewMode === 'list' ? 'map' : 'list';
    },

    async search() {
      this.loading = true;
      try {
        const categoriesStore = useCategoriesStore();
        await categoriesStore.fetchAll();

        let filtered = [...categoriesStore.categories];
        if (this.query) {
          const q = this.query.toLowerCase();
          filtered = filtered.filter(
            (c: any) =>
              c.name.toLowerCase().includes(q) ||
              c.chips?.some((ch: any) => ch.label.toLowerCase().includes(q))
          );
        }
        if (this.categorySlug) {
          filtered = filtered.filter((c: any) => c.slug === this.categorySlug);
        }

        this.results = filtered;
        this.totalResults = filtered.length;
      } finally {
        this.loading = false;
      }
    },
  },
});
