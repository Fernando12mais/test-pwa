<script setup lang="ts">
  // import { initialAbility } from '@/plugins/casl/ability';

  import { useUserStore } from '@stores/useUserStore';
  import { GlobalLocaleSchema } from '@/plugins/i18n/locales/locale.type';
  import { logoutService } from '@services/logout';
  import { useFilterStore } from '@stores/useFilterStore';
  import { useProductsStore } from '@/stores/useProductsStore';
  import NavBarI18n from './NavBarI18n.vue';
  import NavbarThemeSwitcher from './NavbarThemeSwitcher.vue';

  const router = useRouter();

  const userStore = useUserStore();
  const filterStore = useFilterStore();
  const productsStore = useProductsStore();

  const logout = () => {
    const request = logoutService().get();

    request.execute(true).then(() => {
      const isAdmin = userStore.isAdmin;
      userStore.clear();
      filterStore.reset();
      productsStore.reset();

      router.push(isAdmin ? { name: 'login-admin' } : { name: 'login' });
    });
  };

  const { t } = useI18n<GlobalLocaleSchema>();
</script>

<template>
  <VBadge
    dot
    location="bottom right"
    offset-x="3"
    offset-y="3"
    bordered
    color="success"
  >
    <VAvatar class="cursor-pointer" color="primary" variant="tonal">
      <VIcon icon="tabler-user" />

      <!-- SECTION Menu -->
      <VMenu activator="parent" width="230" location="bottom end" offset="14px">
        <VList>
          <!-- 👉 User Avatar & Name -->
          <VListItem>
            <template #prepend>
              <VListItemAction start>
                <VBadge
                  dot
                  location="bottom right"
                  offset-x="3"
                  offset-y="3"
                  color="success"
                >
                  <VAvatar color="primary" variant="tonal">
                    <VIcon icon="tabler-user" />
                  </VAvatar>
                </VBadge>
              </VListItemAction>
            </template>

            <VListItemTitle class="font-weight-semibold">
              {{ userStore.userData?.user?.dsLogin }}
            </VListItemTitle>
          </VListItem>

          <VDivider class="my-2" />

          <VListItem class="d-lg-none">
            <NavBarI18n />
          </VListItem>
          <VListItem class="d-lg-none">
            <NavbarThemeSwitcher />
          </VListItem>

          <!-- 👉 Profile -->
          <!-- <VListItem :to="{ name: 'apps-user-view-id', params: { id: 21 } }">
            <template #prepend>
              <VIcon class="me-2" icon="tabler-user" size="22" />
            </template>

            <VListItemTitle>Profile</VListItemTitle>
          </VListItem> -->

          <!-- 👉 Settings -->
          <!-- <VListItem
            :to="{
              name: 'pages-account-settings-tab',
              params: { tab: 'account' },
            }"
          >
            <template #prepend>
              <VIcon class="me-2" icon="tabler-settings" size="22" />
            </template>

            <VListItemTitle>Settings</VListItemTitle>
          </VListItem> -->

          <!-- 👉 Pricing -->
          <!-- <VListItem :to="{ name: 'pages-pricing' }">
            <template #prepend>
              <VIcon class="me-2" icon="tabler-currency-dollar" size="22" />
            </template>

            <VListItemTitle>Pricing</VListItemTitle>
          </VListItem> -->

          <!-- 👉 FAQ -->
          <!-- <VListItem :to="{ name: 'pages-faq' }">
            <template #prepend>
              <VIcon class="me-2" icon="tabler-help" size="22" />
            </template>

            <VListItemTitle>FAQ</VListItemTitle>
          </VListItem> -->

          <!-- Divider -->
          <!-- <VDivider class="my-2" /> -->

          <!-- 👉 Logout -->
          <VListItem link @click="logout">
            <template #prepend>
              <VIcon class="me-2" icon="tabler-logout" size="22" />
            </template>

            <VListItemTitle>{{ t('logout') }}</VListItemTitle>
          </VListItem>
        </VList>
      </VMenu>
      <!-- !SECTION -->
    </VAvatar>
  </VBadge>
</template>
