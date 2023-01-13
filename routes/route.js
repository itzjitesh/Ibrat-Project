import express from "express";
import userController from "../controllers/userController.js";
import middlewareAuth from "../middleware/auth.js";

const router = express.Router();

router.get("/", middlewareAuth, userController.getHome); //to get the home page


router.post("/signup", userController.postSignup); //to post a new user
router.get("/signup", userController.getSignup); //to get the signup page

router.get("/login", userController.getLogin); //to get the login page
router.post("/login", userController.postLogin); //to login the user

router.get("/cart", userController.getCart); //to get the cart page
router.post("/cart", middlewareAuth, userController.postCart); //to post and add to cart

export default router;