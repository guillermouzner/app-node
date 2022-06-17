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

passport.serializeUser((user, done) => {
    done(null, { id: user._id, userName: user.userName });
}); // ==> req.user

passport.deserializeUser(async (user, done) => {
    const userdb = await User.findById(user._id);
    return done(null, { id: user._id, userName: user.userName });
});

app.use(express.urlencoded({ extended: true }));

const hbs = create({
    extname: ".hbs",
    partialsDir: ["views/components"],
});

app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");
app.set("views", "./views");

app.use("/", routerHome);
app.use("/auth", routerAuth);

app.use(express.static("public"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});
