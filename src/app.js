import express from "express";
import session from "express-session";
import handlebars from "express-handlebars";
import compression from "express-compression";
import MongoStore from "connect-mongo";
import passport from "passport";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
import __dirname from "./directory.js";
import router from "./routes/router.js";
import setupSocket from "./utils/socket.utils.js";
import config from "./config/enviroment.config.js";
import initializePassport from "./config/passport.config.js";
import logger from "./utils/logger.util.js";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";
import cartsRouter from "./routes/carts.router.js";
import exphbs from "express-handlebars";
import * as helpers from "./utils/functions.utils.js";
import path from "path";

const mongoUrl = config.MONGO_URL;
const mongoSessionSecret = config.MONGO_URL;
const cookieSecret = config.COOKIE_SECRET;
const PORT = config.PORT;
const HOST = config.HOST;

const swaggerOptions = {
  definition: {
    openaip: "1.0.0",
    info: {
      title: "API documentation",
      version: "1.0.0",
      description:
        "Backend server in charge of managing: Products, Carts, Users (divided into User, Premium and Admin roles), Messages, Sessions, Tickets and Views. It is designed to provide a robust and secure service that allows customers to interact efficiently and securely with our platform. Technologies Used: Javascript, HTML, CSS, Mongo, Mongoose, Faker, Bcrypt, Dotenv, Cors, Cookie-parser, Express, Handlebars, Morgan, Nodemailer, Nodemon, Passport, Socket, Swagger, Twilio, Winston, among others.",
    },
  },
  apis: [`${__dirname}/docs/*.yaml`],
};
const specs = swaggerJSDoc(swaggerOptions);

const app = express();
initializePassport();

app.use(
  session({
    store: MongoStore.create({ mongoUrl }),
    secret: mongoSessionSecret,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(
  compression({
    brotli: {
      enable: true,
      zlib: {},
    },
  })
);

// Ruta para renderizar la vista del carrito
app.get("/cart", async (req, res) => {
  try {
    // Aquí deberías obtener los datos del carrito (cartData) desde tu lógica o base de datos
    const cartData = {}; // Reemplaza esto con tu lógica para obtener los datos del carrito
    res.render("cart", { cart: cartData }); // Renderiza la vista del carrito con los datos obtenidos
  } catch (error) {
    res.status(500).send("Error al renderizar la vista del carrito");
  }
});

app.post("/add-to-cart", async (req, res) => {
  try {
    const productId = req.body.productId; // Obtener el ID del producto desde la solicitud

    // Lógica para agregar el producto al carrito utilizando la función addToCart del controlador
    const cartData = await addToCart(productId); // Llama a la función y pasa el productId

    // Si la adición al carrito fue exitosa, renderiza la vista del carrito con los productos actualizados
    res.render("cart", { cart: cartData }); // Renderiza la vista del carrito con los datos obtenidos
  } catch (error) {
    res.status(500).send("Error al agregar producto al carrito");
  }
});

app.get("/user-view", (req, res) => {
  // Aquí renderizas la vista que mostraste anteriormente
  res.render("user-view"); // Asegúrate de tener la plantilla 'user-view.handlebars' en tu directorio de vistas
});

app.post("/api/users/view", async (req, res) => {
  const { userId, userRole, action } = req.body;

  // Lógica para actualizar el rol del usuario según el 'userId' y el 'userRole'
  // Reemplaza la lógica con tu propia función para actualizar el rol del usuario

  // Ejemplo de lógica usando una función 'updateUserRole' (debes implementarla)
  try {
    await updateUserRole(userId, userRole); // Esta función actualiza el rol del usuario
    res.redirect("/user-view"); // Redirecciona después de la actualización
  } catch (error) {
    res.status(500).send("Error al actualizar el rol del usuario");
  }
});

app.use(passport.initialize());
app.use(passport.session());
app.engine(
  "handlebars",
  exphbs.engine({
    helpers: helpers,
    defaultLayout: "main",
  })
);

app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(cookieSecret));
app.use(morgan("dev"));
app.use(cors());
app.use("/docs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));
app.use("/carts", cartsRouter);

const httpServer = app.listen(PORT, HOST, () => {
  logger.info(`Server up on http://${HOST}:${PORT}`);
});
setupSocket(httpServer);

router(app);

export default app;
