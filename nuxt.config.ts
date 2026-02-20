// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  ssr: true,

  modules: [
    '@pinia/nuxt',
    '@vee-validate/nuxt',
    '@nuxtjs/leaflet',
    'nuxt-icon',
  ],

  css: [
    '~/assets/scss/main.scss',
  ],

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @import "~/assets/scss/variables";
            @import "~/assets/scss/mixins";
          `,
          silenceDeprecations: ['legacy-js-api'],
        },
      },
    },
  },

  app: {
    head: {
      title: 'CERCU - Oficios a domicilio en CDMX',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Encuentra profesionales de confianza para servicios a domicilio en CDMX y Estado de México' },
        { name: 'theme-color', content: '#3730A3' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Sora:wght@600;700&display=swap' },
      ],
    },
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3002/api/v1',
      googleClientId: process.env.NUXT_PUBLIC_GOOGLE_CLIENT_ID || '',
    },
  },

  routeRules: {
    '/admin/**': { ssr: false },
    '/pro/**': { ssr: false },
  },

  components: [
    { path: '~/components', pathPrefix: false },
  ],

  pinia: {
    storesDirs: ['./stores/**'],
  },
})
