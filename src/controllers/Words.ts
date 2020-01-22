
import { Request, Response, Router } from 'express';
import { OK, INTERNAL_SERVER_ERROR, NOT_FOUND } from 'http-status-codes';
import { Word, WordData } from "../models/Word";

const router = Router();

export const WordsController = {
    // Find All Words - "GET /api/v1/words/"
    find: async (req: Request, res: Response) => {
        try {
            const words: WordData[] = await Word.find()
            const reducer = (accumulator: {[key:string]: object}, word:WordData) => {
                accumulator[word.word] = word
                return accumulator
            }

            const obj: object = words.reduce(reducer, {})

            return res.status(OK).json(obj);
        } catch (err) {
            return res.status(INTERNAL_SERVER_ERROR).json({
                error: err.message,
            });
        }
    },
    get: async (req: Request, res: Response) => {
        const { wordId } = req.params
        return Word.findById(wordId).populate('translations')
            .then(word => {
                if(word) {
                    return res.status(OK).json(word);
                }
            })
            .catch(err => {
                return res.status(NOT_FOUND).json({error: `No word found with id ${wordId}`})
            })
    },
}

router.get('/', WordsController.find);
router.get('/:wordId', WordsController.get);
export default router;
