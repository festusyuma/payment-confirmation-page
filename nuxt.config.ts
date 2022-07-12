import { defineNuxtConfig } from 'nuxt'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  css: ['@/assets/css/main.scss'],

  typescript: {
    typeCheck: true,
    strict: true
  },

  components: {
    global: true,
    dirs: ['~/components']
  },

  build: {
    postcss: {
      postcssOptions: {
        plugins: {
          tailwindcss: {},
          autoprefixer: {}
        }
      }
    }
  },

  publicRuntimeConfig: {
    hostname: process.env.HOSTNAME,
    socketUrl: process.env.SOCKET_URL
  }
})
