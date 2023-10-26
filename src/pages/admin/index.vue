<script setup lang="ts">
  import { VForm } from 'vuetify/components';

  import { useField, useForm } from 'vee-validate';
  import { useTheme } from 'vuetify';

  import { ref } from 'vue';

  import { GlobalLocaleSchema } from '@/plugins/i18n/locales/locale.type';
  import authV2LoginIllustrationLight from '@images/pages/auth-v2-login-illustration-light.png';
  import logo from '@images/logo.png';

  import { settingsSchema } from '@validators/admin';
  import { useUserConfigStore } from '@stores/useUserConfigStore';
  import { useThemeConfig } from '@/@core/composable/useThemeConfig';
  import { paramB2BService } from '@services/paramB2B';
  import { type ParamB2BPayload } from '@services/paramB2B/types';
  import LoginPage from '../login/index.vue';
  import { useToastStore } from '@stores/useToastStore';

  const { t } = useI18n<GlobalLocaleSchema>();
  const { toast } = useToastStore();

  const UserConfigStore = useUserConfigStore();

  const { handleSubmit } = useForm({ validationSchema: settingsSchema });

  const title = useField('title');

  const { setPrimaryColor, colors, getBoxColor, getPrimaryColor } =
    useThemeConfig();

  const { setConfig } = UserConfigStore;
  const customColor = ref('#000000');

  const isCustomColor = computed(() =>
    colors.every(
      color =>
        initialThemeColors[color] !== vuetifyTheme.current.value.colors.primary,
    ),
  );

  const { config } = storeToRefs(UserConfigStore);

  const vuetifyTheme = useTheme();
  const initialThemeColors = JSON.parse(
    JSON.stringify(vuetifyTheme.current.value.colors),
  );

  const isModalOpen = ref(false);

  const loginBg = ref({
    src: '',
    percentage: 0,
  });
  const loginImg = ref({
    src: '',
    percentage: 0,
  });
  const logoImg = ref({ src: '', percentage: 0 });

  const favicon = ref({
    src: '',
    percentage: 0,
  });

  const { isFetching, post } = paramB2BService();

  const onSubmit = handleSubmit(data => {
    isModalOpen.value = true;

    if (!data.title) return;

    setConfig(
      {
        title: data.title,
        images: {
          favicon:
            favicon.value.src || (config.value?.images?.favicon as string),
          login: loginImg.value.src || (config.value?.images?.login as string),
          loginBg:
            loginBg.value.src || (config.value?.images?.loginBg as string),
          logo: logoImg.value.src || (config.value?.images?.logo as string),
        },
      },
      false,
    );
  });

  const onSendData = (data: { title: string }) => {
    const payload: ParamB2BPayload = {
      dsCnpjCpf: import.meta.env.VITE_B2B_CNPJ_EMPRESA,
      dsColor: vuetifyTheme.current.value.colors.primary,
      txTituloPagina: data.title,
      txFavicon: favicon.value.src || undefined,
      txImagemCapa: loginBg.value.src || undefined,
      txImagemLogin: loginImg.value.src || undefined,
      txLogotipo: logoImg.value.src || undefined,
    };

    isModalOpen.value = false;
    post(payload)
      .execute(true)
      .then(() => {
        console.log('here');
        setConfig({
          title: data.title,
          images: {
            favicon:
              favicon.value.src || (config.value?.images?.favicon as string),
            login:
              loginImg.value.src || (config.value?.images?.login as string),
            loginBg:
              loginBg.value.src || (config.value?.images?.loginBg as string),
            logo: logoImg.value.src || (config.value?.images?.logo as string),
          },
        });

        toast({ message: t('messages.settings.success') });
      })
      .catch(() => {
        console.error('error');
      });
  };

  onMounted(() => {
    title.setValue(config.value?.title);
  });
</script>

