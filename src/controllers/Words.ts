
import { Request, Response, Router } from 'express';
import { OK, BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND } from 'http-status-codes';
import { Word, WordData } from "../models/Word";
import { Film } from "../models/Film";
import { AuthController } from './Auth'

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
    add: (req: Request, res: Response) => {
        try {
            return new Word(req.body).save().then(word => {
                return res.status(200).json(word )
            })
        } catch(err) {
            console.error(`error creating word`, err)
            return res.status(INTERNAL_SERVER_ERROR).json({
                error: err.message,
            });
        }
    },
    addOrUpdateMany: async (req: Request, res: Response) => {
        const { sourceKey, sourceType, words } = req.body
        //todo check if source exists
        const source = await Film.exists({name: sourceKey})

        if(!source) {
            return res.status(BAD_REQUEST).json({
                error: `Source doesnt exist for ${sourceKey}`,
            });
        }
        
        if(words.constructor.name !== 'Array') {
            return res.status(BAD_REQUEST).json({error: {message: "body should be array"}})        
        }

        const promises = words.map( async ( wordData:any ) => {
            const translationsIds = await Promise.all(wordData.translations.map(async (translatedWordData:any) => {
                const  { translations, ...withoutTranslation } = translatedWordData

                // upsert is true, so it creates them if they don't exist. 
                return Word.findOneAndUpdate({word: translatedWordData.word, language: translatedWordData.language}, { $set: withoutTranslation }, { upsert: true, new: true })
                    .exec()
                    .then((word:any) => {
                        return word._id
                    }) 
            }))



            const  { translations, ...wordDataWithoutTranslations } = wordData
            return Word.findOneAndUpdate({word: wordData.word, language: wordData.language},{ $set: wordDataWithoutTranslations, $addToSet: { translations: translationsIds  } }, { upsert: true, new: true  })
            .exec()
            .then(async (word:any) => {
                const all = await Promise.all(word.translations.map(async (x:any) => { 
                    return Word.findByIdAndUpdate({ _id: x },{ $addToSet: { translations: word._id } }).exec()
                }))
                return word
            }) 
        })

        // const addIdsToSource = (words: WordData[]) => {
        const addIdsToSource = async (words: any[]) => {
            const ids = words.map((word:any) => word._id)
            return Film.updateOne(
                    {name: sourceKey},
                    // https://docs.mongodb.com/manual/reference/operator/update/addToSet/#each-modifier
                    { $addToSet: { words: { $each: ids } } }
                )
        }

        return Promise.all(promises)
        .then(addIdsToSource)
        .then((completed:any) => {
            return res.status(200).json(completed)        
        }).catch((err:any) => {
            console.error(`error creating word`, err)
            return res.status(INTERNAL_SERVER_ERROR).json({
                error: err.message,
            });
        })
    },
}
const authController = new AuthController();

router.get('/', WordsController.find);
router.get('/:wordId', WordsController.get);
router.post("/", authController.authenticateJWT, WordsController.add)
router.post("/add_or_update_many", authController.authenticateJWT, WordsController.addOrUpdateMany)
export default router;
