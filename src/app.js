import express from "express";
import mongoose from 'mongoose';

import passport from 'passport';
import cookieParser from 'cookie-parser';

import path from "path";
import cors from "cors"

import config from "./config/dotenv.config.js";
import __dirname from './utils.js';
import ProductsRouter from "./routes/ProductsRouter.js";
import SessionsRouter from "./routes/SessionsRouter.js";
import initializePassportConfig from './config/passport.config.js';


const app = express();
const PORT = process.env.PORT || 8080;
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));

app.use(cors({ origin: 'http://localhost:3001' }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

initializePassportConfig();
app.use(passport.initialize());

app.use("/api/products", ProductsRouter);
app.use("/api/sessions", SessionsRouter);

app.use(express.static(path.join(__dirname, "../client/build")));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});