import mongoose from "mongoose";

export type WordData = {
    _id?: any;
    word: string;
    language: string;
    translations?: any[];
}

export type WordDocument = mongoose.Document & WordData;

const wordSchema = new mongoose.Schema({
    word: { type: String },
    language: { type: String },
    translations: [ {type : mongoose.Schema.Types.ObjectId, ref : 'Word'} ]
}, { timestamps: true });

export const Word = mongoose.model<WordDocument>("Word", wordSchema);