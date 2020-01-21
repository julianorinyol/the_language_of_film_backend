import mongoose from "mongoose";

export type WordData = {
    word: string;
    language: string;
}

export type WordDocument = mongoose.Document & WordData;

const wordSchema = new mongoose.Schema({
    word: { type: String },
    language: { type: String },
}, { timestamps: true });

export const Word = mongoose.model<WordDocument>("Word", wordSchema);