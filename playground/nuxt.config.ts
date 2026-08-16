import blog from './blog.config'

export default defineNuxtConfig({
  extends: ['@happydesigns/ui'],
  modules: [
    ['@happydesigns/blog', blog],
  ],
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  compatibilityDate: '2026-08-15',
})
