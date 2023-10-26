/* eslint-disable import/order */
import '@/@fake-db/db';
import '@/@iconify/icons-bundle';
import App from '@/App.vue';
import ability from './plugins/casl/AppAbility';
import i18n from '@/plugins/i18n';
import layoutsPlugin from '@/plugins/layouts';
import vuetify from '@/plugins/vuetify';
import { loadFonts } from '@/plugins/webfontloader';
import router from '@/router';
import { abilitiesPlugin } from '@casl/vue';
import '@core/scss/template/index.scss';
import '@styles/styles.scss';
import { createPinia } from 'pinia';
import { createApp } from 'vue';

import { createHead } from '@unhead/vue';
import 'vue-skeletor/dist/vue-skeletor.css';
import 'viewerjs/dist/viewer.css';
import VueViewer from 'v-viewer';

import Vue3DraggableResizable from 'vue3-draggable-resizable';
//default styles
import 'vue3-draggable-resizable/dist/Vue3DraggableResizable.css';

import { Skeletor } from 'vue-skeletor';

const head = createHead();

loadFonts();

// Create vue app
const app = createApp(App);
app.component(Skeletor.name, Skeletor);
app.use(Vue3DraggableResizable);
app.use(VueViewer);

// Use plugins
const pinia = createPinia();
app.use(vuetify);
app.use(pinia);

app.use(abilitiesPlugin, ability, {
  useGlobalProperties: true,
});

app.use(router);
app.use(layoutsPlugin);
app.use(i18n);

app.use(head);

// Mount vue app
app.mount('#app');
