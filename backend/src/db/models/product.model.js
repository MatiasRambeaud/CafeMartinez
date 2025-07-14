import mongoose from "mongoose";

const collection = "Products";

const schema = new mongoose.Schema({
    title:String,
    description:String,
    code:String,
    price:Number,
    category:String,
    image:String,
    status:{
        type:Boolean,
        default:true
    }
})

const productsModel = mongoose.model(collection,schema);

export default productsModel;