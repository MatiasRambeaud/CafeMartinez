import express from "express";
import mongoose from "mongoose";

import passport from "passport";
import cookieParser from "cookie-parser";

import path from "path";
import cors from "cors";

import config from "./config/dotenv.config.js";
import __dirname from "./utils.js";
import ProductsRouter from "./routes/ProductsRouter.js";
import SessionsRouter from "./routes/SessionsRouter.js";
import CategoriesRouter from "./routes/CategoriesRouter.js";
import SubcategoriesRouter from "./routes/SubcategoriesRouter.js";
import DecorImagesRouter from "./routes/DecorImagesRouter.js";
import initializePassportConfig from "./config/passport.config.js";
import categoriesModel from "./db/models/category.model.js";
import productsModel from "./db/models/product.model.js";

const app = express();
const PORT = process.env.PORT || 8080;

// Seed inicial: categoría "Combos" y combos principales si no existen
const seedInitialData = async () => {
    try {
        const combosCategoryName = "Combos";

        let combosCategory = await categoriesModel.findOne({ name: combosCategoryName });

        if (!combosCategory) {
            combosCategory = await categoriesModel.create({
                name: combosCategoryName,
                description: "Combos de desayuno / brunch",
            });
            console.log("[seed] Categoría 'Combos' creada");
        }

        // Definir todos los combos iniciales
        const combos = [
            {
                title: "Clásico",
                description: "Café + 2 medialunas o porción de budín + exprimido de naranja",
                code: "COMBO_CLASICO",
                price: 9000,
            },
            {
                title: "Martinez",
                description:
                    "Café + 2 tostadas + huevo revuelto + jamón + queso + manteca/queso untable + exprimido de naranja",
                code: "COMBO_MARTINEZ",
                price: 16000,
            },
            {
                title: "Londres",
                description:
                    "Café + 2 tostadas + queso untable/manteca + mermelada + exprimido de naranja",
                code: "COMBO_LONDRES",
                price: 12000,
            },
            {
                title: "Paris",
                description: "Café + tostados de miga o pan de campo + exprimido de naranja",
                code: "COMBO_PARIS",
                price: 15000,
            },
            {
                title: "Madrid",
                description:
                    "Café + 2 tostadas + palta + jamón + queso + manteca/queso untable + exprimido de naranja",
                code: "COMBO_MADRID",
                price: 16000,
            },
            {
                title: "Tokio",
                description:
                    "Café + yogur con granola + frutas de estación + 2 tostadas integral + mermelada + exprimido de naranja",
                code: "COMBO_TOKIO",
                price: 17000,
            },
            {
                title: "Roma",
                description:
                    "Café + 2 tostadas + huevo revuelto + palta + jamón y queso + exprimido de naranja",
                code: "COMBO_ROMA",
                price: 17000,
            },
            {
                title: "Venecia",
                description: "Café + porción de torta, tarta o postre + exprimido de naranja",
                code: "COMBO_VENECIA",
                price: 17000,
            },
        ];

        for (const combo of combos) {
            const existing = await productsModel.findOne({ code: combo.code });
            if (!existing) {
                await productsModel.create({
                    title: combo.title,
                    description: combo.description,
                    code: combo.code,
                    price: combo.price,
                    category: combosCategory.name,
                    categoryId: combosCategory._id,
                    subcategoryId: null,
                    status: true,
                    variations: null,
                    image: null,
                });
                console.log(`[seed] Producto '${combo.title}' creado en categoría 'Combos'`);
            }
        }

    } catch (err) {
        console.error("[seed] Error al crear datos iniciales:", err.message);
    }
};

mongoose
    .connect(process.env.MONGO_URL)
    .then(async () => {
        console.log("MongoDB connected");
        await seedInitialData();
    })
    .catch((err) => console.error("MongoDB connection error:", err));

app.use(cors({ origin: 'http://localhost:3001', credentials: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/images", express.static(path.join(process.cwd(), "public/images")));


initializePassportConfig();
app.use(passport.initialize());

app.use("/api/products", ProductsRouter);
app.use("/api/sessions", SessionsRouter);
app.use("/api/categories", CategoriesRouter);
app.use("/api/subcategories", SubcategoriesRouter);
app.use("/api/decor-images", DecorImagesRouter);

app.use(express.static(path.join(__dirname, "../client/build")));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});