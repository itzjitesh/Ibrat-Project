import cartDB from "../models/cart.js";
import mongoose from "mongoose";
import validator from "validator";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({ path: "./config.env"});

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "Please provide your name"],
        minlength: [5, "your name should have atleast 5 characters"],
        maxlength: [50, "Your name should be less than 50 characters."],
        trim: true
    },
    email:{
        type: String,
        required: [true, "Please provide your name"],
        unique: [true, "Email is already registered, Sign up with a new email"],
        validator: [validator.isEmail, "Please provide a valid email"],
    },
    password:{
        type: String,
        required : [true, "Please provide password"],
        minlength: [8, "Your password should have atleast 8 characters"],
        maxlength: [255, "Your password should not be more than 16 characters"],
        // select: false,
        trim: true
    },
    confirmPassword:{
        type: String,
        required : [true, "Please confirm your password"],
        validate:{
            validator : function(confirmPassword){
                return confirmPassword === this.password;
            },
            message: "Please re-enter the same password"
        },
        select: false        
    },
    cart: {
        type: [cartDB.cartSchema]
    }
});

userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id: this._id}, process.env.JWT_PRIVATEKEY);
    return token;
}

const User = mongoose.model("User", userSchema);

export default User;    

