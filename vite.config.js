import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [vue()],
  css: {
    preprocessorOptions: {
      scss: {
        // Opt out of Sass's legacy JS API (removed in Dart Sass 2.0)
        api: 'modern-compiler',
      },
    },
  },
})
