<script lang="ts" setup>
  import { Device, useDevice } from '@composables/useDevice';
  import { useTemplateStore } from '@stores/useTemplateStore';
  const TemplateStore = useTemplateStore();

  const { data } = storeToRefs(TemplateStore);

  const devices: Device[] = ['mobile', 'email', 'pdf'];

  const selectedDevice = ref<Device>('mobile');
  const { deviceData, getColWidth, parentWidth } = useDevice('mobile');
</script>

<template>
  <VRow>
    <VCol style="border-radius: 8px; border: 1px solid black">
      <h1 class="text-center">Conteudo:</h1>

      {{ data }}
      <VRow>
        <VCol></VCol>
      </VRow>
    </VCol>
    <VCol cols="6" class="d-flex justify-center px-4">
      <DeviceRoot
        v-if="deviceData"
        :device-data="deviceData"
        :device="selectedDevice"
      >
        <DragAndDropParent
          :background-color="
            data.selectedElement?.content.backgroundColor || 'gray'
          "
          @on-focus="
            data.selectedElement = {
              content: {
                backgroundColor: $event,
              },
            }
          "
          :cols="9"
          :rows-height="16 * deviceData.multiplier"
          :rows="9"
          :width="parentWidth"
        >
          <DragAndDropResizable
            :initial-x="0"
            :initial-y="0"
            :height="16 * deviceData.multiplier * 2"
            :width="getColWidth(9) * 2"
            :snap="{
              colWidth: getColWidth(9),
              rowHeight: 16 * deviceData.multiplier,
            }"
            :active="true"
          >
            <p>teasd</p>
          </DragAndDropResizable>
        </DragAndDropParent>
      </DeviceRoot>
    </VCol>
    <VCol style="border-radius: 8px; border: 1px solid black">
      <VSelect
        label="Template:"
        :model-value="selectedDevice"
        :items="devices"
      />
      <h1 class="text-center">Ferramentas:</h1>

      <VRow>
        <VCol>
          {{ data.selectedElement?.content.backgroundColor }}
          <ColorPicker
            v-if="data.selectedElement"
            :value="data.selectedElement.content.backgroundColor"
            @on-input="
              if (data.selectedElement)
                data.selectedElement.content.backgroundColor = $event;
            "
          />
        </VCol>
      </VRow>
    </VCol>
  </VRow>
</template>
