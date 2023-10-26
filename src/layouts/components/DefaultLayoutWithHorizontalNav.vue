<script lang="ts" setup>
  import { useThemeConfig } from '@core/composable/useThemeConfig';
  import { themeConfig } from '@themeConfig';
  import { HorizontalNavLayout } from '@layouts';
  import { VNodeRenderer } from '@layouts/components/VNodeRenderer';
  import navItems from '@/navigation/horizontal';
  import logo from '@images/logo.png';
  import { formatMoney } from '@/utils/formatters';

  // Components
  // import Footer from '@/layouts/components/Footer.vue';
  import NavBarI18n from '@/layouts/components/NavBarI18n.vue';
  // import NavBarNotifications from '@/layouts/components/NavBarNotifications.vue';
  // import NavbarShortcuts from '@/layouts/components/NavbarShortcuts.vue';
  import NavbarThemeSwitcher from '@/layouts/components/NavbarThemeSwitcher.vue';
  import UserProfile from '@/layouts/components/UserProfile.vue';
  import HorizontalNav from '@/@layouts/components/HorizontalNav.vue';
  import { useUserStore } from '@stores/useUserStore';
  import { useUserConfigStore } from '@stores/useUserConfigStore';
  import { GlobalLocaleSchema } from '@/plugins/i18n/locales/locale.type';

  const { appRouteTransition } = useThemeConfig();

  const userStore = useUserStore();
  const UserConfigStore = useUserConfigStore();

  const { config } = storeToRefs(UserConfigStore);

  const { isAdmin, isFetchingCreditLimit, creditLimit } =
    storeToRefs(userStore);

  const { getCreditLimit } = userStore;
  const { t } = useI18n<GlobalLocaleSchema>();

  onBeforeMount(() => {
    getCreditLimit();
  });
</script>

<template>
  <HorizontalNavLayout>
    <!-- 👉 navbar -->

    <template #navbar>
      <RouterLink to="/" class="app-logo d-flex align-center gap-x-3">
        <VImg
          v-if="config?.images?.logo || logo"
          :src="config?.images?.logo || logo"
          min-width="5rem"
          max-height="3rem"
        />
      </RouterLink>

      <!-- <VCard
        v-if="!isAdmin"
        class="text-uppercase ms-1"
        style="padding: 0 1rem"
      >
        <ul v-if="userStore.userData?.sales">
          <li class="text-success d-flex justify-space-between w-100 gap-1">
            <span>{{ t('goal') }}: </span>
            <span>{{ userStore.userData.sales.goal }}</span>
          </li>
          <li
            class="d-flex justify-space-between w-100 gap-1"
            :class="
              userStore.userData.sales.goal <= userStore.userData.sales.buyed
                ? 'text-success'
                : 'text-error'
            "
          >
            <span>{{ t('purchases') }}:</span>
            <span> {{ userStore.userData.sales.buyed }}</span>
          </li>
        </ul>
      </VCard> -->

      <div class="layout-horizontal-nav">
        <div class="horizontal-nav-content-container">
          <HorizontalNav :nav-items="navItems" />
        </div>
      </div>

      <VSpacer />

      <!-- <NavSearchBar trigger-btn-class="ms-lg-n3" /> -->

      <!-- 

      <NavbarShortcuts />

      <NavBarNotifications class="me-2" /> -->

      <div class="d-flex align-center justify-center gap-2">
        <!-- <InfoCardRoot
          :label="t('utilized')"
          value="1.142,56"
          style="
            border: 2px solid rgb(var(--v-theme-primary));
            color: rgb(var(--v-theme-primary));
          "
        /> -->

        <SkeletonRoot v-if="isFetchingCreditLimit" :height="44" :width="110" />

        <InfoCardRoot
          v-else-if="!userStore.isAdmin && creditLimit?.limitAvailable"
          :label="t('available')"
          :value="formatMoney(creditLimit?.limitAvailable)"
          style="
            border: 2px solid rgb(var(--v-theme-success));
            color: rgb(var(--v-theme-success));
          "
        />

        <RouterLink to="/" class="app-logo d-flex align-center gap-x-3">
          <VNodeRenderer style="height: 3rem" :nodes="themeConfig.app.logo" />
        </RouterLink>
        <NavbarThemeSwitcher />
        <NavBarI18n />
        <UserProfile />
      </div>
    </template>

    <!-- 👉 Pages -->

    <RouterView v-slot="{ Component, route }">
      <Transition :name="appRouteTransition" mode="out-in">
        <Component :is="Component" :key="route.path" />
      </Transition>
    </RouterView>

    <!-- 👉 Footer -->
    <!-- <template #footer>
      <Footer />
    </template> -->

    <!-- 👉 Customizer -->
    <!-- <TheCustomizer /> -->
  </HorizontalNavLayout>
</template>
