import blog from './blog.config'

export default defineNuxtConfig({
  modules: [
    ['@happydesigns/blog', blog],
  ],
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  compatibilityDate: '2026-08-15',
})
