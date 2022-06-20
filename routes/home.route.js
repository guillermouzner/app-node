import { Router } from "express";
import {
    leerUrls,
    agregarUrl,
    eliminarUrl,
    editarUrlForm,
    editarUrl,
    redireccion,
} from "../controllers/home.controller.js";
import { validarUrl } from "../middlewares/urlValidator.js";
import { verificarUser } from "../middlewares/userValidator.js";

import {
    formPerfil,
    editarFotoPerfil,
} from "../controllers/perfil.controller.js";

const router = Router();

router.get("/", verificarUser, leerUrls);
router.post("/", verificarUser, validarUrl, agregarUrl);
router.get("/eliminar/:id", verificarUser, eliminarUrl);

router.get("/editar/:id", verificarUser, editarUrl);
router.post("/editar/:id", verificarUser, validarUrl, editarUrlForm);

router.get("/perfil", verificarUser, formPerfil);
router.post("/perfil", verificarUser, editarFotoPerfil);

router.get("/:shortUrl", redireccion);
export default router;
