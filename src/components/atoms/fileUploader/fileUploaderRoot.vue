<script setup lang="ts">
  const props = defineProps<{
    progress?: number;
    accept?: string;
    label: string;
    icon?: string;
    src: string;
    fallback?: string;
  }>();

  const error = ref(false);

  const emit = defineEmits({
    onProgress: (value: number) => value,
    onFileLoad: (value: string) => value,
    onClear: () => true,
  });

  async function readFile(e: Event) {
    const target = e.target as HTMLInputElement;
    const files = target.files;
    const file = files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      emit('onFileLoad', reader.result as string);
      error.value = false;
      target.value = '';
    };

    reader.onprogress = e => {
      const percentage = Number(((e.loaded * 100) / e.total).toFixed(2));
      emit('onProgress', percentage);
    };

    reader.readAsDataURL(file);
  }
  const isStoredImage = computed(() => {
    return !props.src;
  });
</script>

<template>
  <div
    class="d-flex flex-column justify-center align-center position-relative mx-auto"
    style="width: fit-content"
  >
    <form class="container" :class="{ error }">
      <label
        class="d-flex flex-column justify-center align-center position-relative gap-1"
      >
        <span class="label">{{ label }}</span>
        <div>
          <VImg
            v-if="(src || fallback) && !error"
            v-bind="$attrs"
            ref="imageRef"
            :src="src || fallback"
            @error="error = true"
          />
          <VIcon
            v-else
            :icon="error ? 'tabler-file-alert' : 'tabler-camera-plus'"
            :color="error ? 'error' : 'primary'"
            v-bind="$attrs"
          />

          <input type="file" @input="readFile" :accept="accept" />
        </div>
      </label>

      <button
        v-if="!isStoredImage"
        type="button"
        @click="
          $emit('onClear');
          error = false;
        "
        class="btn-close"
      >
        <VIcon icon="tabler-x" color="primary" />
      </button>
    </form>

    <slot></slot>
  </div>
</template>

<style scoped>
  label {
    cursor: pointer;
  }
  input {
    width: 0;
    height: 0;
    visibility: hidden;
  }
  .label {
    padding: 0 0.5rem;
    border-bottom: 0.0625rem solid rgb(var(--v-theme-primary));
    width: 100%;
    text-align: center;
  }
  .btn-close {
    position: absolute;
    top: 0;
    right: 0;
    cursor: pointer;
    translate: 100% -50%;
  }
  .container {
    position: relative;
    border: 0.125rem solid rgb(var(--v-theme-primary));
    border-radius: 0.25rem;
    display: flex;
    justify-content: center;
    align-items: center;
    /* padding: 0.5rem; */
  }
  .error {
    border: 0.125rem solid rgb(var(--v-theme-error));
  }
</style>
