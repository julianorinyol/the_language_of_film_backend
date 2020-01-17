import { Router } from 'express';
import FilmRouter from './Films';
import WordsRouter from './Words';

// Init router and path
const router = Router();

// Add sub-routes
router.use('/films', FilmRouter);
router.use('/words', WordsRouter);

// Export the base-router
export default router;
