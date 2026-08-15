import BlogModule from '../../../src/module'
import blog from './blog.config'

export default defineNuxtConfig({
  modules: [
    [BlogModule, blog],
  ],
  css: ['~/assets/css/main.css'],
  compatibilityDate: '2026-08-15',
})
