export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore();

  if (!authStore.isAuthenticated) {
    return navigateTo('/');
  }

  const path = to.path;

  if (path.startsWith('/admin') && !authStore.isAdmin) {
    return navigateTo('/');
  }

  if (path.startsWith('/pro') && !authStore.isProfessional) {
    return navigateTo('/');
  }
});
