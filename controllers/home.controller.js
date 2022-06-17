import { Url } from "../models/Url.js";
import { nanoid } from "nanoid";

export const leerUrls = async (_req, res) => {
    try {
        const urls = await Url.find().lean();
        res.render("home", { urls });
    } catch (error) {
        console.log(error);
        res.send("Fallo algo");
    }
};

export const agregarUrl = async (req, res) => {
    const { originalLink } = req.body;
    try {
        const url = new Url({
            originalLink: originalLink,
            shortUrl: nanoid(6),
        });
        await url.save();
        res.redirect("/");
    } catch (error) {
        console.log(error.message);
    }
};

export const eliminarUrl = async (req, res) => {
    const { id } = req.params;
    try {
        await Url.findByIdAndDelete(id);
        res.redirect("/");
    } catch (error) {
        console.log(error);
    }
};

export const editarUrl = async (req, res) => {
    const { id } = req.params;
    try {
        const url = await Url.findById(id).lean();
        res.render("home", { url: url });
    } catch (error) {
        res.send("algo fallo");
    }
};

export const editarUrlForm = async (req, res) => {
    const { id } = req.params;
    const { originalLink } = req.body;
    try {
        await Url.findByIdAndUpdate(id, { originalLink });
        res.redirect("/");
    } catch (error) {
        res.send("algo salio mal");
    }
};

export const redireccion = async (req, res) => {
    const { shortUrl } = req.params;
    try {
        const url = await Url.findOne({ shortUrl });
        res.redirect(url.originalLink);
        // console.log(url.originalLink);
    } catch (error) {
        res.send("algo salio mal");
    }
};
