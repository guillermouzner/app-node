import { User } from "../models/User.js";
import { nanoid } from "nanoid";
import { validationResult } from "express-validator";

export const registerForm = (req, res) => {
    res.render("register", { mensajes: req.flash("mensajes") });
};

export const registerUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash("mensajes", errors.array());
        return res.redirect("/auth/register");
    }
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
        req.flash("mensajes", [
            { msg: "confirma tu correo electronico para ingresar" },
        ]);
        res.redirect("/auth/login");
    } catch (error) {
        req.flash("mensajes", [{ msg: error.message }]);
        return res.redirect("/auth/register");
        // return res.status(400).json(error.message);
        // res.redirect("/auth/register");
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
        req.flash("mensajes", [
            { msg: "Cuenta verificada, puedes iniciar sesión." },
        ]);
        return res.redirect("/auth/login");
    } catch (error) {
        console.log(error);
    }
};

export const loginForm = (req, res) => {
    res.render("login", { mensajes: req.flash("mensajes") });
};

export const loginUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash("mensajes", errors.array());
        return res.redirect("/auth/login");
    }
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) throw new Error("No existe una cuenta con email ingresado");

        if (!user.cuentaConfirmada)
            throw new Error("Falta confirmar su cuenta");

        const userPassword = await user.comparePassword(password);
        if (!userPassword)
            return res.status(403).json({ error: "Constraseña incorrecta" });

        // esto me crea la sesion a travez de passport
        req.login(user, function (err) {
            if (err) throw new Error("Error al crear sesion");
            return res.redirect("/");
        });
    } catch (error) {
        req.flash("mensajes", [{ msg: error.message }]);
        return res.redirect("/auth/login");
    }
};

export const cerrarSesion1 = (req, res) => {
    req.logout();
    return res.redirect("/auth/login");
};

export const cerrarSesion = (req, res) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect("/auth/login");
    });
};
