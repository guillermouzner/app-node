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
        console.log(error.message);
        res.send("Invalid URL");
    }
};
