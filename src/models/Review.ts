
import mongoose from "mongoose";
import { WordData } from "./Word";
import { PhraseData } from "./Phrase";
import { UserData } from "./User";

export type ReviewData = {
	 _id?: mongoose.Types.ObjectId;
    itemType: string;
    itemText: string;
    itemId: mongoose.Types.ObjectId;
    percentage: number;
    // item?:  WordData | PhraseData[]; //todo figure how to do this properly in mongoose using their relationships
    user: mongoose.Types.ObjectId | UserData;
}

export type ReviewDocument = mongoose.Document & ReviewData;

const reviewSchema = new mongoose.Schema({
    itemType: { type: String },
    itemText: { type: String },
    itemId: { type: String },
    percentage: { type: Number },
    user: {type : mongoose.Schema.Types.ObjectId, ref : 'User'},
}, { timestamps: true });

export const Review = mongoose.model<ReviewDocument>("Review", reviewSchema);