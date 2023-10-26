import { defineStore } from 'pinia';
import { Toast } from './types';

export const useToastStore = defineStore('ToastStore', () => {
  const toasts = ref<Toast[]>([]);

  function toast(data: Pick<Toast, 'message' | 'timeout' | 'color'>) {
    toasts.value.push({
      ...data,
      id: Math.random(),
      color: data.color || 'primary',
    });
  }
  function clearToast(id: Toast['id']) {
    toasts.value = toasts.value.filter(toast => toast.id !== id);
  }

  return { toast, toasts, clearToast };
});
