<script lang="ts" setup>
  import { useUserStore } from '@stores/useUserStore';
  import { useSkins } from '@core/composable/useSkins';
  import { useThemeConfig } from '@core/composable/useThemeConfig';

  // @layouts plugin
  import { AppContentLayoutNav } from '@layouts/enums';

  const DefaultLayoutWithHorizontalNav = defineAsyncComponent(
    () => import('./components/DefaultLayoutWithHorizontalNav.vue'),
  );
  const DefaultLayoutWithVerticalNav = defineAsyncComponent(
    () => import('./components/DefaultLayoutWithVerticalNav.vue'),
  );

  const { width: windowWidth } = useWindowSize();
  const { appContentLayoutNav, switchToVerticalNavOnLtOverlayNavBreakpoint } =
    useThemeConfig();

  // ℹ️ This will switch to vertical nav when define breakpoint is reached when in horizontal nav layout
  // Remove below composable usage if you are not using horizontal nav layout in your app
  switchToVerticalNavOnLtOverlayNavBreakpoint(windowWidth);

  const UserStore = useUserStore();

  const { layoutAttrs, injectSkinClasses } = useSkins();

  injectSkinClasses();

  const url = new URL('https://wa.me/');
  url.searchParams.set('text', 'Olá');
</script>

<template>
  <DefaultLayoutWithVerticalNav
    v-if="appContentLayoutNav === AppContentLayoutNav.Vertical"
    v-bind="layoutAttrs"
  />

  <DefaultLayoutWithHorizontalNav v-else v-bind="layoutAttrs" />

  <VBtn
    v-if="UserStore.userData?.user?.vendedor?.whatsapp != null"
    class="fixed-icon elevate-1"
    rounded
    size="38"
    color="success"
    target="_blank"
    rel="noreferrer"
    as="a"
    :href="url + UserStore.userData?.user?.vendedor?.whatsapp"
  >
    <VIcon size="22" icon="tabler-brand-whatsapp" />
  </VBtn>
</template>

<style lang="scss">
  // As we are using `layouts` plugin we need its styles to be imported
  @use '@layouts/styles/default-layout';
</style>

<style scoped>
  .fixed-icon {
    position: fixed;
    right: 1rem;
    bottom: 1rem;
  }
</style>
