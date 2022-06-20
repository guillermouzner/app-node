import { User } from "../models/User.js";
import formidable from "formidable";
import path from "path";
import fs from "fs";
import Jimp from "jimp";
import { fileURLToPath } from "url";

export const formPerfil = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.render("perfil", { user: req.user, imagen: user.imagen });
    } catch (error) {
        req.flash("mensajes", [{ msg: "Error al leer al usuario" }]);
        return res.redirect("/perfil");
    }
};

export const editarFotoPerfil = (req, res) => {
    const form = new formidable.IncomingForm();
    form.maxFileSize = 50 * 1024 * 1024; //(50mb)
    form.parse(req, async (err, fields, files) => {
        if (err) {
            req.flash("mensajes", [{ msg: "error de formidable" }]);
            return res.redirect("/perfil");
        }
        const file = files.Myfile;
        try {
            if (file.originalFilename === "")
                throw new Error("No se selecciono ninguna imagen");
            const imageTypes = ["image/jpeg", "image/png"];
            if (!imageTypes.includes(file.mimetype))
                throw new Error("La imagen debe ser en formato .jpg o .png");
            if (file.size > 50 * 1024 * 1024)
                throw new Error("La imagen no debe superar los 50MB");
            const extension = file.mimetype.split("/")[1];
            // const dirFile = path.join(
            //     __dirname + `../public/img/perfiles/${req.user.id}.${extension}`
            // );
            const __filename = fileURLToPath(import.meta.url);

            const __dirname = path.dirname(__filename);

            const pathname = path.join(
                __dirname,
                `../public/img/perfiles/${req.user.id}.${extension}`
            );

            fs.renameSync(file.filepath, pathname);

            const image = await Jimp.read(pathname);
            image.resize(200, 200).quality(90).writeAsync(pathname);

            const user = await User.findById(req.user.id);
            user.imagen = `${req.user.id}.${extension}`;

            await user.save();

            req.flash("mensajes", [{ msg: "Imagen guardada correctamente" }]);
            return res.redirect("/perfil");
        } catch (error) {
            req.flash("mensajes", [{ msg: error.message }]);
            return res.redirect("/perfil");
        }
    });
};
