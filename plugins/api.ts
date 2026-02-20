export default defineNuxtPlugin((_nuxtApp) => {
  const config = useRuntimeConfig();
  const authStore = useAuthStore();

  const api = $fetch.create({
    baseURL: config.public.apiBase as string,
    onRequest({ options }) {
      const token = authStore.token;
      if (token) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        };
      }
    },
    async onResponseError({ response }) {
      if (response.status === 401) {
        const refreshed = await authStore.refreshTokenAction();
        if (!refreshed) {
          authStore.logout();
          navigateTo('/auth/login');
        }
      }
    },
  });

  return {
    provide: {
      api,
    },
  };
});
