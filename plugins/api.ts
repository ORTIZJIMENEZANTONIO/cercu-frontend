export default defineNuxtPlugin((_nuxtApp) => {
  const config = useRuntimeConfig();
  const token = useCookie<string | null>('cercu_token');

  const api = $fetch.create({
    baseURL: config.public.apiBase as string,
    onRequest({ options }) {
      if (token.value) {
        const headers = new Headers(options.headers as HeadersInit | undefined);
        headers.set('Authorization', `Bearer ${token.value}`);
        options.headers = headers;
      }
    },
    async onResponseError({ response }) {
      if (response.status === 401) {
        // Try refresh
        const refreshCookie = useCookie<string | null>('cercu_refresh');
        if (refreshCookie.value) {
          try {
            const data: any = await $fetch(`${config.public.apiBase}/auth/refresh`, {
              method: 'POST',
              body: { refreshToken: refreshCookie.value },
            });
            token.value = data.data.accessToken;
            refreshCookie.value = data.data.refreshToken;
            return; // retry will happen naturally
          } catch {
            // refresh failed — logout
          }
        }
        token.value = null;
        refreshCookie.value = null;
        useCookie<null>('cercu_user').value = null;
        navigateTo('/auth/login');
      }
    },
  });

  // Public API — no auth header
  const apiPublic = $fetch.create({
    baseURL: config.public.apiBase as string,
  });

  return {
    provide: {
      api,
      apiPublic,
    },
  };
});
