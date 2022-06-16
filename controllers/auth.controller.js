import { Url } from "../models/Url.js";
import { nanoid } from "nanoid";

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
