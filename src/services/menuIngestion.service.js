import mongoose from "mongoose";
import categoriesModel from "../db/models/category.model.js";
import subcategoriesModel from "../db/models/subcategory.model.js";
import productsModel from "../db/models/product.model.js";

// Allowed sizes for multi-price products
const ALLOWED_SIZES = ["Chico", "Mediano", "Grande"];

// MENU_DEFINITION: full category/subcategory structure.
// Populate product arrays as you capture items from the physical menu.
export const MENU_DEFINITION = {
  // 1) Cafe with subcategories
  Cafe: {
    Cafeteria: [],
    Frio: [],
    Jugos: [],
    Otros: [],
    Pasteleria: [],
  },

  // 2) Combos without subcategories
  Combos: [
    {
      code: "COMBO_CLASICO",
      name: "Clasico",
      description: "Cafe + 2 medialunas o porcion de budin + exprimido de naranja",
      basePrice: 9000,
    },
    {
      code: "COMBO_MARTINEZ",
      name: "Martinez",
      description:
        "Cafe + 2 tostadas + huevo revuelto + jamon + queso + manteca/queso untable + exprimido de naranja",
      basePrice: 16000,
    },
    {
      code: "COMBO_LONDRES",
      name: "Londres",
      description:
        "Cafe + 2 tostadas + queso untable/manteca + mermelada + exprimido de naranja",
      basePrice: 12000,
    },
    {
      code: "COMBO_PARIS",
      name: "Paris",
      description: "Cafe + tostados de miga o pan de campo + exprimido de naranja",
      basePrice: 15000,
    },
    {
      code: "COMBO_MADRID",
      name: "Madrid",
      description:
        "Cafe + 2 tostadas + palta + jamon + queso + manteca/queso untable + exprimido de naranja",
      basePrice: 16000,
    },
    {
      code: "COMBO_TOKIO",
      name: "Tokio",
      description:
        "Cafe + yogur con granola + frutas de estacion + 2 tostadas integral + mermelada + exprimido de naranja",
      basePrice: 17000,
    },
    {
      code: "COMBO_ROMA",
      name: "Roma",
      description:
        "Cafe + 2 tostadas + huevo revuelto + palta + jamon y queso + exprimido de naranja",
      basePrice: 17000,
    },
    {
      code: "COMBO_VENECIA",
      name: "Venecia",
      description: "Cafe + porcion de torta, tarta o postre + exprimido de naranja",
      basePrice: 17000,
    },
  ],

  // 3) Comida with subcategories
  Comida: {
    Ensaladas: [],
    Pizzas: [],
    Tartas: [],
    "Sandwich De Milanesa": [],
    Empanadas: [],
    Bebidas: [],
  },

  // 4) Menu with structured combos
  Menu: {
    Menu: [
      // Example structure for future items:
      // {
      //   code: "MENU_ALGO",
      //   name: "Nombre del menu",
      //   includes: { plato: "...", bebida: "...", postre: "..." },
      //   basePrice: 0,
      // },
    ],
    "Comida Al Plato": [],
    Bebidas: [],
  },

  // 5) Promos without subcategories
  Promos: [],

  // 6) Independent categories from tortas_y_tostados
  Tortas: [],
  Tostados: [],
  Tostadas: [],
};

const capitalizeWords = (str) =>
  str
    .trim()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");

const normalizeProductName = (str) => {
  const trimmed = str.trim();
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
};

const validateProductDefinition = (product) => {
  const errors = [];

  if (!product.name) errors.push("Missing name");
  if (!product.code) errors.push("Missing code");

  const hasBase = typeof product.basePrice === "number";
  const hasPrices = Array.isArray(product.prices) && product.prices.length > 0;

  if (hasBase && hasPrices) errors.push("Product cannot have both basePrice and prices[]");
  if (!hasBase && !hasPrices) errors.push("Product must have either basePrice or prices[]");

  if (hasBase && product.basePrice <= 0) errors.push("basePrice must be positive");

  if (hasPrices) {
    const seen = new Set();
    for (const p of product.prices) {
      if (!ALLOWED_SIZES.includes(p.size)) {
        errors.push(`Invalid size '${p.size}'`);
      }
      if (p.price == null || typeof p.price !== "number" || p.price <= 0) {
        errors.push("All prices in prices[] must be positive numbers");
      }
      if (seen.has(p.size)) {
        errors.push("Duplicate size in prices[]");
      }
      seen.add(p.size);
    }
  }

  return errors;
};

