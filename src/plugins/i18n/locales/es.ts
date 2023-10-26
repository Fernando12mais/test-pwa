import { LocaleSchema } from './locale.type';

const messages: LocaleSchema['messages'] = {
  errorPromotionExpired:
    'Error. Promoción expirada para los artículos anteriores. Puedes eliminarlos para continuar con la finalización del pedido.',
  errorWhenFinishingOrder: 'Error al finalizar el pedido',
  insufficientLimit: 'Límite insuficiente',
  errorMissingItemsInStock:
    'Error. Inventario insuficiente para los artículos anteriores. Puedes eliminarlos para continuar con la finalización del pedido.',
  installB2B: 'Instalar B2B',
  changeTheme: 'Cambiar tema',
  changeLanguage: 'Cambiar idioma',
  yesFinishOrder: 'Sí, finalizar pedido',
  areYouSure: '¿Estás seguro?',
  thisProductHasNoSimilars: 'Este producto no tiene similares',
  seeSimilars: 'Ver Similares',
  sendOrder: 'Enviar pedido',
  pickUpAtTheCounter: 'Recoger en el mostrador',
  pleaseSelectADueDate: 'Por favor, seleccione una fecha de vencimiento',
  searchVehicleByLicensePlate: 'Buscar vehículo por matrícula',
  finishOrder: 'Finalizar Pedido',
  paymentForm: 'Forma de Pago',
  dueDate: 'Fecha de Vencimiento',
  finishPayment: 'Finalizar Pago',
  printedNameOnCard: 'Nombre Impreso en la Tarjeta',
  cardNumber: 'Número de Tarjeta',
  copyQRCode: 'Copiar código del código QR',
  addCredit: 'Agregar crédito',
  activeCredit: 'Crédito Activo',
  usedCredit: 'Crédito utilizado',
  creditCard: 'Tarjeta de crédito',
  itemAddedToOrderSuccessfully: 'Elemento añadido al pedido con éxito!',
  clickHereToChangeYourSearchOptions:
    'Haga clic aquí para cambiar sus opciones de búsqueda',
  changeSearch: 'Cambiar búsqueda',
  sendedOrders: 'Pedidos Enviados',
  allResultsWereShown: 'Se mostraron todos los resultados',
  showingEntries: 'Mostrando {from} a {to} de {total} entradas.',
  quantityUnavailable: 'Cantidad no disponible',
  generalSearch: 'Búsqueda general',
  positionSideExt: 'Posición/Lado/Ext',
  filtersByBrand: 'Filtros por marca',
  areYouAClient: '¿Eres un cliente?',
  proceedToClientLogin: 'Continuar al inicio de sesión para clientes',
  goToLoginPage: 'Ir a la página de inicio de sesión',
  chooseLogoImage: 'Elegir imagen de logotipo',
  chooseLoginLogoImage: 'Elegir imagen de logotipo de inicio de sesión',
  chooseLoginBackgroundImage: 'Elegir imagen de fondo de inicio de sesión',
  enterUsersPageTitle: 'Ingrese el título de la página de usuario',
  chooseFavicon: 'Elegir un favicon',
  themeColor: 'Color del tema',
  saveChanges: 'Guardar cambios',
  previewLoginPage: 'Vista previa de la página de inicio de sesión',
  noResultsFound: 'No se encontraron resultados',
  addToOrder: 'Agregar al pedido',
  qtdItem: 'Cant. Item',
  qtdUnit: 'Cant. unidad',
  finishedOrders: 'Pedidos finalizados',
  trySearchingProductByFillingFields:
    'Intente buscar un producto completando los campos.',
  noProductsFound: 'No se encontraron productos!',
  settings: {
    success: 'Tus configuraciones se han guardado exitosamente.',
  },
  sessionExpired: {
    title: 'Sesión expirada',
    description:
      'Tu sesión ha expirado debido a la inactividad. Por favor, inicia sesión nuevamente para continuar utilizando el servicio.',
  },
};

const validation: LocaleSchema['validation'] = {
  email: {
    required: 'Proporciona tu correo electrónico',
    invalid: 'Correo electrónico inválido',
    incorrect: 'Correo electrónico incorrecto',
  },
  password: {
    required: 'Proporciona tu contraseña',
    incorrect: 'Contraseña incorrecta',
  },
  title: {
    required: 'Por favor, proporciona un título de página',
  },
  plate: {
    invalid: 'Matrícula de vehículo no válida',
  },
  paymentForm: {
    required: 'Por favor, elija un método de pago',
  },
  dueDate: {
    required: 'Por favor, elija un vencimiento',
  },
  carrier: {
    required: 'Por favor, elija una transportadora',
  },
};

const serverError: LocaleSchema['serverError'] = {
  unavailable: 'Acceso no disponible en este momento.',
  unauthorized: 'Acceso denegado: Usuario no autorizado',
  notFound: 'No se encontraron resultados.',
};

const es: LocaleSchema = {
  back: 'Regresar',
  summary: 'Resumen',
  plate: 'Placa',
  carrier: 'Transportista',
  devolution: 'Devolución',
  details: 'Detalles',
  utilized: 'Utilizado',
  available: 'Disponible',
  email: 'Correo electrónico',
  password: 'Contraseña',
  login: 'Iniciar sesión',
  search: 'Buscar',
  brand: 'Marca',
  reference: 'Referencia',
  application: 'Aplicación',
  goal: 'Meta',
  purchases: 'Compras',
  orders: 'Pedidos',
  promotions: 'Promociones',
  logout: 'Cerrar sesión',
  unitary: 'Unitario',
  total: 'Total',
  quantity: 'Cantidad',
  original: 'Original',
  positionPrefix: 'P',
  sidePrefix: 'S',
  position: 'Posición',
  side: 'Lado',
  extremity: 'Extremidad',
  similars: 'Similares',
  similar: 'Similar',
  apply: 'Aplicar',
  administration: 'Administración',
  buy: 'Comprar',
  number: 'Número',
  date: 'Fecha',
  subDescription: 'Subdescripción',
  old: 'Antiguo',
  promotion: 'Promoción',
  financial: 'Financiero',
  guarantee: 'Garantía',
  freight: 'Flete',
  items: 'Elementos',
  parcel: 'Parte',
  payment: 'Pago',
  bank: 'Banco',
  emission: 'Emisión',
  dueDate: 'Vencimiento',
  value: 'Valor',
  sell: 'Vender',
  type: 'Tipo',
  actions: 'Opciones',
  manufacturer: 'Fabricante',
  unavailable: 'No disponible',
  clear: 'Limpar',
  sended: 'Enviado',
  invoice: 'Nota',
  status: 'Estado',
  send: 'Enviar',
  filters: 'Filtros',
  credit: 'Crédito',
  origin: 'Origen',
  form: 'Forma',
  period: 'Período',
  year: 'Año',
  month: 'Mes',

  messages: messages,
  validation: validation,
  serverError: serverError,
};

export default es;
