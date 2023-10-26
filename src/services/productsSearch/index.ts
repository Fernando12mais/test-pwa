import { getFilterByTitle } from '@/stores/useProductsStore/utils';
import { useFetchAPI } from '../api';
import {
  ProcessedProductsResponse,
  ProductsSearchPayload,
  ProductsSearchResponse,
  SearchLoadingType,
} from './types';

export const productsSearchService = () => {
  let payload: ProductsSearchPayload;
  const allData = ref<ProcessedProductsResponse>({
    results: [],
    subDescriptions: [],
    types: [],
    brands: [],
  });
  const resultsPerRequest = ref(10);

  const isSearchingProduct = ref<{ [key in SearchLoadingType]?: boolean }>({
    search: false,
    filters: false,
    pagination: false,
  });

  const { data, post, error } = useFetchAPI<ProcessedProductsResponse>(
    'item/search',
    {
      immediate: false,
      beforeFetch: ctx => {
        const body = JSON.parse(
          String(ctx.options.body),
        ) as ProductsSearchPayload;

        payload = body;

        payload.loadingType.forEach(
          key => (isSearchingProduct.value[key] = true),
        );
        const filter = getFilterByTitle(payload.filterId as string, [
          ...allData.value.types,
          ...(allData.value.subDescriptions || []),
          ...allData.value.brands,
        ]);

        if (filter && !filter.subgroup?.length) filter.loading = true;
      },
      onFetchError: ctx => {
        payload.loadingType.forEach(
          key => (isSearchingProduct.value[key] = false),
        );

        const filter = getFilterByTitle(payload.filterId as string, [
          ...allData.value.types,
          ...(allData.value.subDescriptions || []),
          ...allData.value.brands,
        ]);

        if (filter) filter.loading = false;
        ctx.data = allData.value;
        return ctx;
      },
      afterFetch: ctx => {
        payload.loadingType.forEach(
          key => (isSearchingProduct.value[key] = false),
        );

        const foundedFilter = getFilterByTitle(payload.filterId as string, [
          ...allData.value.types,
          ...(allData.value.subDescriptions || []),
          ...allData.value.brands,
        ]);
        if (foundedFilter) foundedFilter.loading = false;
        const data = ctx.data as ProductsSearchResponse;
        const isSearching = payload.sidebar == undefined && payload.page == 1;
        const processedData: ProcessedProductsResponse = {
          results: data.resultado.map(item => ({
            application: item.txAplicacao,
            description: item.dsDescricao,
            id: item.cdItem,
            logo: item.txUrlImagemMarca,
            logoAlt: item.dsMarca,
            manufacturer: item.dsCodigoFabricante,
            picture: item.txUrlImagem,
            position: item.dsPosicao,
            price: item.vlUnitario,
            side: item.dsLado,
            similars: item.similares || [],
            extremity: item.dsExtremidade,
            original: item.dsCodigoOriginal,
            similarItems: [],
            isSimilar: false,
            technicalPicture: item.txUrlImagemTecnica,
            isAvailable: item.flDisponivel,
          })),
          types: data.tipos.map(item => ({
            title: item.dsTipo,
            value: item.cdTipo,
            level: 0,
            id: `id-${Math.random()}`,
          })),
          subDescriptions:
            data.subDescricoes?.map(item => ({
              title: item.dsSubDescricao,
              level: 1,
              id: `id-${Math.random()}`,
            })) || [],
          brands:
            data.marcas?.map(item => ({
              title: item.dsMarca,
              level: 2,
              value: item.cdMarca,
              id: `id-${Math.random()}`,
            })) || [],
        };

        if (isSearching) {
          allData.value = processedData;

          resultsPerRequest.value =
            processedData.results.length > resultsPerRequest.value
              ? processedData.results.length
              : resultsPerRequest.value;
          ctx.data = allData.value;
          return ctx;
        }

        if (payload.page > 1) {
          allData.value.results.push(...processedData.results);

          allData.value.end =
            processedData.results.length < resultsPerRequest.value &&
            payload.page > 1;
          ctx.data = allData.value;
          return ctx;
        }

        const filter = getFilterByTitle(
          payload.filterId as string,
          allData.value.types,
        );

        if (filter?.level == 0 && processedData.subDescriptions?.length) {
          filter.subgroup = processedData.subDescriptions?.map(item => ({
            ...item,
            father: {
              ...filter,
              subgroup: [],
            },
          }));
        }
        if (filter?.level == 1 && processedData.brands?.length) {
          filter.subgroup = processedData.brands?.map(item => ({
            ...item,
            father: {
              ...filter,
              subgroup: [],
            },
          }));
        }

        allData.value.subDescriptions = processedData.subDescriptions;
        allData.value.results = processedData.results;
        allData.value.brands = processedData.brands;

        ctx.data = allData.value;
        return ctx;
      },
    },
  );

  function insertValueAtPositionAndShift<T>(
    array: T[],
    value: T,
    index: number,
  ): T[] {
    // Shift elements to the right to make space for the new value
    for (let i = array.length - 1; i >= index; i--) {
      array[i + 1] = array[i];
    }

    // Insert the new value at the specified index
    array[index] = value;

    return array;
  }

  async function fetchSimilars(payload: number[], index: number) {
    const { data: similars, post: getSimilars } =
      useFetchAPI<ProductsSearchResponse>('item/search');
    allData.value.results[index].isLoading = true;

    await getSimilars({ cdItem: payload })
      .json()
      .execute(true)
      .catch(err => console.error(err));
    allData.value.results[index].noSimilars = !similars.value?.resultado.length;
    allData.value.results[index].isLoading = false;

    if (similars.value?.resultado.length) {
      allData.value.results = allData.value.results.filter(
        item => !payload.includes(item.id),
      );
      const items: ProcessedProductsResponse['results'] =
        similars.value.resultado.map((item, similarIndex) => ({
          application: item.txAplicacao,
          description: item.dsDescricao,
          id: item.cdItem,
          logo: item.txUrlImagemMarca,
          logoAlt: item.dsMarca,
          manufacturer: item.dsCodigoFabricante,
          picture: item.txUrlImagem,
          position: item.dsPosicao,
          price: item.vlUnitario,
          side: item.dsLado,
          similars: similars.value?.resultado.map(item => item.cdItem) || [],
          extremity: item.dsExtremidade,
          original: item.dsCodigoOriginal,
          isSimilar: true,
          similarIndex: similarIndex + 1,
          technicalPicture: item.txUrlImagemTecnica,
          isAvailable: item.flDisponivel,
        }));

      items.forEach(
        item =>
          (allData.value.results = insertValueAtPositionAndShift(
            allData.value.results,
            item,
            index + 1,
          )),
      );
    }
  }
  return { data, post, isSearchingProduct, error, fetchSimilars };
};
