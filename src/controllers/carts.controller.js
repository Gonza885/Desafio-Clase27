// En controllers/cart.controller.js
import * as cartService from "../services/cart.service.js";

export const getCarts = async (req, res) => {
  try {
    const result = await cartService.getCarts();
    return res.status(200).json({ status: "success", payload: result });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const getCartById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await cartService.getCartById(id);

    if (!result) {
      return res.status(400).send(`There's no cart with ID ${id}`);
    }

    return res.status(200).json({ status: "success", payload: result });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const createCart = async (req, res) => {
  try {
    const result = await cartService.createCart();
    return res.status(200).json({ status: "success", payload: result });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const addProductToCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const result = await cartService.addProductToCart(cid, pid);
    return res.status(200).json({ status: "success", payload: result });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const updateCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const newCart = req.body;
    const result = await cartService.updateCart(cid, newCart);
    return res.status(200).json({ status: "success", payload: result });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const updateProductInCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const newQuantity = req.body.quantity;
    const result = await cartService.updateProductInCart(cid, pid, newQuantity);
    return res.status(200).json({ status: "success", payload: result });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const deleteCart = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await cartService.deleteCart(id);
    return res.status(200).json({ status: "success", payload: result });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const deleteProductFromCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const result = await cartService.deleteProductFromCart(cid, pid);
    return res.status(200).json({ status: "success", payload: result });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
