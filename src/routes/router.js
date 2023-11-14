import views from "./views.router.js";
import sessions from "./sessions.router.js";
import products from "./products.router.js";
import cartsRouter from "./carts.router.js";
import tests from "./tests.router.js";

const router = (app) => {
  app.use("/", views);
  app.use("/api/sessions", sessions);
  app.use("/api/products", products);
  app.use("/carts", cartsRouter);
  app.use("/api/tests", tests);
};

export default router;
