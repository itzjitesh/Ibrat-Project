import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "./config.env"}); 

const db = process.env.MONGO_DB; 

mongoose.set('strictQuery', false);
mongoose.connect(db)
    .then(()=>{
        console.log("connected to mongodb...");
    })
    .catch(err=>{
        console.log(err);
    });







