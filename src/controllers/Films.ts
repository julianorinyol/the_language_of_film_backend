
import { Request, Response, Router } from 'express';
import { INTERNAL_SERVER_ERROR, NOT_FOUND, OK } from 'http-status-codes';

const router = Router();

type FilmType = {
    name: string
}

type FilmMapType = {
    [key: string]: FilmType
}

const films: FilmMapType = {
    fakemovie1: {
        name: "fake movie 1"
    },
    fakemovie2: {
        name: "fake movie 2"
    }
}

export const FilmController = {
    // Find All Films - "GET /api/v1/films/"
    find: (req: Request, res: Response) => {
        try {
            return res.status(OK).json({films});
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
            if(!(filmId in films)) {
                return res.status(NOT_FOUND).json({
                    error: `There is no film with id ${filmId}`,
                });
            }

            return res.status(OK).send(films[filmId])
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
