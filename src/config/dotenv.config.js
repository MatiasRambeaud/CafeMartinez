import {config} from "dotenv";
config();
export default{
    MONGO:{
        URL:process.env.MONGO_URL
    }
}