import axios from "axios";
export const validarUrl = async (req, res, next) => {
    try {
        let { originalLink } = req.body;

        if (!originalLink.startsWith("https://")) {
            originalLink = "https://" + originalLink;
        }

        await axios.get(originalLink);
        next();
    } catch (error) {
        if (error.message === "Invalid URL")
            req.flash("mensajes", [{ msg: "Url no valida" }]);
        if (error.message.startsWith("getaddrinfo ENOTFOUND"))
            req.flash("mensajes", [{ msg: "Url no valida" }]);
        // req.flash("mensajes", [{ msg: error.message }]);
        return res.redirect("/");
    }
};
