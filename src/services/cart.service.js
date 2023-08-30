import { cartModel } from "../dao/models/cart.model.js";
import { productModel } from "../dao/models/product.model.js";

export const getCarts = async () => {
  try {
    return await cartModel.find();
  } catch (err) {
    throw err;
  }
};

export const getCartById = async (id) => {
  try {
    return await cartModel.findById(id).populate("products._id");
  } catch (err) {
    throw err;
  }
};

export const createCart = async () => {
  try {
    return await cartModel.create({
      products: [],
    });
  } catch (err) {
    throw err;
  }
};

export const addProductToCart = async (cartId, productId) => {
  try {
    const newProduct = await productModel.findById(productId);
    const cart = await cartModel.findById(cartId);

    const productInCart = cart.products.find(
      (product) => product._id.toString() === newProduct.id
    );

    if (!productInCart) {
      const create = {
        $push: { products: { _id: newProduct.id, quantity: 1 } },
      };
      await cartModel.findByIdAndUpdate({ _id: cartId }, create);
    } else {
      await cartModel.findByIdAndUpdate(
        { _id: cartId },
        { $inc: { "products.$[elem].quantity": 1 } },
        { arrayFilters: [{ "elem._id": newProduct.id }] }
      );
    }

    return await cartModel.findById(cartId).populate("products._id");
  } catch (err) {
    throw err;
  }
};

export const updateCart = async (cartId, products) => {
  try {
    const cart = await cartModel.findById(cartId);

    for (const product of products) {
      if (product.quantity < 1) {
        product.quantity = 1;
      }

      const existProduct = await productModel.findById(product._id);
      if (existProduct && existProduct.stock >= product.quantity) {
        const productInCart = cart.products.find((productInCart) =>
          productInCart._id.equals(existProduct._id)
        );

        if (!productInCart) {
          const create = {
            $push: {
              products: { _id: existProduct._id, quantity: product.quantity },
            },
          };
          await cartModel.findByIdAndUpdate({ _id: cartId }, create);
        } else {
          await cartModel.findByIdAndUpdate(
            { _id: cartId },
            { $set: { "products.$[elem].quantity": product.quantity } },
            { arrayFilters: [{ "elem._id": existProduct._id }] }
          );
        }
      }
    }

    return await cartModel.findById(cartId).populate("products._id");
  } catch (err) {
    throw err;
  }
};

export const deleteCart = async (cartId) => {
  try {
    await cartModel.findByIdAndUpdate(cartId, { products: [] });
    return await cartModel.find();
  } catch (err) {
    throw err;
  }
};

export const deleteProductFromCart = async (cartId, productId) => {
  try {
    await cartModel.findByIdAndUpdate(cartId, {
      $pull: { products: { _id: productId } },
    });
    return await cartModel.find();
  } catch (err) {
    throw err;
  }
};
