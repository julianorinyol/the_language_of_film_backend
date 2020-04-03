
import { Request, Response, Router } from 'express';
import { INTERNAL_SERVER_ERROR, NOT_FOUND, OK } from 'http-status-codes';
import { Film, FilmDocument, FilmData} from "../models/Film";
import { User, UserData, UserDocument } from "../models/User";
import { AuthController } from './Auth'
const router = Router();

const filterOutFields = (film: FilmDocument): FilmData => {
    return { name: film.name, img: film.img }
}

export const CurrentUserController = {
    findUserFilms: async (req: Request, res: Response) => {
    	const user = req.user as UserDocument

    	const populatedUser:any = await user.populate('films').execPopulate();
    	const films = populatedUser.films
       
        try {
            return res.status(OK).json(films);
        } catch (err) {
            return res.status(INTERNAL_SERVER_ERROR).json({
                error: err.message,
            });
        }
    },

    toggleFilm: async (req: Request, res: Response) => {
        const user = req.user as UserDocument
        const { body } = req 
        const film: FilmDocument[] = await Film.find({name: body.name})

        const filmId = film[0]._id        

        // todo: this is just to satisfy typescript, need to remove or refactor
        if(!user.films) {
            return res.status(INTERNAL_SERVER_ERROR).json({
                error: "problem toggling film on user",
            });
        }

        const action = user.films.includes(filmId) ? { $pull: { films: filmId }} : { $addToSet: { films: filmId }}
        const result = await user.update(action)            
        console.log({result})

        // todo i cant find a way to return the updated document from the update() call above
        // doesn't seem to be a {new: true} option for update. https://mongoosejs.com/docs/api/model.html#model_Model.update
        // perhaps i should be using a different funciton like findOneAndUpdate() ??
        const updatedUser:UserDocument | null =  await User.findOne({_id: user._id})
        
        // todo: this is just to satisfy typescript, need to remove or refactor
        if(!updatedUser) {
            return res.status(INTERNAL_SERVER_ERROR).json({
                error: "problem toggling film on user",
            });
        }

        const populatedUser:UserDocument = await updatedUser.populate('films').execPopulate();
        const films = populatedUser.films

        try {
            return res.status(OK).json(films);
        } catch (err) {
            return res.status(INTERNAL_SERVER_ERROR).json({
                error: err.message,
            });
        }
    },
}

const authController = new AuthController();

router.get('/films', authController.authenticateJWT, CurrentUserController.findUserFilms)
// router.get('/:filmId', authController.authenticateJWT, CurrentUserController.get)
router.post("/films", authController.authenticateJWT, CurrentUserController.toggleFilm)
export default router;
