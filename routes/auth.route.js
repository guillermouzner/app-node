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

router.get("/register", registerForm);
router.post("/register", bodyRegisterValidator, registerUser);

router.get("/confirmar/:token", confirmarCuenta);

router.get("/login", loginForm);
router.post("/login", bodyLoginValidator, loginUser);

router.get("/logout", cerrarSesion);
export default router;
