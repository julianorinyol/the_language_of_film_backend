import { Router, NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";

const router = Router();
import passport from "../config/passport";

import { JWT_SECRET } from "../helpers/secretsHelper";


const secretKey:string = JWT_SECRET

export const LoginController = {
    test(req: Request, res: Response) {
        return res.status(200).json({bla: "blaaaaa"})
    },
    authenticateUser(req: Request, res: Response, next: NextFunction) {
        passport.authenticate("local", {session: false}, function (err, user, info) {
          if (err) {
            return next(err);
          }
          if (!user) {
            return res.status(401).json({ status: "error", code: "unauthorized" });
          } else {
            const token = jwt.sign({ username: user.email }, secretKey);
            
            res.status(200).send({ token });
          }
        })(req,res,next); // todo: this is a weird setup.
      }
}

router.post("/", LoginController.authenticateUser)
export default router;

/*

curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"email":"julian@bla.com","password":"password123"}' \
  http://localhost:8000/api/v1/login/
*/