import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product", // Referencia al modelo de Product
        required: true,
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Referencia al modelo de User, si es aplicable
    required: true,
  },
});

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
