import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { ingestMenu } from "../src/services/menuIngestion.service.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env (respect ENV variable like app.js)
const envFile = process.env.ENV || ".env";
dotenv.config({ path: envFile });

async function run() {
  const mongoUrl = process.env.MONGO_URL;
  if (!mongoUrl) {
    console.error("MONGO_URL is not defined in environment");
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUrl);
    console.log("[ingest] MongoDB connected");

    const summary = await ingestMenu();

    console.log("[ingest] Summary:");
    console.log(
      JSON.stringify(
        {
          categoriesCreated: summary.categoriesCreated,
          subcategoriesCreated: summary.subcategoriesCreated,
          productsInserted: summary.productsInserted,
          productsUpdated: summary.productsUpdated,
          priceConflicts: summary.priceConflicts,
          duplicatesSkipped: summary.duplicatesSkipped,
          errors: summary.errors,
        },
        null,
        2,
      ),
    );

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("[ingest] Fatal error:", err);
    try {
      await mongoose.disconnect();
    } catch (_) {
      // ignore
    }
    process.exit(1);
  }
}

run();

