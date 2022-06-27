import { Url } from "../models/Url.js";
import { nanoid } from "nanoid";

export const leerUrls = async (req, res) => {
    /*
    get("/")
    utiliza el req.user que viene del middleware verificarUser para obtener
    las urls que fueron creadas por el usuario activo
    */
    try {
        const urls = await Url.find({ user: req.user.id }).lean();
        res.render("home", { urls });
    } catch (error) {
        req.flash("mensajes", [{ msg: error.message }]);
        return res.redirect("/");
    }
};

export const agregarUrl = async (req, res) => {
    /*
    post("/")
    originalLink lo leemos desde formulario Form.hbs
    */
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
    /*
    get("/eliminar/:id")
    Llega el id como parametro y elimina en caso de que le pertenezca
    */
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
    /*
    get("/editar/:id") 
    me lleva a la vista para editar url
    */
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
    /* 
    post("/editar/:id") 
    Edita url 
    Busca en base de datos con el id que recibe como parametro y en caso de existir lo
    actualiza con el nuevo link que le pasamos en el body.
    */
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
    /* 
    get("/:shortUrl")
    Cuando apretamos boton copiar/compartir
    Busca en la base de datos el link original con el nanoid que le llega como parametro
    y redirecciona hacia ese link original
    */
    const { shortUrl } = req.params;
    try {
        const url = await Url.findOne({ shortUrl });
        res.redirect(url.originalLink);
    } catch (error) {
        res.send("algo salio mal");
    }
};
