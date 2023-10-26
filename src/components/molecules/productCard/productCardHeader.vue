<script setup lang="ts">
  import { GlobalLocaleSchema } from '@/plugins/i18n/locales/locale.type';
  import { useDisplay } from 'vuetify/lib/framework.mjs';

  type HighlightableProps = {
    title: string;
    position: string;
    side: string;
    extremity: string;
    original: string;
    logo: string;
    manufacturer?: string;
  };

  const props = defineProps<
    {
      logoAlt: string;
      image?: string;
      highlight?: Partial<Omit<HighlightableProps, 'original'>>;
    } & HighlightableProps
  >();
  const { t } = useI18n<GlobalLocaleSchema>();
  const imageHasError = ref(!props.logo);

  const { mdAndUp } = useDisplay();
  const headers = computed(() => {
    if (props.highlight)
      return [
        mdAndUp.value
          ? {
              id: 'original',
              title: t('original'),
              value: props.original,
            }
          : {},
        {
          id: 'extremity',
          title: t('extremity'),
          value: props.extremity,
          highlight: props.highlight?.extremity,
        },
        {
          id: 'position',

          title: t('position'),
          value: props.position,
          highlight: props.highlight?.position,
        },
        {
          id: 'side',

          title: t('side'),
          value: props.side,
          highlight: props.highlight?.side,
        },
      ];
    return [];
  });
</script>

<template>
  <VCol cols="12" class="pt-1">
    <div class="root d-flex flex-wrap py-0">
      <VCol class="py-1 d-flex align-center gap-2 mr-auto" cols="auto">
        <ExpandableImageRoot
          v-if="image"
          :alt="logoAlt"
          :src="image"
          width="4rem"
          height="4rem"
          class="d-md-none"
          @error="imageHasError = true"
          :images="[image]"
        />

        <h4 class="mr-auto" :title="title">
          <span
            v-if="highlight?.title"
            class="font-black"
            style="min-height: 0.75rem"
          >
            <HighlighterRoot :highlight="highlight.title" :words="title" />
          </span>

          <span v-else>
            {{ title }}
          </span>
        </h4>
      </VCol>
      <VCol
        cols="auto"
        v-for="(item, index) in headers.filter(item => item.value)"
        :key="item.value"
        :class="{
          'side-border': index == 0,
          'right-border': index != 0,
        }"
        class="px-1 flex-column py-0 d-none d-md-flex"
        :title="item.title"
      >
        <span v-if="item.title == t('original')" class="small">{{
          item.title
        }}</span>
        <span class="font-black text-primary" style="min-height: 0.75rem">
          <HighlighterRoot
            v-if="item.highlight"
            :highlight="item.highlight"
            :words="item.value"
          />

          <span v-else>{{ item.value }}</span>
        </span>
      </VCol>

      <VCol cols="auto" :title="logoAlt" class="px-2 py-0 d-none d-md-flex">
        <VImg
          v-if="!imageHasError"
          :alt="logoAlt"
          :src="logo"
          height="1.5rem"
          width="4rem"
          @error="imageHasError = true"
        />
        <div v-else>
          <HighlighterRoot
            v-if="highlight?.logo"
            :words="logoAlt"
            :highlight="highlight.logo"
          />

          <span v-else>{{ logoAlt }} </span>
        </div>
      </VCol>
    </div>
    <VDivider class="mx-auto divider-color d-md-none" />

    <div class="row pt-2 gap-2 d-md-none">
      <VCol class="d-flex flex-column align-center">
        <span>{{ t('original') }}: </span>
        <span> {{ !original ? '-' : original }} </span>
      </VCol>

      <VCol class="d-flex justify-center align-center text-primary">
        <ul class="text-center d-flex gap-2">
          <li
            v-for="header in headers.filter(header => header.value)"
            :key="header.id"
          >
            {{ header.value }}
          </li>
        </ul>
      </VCol>
      <VCol class="d-flex justify-center">
        <VImg
          v-if="!imageHasError"
          :alt="logoAlt"
          :src="logo"
          width="3rem"
          height="1.5rem"
          @error="imageHasError = true"
        />
        <div v-else>
          <HighlighterRoot
            v-if="highlight?.logo"
            :words="logoAlt"
            :highlight="highlight.logo"
          />

          <span v-else>{{ logoAlt }} </span>
        </div>
      </VCol>
    </div>
    <VDivider class="mx-auto divider-color d-md-none" />
  </VCol>
</template>

<style scoped>
  .root {
    padding-bottom: 0.25rem;
  }

  .side-border {
    border-left: 1px solid rgb(var(--v-theme-primary));
    border-right: 1px solid rgb(var(--v-theme-primary));
  }

  .right-border {
    border-right: 1px solid rgb(var(--v-theme-primary));
  }
  .small {
    font-weight: 600;
    font-size: 0.7rem;
    line-height: 1;
    text-align: center;
  }

  .ellipsis {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    max-width: 100%;
  }
</style>
