import crypto from "crypto";
import mongoose from "mongoose";
import { comparePassword, hashPassword }  from '../helpers/passwordHelper'

export type UserData = {
    email: string;
    password: string;
    passwordResetToken?: string;
    passwordResetExpires?: Date;

    facebook?: string;
    tokens?: AuthToken[];

    profile?: {
        name: string;
        gender: string;
        location: string;
        website: string;
        picture: string;
    };
    // comparePasswordToHash: comparePasswordToHashFunction;
    gravatar?: (size: number) => string;
}

export type UserDocument = mongoose.Document & UserData;

type comparePasswordToHashFunction = (candidatePassword: string, cb: (err: any, isMatch: any) => {}) => void;

export interface AuthToken {
    accessToken: string;
    kind: string;
}

const userSchema: mongoose.Schema = new mongoose.Schema({
    email: { type: String, unique: true },
    password: String,
    passwordResetToken: String,
    passwordResetExpires: Date,

    facebook: String,
    twitter: String,
    google: String,
    tokens: Array,

    profile: {
        name: String,
        gender: String,
        location: String,
        website: String,
        picture: String
    }
}, { timestamps: true });

/**
 * Password hash middleware.
 */
userSchema.pre("save", function save(next) {
    const user = this as UserDocument;
    if (!user.isModified("password")) { return next(); }
    user.password = hashPassword(user.password)
    next()    
});

const comparePasswordToHash: comparePasswordToHashFunction = function (candidatePassword) {
    // @ts-ignore
    return comparePassword(candidatePassword, this.password);
};

userSchema.methods.comparePassword = comparePasswordToHash;

/**
 * Helper method for getting user's gravatar.
 */
userSchema.methods.gravatar = function (size: number = 200) {
    if (!this.email) {
        return `https://gravatar.com/avatar/?s=${size}&d=retro`;
    }
    const md5 = crypto.createHash("md5").update(this.email).digest("hex");
    return `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`;
};

// export { userSchema }

export const User = mongoose.model<UserDocument>("User", userSchema);
