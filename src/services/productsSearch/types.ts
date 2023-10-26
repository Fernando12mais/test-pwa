import { FilterOption } from '@/stores/useFilterStore/types';

export type SearchLoadingType = 'search' | 'filters' | 'pagination';

export type ProductsSearchResponse = {
  resultado: {
    dsDescricao: string;
    dsPosicao: string;
    dsLado: string;
    dsExtremidade: string;
    txUrlImagemMarca: string;
    txUrlImagem: string;
    vlUnitario: number;
    dsCodigoFabricante: string;
    dsCodigoOriginal: string;
    cdItem: number;
    txAplicacao: string[];
    dsMarca: string;
    nrItemSimilar: number;
    similares: number[];
    txUrlImagemTecnica: string;
    flDisponivel: boolean;
  }[];
  tipos: { cdTipo: number; dsTipo: string }[];
  subDescricoes?: { dsSubDescricao: string }[];
  marcas?: { dsMarca: string; cdMarca: number }[];
};

type Product = ProductsSearchResponse['resultado'][0];

type ActiveFilters = {
  cdTipo: number;
  dsSubDescricao?: string;
  cdMarca?: number;
};
export type ProductsSearchPayload = {
  txSearch: string;
  dsMarca: string;
  dsReferencia: string;
  txAplicacao: string;
  dsPosicao: string;
  dsLado: string;
  dsExtremidade: string;
  cdMarca: number[];
  txSearchSidebar: ActiveFilters[];
  sidebar?: { cdTipo?: number; dsSubDescricao?: string; cdMarca?: number };
  page: number;
  filterId?: string;
  loadingType: SearchLoadingType[];
};

export type ProcessedProductsResponse = {
  results: {
    description: Product['dsDescricao'];
    position: Product['dsPosicao'];
    side: Product['dsLado'];
    logo: Product['txUrlImagemMarca'];
    picture: Product['txUrlImagem'];
    price: Product['vlUnitario'];
    manufacturer: Product['dsCodigoFabricante'];
    id: Product['cdItem'];
    application: Product['txAplicacao'];
    logoAlt: Product['dsMarca'];
    extremity: Product['dsExtremidade'];
    original: Product['dsCodigoOriginal'];
    similars: Product['similares'];
    isSimilar?: boolean;
    noSimilars?: boolean;
    isLoading?: boolean;
    isBuying?: boolean;
    similarIndex?: number;
    technicalPicture: Product['txUrlImagemTecnica'];
    isAvailable?: Product['flDisponivel'];
  }[];
  types: FilterOption[];
  subDescriptions: FilterOption[] | undefined;
  brands: FilterOption[];
  end?: boolean;
};
