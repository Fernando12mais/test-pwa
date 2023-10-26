export type FilterTypesPayload = {
  cdMarca?: number;
};

export type FilterTypesResponse =
  | {
      cdTipo: number;
      dsTipo: string;
    }[]
  | undefined;
