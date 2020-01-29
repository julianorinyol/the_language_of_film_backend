
import { Request, Response, Router } from 'express';
import { OK, INTERNAL_SERVER_ERROR, NOT_FOUND } from 'http-status-codes';
import { Phrase, PhraseData } from "../models/Phrase";

const router = Router();

export const PhrasesController = {
    // Find All Phrases - "GET /api/v1/phrases/"
    find: async (req: Request, res: Response) => {
        try {
            const phrases: PhraseData[] = await Phrase.find()
            const reducer = (accumulator: {[key:string]: object}, phrase:PhraseData) => {
                accumulator[phrase.phrase] = phrase
                return accumulator
            }

            const obj: object = phrases.reduce(reducer, {})

            return res.status(OK).json(obj);
        } catch (err) {
            return res.status(INTERNAL_SERVER_ERROR).json({
                error: err.message,
            });
        }
    },
    get: async (req: Request, res: Response) => {
        const { phraseId } = req.params
        return Phrase.findById(phraseId).populate('translations')
            .then(phrase => {
                if(phrase) {
                    return res.status(OK).json(phrase);
                }
            })
            .catch(err => {
                return res.status(NOT_FOUND).json({error: `No phrase found with id ${phraseId}`})
            })
    },
}

router.get('/', PhrasesController.find);
router.get('/:phraseId', PhrasesController.get);
export default router;
