import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['logo.png', 'film.svg'],
      manifest: {
        name: 'Cines Argón - Tu Cine en Tamanco Viejo',
        short_name: 'Cines Argón',
        description: 'Cartelera, horarios y boletos del Cine Argón en Centro Poblado Tamanco Viejo, Emilio San Martín, Loreto.',
        start_url: '/',
        display: 'standalone',
        background_color: '#07090e',
        theme_color: '#f59e0b',
        orientation: 'portrait-primary',
        lang: 'es-PE',
        scope: '/',
        categories: ['entertainment', 'lifestyle'],
        icons: [
          {
            src: '/logo.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: '/logo.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
        shortcuts: [
          {
            name: 'Ver Cartelera',
            url: '/',
            description: 'Ver las películas en cartelera de Cines Argón',
          },
        ],
      },
      workbox: {
        // Cachear assets estáticos (imágenes, JS, CSS) por 30 días
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/image\.tmdb\.org\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'tmdb-images',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 días
              },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 año
              },
            },
          },
          {
            urlPattern: /\/api\/(movies|showtimes|rooms|pricing|hero-slides)/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-data',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 5, // 5 minutos
              },
            },
          },
        ],
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
      },
      devOptions: {
        enabled: true, // Habilitar en desarrollo para probar
        type: 'module',
      },
    }),
  ],
  server: {
    port: 3000,
    open: true
  }
})

