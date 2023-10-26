<script setup lang="ts">
  import { VForm } from 'vuetify/components';
  import logo from '@images/logo.png';

  import { GlobalLocaleSchema } from '@/plugins/i18n/locales/locale.type';
  import NavBarI18n from '@/layouts/components/NavBarI18n.vue';
  import { ref } from 'vue';
  import { useField, useForm } from 'vee-validate';
  import { loginSchema } from '@validators/admin/login';

  import { useUserStore } from '@stores/useUserStore';
  import { useUserConfigStore } from '@stores/useUserConfigStore';

  const UserConfigStore = useUserConfigStore();
  const { login } = useUserStore();

  const { handleSubmit, setErrors } = useForm({
    validationSchema: loginSchema,
  });
  const email = useField('email');
  const password = useField('password');
  const refVForm = ref<VForm>();
  const isPasswordVisible = ref(false);
  const { t } = useI18n<GlobalLocaleSchema>();

  const onSubmit = handleSubmit(data => {
    const { request } = login('admin', {
      dsEmail: data.email,
      dsPassword: data.password,
    });
    request.then(({ error }) => {
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
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <div class="my-sm-16 w-100" style="max-width: 440px">
      <VCard class="d-flex flex-column auth-card pa-4">
        <h1 class="text-center font-weight-semibold text-capitalize">
          {{ t('administration') }} <span class="text-primary"> B2B </span>
        </h1>
        <NavBarI18n class="ms-auto" />
        <VImg
          :src="UserConfigStore?.config?.images?.login || logo"
          class="mx-auto"
          style="width: 100%; max-width: 15rem"
        />

        <VCardText>
          <VForm ref="refVForm" @submit.prevent="onSubmit">
            <VRow>
              <VCol cols="12">
                <TextFieldInput
                  name="email"
                  @on-clear="email.value.value = ''"
                  v-model="email.value.value"
                  :label="t('email')"
                  type="email"
                  :error-messages="
                    email.errorMessage.value ? t(email.errorMessage.value) : ''
                  "
                />
              </VCol>

              <VCol cols="12">
                <TextFieldInput
                  name="password"
                  @on-clear="password.value.value = ''"
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
                <VBtn data-cy="btn-login" block type="submit">
                  {{ t('login') }}
                </VBtn>
              </VCol>

              <VCol cols="12" class="text-center">
                <span>{{ t('messages.areYouAClient') }}</span>
                <RouterLink
                  data-cy="link-login"
                  class="text-primary ms-2"
                  :to="{ name: 'login' }"
                >
                  {{ t('messages.goToLoginPage') }}
                </RouterLink>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </div>
  </div>
</template>

<style lang="scss">
  @use '@core/scss/template/pages/page-auth.scss';
</style>

<route lang="yaml">
meta:
  redirectIfLoggedIn: true
  layout: blank
  subject: public
</route>
