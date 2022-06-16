import "dotenv/config";
import "./database/connectdb.js";
import express from "express";
import { create } from "express-handlebars";
import routerAuth from "./routes/auth.route.js";
const app = express();

app.use(express.urlencoded({ extended: true }));

const hbs = create({
    extname: ".hbs",
    partialsDir: ["views/components"],
});

app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");
app.set("views", "./views");

app.use("/", routerAuth);

app.use(express.static("public"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});
