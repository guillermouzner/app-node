import "dotenv/config";
import "./database/connectdb.js";
import express from "express";
import { create } from "express-handlebars";
import routerHome from "./routes/home.route.js";
import routerAuth from "./routes/auth.route.js";
import session from "express-session";
import flash from "connect-flash";
import passport from "passport";
import { User } from "./models/User.js";
import csrf from "csurf";

const app = express();

app.use(
    session({
        secret: "keyboard cat",
        resave: false,
        saveUninitialized: false,
        name: "secret-name-web",
    })
);

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

// crea la sesion
passport.serializeUser((user, done) => {
    done(null, { id: user._id, userName: user.userName });
}); // ==> req.user

// actualiza la sesion
passport.deserializeUser(async (user, done) => {
    const userDB = await User.findById(user.id).exec();
    return done(null, { id: userDB._id, userName: userDB.userName }); //se guardará en req.user
});

app.use(express.urlencoded({ extended: true }));

app.use(csrf());

const hbs = create({
    extname: ".hbs",
    partialsDir: ["views/components"],
});

app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");
app.set("views", "./views");

app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    res.locals.mensajes = req.flash("mensajes");
    next();
});

app.use("/", routerHome);
app.use("/auth", routerAuth);

app.use(express.static("public"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});
