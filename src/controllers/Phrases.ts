
import { Request, Response, Router } from 'express';
import { OK, BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND } from 'http-status-codes';
import { Phrase, PhraseData } from "../models/Phrase";
import { AuthController } from './Auth'

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
    add: (req: Request, res: Response) => {
        try {
            return new Phrase(req.body).save().then(phrase => {
                return res.status(200).json(phrase)
            })
        } catch(err) {
            console.error(`error creating phrase`, err)
            return res.status(INTERNAL_SERVER_ERROR).json({
                error: err.message,
            });
        }
    },
    addOrUpdateMany: async (req: Request, res: Response) => {
        const phrases = req.body
        if(phrases.constructor.name !== 'Array') {
            return res.status(BAD_REQUEST).json({error: {message: "body should be array"}})        
        }

        const promises = phrases.map( async ( phraseData:any ) => {
            const translationsIds = await Promise.all(phraseData.translations.map(async (translatedPhraseData:any) => {
                const  { translations, ...withoutTranslation   } =translatedPhraseData

                return Phrase.findOneAndUpdate({phrase: translatedPhraseData.phrase, language: translatedPhraseData.language}, { $set: withoutTranslation }, { upsert: true, new: true })
                    .exec()
                    .then((phrase:any) => {
                        return phrase._id
                    }) 
            }))



            const  { translations, ...phraseDataWithoutTranslations } = phraseData
            return Phrase.findOneAndUpdate({phrase: phraseData.phrase, language: phraseData.language},{ $set: phraseDataWithoutTranslations, $addToSet: { translations: translationsIds  } }, { upsert: true, new: true  })
            .exec()
            .then(async (phrase:any) => {
                const all = await Promise.all(phrase.translations.map(async (x:any) => { 
                    return Phrase.findByIdAndUpdate({ _id: x },{ $addToSet: { translations: phrase._id } }).exec()
                }))
                return phrase
            }) 
        })

        return Promise.all(promises).then((completed:any) => {
            return res.status(200).json(completed)        
        }).catch((err:any) => {
            console.error(`error creating phrase`, err)
            return res.status(INTERNAL_SERVER_ERROR).json({
                error: err.message,
            });
        })
    },

}

const authController = new AuthController()
router.get('/', PhrasesController.find);
router.get('/:phraseId', PhrasesController.get);
router.post("/add_or_update_many", authController.authenticateJWT, PhrasesController.addOrUpdateMany)
export default router;
