import { User } from "../models/User.js";
import { nanoid } from "nanoid";
import { validationResult } from "express-validator";
// import nodemailer from "nodemailer";

export const registerForm = (req, res) => {
    /* get("/register")
    renderiza vista register
    */
    res.render("register");
};

export const registerUser = async (req, res) => {
    /* 
    post("/register")
    Verifica que pase las validaciones de los campos del formulario register
    Si pasa las validaciones crea un nuevo usuario y envia un mail
    para validar cuenta y poder ingresar
    */
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

        // enviar correo electronico //
        /*
        const transport = nodemailer.createTransport({
            host: "smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: process.env.USEREMAIL,
                pass: process.env.PASSEMAIL,
            },
        });
        await transport.sendMail({
            from: '"Fred Foo 👻" <foo@example.com>', // nuestro mail
            to: newUser.email, // a quien lo estamos enviando
            subject: "Verifica tu cuenta de correo", // Subject line
            html: `<a href="${process.env.PATHHEROKU || 'http://localhost:3000' }/auth/confirmar/${newUser.tokenConfirm}">Confirma tu correo haciendo click aqui</a>`, // html body
        });
        */
        req.flash("mensajes", [
            { msg: "confirma tu correo electronico para ingresar" },
        ]);

        // link que se manda por mail para la confirmacion de cuenta
        req.flash("mensajes", [
            {
                msg: `${
                    process.env.PATHHEROKU || "http://localhost:3000/"
                }auth/confirmar/${newUser.tokenConfirm}`,
            },
        ]);

        res.redirect("/auth/login");
    } catch (error) {
        req.flash("mensajes", [{ msg: error.message }]);
        return res.redirect("/auth/register");
    }
};

export const confirmarCuenta = async (req, res) => {
    /* 
    get("/confirmar/:token")
    Ruta para validar cuenta
    */
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

export const loginForm = (_req, res) => {
    /* 
    get("/login") 
    renderiza vista login
    */
    res.render("login");
};

export const loginUser = async (req, res) => {
    /* 
    post("/login")
    Verifica que pase las validaciones de los campos del formulario login
    Si pasa las validaciones comprueba que la cuenta exista y que esté validada

    Crea una sesion a travez de passport y redirije a vista home
    */
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

// export const cerrarSesion1 = (req, res) => {
//     req.logout();
//     return res.redirect("/auth/login");
// };

export const cerrarSesion = (req, res) => {
    /* 
    get("/logout")
    se cierra la sesion
    */
    req.logout((err) => {
        if (err) return next(err);
        res.redirect("/auth/login");
    });
};
