import { Url } from "../models/Url.js";
import { nanoid } from "nanoid";

export const leerUrls = async (req, res) => {
    try {
        const urls = await Url.find({ user: req.user.id }).lean();
        res.render("home", { urls });
    } catch (error) {
        req.flash("mensajes", [{ msg: error.message }]);
        return res.redirect("/");
    }
};

export const agregarUrl = async (req, res) => {
    let { originalLink } = req.body;
    if (!originalLink.startsWith("https://")) {
        originalLink = "https://" + originalLink;
    }
    try {
        const url = new Url({
            originalLink: originalLink,
            shortUrl: nanoid(6),
            user: req.user.id,
        });
        await url.save();
        req.flash("mensajes", [{ msg: "Url Agregada con exito" }]);
        res.redirect("/");
    } catch (error) {
        req.flash("mensajes", [{ msg: "algo anda mal" }]);
        return res.redirect("/");
    }
};

export const eliminarUrl = async (req, res) => {
    const { id } = req.params;
    try {
        const url = await Url.findById(id);
        if (!url.user.equals(req.user.id))
            throw new Error("No se puede eliminar esta URL");

        await url.remove();

        req.flash("mensajes", [{ msg: "URL eliminada con exito" }]);

        res.redirect("/");
    } catch (error) {
        req.flash("mensajes", [{ msg: error.message }]);
        return res.redirect("/");
    }
};

export const editarUrl = async (req, res) => {
    const { id } = req.params;
    try {
        const url = await Url.findById(id).lean();
        if (!url.user.equals(req.user.id))
            throw new Error("No se puede editar esta URL");

        res.render("home", { url: url });
    } catch (error) {
        req.flash("mensajes", [{ msg: error.message }]);
        return res.redirect("/");
    }
};

export const editarUrlForm = async (req, res) => {
    const { id } = req.params;
    let { originalLink } = req.body;
    if (!originalLink.startsWith("https://")) {
        originalLink = "https://" + originalLink;
    }

    try {
        const url = await Url.findById(id);
        if (!url.user.equals(req.user.id))
            throw new Error("No se puede editar esta URL");

        await url.updateOne({ originalLink });

        req.flash("mensajes", [{ msg: "Url editada" }]);

        res.redirect("/");
    } catch (error) {
        req.flash("mensajes", [{ msg: "algo fallo intente nuevamente" }]);
        return res.redirect("/");
    }
};

export const redireccion = async (req, res) => {
    const { shortUrl } = req.params;
    try {
        const url = await Url.findOne({ shortUrl });
        res.redirect(url.originalLink);
    } catch (error) {
        res.send("algo salio mal");
    }
};
