
import { Request, Response, Router } from 'express';
import { BAD_REQUEST, NOT_FOUND, OK } from 'http-status-codes';

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


/******************************************************************************
 *                      Get All Films - "GET /api/v1/films/"
 ******************************************************************************/


router.get('/', async (req: Request, res: Response) => {
    try {
        return res.status(OK).json({films});
    } catch (err) {
        return res.status(BAD_REQUEST).json({
            error: err.message,
        });
    }
});

/******************************************************************************
 *                      Get One Film - "GET /api/v1/films/<filmId>"
 ******************************************************************************/

export const showFilmController = (req: Request, res: Response) => {
	 try {
        const { filmId } = req.params
    	if(!(filmId in films)) {
			return res.status(NOT_FOUND).json({
                error: `There is no film with id ${filmId}`,
            });
		}
        return res.status(OK).send(films[filmId])
    } catch (err) {
        return res.status(BAD_REQUEST).json({
            error: err.message,
        });
    }
}

router.get('/:filmId', showFilmController)

/******************************************************************************
 *                                     Export
 ******************************************************************************/

export default router;
