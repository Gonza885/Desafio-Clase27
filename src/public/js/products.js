import logger from "../../utils/logger.util.js";

const productsForm = document.querySelectorAll(".product-form");

productsForm.forEach((productForm) => {
  productForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const cart = productForm.getAttribute("cart");
    const product = productForm.getAttribute("product");
    fetch(`/api/carts/${cart}/product/${product}`, {
      method: "POST",
    })
      .then((res) => {
        if (res.status !== 200) return;
        alert("Added");
      })
      .catch((err) => logger.error(`Catch error: ${err}`));
  });
});

// Manejador de eventos para agregar productos al carrito
document.querySelectorAll(".product-form").forEach((form) => {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const productId = form.getAttribute("product");

    try {
      const response = await fetch("/add-to-cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      });

      if (response.ok) {
        // Mostrar mensaje de éxito o actualizar la UI
        console.log("Producto agregado al carrito");
      } else {
        // Manejar errores
        console.error("Error al agregar producto al carrito");
      }
    } catch (error) {
      console.error("Error de red:", error);
    }
  });
});
