import express from "express";
import mongoose from 'mongoose';
import path from "path";

import config from "./config/dotenv.config.js";
import __dirname from './utils.js';
import ProductsRouter from "./routes/ProductsRouter.js";

const app = express();
const PORT = process.env.PORT || 8080;

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));
console.log("1")
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/products", ProductsRouter);

app.use(express.static(path.join(__dirname, "../client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});
console.log("2")
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
