/// <reference path="auto-imports.d.ts" />
/// <reference path="components.d.ts" />
/// <reference types="vite/client" />
/// <reference types="vite-plugin-pages/client" />

import 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    action?: string;
    subject?: string;
    layoutWrapperClasses?: string;
  }
}

interface ImportMetaEnv {
  readonly VITE_BASE_URL_API: string;
  readonly VITE_B2B_CNPJ_EMPRESA: string;
  readonly VITE_B2B_SERVICES_API: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
