import { LocaleSchema } from './locale.type';

const messages: LocaleSchema['messages'] = {
  errorPromotionExpired:
    'Erro! Promoção expirada para os itens acima, você pode remove-los para prosseguir com a finalização do pedido.',
  errorWhenFinishingOrder: 'Erro ao finalizar o pedido',
  insufficientLimit: 'Limite Insuficiente. Entre em contato com seu vendedor.',
  errorMissingItemsInStock:
    'Erro! Estoque insuficiente para os itens acima, você pode remove-los para prosseguir com a finalização do pedido.',
  installB2B: 'Instalar B2B',
  changeTheme: 'Alterar tema',
  changeLanguage: 'Alterar idioma',
  yesFinishOrder: 'Sim, finalizar pedido',
  areYouSure: 'Você tem certeza?',
  thisProductHasNoSimilars: 'Este produto não tem similares',
  seeSimilars: 'Ver Similares',
  sendOrder: 'Enviar pedido',
  pickUpAtTheCounter: 'Retirar no Balcão',
  pleaseSelectADueDate: 'Por favor, selecione uma data de vencimento',
  searchVehicleByLicensePlate: 'Buscar veículo por placa',
  finishOrder: 'Finalizar Pedido',
  paymentForm: 'Forma de Pagamento',
  dueDate: 'Data de Vencimento',
  finishPayment: 'Finalizar Pagamento',
  printedNameOnCard: 'Nome Impresso no Cartão',
  cardNumber: 'Número do Cartão',
  copyQRCode: 'Copiar código do QR Code',
  addCredit: 'Adicionar crédito',
  activeCredit: 'Crédito Ativo',
  usedCredit: 'Crédito utilizado',
  creditCard: 'Cartão de crédito',
  itemAddedToOrderSuccessfully: 'Item adicionado ao pedido com sucesso!',
  clickHereToChangeYourSearchOptions:
    'Clique aqui para alterar suas opções de busca',
  changeSearch: 'Mudar busca',
  sendedOrders: 'Pedidos Enviados',
  allResultsWereShown: 'Todos os resultados foram exibidos',
  showingEntries: 'Mostrando {from} a {to} de {total} entradas.',
  quantityUnavailable: 'Quantidade indisponível',
  generalSearch: 'Pesquisa geral',
  positionSideExt: 'Posição/Lado/Ext',
  filtersByBrand: 'Filtros por marca',
  areYouAClient: 'Você é um cliente?',
  proceedToClientLogin: 'Prosseguir para o login de cliente',
  goToLoginPage: 'Ir para a página de login',
  chooseLogoImage: 'Escolher a imagem do logotipo',
  chooseLoginLogoImage: 'Escolher a imagem do logotipo de login',
  chooseLoginBackgroundImage: 'Escolher a imagem de fundo de login',
  enterUsersPageTitle: 'Digite o título da página do usuário',
  chooseFavicon: 'Escolher um favicon',
  themeColor: 'Cor do tema',
  saveChanges: 'Salvar alterações',
  previewLoginPage: 'Visualizar página de login',
  noResultsFound: 'Nenhum resultado encontrado',
  addToOrder: 'Adicionar ao pedido',
  qtdItem: 'Qtd. Item',
  qtdUnit: 'Qtd. unit',
  finishedOrders: 'Pedidos finalizados',
  trySearchingProductByFillingFields:
    'Tente pesquisar por um produto preenchendo os campos.',
  noProductsFound: 'Nenhum produto encontrado!',
  settings: {
    success: 'Suas configurações foram salvas com sucesso.',
  },
  sessionExpired: {
    title: 'Sessão expirada',
    description:
      'Sua sessão expirou devido à inatividade. Por favor, faça login novamente para continuar usando o serviço.',
  },
};

const validation: LocaleSchema['validation'] = {
  email: {
    required: 'Informe seu e-mail',
    invalid: 'E-mail inválido',
    incorrect: 'E-mail incorreto',
  },
  password: {
    required: 'Informe sua senha',
    incorrect: 'Senha incorreta',
  },
  title: {
    required: 'Por favor, forneça um título para a página',
  },
  plate: {
    invalid: 'Placa de veículo inválida',
  },
  paymentForm: {
    required: 'Por favor, escolha um método de pagamento',
  },
  dueDate: {
    required: 'Por favor, escolha um vencimento',
  },
  carrier: {
    required: 'Por favor, escolha uma transportadora',
  },
};

const serverError: LocaleSchema['serverError'] = {
  unavailable: 'Acesso indisponível no momento.',
  unauthorized: 'Acesso negado: Usuário não autorizado',
  notFound: 'Nenhum resultado encontrado.',
};

const pt: LocaleSchema = {
  back: 'Voltar',
  plate: 'Placa',
  summary: 'Resumo',
  carrier: 'Transportadora',
  devolution: 'Devolução',
  details: 'Detalhes',
  email: 'E-mail',
  password: 'Senha',
  login: 'Entrar',
  search: 'Pesquisar',
  brand: 'Marca',
  reference: 'Referência',
  application: 'Aplicação',
  goal: 'Meta',
  purchases: 'Compras',
  orders: 'Pedidos',
  promotions: 'Promoções',
  financial: 'Financeiro',
  guarantee: 'Garantia',
  freight: 'Frete',
  items: 'Itens',
  parcel: 'Parcela',
  payment: 'Pagamento',
  bank: 'Banco',
  emission: 'Emissão',
  dueDate: 'Vencimento',
  value: 'Valor',
  logout: 'Sair',
  unitary: 'Unitário',
  total: 'Total',
  quantity: 'Quantidade',
  original: 'Original',
  positionPrefix: 'P',
  sidePrefix: 'S',
  position: 'Posição',
  side: 'Lado',
  extremity: 'Extremidade',
  similars: 'Similares',
  similar: 'Similar',
  apply: 'Aplicar',
  administration: 'Administração',
  buy: 'Comprar',
  number: 'Número',
  date: 'Data',
  subDescription: 'Subdescrição',
  old: 'Antigo',
  promotion: 'Promoção',
  sell: 'Vender',
  type: 'Tipo',
  actions: 'Ações',
  manufacturer: 'Fabricante',
  unavailable: 'Indisponível',
  clear: 'Limpar',
  sended: 'Enviado',
  invoice: 'Nota',
  status: 'Status',
  send: 'Enviar',
  filters: 'Filtros',
  utilized: 'Utilizado',
  available: 'Disponível',
  credit: 'Crédito',
  origin: 'Origem',
  form: 'Forma',
  period: 'Período',
  year: 'Ano',
  month: 'Mês',
  messages,
  validation,
  serverError,
};

export default pt;
