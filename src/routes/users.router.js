// user.router.js

import { Router } from "express";
import User from "../dao/mongo/models/user.model.js";
import roleAuth from "../middlewares/role.middleware.js";
import nodemailer from "nodemailer";

require("dotenv").config();

const router = Router();

// Ruta para obtener todos los usuarios
router.get("/", roleAuth(["admin"]), async (req, res) => {
  try {
    const users = await User.find(
      {},
      { first_name: 1, last_name: 1, email: 1, role: 1 }
    );
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener usuarios." });
  }
});

router.post("/view", roleAuth(["admin"]), async (req, res) => {
  try {
    const selectedUserId = req.body.userId;
    const selectedUser = await User.findById(selectedUserId);

    // Renderiza la vista aquí (utilizando res.render si estás usando un motor de plantillas)
    res.render("user-view", { users: [], selectedUser });
  } catch (error) {
    res.status(500).json({ error: "Error al procesar la solicitud." });
  }
});

// Ruta para limpiar usuarios inactivos
router.delete(
  "/clean-inactive",
  roleAuth(["admin", "premium"]),
  async (req, res) => {
    try {
      // Identificar usuarios inactivos (ejemplo: último acceso hace más de 2 días)
      const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000); // Hace 2 días
      const inactiveUsers = await User.find({
        lastActivity: { $lt: twoDaysAgo },
      });

      // Eliminar a los usuarios inactivos
      await User.deleteMany({
        _id: { $in: inactiveUsers.map((user) => user._id) },
      });

      for (const user of inactiveUsers) {
        try {
          const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: process.env.EMAIL,
              pass: process.env.EMAIL_PASSWORD,
            },
          });

          // Opciones del correo electrónico
          const mailOptions = {
            from: process.env.EMAIL,
            to: user.email,
            subject: "Cuenta eliminada",
            text: "Tu cuenta ha sido eliminada debido a inactividad.",
          };

          // Enviar el correo electrónico
          await transporter.sendMail(mailOptions);

          console.log(`Correo enviado a ${user.email}`);
        } catch (error) {
          console.error(
            `Error al enviar correo a ${user.email}: ${error.message}`
          );
        }
      }

      res
        .status(200)
        .json({ message: "Usuarios inactivos eliminados y correos enviados." });
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar usuarios inactivos." });
    }
  }
);

export default router;
