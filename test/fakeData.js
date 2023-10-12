import { faker } from "@faker-js/faker";

import { productModel } from "../src/dao/mongo/models/product.model.js";

async function createFakeProduct() {
  const fakeProductData = {
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    code: faker.string.uuid(),
    price: faker.commerce.price(),
    stock: faker.number.int({ min: 0, max: 100 }),
    category: faker.commerce.product(),
  };

  const fakeProduct = new productModel(fakeProductData); // Crea un nuevo producto utilizando el modelo

  try {
    await fakeProduct.save(); // Guarda el producto en la base de datos de prueba
    return fakeProduct; // Devuelve el objeto del producto creado
  } catch (error) {
    throw error; // Maneja cualquier error que pueda ocurrir al guardar el producto
  }
}

export { createFakeProduct };
