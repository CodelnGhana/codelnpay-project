import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import {VitePWA} from "vite-plugin-pwa";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
      vue(),
    vueJsx(),
      VitePWA({
        registerType:'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
        manifest: {
          name: 'CodelnPay',
          short_name: 'CodelnPay',
          description: 'Payroll platform for cross-border salary payments',
          theme_color: '#030852',
          "icons": [
            {
              "src": "/pwa-192x192.png",
              "sizes": "192x192",
              "type": "image/png",
              "purpose": "any"
            },
            {
              "src": "/pwa-512x512.png",
              "sizes": "512x512",
              "type": "image/png",
              "purpose": "any"
            },
            {
              "src": "/pwa-maskable-192x192.png",
              "sizes": "192x192",
              "type": "image/png",
              "purpose": "maskable"
            },
            {
              "src": "/pwa-maskable-512x512.png",
              "sizes": "512x512",
              "type": "image/png",
              "purpose": "maskable"
            }
          ],
        }
      })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },

  css: {
    preprocessorOptions:{
      less: {
        modifyVars: {


        },
        javascriptEnabled: true,
      },
    },
  },
})
