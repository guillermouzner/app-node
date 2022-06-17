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

const router = Router();

router.get("/", leerUrls);
router.post("/", validarUrl, agregarUrl);
router.get("/eliminar/:id", eliminarUrl);

router.get("/editar/:id", editarUrl);
router.post("/editar/:id", validarUrl, editarUrlForm);

router.get("/:shortUrl", redireccion);
export default router;
