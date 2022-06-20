import mongoose from "mongoose";

export const clientDB = mongoose
    .connect(process.env.DB_URL)
    .then((m) => {
        console.log("db conectada");
        return m.connection.getClient();
    })
    .catch((err) => console.log("fallo la conexion: " + err));
