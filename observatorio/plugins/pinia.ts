/**
 * Pinia plugin registration for Nuxt 3.
 *
 * The @pinia/nuxt module (configured in nuxt.config.ts) auto-registers Pinia
 * with the Nuxt app, so manual plugin setup is NOT required.
 *
 * This file is kept as a lightweight extension point: any custom Pinia plugins
 * (e.g. persistence, logging, devtools enhancements) can be added here and
 * they will be picked up automatically by Nuxt's plugin auto-import.
 */
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(({ $pinia }) => {
  // Example: add a custom plugin that logs every action in development
  if (import.meta.dev) {
    ($pinia as any).use(({ store }: { store: any }) => {
      store.$onAction(({ name, args, after, onError }: any) => {
        const startTime = performance.now()

        after(() => {
          const duration = (performance.now() - startTime).toFixed(1)
          console.debug(
            `[pinia] ${store.$id}.${name}() completed in ${duration}ms`,
          )
        })

        onError((error: Error) => {
          console.warn(
            `[pinia] ${store.$id}.${name}() failed:`,
            error.message,
          )
        })
      })
    })
  }
})
