import express from "express";
import mongoose from 'mongoose';

import config from "./config/dotenv.config.js";
import __dirname from './utils.js';
import ProductsRouter from "./routes/ProductsRouter.js";

const app = express();
const PORT = process.env.PORT||8080;
app.listen(PORT, ()=>console.log("server running."));

const connection = mongoose.connect(process.env.MONGO_URL);

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use("/api/products",ProductsRouter);
