import mongoose from "mongoose";

try {
    await mongoose.connect(process.env.DB_URL);
    console.log("db conectada :)");
} catch (error) {
    console.log(error);
}

// import mongoose from "mongoose";

// try {
//     await mongoose.connect(process.env.DB_URL);
//     console("DB conectada");
// } catch (error) {
//     console.log(error);
// }
