type Conditon =
  | 'content'
  | 'differentTo'
  | 'startsWith'
  | 'endsWith'
  | 'lessThan'
  | 'lessEqualThan'
  | 'greaterThan'
  | 'greatedEqualThan'
  | 'equalsTo';
type Field =
  | 'cdMarca'
  | 'dsMarca'
  | 'flDesativado'
  | 'dtRegistro'
  | 'dtModificado'
  | 'cdUsuarioRegistro'
  | 'cdUsuarioModificado'
  | 'vlDesconto'
  | 'dsImagem'
  | 'dsIpRegistro'
  | 'dsIpModificado'
  | 'dsLinkCatalogoEletronico'
  | 'flBloquearGerarMinMix'
  | 'flExibirPedido'
  | 'flCupomPromocao'
  | 'cdFornecedor'
  | 'dsRessuprimento'
  | 'flExibirB2b';

export type BrandsFindPayload = {
  fields?: Field[];
  pageNumber: number;
  limit: number;
  conditions?: Partial<
    Record<Conditon, Partial<Record<Field, boolean | string | number>>>
  >;
  orderBy?: Partial<Record<Field, 'ASC' | 'DESC'>>;
};

export type BrandsFindResponse = {
  paginacao: {
    atual: number;
    anterior?: number;
    proxima: number;
    primeira: number;
    ultima: number;
    registrosDe: number;
    registrosAte: number;
    totalRegistros: number;
    paginas: number[];
  };
  registros: {
    cdMarca: number;
    dsMarca: string;
    flDesativado?: boolean;
    dtRegistro?: Date;
    dtModificado?: Date;
    cdUsuarioRegistro?: number;
    cdUsuarioModificado?: number;
    vlDesconto?: string;
    dsImagem?: string;
    dsIpRegistro?: string;
    dsIpModificado?: string;
    dsLinkCatalogoEletronico?: string;
    flBloquearGerarMinMix?: boolean;
    flExibirPedido?: boolean;
    flCupomPromocao?: boolean;
    cdFornecedor?: number;
    dsRessuprimento?: string;
    flExibirB2b?: boolean;
  }[];
};

export type ProcessedBrandsFind = {
  actual: number;
  loading: boolean;
} & Record<
  number,
  {
    prev: number;
    pages: number[];
    actual: number;
    first: number;
    next: number;
    from: number;
    to: number;
    total: number;
    last: number;
    data: BrandsFindResponse['registros'];
  }
>;
