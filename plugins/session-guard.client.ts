export default defineNuxtPlugin(() => {
  const authStore = useAuthStore()

  // Watch the token — when it goes from truthy to null (cookie expired), redirect to home
  let wasAuthenticated = !!authStore.token

  watch(
    () => authStore.token,
    (newToken) => {
      if (wasAuthenticated && !newToken) {
        // Token expired or was cleared — clean up and go home
        authStore.logout()
        navigateTo('/', { replace: true })
      }
      wasAuthenticated = !!newToken
    },
  )

  // Also check periodically in case cookie expires between Vue reactivity ticks
  const CHECK_INTERVAL = 30_000 // every 30 seconds
  setInterval(() => {
    if (wasAuthenticated && !authStore.token) {
      authStore.logout()
      navigateTo('/', { replace: true })
      wasAuthenticated = false
    }
  }, CHECK_INTERVAL)
})
