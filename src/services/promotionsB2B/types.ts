export type PromotionsB2BResponse = {
  cdItem: number;
  dsCodigoAntigo: string;
  dsCodigoFabricante: string;
  dsMarca: string;
  dsSubDescricao: string;
  dsTipo: string;
  vlPrecoPromocao: string;
  vlPrecoVenda: string;
}[];

export type PromotionsB2BProcessedResponse = {
  id: PromotionsB2BResponse[0]['cdItem'];
  type: PromotionsB2BResponse[0]['dsTipo'];
  description: PromotionsB2BResponse[0]['dsSubDescricao'];
  brand: PromotionsB2BResponse[0]['dsMarca'];
  oldCode: PromotionsB2BResponse[0]['dsCodigoAntigo'];
  manufacturer: PromotionsB2BResponse[0]['dsCodigoFabricante'];
  promotion: PromotionsB2BResponse[0]['vlPrecoPromocao'];
  sell: PromotionsB2BResponse[0]['vlPrecoVenda'];
}[];

export type PromotionsB2BPayload = {
  cdEmpresa: number;
  cdLocalEstoque: number;
};
