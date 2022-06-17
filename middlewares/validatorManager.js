import { body } from "express-validator";

export const bodyRegisterValidator = [
    body("userName", "ingrese un nombre valido").trim().notEmpty().escape(),
    body("email", "formato de email incorrecto")
        .trim()
        .isEmail()
        .normalizeEmail(),
    body("password", "contraseña minimo 6 caracteres")
        .trim()
        .isLength({ min: 6 }),
    body("password", "las contraseñas no coinciden").custom(
        (value, { req }) => {
            if (value !== req.body.repassword)
                throw new Error("Las contraseñas no coinciden");
            return value;
        }
    ),
];

export const bodyLoginValidator = [
    body("email", "formato de email incorrecto")
        .trim()
        .isEmail()
        .normalizeEmail(),
    body("password", "Contraseña incorrecta").trim().isLength({ min: 6 }),
];
