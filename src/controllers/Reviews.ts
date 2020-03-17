
import { Request, Response, Router } from 'express';
import { INTERNAL_SERVER_ERROR, NOT_FOUND, OK } from 'http-status-codes';
import { Review, ReviewDocument, ReviewData} from "../models/Review";
import { AuthController } from './Auth'
const router = Router();

export const ReviewController = {
    // Find All Reviews - "GET /api/v1/reviews/"
    find: async (req: Request, res: Response) => {
        try {
            const reviews: ReviewData[] = await Review.find()
                //TODO use mongoose built in .select({ "name": 1, "_id": 0})
                .then((res: ReviewDocument[]): ReviewData[] => {
                        // return res.map(review => filterOutFields(review))
                        return res
                })
                
            return res.status(OK).json(reviews);
        } catch (err) {
            return res.status(INTERNAL_SERVER_ERROR).json({
                error: err.message,
            });
        }
    },
    
    // Get One Review - "GET /api/v1/reviews/<reviewId>"
    get: (req: Request, res: Response) => {
        try {
            const { reviewId } = req.params
            return Review.findById(reviewId).then(review => {
                if(review) {
                    // return res.status(OK).json(filterOutFields(review))
                    return res.status(OK).json(review)
                } else {
                    return res.status(NOT_FOUND).json({
                        error: `There is no review with id ${reviewId}`,
                    });
                }
            })
        } catch (err) {
            return res.status(INTERNAL_SERVER_ERROR).json({
                error: err.message,
            });
        }
    },

        // Get One Review - "GET /api/v1/reviews/<reviewId>"
    add: (req: Request, res: Response) => {
        console.log(req.body)
        try {
            return new Review(req.body).save().then(review => {
                return res.status(200).json(review )
            }).catch( (err:any)=> {
                console.log(`error saving review`, err)
                throw err
            })
        } catch(err) {
            console.log(`error craeteing review`, err)
            return res.status(INTERNAL_SERVER_ERROR).json({
                error: err.message,
            });
        }
    },


}
const authController = new AuthController();

router.get('/', authController.authenticateJWT, ReviewController.find)
router.get('/:reviewId', authController.authenticateJWT, ReviewController.get)
router.post("/", authController.authenticateJWT, ReviewController.add)
// router.get('/:reviewId', ReviewController.get)

export default router;


/*
    curl -H "Authorization: bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imp1bGlhbkBibGEuY29tIiwiaWF0IjoxNTg0NDc4MDM2fQ.ayZCRNpVpCeSHx5fAxHIelInU3RX5turTna3-wjjaTU" localhost:8000/api/v1/reviews
*/