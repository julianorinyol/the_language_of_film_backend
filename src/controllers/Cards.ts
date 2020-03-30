
import { Request, Response, Router } from 'express';
import { OK, INTERNAL_SERVER_ERROR } from 'http-status-codes';
import { Word, WordDocument } from "../models/Word";
import { Phrase, PhraseDocument } from "../models/Phrase";

const router = Router();

type CardData = {
    id?: string;
    question: string;
    answer: string;
    examples?: string[];
}

const getWordCards = async () => {
    const words: WordDocument[] = await Word.find().populate('translations').populate('phrases')
    const createAnswer = (word: WordDocument) => {
        let answer = ''
        if(word && word.translations) { 
            const answers = word.translations.map((translationWord: any)  => {
                return `${translationWord.word} -  ${translationWord.language}\n`
            })

            answer = answers.join('')
        }
        
        return answer
    }

    const createExamples = (word: WordDocument) => {
        let examples: any[] = []
        if(word && word.phrases) { 
            examples = word.phrases.map((phrase: any)  => {
                return `${phrase.phrase}`
            })
        }
        return examples
    }

    const reducer = (accumulator: {[key:string]: object}, word:WordDocument) => {
        const card: CardData = {
            id: word._id,
            question: word.word,
            answer: createAnswer(word),
            examples: createExamples(word)
        }
        
        accumulator[card.question] = card
        return accumulator
    }

    const mappedCards: object = words.reduce(reducer, {})
    return mappedCards
}

const getPhraseCards = async () => {
    const phrases: PhraseDocument[] = await Phrase.find().populate('translations').populate('phrases')
    const createAnswer = (phrase: PhraseDocument) => {
        let answer = ''
        if(phrase && phrase.translations) { 
            const translations: any = phrase.translations
            const answers = translations.map((translationPhrase: any)  => {
                return `${translationPhrase.phrase} -  ${translationPhrase.language}\n`
            })

            answer = answers.join('')
        }
        
        return answer
    }



    const reducer = (accumulator: {[key:string]: object}, phrase:PhraseDocument) => {
        const card: CardData = {
            id: phrase._id,
            question: phrase.phrase,
            answer: createAnswer(phrase)
        }
        
        accumulator[card.question] = card
        return accumulator
    }

    const mappedCards: object = phrases.reduce(reducer, {})
    return mappedCards
}

export const CardController = {
    // Find All Cards - "GET /api/v1/cards/"
    find: async (req: Request, res: Response) => {
        try {
            const mappedWordCards = await getWordCards()
            const mappedPhraseCards = await getPhraseCards()

            const allCards = {...mappedWordCards, ...mappedPhraseCards}
            return res.status(OK).json(allCards);
        } catch (err) {
            return res.status(INTERNAL_SERVER_ERROR).json({
                error: err.message,
            });
        }
    },
}

router.get('/', CardController.find);

export default router;
