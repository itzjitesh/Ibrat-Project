import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({ path: "./config.env"});


const middlewareAuth = async(req, res, next)=>{

    const requestedCookie = req.cookies.jwt;
    
    if (!requestedCookie) return res.status(401).render("fail");
    
    try{
        const decoded = jwt.verify(requestedCookie, process.env.JWT_PRIVATEKEY);
        req.user = decoded;
        next();
    }
    catch(ex){
        res.status(400).send("Invalid token");
    }
}

export default middlewareAuth;