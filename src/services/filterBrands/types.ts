export type FilterBrandsPayload = {
  cdMarca?: number;
  cdTipo: number;
  dsSubDescricao: string;
};

export type FilterBrandsResponse =
  | { cdMarca: number; dsMarca: string }[]
  | null;
