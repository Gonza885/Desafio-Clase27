import { productsRepository } from "../repositories/repository.js";
import { productModel as Product } from "../dao/mongo/models/product.model.js";
import Cart from "../dao/mongo/models/cart.model.js";

export const addToCart = async (req, res) => {
  const { productId } = req.body;

  try {
    const cart = await cartModel.findOneAndUpdate(
      // Encuentra el carrito basado en el usuario o alguna identificación única
      {
        /* criterio de búsqueda para el carrito del usuario */
      },
      { $addToSet: { products: { _id: productId, quantity: 1 } } }, // Añade el producto al carrito
      { new: true, upsert: true }
    );

    // Después de agregar, redirige a la página de carrito o envía una respuesta JSON
    res.redirect("/cart"); // Esto redirigirá a la vista del carrito
  } catch (error) {
    res.status(500).json({ error: "Could not add product to cart" });
  }
};

export const products = async (req, res) => {
  try {
    const payload = await productsRepository.getProducts();
    if (typeof payload == "string")
      return res.status(404).json({ status: "error", message: payload });
    return res.status(200).json({ status: "success", products: payload });
  } catch (err) {
    return res.status(500).json({ status: "error", error: err.message });
  }
};

export const product = async (req, res) => {
  try {
    const { pid } = req.params;
    const payload = await productsRepository.getProduct(pid);
    if (typeof payload == "string")
      return res.status(404).json({ status: "error", message: payload });
    return res.status(200).json({ status: "success", product: payload });
  } catch (err) {
    return res.status(500).json({ status: "error", error: err.message });
  }
};

export const insertProduct = async (req, res) => {
  try {
    const productInfo = req.body;
    const { user } = req.session;
    const newProduct = {
      ...productInfo,
      owner: user.email,
    };
    const payload = await productsRepository.createProduct(newProduct);
    if (typeof payload == "string")
      return res.status(404).json({ status: "error", message: payload });
    return res.status(200).json({ status: "success", product: payload });
  } catch (err) {
    return res.status(500).json({ status: "error", error: err.message });
  }
};

export const editProduct = async (req, res) => {
  try {
    const { pid } = req.params;
    const newProduct = req.body;
    const payload = await productsRepository.updateProduct(pid, newProduct);
    if (typeof payload == "string")
      return res.status(404).json({ status: "error", message: payload });
    return res.status(200).json({ status: "success", product: payload });
  } catch (err) {
    return res.status(500).json({ status: "error", error: err.message });
  }
};

export const eraseProduct = async (req, res) => {
  try {
    const { pid } = req.params;

    // Busca el producto por ID antes de eliminarlo
    const productToDelete = await Product.findById(pid);

    if (!productToDelete) {
      return res
        .status(404)
        .json({ status: "error", message: "Producto no encontrado." });
    }

    // Elimina el producto
    await Product.findByIdAndDelete(pid);

    // Si el producto pertenece a un usuario premium, envía un correo
    if (productToDelete.owner) {
      const owner = await User.findOne({ email: productToDelete.owner });

      if (owner && owner.role === "premium") {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
          },
        });

        const mailOptions = {
          from: process.env.EMAIL,
          to: owner.email,
          subject: "Producto eliminado",
          text: `El producto "${productToDelete.title}" ha sido eliminado de tu cuenta premium.`,
        };

        await transporter.sendMail(mailOptions);

        console.log(`Correo enviado a ${owner.email}`);
      }
    }

    // Obtén y devuelve la lista actualizada de productos después de la eliminación
    const updatedProducts = await productsRepository.getProducts();
    return res
      .status(200)
      .json({ status: "success", products: updatedProducts });
  } catch (err) {
    return res.status(500).json({ status: "error", error: err.message });
  }
};

export const mockingProducts = async (req, res) => {
  try {
    const payload = await productsRepository.generateProducts(req, res);
    if (typeof payload == "string")
      return res.status(404).json({ status: "error", message: payload });
    return res.status(200).json({ status: "success", products: payload });
  } catch (err) {
    return res.status(500).json({ status: "error", error: err.message });
  }
};
