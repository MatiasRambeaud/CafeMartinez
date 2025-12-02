import mongoose from "mongoose";

const collection = "Subcategories";

const schema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Categories", required: true },
  description: { type: String, default: "" },
});

schema.index({ name: 1, categoryId: 1 }, { unique: true });

const subcategoriesModel = mongoose.model(collection, schema);
export default subcategoriesModel;
