export type PaymentFormResponse = {
  cdFormaPagamento: number;
  dsFormaPagamento: string;
}[];

export type ProcessedPaymentFormResponse = {
  id: PaymentFormResponse[0]['cdFormaPagamento'];
  label: PaymentFormResponse[0]['dsFormaPagamento'];
}[];
