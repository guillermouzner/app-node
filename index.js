import "dotenv/config";
import { clientDB } from "./database/connectdb.js";
import express from "express";
import { create } from "express-handlebars";
import routerHome from "./routes/home.route.js";
import routerAuth from "./routes/auth.route.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import flash from "connect-flash";
import mongoSanitize from "express-mongo-sanitize";
import passport from "passport";
import { User } from "./models/User.js";
import csrf from "csurf";
import cors from "cors";

const app = express();

const corsOptions = {
    credentials: true,
    origin: process.env.PATHHEROKU || "*",
    methods: ["GET", "POST"],
};

app.use(cors(corsOptions));

app.use(
    session({
        secret: process.env.SECRETSESSION,
        resave: false,
        saveUninitialized: false,
        name: "session-user",
        store: MongoStore.create({
            clientPromise: clientDB,
            dbName: process.env.DB_NAME,
        }),
        cookie: {
            secure: process.env.MODO === "production",
            maxAge: 30 * 24 * 60 * 60 * 1000,
        },
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

app.use(mongoSanitize());

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
