export function useApi() {
  const config = useRuntimeConfig();
  const authStore = useAuthStore();

  async function apiFetch<T = any>(
    url: string,
    options: any = {}
  ): Promise<T> {
    const headers: Record<string, string> = { ...options.headers };

    if (authStore.token) {
      headers.Authorization = `Bearer ${authStore.token}`;
    }

    try {
      return await $fetch(url, {
        baseURL: config.public.apiBase as string,
        ...options,
        headers,
      });
    } catch (error: any) {
      if (error?.statusCode === 401) {
        const refreshed = await authStore.refreshTokenAction();
        if (refreshed) {
          headers.Authorization = `Bearer ${authStore.token}`;
          return $fetch(url, {
            baseURL: config.public.apiBase as string,
            ...options,
            headers,
          });
        }
        authStore.logout();
        navigateTo('/auth/login');
      }
      throw error;
    }
  }

  return { apiFetch };
}
