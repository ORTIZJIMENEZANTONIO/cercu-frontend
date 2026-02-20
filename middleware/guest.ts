export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore();

  if (authStore.isAuthenticated) {
    if (authStore.isProfessional) {
      return navigateTo('/pro');
    }
    return navigateTo('/');
  }
});
