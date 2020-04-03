import mongoose from "mongoose";
import { WordData } from "./Word";
import { PhraseData } from "./Phrase";


export type FilmData = {
	_id?: mongoose.Types.ObjectId,
    name: string;
    img: string;
    phrases?: mongoose.Types.ObjectId[] | PhraseData[];
    words?: mongoose.Types.ObjectId[] | WordData[];
}

export type FilmDocument = mongoose.Document & FilmData;

const defaultImage = 'https://images.all-free-download.com/images/graphiclarge/movie_poster_background_art_vector_530172.jpg'
const filmSchema = new mongoose.Schema({
    name: { type: String, unique: true },
    img: { type: String, default: defaultImage },
    phrases: [ {type : mongoose.Schema.Types.ObjectId, ref : 'Phrase'} ],
    words: [ {type : mongoose.Schema.Types.ObjectId, ref : 'Word'} ],
}, { timestamps: true });

export const Film = mongoose.model<FilmDocument>("Film", filmSchema);