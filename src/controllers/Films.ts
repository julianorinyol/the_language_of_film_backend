
import { Request, Response, Router } from 'express';
import { INTERNAL_SERVER_ERROR, NOT_FOUND, OK } from 'http-status-codes';
import { Film, FilmDocument, FilmData} from "../models/Film";

const router = Router();


const filterOutFields = (film: FilmDocument): FilmData => {
    return { name: film.name, img: film.img }
}

export const FilmController = {
    // Find All Films - "GET /api/v1/films/"
    find: async (req: Request, res: Response) => {
        try {
            const films: FilmData[] = await Film.find()
                //TODO use mongoose built in .select({ "name": 1, "_id": 0})
                .then((res: FilmDocument[]): FilmData[] => {
                        return res.map(film => filterOutFields(film))
                })
                
            return res.status(OK).json(films);
        } catch (err) {
            return res.status(INTERNAL_SERVER_ERROR).json({
                error: err.message,
            });
        }
    },
    
    // Get One Film - "GET /api/v1/films/<filmId>"
    get: (req: Request, res: Response) => {
        try {
            const { filmId } = req.params
            return Film.findById(filmId).then(film => {
                if(film) {
                    return res.status(OK).json(filterOutFields(film))
                } else {
                    return res.status(NOT_FOUND).json({
                        error: `There is no film with id ${filmId}`,
                    });
                }
            })
        } catch (err) {
            return res.status(INTERNAL_SERVER_ERROR).json({
                error: err.message,
            });
        }
    }
}

router.get('/', FilmController.find);
router.get('/:filmId', FilmController.get)

export default router;
