<script setup lang="ts">
  import { VForm } from 'vuetify/components';

  import authV2LoginIllustrationLight from '@images/pages/auth-v2-login-illustration-light.png';
  import logo from '@images/logo.png';

  import { useUserStore } from '@stores/useUserStore';
  import { useUserConfigStore } from '@stores/useUserConfigStore';
  import { useField, useForm } from 'vee-validate';
  import { loginSchema } from '@validators/admin/login';
  import { GlobalLocaleSchema } from '@/plugins/i18n/locales/locale.type';
  import NavBarI18n from '@/layouts/components/NavBarI18n.vue';
  import { usePWA } from '@composables/usePWA';

  const { handleSubmit, setErrors } = useForm({
    validationSchema: loginSchema,
  });
  const { installPWA, isInstallable, getCameraAccess, stream } = usePWA();

  const { t } = useI18n<GlobalLocaleSchema>();
  const email = useField('email');
  const password = useField('password');
  const isPasswordVisible = ref(false);
  const loading = ref(false);
  const { login } = useUserStore();
  const UserConfigStore = useUserConfigStore();

  const onSubmit = handleSubmit(data => {
    loading.value = true;

    const { request } = login('client', {
      dsEmail: data.email,
      dsPassword: data.password,
    });

    request.then(({ error }) => {
      loading.value = false;
      const message = error.value?.message;
      if (message?.toLowerCase()?.includes('unauthorized')) {
        setErrors({
          email: `validation.email.incorrect`,
          password: `validation.password.incorrect`,
        });
      } else if (error.value) {
        setErrors({
          email: `serverError.unavailable`,
          password: `serverError.unavailable`,
        });
      }
    });
  });
</script>

<template>
  <VRow no-gutters class="auth-wrapper">
    <VCol lg="8" class="d-none d-lg-flex">
      <div class="position-relative auth-bg rounded-lg w-100 ma-8 me-0">
        <div class="d-flex align-center justify-center w-100 h-100">
          <VImg
            max-width="50%"
            :src="
              UserConfigStore.config?.images?.loginBg ||
              authV2LoginIllustrationLight
            "
            class="auth-illustration mt-16 mb-2"
          />
        </div>
      </div>
    </VCol>

    <VCol cols="12" lg="4" class="d-flex align-center justify-center">
      <VCard
        :max-width="500"
        class="d-flex w-100 flex-column mt-12 mt-sm-0 pa-4 ms-4 mx-4"
      >
        <VImg
          :src="UserConfigStore.config?.images?.login || logo"
          class="auth-illustration mt-16 mb-2 mx-auto"
          width="300"
        />
        <NavBarI18n class="ms-auto" />
        <VCardText>
          <VForm @submit.prevent="onSubmit">
            <VRow>
              <!-- email -->
              <VCol cols="12">
                <TextFieldInput
                  name="email"
                  @on-clear="email.value.value = ''"
                  density="comfortable"
                  v-model="email.value.value"
                  :label="t('email')"
                  type="email"
                  :error-messages="
                    email.errorMessage.value ? t(email.errorMessage.value) : ''
                  "
                />
              </VCol>

              <!-- password -->
              <VCol cols="12">
                <TextFieldInput
                  name="password"
                  @on-clear="password.value.value = ''"
                  density="comfortable"
                  v-model="password.value.value"
                  :label="t('password')"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="
                    isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'
                  "
                  :error-messages="
                    password.errorMessage.value
                      ? t(password.errorMessage.value)
                      : ''
                  "
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                />
              </VCol>

              <VCol cols="12">
                <VBtn
                  data-cy="btn-login"
                  :loading="loading"
                  :disabled="loading"
                  block
                  type="submit"
                >
                  {{ t('login') }}
                </VBtn>
              </VCol>

              <VCol v-if="isInstallable" cols="12">
                <VBtn @click="installPWA"> Instalar app </VBtn>
              </VCol>

              <VCol cols="12">
                <VBtn @click="getCameraAccess"> Acessar câmera </VBtn>
              </VCol>

              <VCol>
                <video
                  width="400"
                  height="400"
                  autoplay
                  :srcObject="stream"
                ></video>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss">
  @use '@core/scss/template/pages/page-auth.scss';
</style>
