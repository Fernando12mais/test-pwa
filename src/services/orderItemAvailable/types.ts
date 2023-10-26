export type OrderItemServiceParams = {
  cdEmpresa: number;
  cdItem: number;
  nrQuantidade: number;
};

export type OrderItemServiceResponse = {
  disponivel: boolean;
  flRede: boolean;
};
