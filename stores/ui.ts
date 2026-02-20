interface Toast {
  id: string;
  message: string;
  type?: 'success' | 'danger' | 'warning' | 'info';
  duration?: number;
}

export const useUiStore = defineStore('ui', {
  state: () => ({
    sidebarOpen: false,
    toasts: [] as Toast[],
    globalLoading: false,
  }),

  actions: {
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen;
    },

    addToast(toast: Omit<Toast, 'id'>) {
      const id = Date.now().toString();
      this.toasts.push({ ...toast, id });
      setTimeout(() => this.removeToast(id), toast.duration || 4000);
    },

    removeToast(id: string) {
      this.toasts = this.toasts.filter((t) => t.id !== id);
    },

    setLoading(loading: boolean) {
      this.globalLoading = loading;
    },
  },
});
