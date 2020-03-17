import { Router } from 'express';
import FilmRouter from './Films';
import WordsRouter from './Words';
import PhrasesRouter from './Phrases';
import ReviewsRouter from './Reviews';
import CardsRouter from './Cards';
import LoginRouter from './Login';

// Init router and path
const router = Router();

// Add sub-routes
router.use('/films', FilmRouter);
router.use('/words', WordsRouter);
router.use('/phrases', PhrasesRouter);
router.use('/cards', CardsRouter);
router.use('/reviews', ReviewsRouter);
router.use('/login', LoginRouter);

// Export the base-router
export default router;
