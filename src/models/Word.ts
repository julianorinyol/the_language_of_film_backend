import mongoose from "mongoose";

export type WordData = {
    _id?: mongoose.Types.ObjectId;
    word: string;
    language: string;
    translations?: mongoose.Types.ObjectId[];
    phrases?: mongoose.Types.ObjectId[];
}

export type WordDocument = mongoose.Document & WordData;

const wordSchema = new mongoose.Schema({
    word: { type: String },
    language: { type: String },
    translations: [ {type : mongoose.Schema.Types.ObjectId, ref : 'Word'} ],
    phrases: [ {type : mongoose.Schema.Types.ObjectId, ref : 'Phrase'} ]
}, { timestamps: true });

export const Word = mongoose.model<WordDocument>("Word", wordSchema);