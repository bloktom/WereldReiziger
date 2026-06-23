import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// Tijdens `dev` draait de app op '/'. Bij een productie `build` (GitHub Pages)
// gebruiken we een base path die gelijk is aan je repository-naam.
// Pas '/WereldReiziger/' aan als je repo anders heet, of zet VITE_BASE in je
// build-omgeving (de GitHub Action doet dit automatisch).
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === 'production' ? (process.env.VITE_BASE || '/WereldReiziger/') : '/',
  build: {
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        // Splits grote afhankelijkheden in aparte chunks voor sneller laden.
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('firebase') || id.includes('@firebase')) return 'firebase'
            if (id.includes('react-simple-maps') || id.includes('d3-geo') || id.includes('d3-'))
              return 'maps'
          }
        },
      },
    },
  },
}))

