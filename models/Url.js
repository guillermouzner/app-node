import mongoose from "mongoose";
const { Schema, model } = mongoose;

const urlSchema = new Schema({
    originalLink: {
        type: String,
        required: true,
        trim: true,
    },
    shortUrl: {
        type: String,
        unique: true,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
});

export const Url = model("Url", urlSchema);
