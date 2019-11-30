
import { Request, Response, Router } from 'express';
import { OK } from 'http-status-codes';
import { Word } from "../models/Word";

const router = Router();

export const WordsController = {
    // Find All Films - "GET /api/v1/films/"
    find: async (req: Request, res: Response) => {
        const words = Word.find()
        return res.status(OK).json(words);
    }
}

router.get('/', WordsController.find);

export default router;
