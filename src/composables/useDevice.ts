export type Device = 'mobile' | 'pdf' | 'email';
export type DeviceData = {
  width: number;
  height: number;
  type: Device;
  multiplier: number;
};
const multiplier = 1.4;
const initialValue: DeviceData = {
  height: 640 * multiplier,
  width: 360 * multiplier,
  type: 'mobile',
  multiplier,
};
export const useDevice = (device: Device) => {
  const deviceData = ref(initialValue);
  const parentWidth = computed(() => deviceData.value.width * 0.9);

  function setDeviceData() {
    if (device == 'mobile') {
      deviceData.value = {
        height: 640 * multiplier,
        width: 360 * multiplier,
        type: device,
        multiplier,
      };
    }
    return deviceData;
  }

  const getColWidth = (cols: number) => parentWidth.value / cols;
  const getRowHeight = (rows: number) => parentWidth.value / rows;

  setDeviceData();

  return { deviceData, multiplier, getColWidth, getRowHeight, parentWidth };
};
