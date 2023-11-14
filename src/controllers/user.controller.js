// users.controller.js

const User = require("../dao/mongo/models/user.model.js");
const nodemailer = require("nodemailer");

const getUsers = async (req, res) => {
  try {
    const users = await User.find({}, { first_name: 1, last_name: 1 });
    res.render("user-view", { users });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener usuarios." });
  }
};

const cleanInactiveUsers = async (req, res) => {
  try {
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
    const inactiveUsers = await User.find({
      lastActivity: { $lt: twoDaysAgo },
    });

    await User.deleteMany({
      _id: { $in: inactiveUsers.map((user) => user._id) },
    });

    for (const user of inactiveUsers) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const mailOptions = {
        from: "tucorreo@gmail.com",
        to: user.email,
        subject: "Cuenta eliminada",
        text: "Tu cuenta ha sido eliminada debido a inactividad.",
      };

      await transporter.sendMail(mailOptions);

      console.log(`Correo enviado a ${user.email}`);
    }

    res
      .status(200)
      .json({ message: "Usuarios inactivos eliminados y correos enviados." });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar usuarios inactivos." });
  }
};

module.exports = { getUsers, cleanInactiveUsers };
