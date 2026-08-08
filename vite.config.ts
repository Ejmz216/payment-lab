import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// Base is set to the repo name for GitHub Pages project sites.
export default defineConfig({
  plugins: [react()],
  base: '/payment-lab/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
  },
})
