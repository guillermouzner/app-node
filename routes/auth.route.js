import { Router } from "express";
import {
    registerForm,
    registerUser,
    confirmarCuenta,
    loginForm,
    loginUser,
    cerrarSesion,
} from "../controllers/auth.controllers.js";
import {
    bodyRegisterValidator,
    bodyLoginValidator,
} from "../middlewares/validatorManager.js";

const router = Router();

// Registro de usuario
router.get("/register", registerForm);
router.post("/register", bodyRegisterValidator, registerUser);

// Confirmacion de cuenta
router.get("/confirmar/:token", confirmarCuenta);

// Login
router.get("/login", loginForm);
router.post("/login", bodyLoginValidator, loginUser);

// Logout
router.get("/logout", cerrarSesion);

export default router;
