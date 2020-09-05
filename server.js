const express = require("express");
const dotenv = require("dotenv"); 
const routers = require("./routes/index");
const {connectDatabase} = require("./helpers/database/connectDatabase");
const customErrorHandler = require("./middlewares/errors/customErrorHandler");
const path = require("path");

const app = express();

dotenv.config({path : "./config/env/config.env"});

connectDatabase();

const PORT =process.env.PORT;
//Express body-req middleware


app.use(express.json());
app.use("/api",routers);


app.get("/", (req,res,next)=>{
    res.send("Home Page");
})
app.use(customErrorHandler);
app.use(express.static(__dirname+path.join("/public")));
app.listen(PORT, ()=>{
    console.log("App started on: " + PORT+ " in the environment of "+ process.env.NODE_ENV);
})

