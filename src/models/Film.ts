import mongoose from "mongoose";

export type FilmDocument = mongoose.Document & {
    name: string;
};


const filmSchema = new mongoose.Schema({
    name: { type: String, unique: true },
}, { timestamps: true });

export const Film = mongoose.model<FilmDocument>("Film", filmSchema);