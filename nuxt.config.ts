// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: true },
  plugins: ['~/plugins/maska/index.ts'],
  modules: [
    'nuxt-primevue',
    '@nuxtjs/tailwindcss',
    '@nuxt/image',
  ],
  primevue: {
    /* Options */
  },
  image: {
    format: ['png'],
    dir: 'assets/images'
  },
  css: ['primeicons/primeicons.css', 'maz-ui/css/main.css', 'primevue/resources/themes/aura-light-green/theme.css', '@/assets/scss/index.scss'],
})
