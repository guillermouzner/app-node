import { Router } from "express";
import {
    registerForm,
    registerUser,
    confirmarCuenta,
    loginForm,
    loginUser,
} from "../controllers/auth.controllers.js";

const router = Router();

router.get("/register", registerForm);
router.post("/register", registerUser);

router.get("/confirmar/:token", confirmarCuenta);

router.get("/login", loginForm);
router.post("/login", loginUser);

export default router;
