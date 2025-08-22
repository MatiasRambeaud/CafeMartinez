import mongoose from "mongoose";

const collection = "Users";

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ['user', 'admin'],
        default: 'user'
    }
})

const usersModel = mongoose.model(collection, schema);

export default usersModel;