import mongoose from "mongoose";
const { Schema, model } = mongoose;
import bcryptjs from "bcryptjs";
const userSchema = new Schema({
    userName: {
        type: String,
        lowercase: true,
        required: true,
    },
    email: {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
        index: { unique: true },
    },
    password: {
        type: String,
        required: true,
    },
    tokenConfirm: {
        type: String,
        default: null,
    },
    cuentaConfirmada: {
        type: Boolean,
        default: false,
    },
    imagen: {
        type: String,
        default: null,
    },
});

userSchema.pre("save", async function (next) {
    const user = this;
    if (!user.isModified("password")) return next();
    try {
        const salt = await bcryptjs.genSalt(10);
        user.password = await bcryptjs.hash(user.password, salt);
        next();
    } catch (error) {
        console.log(error);
        throw new Error("Error al hashear contraseña");
    }
});

userSchema.methods.comparePassword = async function (password) {
    return await bcryptjs.compare(password, this.password);
};

export const User = model("User", userSchema);
