import { fileURLToPath } from 'url';
import VueI18n from '@intlify/vite-plugin-vue-i18n';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import DefineOptions from 'unplugin-vue-define-options/vite';
import { defineConfig } from 'vite';
import Pages from 'vite-plugin-pages';
import Layouts from 'vite-plugin-vue-layouts';
import vuetify from 'vite-plugin-vuetify';
import { unheadVueComposablesImports } from '@unhead/vue';
import { VitePWA } from 'vite-plugin-pwa';
import manifest from './public/manifest.webmanifest.json';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],

      devOptions: {
        enabled: true,
      },

      manifest,
    }),

    // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
    vuetify({
      styles: {
        configFile: 'src/styles/variables/_vuetify.scss',
      },
    }),
    Pages({
      extendRoute: route => {
        if (route.path.includes('/admin')) {
          return {
            ...route,
            meta: { subject: 'admin', action: 'all', ...route.meta },
          };
        }
        if (route.path.includes('/client')) {
          return {
            ...route,
            meta: { subject: 'client', action: 'all', ...route.meta },
          };
        }

        return {
          ...route,
          meta: {
            subject: 'public',
            action: 'all',
            layout: 'blank',
            redirectIfLoggedIn: true,
            ...route.meta,
          },
        };
      },
      dirs: ['./src/pages'],

      // ℹ️ We need three routes using single routes so we will ignore generating route for this SFC file
      onRoutesGenerated: routes => [
        // Email filter

        // Email label

        ...routes,
      ],
    }),
    Layouts({
      layoutsDirs: './src/layouts/',
    }),
    Components({
      dirs: ['src/@core/components', 'src/views/demos', 'src/components'],
      dts: true,
    }),
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        '@vueuse/core',
        '@vueuse/math',
        'vue-i18n',
        'pinia',
        unheadVueComposablesImports,
      ],
      vueTemplate: true,
    }),
    VueI18n({
      runtimeOnly: true,
      compositionOnly: true,
      include: [
        fileURLToPath(
          new URL('./src/plugins/i18n/locales/**', import.meta.url),
        ),
      ],
    }),
    DefineOptions(),
  ],
  define: { 'process.env': {} },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@themeConfig': fileURLToPath(
        new URL('./themeConfig.ts', import.meta.url),
      ),
      '@data': fileURLToPath(new URL('./src/data', import.meta.url)),
      '@utils': fileURLToPath(new URL('./src/utils', import.meta.url)),
      '@core': fileURLToPath(new URL('./src/@core', import.meta.url)),
      '@layouts': fileURLToPath(new URL('./src/@layouts', import.meta.url)),
      '@images': fileURLToPath(new URL('/src/assets/images/', import.meta.url)),
      '@services': fileURLToPath(new URL('./src/services/', import.meta.url)),
      '@stores': fileURLToPath(new URL('./src/stores/', import.meta.url)),
      '@composables': fileURLToPath(
        new URL('./src/composables/', import.meta.url),
      ),

      '@atoms': fileURLToPath(
        new URL('./src/@core/components/atoms', import.meta.url),
      ),
      '@molecules': fileURLToPath(
        new URL('./src/@core/components/molecules', import.meta.url),
      ),
      '@styles': fileURLToPath(new URL('./src/styles/', import.meta.url)),
      '@configured-variables': fileURLToPath(
        new URL('./src/styles/variables/_template.scss', import.meta.url),
      ),
      '@axios': fileURLToPath(new URL('./src/plugins/axios', import.meta.url)),
      '@validators': fileURLToPath(
        new URL('./src/validators/', import.meta.url),
      ),
      apexcharts: fileURLToPath(
        new URL('node_modules/apexcharts-clevision', import.meta.url),
      ),
    },
  },
  base: '/',

  build: {
    chunkSizeWarningLimit: 5000,
  },
  optimizeDeps: {
    exclude: ['vuetify'],
    entries: ['./src/**/*.vue'],
  },
});
