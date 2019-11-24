import mongoose from "mongoose";

export type FilmDocument = mongoose.Document & {
    name: string;
};

const defaultImage = 'https://images.all-free-download.com/images/graphiclarge/movie_poster_background_art_vector_530172.jpg'
const filmSchema = new mongoose.Schema({
    name: { type: String, unique: true },
    img: { type: String, default: defaultImage },
    
}, { timestamps: true });

export const Film = mongoose.model<FilmDocument>("Film", filmSchema);