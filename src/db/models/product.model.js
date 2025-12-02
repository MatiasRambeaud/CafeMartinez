import mongoose from "mongoose";

const collection = "Products";

const schema = new mongoose.Schema({
    title: String,
    description: String,
    code: String,
    price: {
        type: Number,
        default: 0
    },
    // Backward-compatible category display name
    category: String,
    // Hierarchical categorization
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Categories", default: null },
    subcategoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Subcategories", default: null },
    image: String,
    status: {
        type: Boolean,
        default: true
    },
    variations: {
        type: Array,
        default: null
    }
})

const productsModel = mongoose.model(collection, schema);

export default productsModel;