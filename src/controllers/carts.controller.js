import { cartsRepository } from "../repositories/repository.js";
import { productModel } from "../dao/mongo/models/product.model.js";
import Cart from "../dao/mongo/models/cart.model.js";

export const addToCart = async (req, res) => {
  const { productId } = req.body;

  try {
    const productToAdd = await Product.findById(productId);

    if (!productToAdd) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Encontrar o crear el carrito del usuario (cambiar el criterio de búsqueda según tu modelo de datos)
    let cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      cart = await Cart.create({ userId: req.user.id, products: [] });
    }

    // Verificar si el producto ya está en el carrito, si lo está, aumentar la cantidad
    const existingProductIndex = cart.products.findIndex(
      (p) => p.productId.toString() === productId
    );

    if (existingProductIndex !== -1) {
      cart.products[existingProductIndex].quantity += 1;
    } else {
      // Si no está en el carrito, añadirlo con cantidad 1
      cart.products.push({ productId, quantity: 1 });
    }

    await cart.save(); // Guardar los cambios en el carrito

    // Obtener todos los productos en el carrito para calcular los totales (si es necesario)
    const productsInCart = await Product.find({
      _id: { $in: cart.products.map((p) => p.productId) },
    });

    // Renderizar la vista del carrito con los productos y el total
    res.render("cart", { cartItems: productsInCart });
  } catch (error) {
    res.status(500).json({ error: "Could not add product to cart" });
  }
};

export const carts = async (req, res) => {
  try {
    const payload = await cartsRepository.getCarts();
    if (typeof payload == "string")
      return res.status(404).json({ status: "error", message: payload });
    return res.status(200).json({ status: "success", carts: payload });
  } catch (err) {
    return res.status(500).json({ status: "error", error: err.message });
  }
};

export const cart = async (req, res) => {
  try {
    const { cid } = req.params;
    const payload = await cartsRepository.getCart(cid);
    if (typeof payload == "string")
      return res.status(404).json({ status: "error", message: payload });
    return res.status(200).json({ status: "success", cart: payload });
  } catch (err) {
    return res.status(500).json({ status: "error", error: err.message });
  }
};

export const insertCart = async (req, res) => {
  try {
    const payload = await cartsRepository.createCart();
    if (typeof payload == "string")
      return res.status(404).json({ status: "error", message: payload });
    return res.status(200).json({ status: "success", cart: payload });
  } catch (err) {
    return res.status(500).json({ status: "error", error: err.message });
  }
};

export const insertProduct = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const payload = await cartsRepository.createProduct(req, res, cid, pid);
    if (typeof payload == "string")
      return res.status(404).json({ status: "error", message: payload });
    return res.status(200).json({ status: "success", cart: payload });
  } catch (err) {
    return res.status(500).json({ status: "error", error: err.message });
  }
};

export const editCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const newCart = req.body;
    const payload = await cartsRepository.updateCart(req, res, cid, newCart);
    if (typeof payload == "string")
      return res.status(404).json({ status: "error", message: payload });
    return res.status(200).json({ status: "success", cart: payload });
  } catch (err) {
    return res.status(500).json({ status: "error", error: err.message });
  }
};

export const editProduct = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    const payload = await cartsRepository.updateProduct(cid, pid, quantity);
    if (typeof payload == "string")
      return res.status(404).json({ status: "error", message: payload });
    return res.status(200).json({ status: "success", cart: payload });
  } catch (err) {
    return res.status(500).json({ status: "error", error: err.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const payload = await cartsRepository.deleteCart(cid);
    if (typeof payload == "string")
      return res.status(404).json({ status: "error", message: payload });
    return res.status(200).json({ status: "success", cart: payload });
  } catch (err) {
    return res.status(500).json({ status: "error", error: err.message });
  }
};

export const clearProduct = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const payload = await cartsRepository.deleteProduct(cid, pid);
    if (typeof payload == "string")
      return res.status(404).json({ status: "error", message: payload });
    return res.status(200).json({ status: "success", cart: payload });
  } catch (err) {
    return res.status(500).json({ status: "error", error: err.message });
  }
};

export const purchase = async (req, res) => {
  try {
    const payload = await cartsRepository.purchaseCart(req, res);
    if (typeof payload == "string")
      return res.status(404).json({ status: "error", message: payload });
    return res.status(200).json({ status: "success", cart: payload });
  } catch (err) {
    return res.status(500).json({ status: "error", error: err.message });
  }
};
