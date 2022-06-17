import { User } from "../models/User.js";
import { nanoid } from "nanoid";
export const registerForm = (req, res) => {
    res.render("register");
};

export const registerUser = async (req, res) => {
    const { userName, email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user) throw new Error("Ya existe el usuario con ese email");
        const newUser = new User({
            userName,
            email,
            password,
            tokenConfirm: nanoid(5),
        });

        await newUser.save();

        // enviar correo electronico primero

        res.redirect("/auth/login");
    } catch (error) {
        console.log(error.message);
        res.redirect("/auth/register");
    }
};

export const confirmarCuenta = async (req, res) => {
    const { token } = req.params;
    try {
        const user = await User.findOne({ tokenConfirm: token });
        if (!user) throw new Error("No existe este usuario");

        user.cuentaConfirmada = true;
        user.tokenConfirm = null;

        await user.save();
        res.redirect("/auth/login");
    } catch (error) {
        console.log(error);
    }
};

export const loginForm = (req, res) => {
    res.render("login");
};
export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) throw new Error("No existe una cuenta con email ingresado");

        if (!user.cuentaConfirmada)
            throw new Error("Falta confirmar su cuenta");

        const userPassword = await user.comparePassword(password);
        if (!userPassword)
            return res.status(403).json({ error: "Constraseña incorrecta" });

        res.redirect("/");
    } catch (error) {
        res.send(error.message);
    }
};
