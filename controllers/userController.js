import User from "../models/user.js";
import cartDB from "../models/cart.js";
import asyncMiddleware from "../middleware/async.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const saltRounds = 10;

const dummyCarts = [
    {
        imageSource: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8c2hvZXN8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
        text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem, quo, modi ea voluptas tempora vero cumque incidunt eum animi",
        price: "$87.99",
    },
    {
        imageSource: "https://images.unsplash.com/photo-1595341888016-a392ef81b7de?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTZ8fHNob2VzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
        text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem, quo, modi ea voluptas tempora vero cumque incidunt eum animi",
        price: "$235.99",
    },
    {
        imageSource: "https://images.unsplash.com/photo-1543508282-6319a3e2621f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTF8fHNob2VzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
        text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem, quo, modi ea voluptas tempora vero cumque incidunt eum animi",
        price: "$375.99",
    },
    {
        imageSource: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8c2hvZXN8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
        text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem, quo, modi ea voluptas tempora vero cumque incidunt eum animi",
        price: "$195.99",
    },
    {
        imageSource: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8c2hvZXN8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
        text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem, quo, modi ea voluptas tempora vero cumque incidunt eum animi",
        price: "$125.99"
    }
    ];

async function addDummyData(arr) {
    const num = await cartDB.Cart.find({});
    if (num.length === 0) {
        for (let i = 0; i < arr.length; i++) {
            await (new cartDB.Cart(arr[i]).save());
        }
    }
}

addDummyData(dummyCarts);

const getCart = asyncMiddleware(async(req, res)=>{

    const requestedCookie = req.cookies.jwt;
    
    if (!requestedCookie) return res.status(401).render("fail");
    
    const decoded = jwt.verify(requestedCookie, process.env.JWT_PRIVATEKEY);
    req.user = decoded; 
    
    const userId = decoded._id;

    const user = await User.findOne({ _id: userId});

    const requestedCart = user.cart;

    res.render("cart", {
        carts: requestedCart
    });
});

const postCart = asyncMiddleware(async(req, res)=>{
    const requestedCart = req.body.anc0 || req.body.anc1 || req.body.anc2 || req.body.anc3 || req.body.anc4;

    const addedCart = await cartDB.Cart.findOne({imageSource: requestedCart});

    const requestedCookie = req.cookies.jwt;
    
    if (!requestedCookie) return res.status(401).render("fail");
    
    const decoded = jwt.verify(requestedCookie, process.env.JWT_PRIVATEKEY);
    req.user = decoded; 
    
    const userId = decoded._id;

    const user = await User.findOne({ _id: userId});

    user.cart.push(addedCart);
    await user.save();   
});

const getHome = asyncMiddleware(async( req, res)=>{
    const cart = await cartDB.Cart.find();

    res.render("cartHome", {
        carts: cart
    });
});

const getSignup = asyncMiddleware(async(req, res)=>{
    res.render("signup");
});

const postSignup = asyncMiddleware(async(req, res)=>{

    let user = await User.findOne({email: req.body.email});
    
    if (user) return res.status(400).render("error", {
        message : "Email is already registered, Sign up with a new email!"
    });

    bcrypt.hash(req.body.password, saltRounds, async function(err, hash){
        if (err){
            res.status(400).send(err.message);
        }
        else{
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hash,
            confirmPassword: hash
        });           
        
        if (req.body.password !== req.body.confirmPassword){
            return res.status(400).render("error", {
                message: "I think there is something wrong with your keyboard, the confirm password has to be same as your password!"
            });
        }
    
        await user.save();

        const token = user.generateAuthToken();

        res.cookie("jwt", token,{
            expires: new Date(Date.now() + 30000),
            httpOnly: true
        });

        res.redirect("/login");
        }
    });  
});

const getLogin = asyncMiddleware(async(req, res)=>{
    res.render("login");
});

const postLogin = asyncMiddleware(async(req, res)=>{
    
    const email = req.body.email;

    const user = await User.findOne({email: email}).select("password email name");
    if (!user) return res.status(400).render("error",{
        message: "No user exists for this email!"
    });

    const validPassword = await bcrypt.compare(req.body.password, user.password);

    if (!validPassword) return res.status(401).render("error",{
        message: "Invalid Password, Enter the Correct Password!"
    });

    const token = user.generateAuthToken();
    res.cookie("jwt", token, {
        expires: new Date(Date.now() + 60 * 1000 * 30),
        httpOnly: true
    });
    
    res.redirect("/");
});

export default {
    getCart,
    postCart,
    getHome,
    postSignup,
    getSignup,
    getLogin,
    postLogin
}

