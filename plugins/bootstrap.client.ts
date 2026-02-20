import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';

export default defineNuxtPlugin((_nuxtApp) => {
  return {
    provide: {
      bootstrap,
    },
  };
});
