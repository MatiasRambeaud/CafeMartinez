import dotenv from "dotenv";

const envFile = process.env.ENV || '.env';
dotenv.config({ path: envFile });
export default {
    MONGO: {
        URL: process.env.MONGO_URL
    },
    JWT: {
        SECRET: process.env.JWT_SECRET,
        COOKIE: process.env.JWT_COOKIE
    }
}