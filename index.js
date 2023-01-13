import bodyParser  from "body-parser";
import cookieParser from "cookie-parser";
import express from "express"
const app = express();
import routes from "./routes/route.js";
import dotenv from "dotenv";

dotenv.config({ path: "./config.env"}); 

const port = process.env.PORT || 3000;

import("./server.js");

app.set("view engine", "ejs");

app.use(cookieParser());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.use("/", routes);

app.listen(port, ()=>{
    console.log(`server is running at ${port}`);
});