<template>
  <VRow no-gutters class="auth-wrapper">
    <VCol lg="8" class="d-none d-lg-flex">
      <div class="position-relative auth-bg rounded-lg w-100 ma-8 me-0">
        <div class="d-flex align-center justify-center w-100 h-100">
          <FileUploaderRoot
            :src="loginBg.src || config?.images?.loginBg || ''"
            :width="450"
            icon="tabler-replace"
            size="80"
            :label="t('messages.chooseLoginBackgroundImage')"
            @on-progress="loginBg.percentage = $event"
            @on-file-load="loginBg.src = $event"
            @on-clear="
              loginBg.src = '';
              loginBg.percentage = 0;
            "
            accept="image/*"
            :fallback="authV2LoginIllustrationLight"
          >
            <FileUploaderProgress :percentage="loginBg.percentage" />
          </FileUploaderRoot>
        </div>
      </div>
    </VCol>

    <VCol cols="12" lg="4" class="d-flex align-center justify-center">
      <VCard
        flat
        :max-width="500"
        class="mt-12 mt-sm-0 pa-4 d-flex flex-column justify-center"
        min-height="80vh"
      >
        <VCardText class="flex-grow-0">
          <VForm @submit.prevent="onSubmit">
            <VRow class="d-flex">
              <VCol class="mx-auto d-flex d-lg-none" cols="10">
                <FileUploaderRoot
                  :src="loginBg.src || config?.images?.loginBg || ''"
                  :width="250"
                  icon="tabler-replace"
                  size="40"
                  :label="t('messages.chooseLoginBackgroundImage')"
                  @on-progress="loginBg.percentage = $event"
                  @on-file-load="loginBg.src = $event"
                  @on-clear="
                    loginBg.src = '';
                    loginBg.percentage = 0;
                  "
                  accept="image/*"
                  :fallback="authV2LoginIllustrationLight"
                >
                </FileUploaderRoot>
              </VCol>

              <VCol class="mx-auto" cols="10">
                <FileUploaderRoot
                  :src="loginImg.src || config?.images?.login || ''"
                  icon="tabler-replace"
                  :label="t('messages.chooseLoginLogoImage')"
                  size="40"
                  @on-progress="loginImg.percentage = $event"
                  @on-file-load="loginImg.src = $event"
                  @on-clear="loginImg.src = ''"
                  accept="image/*"
                  :width="100"
                  :fallback="logo"
                >
                </FileUploaderRoot>
              </VCol>
              <VCol class="mx-auto" cols="10">
                <FileUploaderRoot
                  icon="tabler-replace"
                  :label="t('messages.chooseLogoImage')"
                  size="40"
                  @on-progress="logoImg.percentage = $event"
                  @on-file-load="logoImg.src = $event"
                  @on-clear="logoImg.src = ''"
                  accept="image/*"
                  :src="logoImg.src || config?.images?.logo || ''"
                  :fallback="logo"
                  :width="100"
                >
                </FileUploaderRoot>
              </VCol>

              <VCol class="mx-auto" cols="10">
                <FileUploaderRoot
                  icon="tabler-replace"
                  :label="t('messages.chooseFavicon')"
                  size="40"
                  @on-progress="favicon.percentage = $event"
                  @on-file-load="favicon.src = $event"
                  @on-clear="favicon.src = ''"
                  accept="image/*"
                  :src="favicon.src || config?.images?.favicon || ''"
                  :width="100"
                  :fallback="'/favicon.ico'"
                >
                </FileUploaderRoot>
              </VCol>

              <VCol cols="12">
                <TextFieldRoot :loading="false">
                  <TextFieldInput
                    v-model="title.value.value"
                    @on-clear="title.value.value = ''"
                    :error-messages="
                      title.errorMessage.value
                        ? t(title.errorMessage.value)
                        : ''
                    "
                    :label="t('messages.enterUsersPageTitle')"
                  />
                </TextFieldRoot>
              </VCol>
            </VRow>

            <VRow>
              <VCol cols="12">
                <h6 class="mt-3 text-base font-weight-regular">
                  {{ t('messages.themeColor') }}
                </h6>
                <div class="d-flex flex-wrap gap-4 mt-2">
                  <div
                    v-for="(color, index) in colors"
                    :key="color"
                    style="
                      width: 2.5rem;
                      height: 2.5rem;
                      border-radius: 0.5rem;
                      transition: all 0.25s ease;
                    "
                    :style="{
                      backgroundColor: getBoxColor(
                        initialThemeColors[color],
                        index,
                      ),
                    }"
                    class="cursor-pointer d-flex align-center justify-center"
                    :class="{
                      'elevation-4':
                        vuetifyTheme.current.value.colors.primary ===
                        getBoxColor(initialThemeColors[color], index),
                    }"
                    @click="
                      setPrimaryColor(
                        getBoxColor(initialThemeColors[color], index),
                        vuetifyTheme,
                      )
                    "
                  >
                    <VFadeTransition>
                      <VIcon
                        v-show="
                          vuetifyTheme.current.value.colors.primary ===
                          getBoxColor(initialThemeColors[color], index)
                        "
                        icon="tabler-check"
                        color="white"
                      />
                    </VFadeTransition>
                  </div>
                  <label
                    style="
                      width: 2.5rem;
                      height: 2.5rem;
                      border-radius: 0.5rem;
                      transition: all 0.25s ease;
                    "
                    class="cursor-pointer d-flex align-center justify-center gradient"
                  >
                    <VFadeTransition v-show="isCustomColor">
                      <VIcon icon="tabler-check" color="white" />
                    </VFadeTransition>
                    <input
                      :value="customColor"
                      style="
                        border: none;
                        visibility: hidden;
                        width: 0;
                        height: 0;
                      "
                      type="color"
                      @input="
                        customColor = ($event.target as HTMLInputElement).value;
                        setPrimaryColor(customColor, vuetifyTheme);
                      "
                    />
                  </label>
                </div>
              </VCol>

              <!-- email -->

              <!-- password -->
              <VCol cols="12">
                <VBtn :loading="isFetching" block type="submit">
                  {{ t('messages.previewLoginPage') }}
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>

    <DialogRoot :is-open="isModalOpen" max-width="70rem">
      <DialogClose @on-close="isModalOpen = false" />
      <DialogContent title="">
        <DialogRow>
          <LoginPage style="pointer-events: none; scale: 1" />
        </DialogRow>
        <DialogRow class="mx-auto">
          <VBtn
            style="flex-grow: 0"
            :loading="isFetching"
            block
            type="submit"
            @click="onSendData({ title: title.value.value as string })"
          >
            {{ t('messages.saveChanges') }}
          </VBtn>
        </DialogRow>
      </DialogContent>
    </DialogRoot>
  </VRow>
</template>

<style lang="scss">
  @use '@core/scss/template/pages/page-auth.scss';
</style>
