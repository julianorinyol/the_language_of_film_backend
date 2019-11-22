import { Router } from 'express';
import FilmRouter from './Films';

// Init router and path
const router = Router();

// Add sub-routes
router.use('/films', FilmRouter);

// Export the base-router
export default router;
