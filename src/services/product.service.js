import { productModel } from "../dao/models/product.model.js";

export const getAllProducts = async () => {
  try {
    return await productModel.find();
  } catch (err) {
    throw err;
  }
};

export const getProductById = async (id) => {
  try {
    return await productModel.findById(id);
  } catch (err) {
    throw err;
  }
};

export const createProduct = async (productData) => {
  try {
    const { title, description, code, price, stock, category } = productData;

    const result = await productModel.create({
      title,
      description,
      code: code.replace(/\s/g, "").toLowerCase(),
      price,
      stock,
      category: category.toLowerCase(),
    });

    return result;
  } catch (err) {
    throw err;
  }
};

export const updateProduct = async (productId, productData) => {
  try {
    const { title, description, code, price, stock, category } = productData;

    const existProduct = await productModel.findById(productId);

    if (!existProduct) {
      throw new Error(`There's no product with ID ${productId}`);
    }

    const updatedProduct = {
      title,
      description,
      code: code.replace(/\s/g, "").toLowerCase(),
      price,
      stock,
      category: category.toLowerCase(),
    };

    await productModel.updateOne({ _id: productId }, updatedProduct);

    return await productModel.findById(productId);
  } catch (err) {
    throw err;
  }
};

export const deleteProduct = async (productId) => {
  try {
    await productModel.deleteOne({ _id: productId });
    return await productModel.find();
  } catch (err) {
    throw err;
  }
};
