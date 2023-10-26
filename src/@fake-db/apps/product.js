function randomImage(width = 150, height = 150) {
  return `https://via.placeholder.com/${width}x${height}`
}
import mock from "@/@fake-db/mock";
const products = [

  { id: 1,image:  `https://via.placeholder.com/${137}x${137}`, name: 'Pastilha', price: '40', code: 9233 },
  { id: 2,image:  randomImage(137, 137), name: 'Espuma',group:'amortecedor',subgroup: 'dianteiro', price: '40', code: 9233 },
  { id: 3,image:  randomImage(137, 137), name: 'Vela', price: '40', code: 9233 },
  { id: 4,image:  randomImage(137, 137), name: 'Mola', price: '40', code: 9233 },
  { id: 5,image:  randomImage(137, 137), name: 'porta', price: '40', code: 9233 },
  { id: 6,image:  randomImage(137, 137), name: 'cabecote', price: '40', code: 9233 },
  { id: 7,image:  randomImage(137, 137), name: 'trava', price: '40', code: 9233 },
  { id: 8,image:  randomImage(137, 137), name: 'parabrisa', price: '40', code: 9233 },
  ];

// 👉  return users
mock.onGet("/apps/products").reply((config) => {
  const {
    q = "",
    group = null,
    subgroup = null,
    type = null,
    perPage = 5,
    currentPage = 1,
  } = config.params ?? {};
  const queryLower = q.toLowerCase();
  let filteredProducts = products
  
    .filter(
      (product) =>
        (product.name.toLowerCase().includes(queryLower) ||
          product.brand.toLowerCase().includes(queryLower) ||
          product.type.toLocaleLowerCase().includes(queryLower)) &&
        product.group === (group || product.group) &&
        product.subgroup === (subgroup || product.subgroup) &&
        product.type === (type || product.type)
    )
    .reverse();
  const totalPage = Math.ceil(filteredProducts.length / perPage)
    ? Math.ceil(filteredProducts.length / perPage)
    : 1;
  const totalProducts = filteredProducts.length;
  if (perPage) {
    const firstIndex = (currentPage - 1) * perPage;
    const lastIndex = perPage * currentPage;

    filteredProducts = filteredProducts.slice(firstIndex, lastIndex);
  }
  

  return [200, { products: filteredProducts, totalPage, totalProducts }];
  
});
mock.onGet(/\/apps\/products\/\d+/).reply(config => {
  // Get event id from URL
  const productId = config.url?.substring(config.url.lastIndexOf('/') + 1)

  // Convert Id to number
  const Id = Number(productId)
  const productIndex = products.findIndex(e => e.id === Id)
  const product = products[productIndex]

  Object.assign(product, {
    taskDone: 1230,
    projectDone: 568,
    taxId: 'Tax-8894',
    language: 'English',
  })
  if (product)
    return [200, product]
  
  return [404]
})


