<template>
  <VMenu
    open-on-hover
    open-on-focus
    :offset="4"
    location="bottom"
    style="max-width: 100%"
  >
    <template #activator="{ props }">
      <div v-bind="{ ...$attrs, ...props }">
        <slot v-bind="props" name="trigger"></slot>
      </div>
    </template>

    <slot> </slot>
  </VMenu>
</template>
