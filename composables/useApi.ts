/**
 * Convenience wrapper – delegates to the $api plugin instance.
 * Prefer using `const { $api } = useNuxtApp()` directly.
 */
export function useApi() {
  const { $api } = useNuxtApp();
  return { apiFetch: $api };
}
