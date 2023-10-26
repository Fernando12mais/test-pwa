import { defineStore } from 'pinia';
import { promotionsService } from '@/services/promotionsB2B';
import { PromotionsB2BPayload } from '@/services/promotionsB2B/types';

export const usePromotionsStore = defineStore('promotionStore', () => {
  async function fetchData(payload: PromotionsB2BPayload) {
    await promotionsService?.post(payload)?.json()?.execute(true);
  }

  return { ...promotionsService, fetchData };
});
