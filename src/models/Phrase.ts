import mongoose from "mongoose";

export type PhraseData = {
    _id?: mongoose.Types.ObjectId;
    phrase: string;
    language: string;
    translations?: mongoose.Types.ObjectId[];
    words?: mongoose.Types.ObjectId[];
}

export type PhraseDocument = mongoose.Document & PhraseData;

const phraseSchema = new mongoose.Schema({
    phrase: { type: String },
    language: { type: String },
    translations: [ {type : mongoose.Schema.Types.ObjectId, ref : 'Phrase'} ],
    words: [ {type : mongoose.Schema.Types.ObjectId, ref : 'Word'} ],
}, { timestamps: true });

export const Phrase = mongoose.model<PhraseDocument>("Phrase", phraseSchema);