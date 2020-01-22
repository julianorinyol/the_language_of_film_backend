
import { Request, Response, Router } from 'express';
import { OK, INTERNAL_SERVER_ERROR } from 'http-status-codes';
import { Word, WordData } from "../models/Word";

const router = Router();

type CardData = {
    question: string;
    answer: string;
    examples: string[];
}

export const CardController = {
    // Find All Cards - "GET /api/v1/cards/"
    find: async (req: Request, res: Response) => {
        try {
            const words: WordData[] = await Word.find().populate('translations')
            const createAnswer = (word: WordData) => {
                let answer = ''
                if(word && word.translations) {
                    const answers = word.translations.map(translationWord => {
                        return `${translationWord.word} -  ${translationWord.language}\n`
                    })
                    answer = answers.join('')
                }
                
                return answer
            }

            const reducer = (accumulator: {[key:string]: object}, word:WordData) => {
                const card: CardData = {
                    question: word.word,
                    answer: createAnswer(word),
                    examples: []
                }
                
                accumulator[card.question] = card
                return accumulator
            }

            const mappedCards: object = words.reduce(reducer, {})



            return res.status(OK).json(mappedCards);
        } catch (err) {
            return res.status(INTERNAL_SERVER_ERROR).json({
                error: err.message,
            });
        }
    },
}

router.get('/', CardController.find);

export default router;