const applyPriceUpdateLogic = (existing, incoming, logState) => {
  const hasExistingBase = typeof existing.price === "number" && !existing.variations;
  const hasExistingVariations = Array.isArray(existing.variations) && existing.variations.length > 0;

  const hasNewBase = typeof incoming.basePrice === "number";
  const hasNewPrices = Array.isArray(incoming.prices) && incoming.prices.length > 0;

  // Case A: base -> base
  if (hasExistingBase && hasNewBase) {
    existing.price = incoming.basePrice;
    return { updated: true };
  }

  // Case B: variations -> variations
  if (hasExistingVariations && hasNewPrices) {
    const existingMap = new Map();
    for (const v of existing.variations) {
      existingMap.set(v.nombre, v.precio);
    }
    for (const p of incoming.prices) {
      existingMap.set(p.size, p.price);
    }
    existing.variations = Array.from(existingMap.entries()).map(([nombre, precio]) => ({ nombre, precio }));
    return { updated: true };
  }

  // Case C: base -> variations
  if (hasExistingBase && hasNewPrices) {
    existing.price = 0;
    existing.variations = incoming.prices.map((p) => ({ nombre: p.size, precio: p.price }));
    return { updated: true };
  }

  // Case D: variations -> base (reject)
  if (hasExistingVariations && hasNewBase) {
    logState.priceConflicts += 1;
    logState.errors.push({
      type: "PRICE_STRUCTURE_CONFLICT",
      code: existing.code,
      message: "Existing product has prices[] but incoming has basePrice",
    });
    return { updated: false };
  }

  return { updated: false };
};

export async function ingestMenu(menuDefinition = MENU_DEFINITION) {
  const summary = {
    categoriesCreated: 0,
    subcategoriesCreated: 0,
    productsInserted: 0,
    productsUpdated: 0,
    priceConflicts: 0,
    duplicatesSkipped: 0,
    errors: [],
  };

  for (const [categoryNameRaw, value] of Object.entries(menuDefinition)) {
    const categoryName = capitalizeWords(categoryNameRaw);

    let category = await categoriesModel.findOne({ name: categoryName });
    if (!category) {
      category = await categoriesModel.create({ name: categoryName, description: "" });
      summary.categoriesCreated += 1;
      console.log(`[ingest] Category created: ${category.name}`);
    }

    // Category without subcategories (array of products)
    if (Array.isArray(value)) {
      await ingestProductsForCategory({
        category,
        subcategory: null,
        products: value,
        summary,
      });
      continue;
    }

    // Category with subcategories (object)
    for (const [subcatNameRaw, products] of Object.entries(value)) {
      const subcatName = capitalizeWords(subcatNameRaw);

      let subcategory = await subcategoriesModel.findOne({ name: subcatName, categoryId: category._id });
      if (!subcategory) {
        subcategory = await subcategoriesModel.create({
          name: subcatName,
          categoryId: category._id,
          description: "",
        });
        summary.subcategoriesCreated += 1;
        console.log(`[ingest] Subcategory created: ${category.name} / ${subcategory.name}`);
      }

      await ingestProductsForCategory({
        category,
        subcategory,
        products,
        summary,
      });
    }
  }

  return summary;
}

async function ingestProductsForCategory({ category, subcategory, products, summary }) {
  for (const prod of products) {
    const validationErrors = validateProductDefinition(prod);
    if (validationErrors.length > 0) {
      summary.errors.push({
        type: "VALIDATION_ERROR",
        code: prod.code,
        errors: validationErrors,
      });
      console.error(`[ingest] Validation error for product ${prod.code}:`, validationErrors.join("; "));
      continue;
    }

    const normalizedTitle = normalizeProductName(prod.name);

    const query = {
      title: normalizedTitle,
      categoryId: category._id,
      subcategoryId: subcategory ? subcategory._id : null,
    };

    let existing = await productsModel.findOne(query);

    if (!existing) {
      const doc = new productsModel({
        title: normalizedTitle,
        description: prod.description || "",
        code: prod.code,
        category: category.name,
        categoryId: category._id,
        subcategoryId: subcategory ? subcategory._id : null,
        status: true,
      });

      if (typeof prod.basePrice === "number") {
        doc.price = prod.basePrice;
        doc.variations = null;
      } else if (Array.isArray(prod.prices)) {
        doc.price = 0;
        doc.variations = prod.prices.map((p) => ({ nombre: p.size, precio: p.price }));
      }

      await doc.save();
      summary.productsInserted += 1;
      console.log(`[ingest] Product inserted: ${doc.title} (${category.name}${
        subcategory ? " / " + subcategory.name : ""
      })`);
      continue;
    }

    const { updated } = applyPriceUpdateLogic(existing, prod, summary);

    // Also keep title/description/code in sync (non-conflict updates)
    existing.title = normalizedTitle;
    existing.description = prod.description || existing.description;
    existing.code = prod.code || existing.code;

    if (updated) {
      await existing.save();
      summary.productsUpdated += 1;
      console.log(`[ingest] Product updated: ${existing.title}`);
    } else {
      summary.duplicatesSkipped += 1;
      console.log(`[ingest] Product skipped (no changes applied): ${existing.title}`);
    }
  }
}

export default {
  ingestMenu,
  MENU_DEFINITION,
};

