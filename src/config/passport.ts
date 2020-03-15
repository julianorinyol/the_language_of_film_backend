import passport from "passport";
import passportLocal from "passport-local";
import passportJwt from "passport-jwt";
import { JWT_SECRET } from "../helpers/secretsHelper";

const LocalStrategy = passportLocal.Strategy;
const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;


import { User } from "../models/User";

/**
 * Sign in using Email and Password.
 */
passport.use(new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
    User.findOne({ email: email.toLowerCase() }, (err, user: any) => {
        if (err) { return done(err); }
        if (!user) {
            return done(undefined, false, { message: `Email ${email} not found.` });
        
        }
        const isMatch = user.comparePassword(password)
        if (isMatch) {
            return done(undefined, user);
        }
        return done(undefined, false, { message: "Invalid email or password." });
    });
}));

const jwtOptions: any = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET
}

const jwtVerify =  function (jwtToken : any, done: any) {
    User.findOne({ email: jwtToken.username }, function (err, user: any) {
      if (err) { return done(err, false); }
      if (user) {
        return done(undefined, user , jwtToken);
      } else {
        return done(undefined, false);
      }
    });
  }

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify)

passport.use(jwtStrategy);

export default passport