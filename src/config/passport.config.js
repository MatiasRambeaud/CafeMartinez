import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { ExtractJwt, Strategy as JWTStrategy } from "passport-jwt";

import { UsersService } from "../services/repositories.js";
import AuthService from "../services/AuthService.js";
import config from "../config/dotenv.config.js";

const authService = new AuthService();

const initializePassportConfig = () => {
  passport.use(
    "register",
    new LocalStrategy(
      { usernameField: "name", passReqToCallback: true },
      async (req, name, password, done) => {
        try {
          const { role } = req.body;
          const user = await UsersService.getUserByName(name);
          if (user) {
            return done(null, false, { message: "User already exists" });
          }
          const hashedPassword = await authService.hashPassword(password);
          const newUser = {
            name,
            password: hashedPassword,
            role: role || "user",
          };
          const result = await UsersService.createUser(newUser);
          return done(null, result);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "name" },
      async (name, password, done) => {
        try {
          const user = await UsersService.getUserByName(name);
          if (!user) {
            return done(null, false, { message: "Incorrect values" });
          }
          const valid = await authService.validatePassword(password, user.password);
          if (!valid) {
            return done(null, false, { message: "Incorrect values" });
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "current",
    new JWTStrategy(
      {
        secretOrKey: process.env.JWT_SECRET,
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      },
      async (payload, done) => {
        try {
          if (payload) return done(null, payload);
          return done(null, false);
        } catch (error) {
          return done(error, false);
        }
      }
    )
  );
};

function cookieExtractor(req) {
  return req?.cookies?.[process.env.JWT_COOKIE] || null;
}

export default initializePassportConfig;
