import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // IMPORTANTE: Isso garante que os caminhos dos arquivos funcionem na Hostinger
  base: './', 
  build: {
    outDir: 'dist',
  }
})