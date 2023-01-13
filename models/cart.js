import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    imageSource: {
        type: String,
        required: [true, "Please provide an image source"]
    },
    text: {
        type: String,
        required: [true, "Please provide the details of the product"],
        minlength: [5, "your text should have atleast 5 characters"],
        maxlength: [250, "Your text should be less than 250 characters."],
        trim: true
    },
    price: {
        type: String,
        required: [true, "Please provide an price of the product"]
    }
});

const Cart = mongoose.model("Cart", cartSchema);

export default {
    cartSchema,
    Cart
}



