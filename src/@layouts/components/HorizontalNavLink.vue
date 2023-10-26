<script lang="ts" setup>
  import { useUserStore } from '@stores/useUserStore';
  import { GlobalLocaleSchema } from '@/plugins/i18n/locales/locale.type';
  import { config } from '@layouts/config';
  import { can } from '@layouts/plugins/casl';
  import type { NavLink } from '@layouts/types';
  import { isNavLinkActive } from '@layouts/utils';

  interface Props {
    item: NavLink;

    // ℹ️ We haven't added this prop in vertical nav because we don't need such differentiation in vertical nav for styling
    isSubItem?: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    isSubItem: false,
  });

  const { t } = useI18n<GlobalLocaleSchema>();
  const { value } = useLocalStorage('orderQueryParams', {});

  const { userData } = storeToRefs(useUserStore());
</script>

<template>
  <li
    v-if="can('all', item.subject || userData?.role)"
    class="nav-link"
    :class="[
      {
        'sub-item': props.isSubItem,
        disabled: item.disable,
      },
    ]"
  >
    <RouterLink
      :class="{
        'router-link-active router-link-exact-active': isNavLinkActive(
          item,
          $router,
        ),
      }"
      :to="{
        name: item.to as string,
        query: (item.title as string)?.includes('orders') ? value : {},
      }"
    >
      <Component
        :is="config.app.iconRenderer || 'div'"
        class="nav-item-icon"
        v-bind="item.icon || config.verticalNav.defaultNavItemIconProps"
      />
      <span class="nav-item-title"> {{ t(item.title) }}</span>
    </RouterLink>
  </li>
</template>

<style lang="scss">
  .layout-horizontal-nav {
    .nav-link a {
      display: flex;
      align-items: center;
    }
  }
</style>
