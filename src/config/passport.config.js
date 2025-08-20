import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { ExtractJwt, Strategy as JWTStrategy } from "passport-jwt";

import { UsersService } from "../services/repositories.js";
import AuthService from "../services/AuthService.js";
import config from "../config/dotenv.config.js";

const authService = new AuthService();

const initializePassportConfig = () => {
    passport.use('register', new LocalStrategy({ usernameField: 'email', passReqToCallback: true }, async(req, email, password, done) => {
        const { role } = req.body;
        const user = await UsersService.getUserByEmail(email);
        if (user) {
            return done(null, false, res.sendBadRequest("User already exists"));
        };
        const hashedPassword = await authService.hashPassword(password);
        const User = {
            email,
            password: hashedPassword,
            role: role || "user"
        }
        const result = await UsersService.createUser(User);
        return done(null, result);
    }));

    passport.use('login', new LocalStrategy({ usernameField: 'email' }, async(email, password, done) => {
        const user = await UsersService.getUserByEmail(email);
        if (!user) {
            return done(null, false, res.sendBadRequest("Incorrect values"));
        };
        const validation = await authService.validatePassword(password, user.password);
        if (!validation) {
            return done(null, false, res.sendBadRequest("Incorrect values"));
        }
        return done(null, user);
    }));

    passport.use('current', new JWTStrategy({
        secretOrKey: process.env.JWT_SECRET,
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor])
    }, async(payload, done) => {
        if (payload) return done(null, payload);
        else return done(null, false);
    }));

}

function cookieExtractor(req) {
    return req?.cookies?.[process.env.JWT_COOKIE] || null;
}

export default initializePassportConfig;