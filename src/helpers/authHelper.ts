import bcrypt from 'bcryptjs'

export type comparePasswordFunction = (candidatePassword: string, hashedPassword: string) => boolean;
export const comparePassword: comparePasswordFunction = (plaintextCandidatePassword, hashedPassword):boolean => {
    return bcrypt.compareSync(plaintextCandidatePassword, hashedPassword);
};

export type hashPasswordFunction = (plaintextPassword: string) => string;

export const hashPassword: hashPasswordFunction = (plaintextPassword: string):string => {
    const salt = bcrypt.genSaltSync(10);     
    return bcrypt.hashSync(plaintextPassword, salt)
}