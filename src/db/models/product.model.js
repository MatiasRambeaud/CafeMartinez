import mongoose from "mongoose";

const collection = "Products";

const schema = new mongoose.Schema({
    title:String,
    description:String,
    code:String,
    price:{
        type:Number,
        default:0
    },
    category:String,
    image:String,
    status:{
        type:Boolean,
        default:true
    },
    variations:{
        type:Array,
        default:null
    }
})

const productsModel = mongoose.model(collection,schema);

export default productsModel;