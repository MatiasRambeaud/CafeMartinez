import mongoose from "mongoose";

const collection = "Categories";

const schema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  description: { type: String, default: "" },
});

const categoriesModel = mongoose.model(collection, schema);
export default categoriesModel;
