import { brandsFindService } from '@/services/brandsFind';
import {
  BrandsFindPayload,
  BrandsFindResponse,
  ProcessedBrandsFind,
} from '@/services/brandsFind/types';

export async function fetchBrandsFind(payload: BrandsFindPayload) {
  const request = brandsFindService.post(payload).json();

  const data: BrandsFindResponse = await request
    .execute(true)
    .then(() => request.data.value);

  const processedResponse: ProcessedBrandsFind = {
    loading: false,
    actual: data.paginacao.atual,
    [data.paginacao.atual]: {
      prev: data.paginacao.anterior || 0,
      actual: data.paginacao.atual,
      pages: data.paginacao.paginas,
      first: data.paginacao.primeira,
      next: data.paginacao.proxima,
      from: data.paginacao.registrosDe,
      to: data.paginacao.registrosAte,
      total: data.paginacao.totalRegistros,
      last: data.paginacao.ultima,
      data: data.registros,
    },
  };

  return { request, processedResponse };
}
