<script setup lang="ts">
  import { GlobalLocaleSchema } from '@/plugins/i18n/locales/locale.type';
  import misc404 from '@images/pages/404.png';
  import { useIntervalFn } from '@vueuse/core';
  const timeout = ref(5);
  const router = useRouter();

  useIntervalFn(() => {
    timeout.value -= 1;
  }, 1000);

  watchEffect(() => {
    if (timeout.value < 1) router.push('/');
  });

  const { t } = useI18n<GlobalLocaleSchema>();
</script>

<template>
  <main
    class="d-flex flex-column justify-center align-center"
    style="min-height: 100vh"
  >
    <ErrorHeader
      :error-title="t('messages.sessionExpired.title')"
      :error-description="t('messages.sessionExpired.description')"
    />
    <VBtn to="/" class="mb-12"> {{ t('messages.goToLoginPage') }} </VBtn>

    <p>{{ timeout }}</p>

    <div class="misc-avatar w-100 text-center">
      <VImg :src="misc404" alt="Coming Soon" :max-width="200" class="mx-auto" />
    </div>
  </main>
</template>

<route lang="yaml">
meta:
  redirectIfLoggedIn: true
  layout: blank
</route>
