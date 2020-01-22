import { Router } from 'express';
import FilmRouter from './Films';
import WordsRouter from './Words';
import CardsRouter from './Cards';

// Init router and path
const router = Router();

// Add sub-routes
router.use('/films', FilmRouter);
router.use('/words', WordsRouter);
router.use('/cards', CardsRouter);

// Export the base-router
export default router;
