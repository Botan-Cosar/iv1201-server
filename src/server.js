"use strict";
const path=require("path");
const APP_ROOT_DIR = path.join(__dirname, '..'); // eslint-disable-line

if (process.env.NODE_ENV !== "production") {
    require('dotenv-safe').config({
    path: path.join(APP_ROOT_DIR, '.env'),
    example: path.join(APP_ROOT_DIR, '.env.example'),
    });
}

const bodyparser=require("body-parser");
const express=require("express");
const cors=require("cors");
const app=express();

app.use(bodyparser.json());

const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use(cors());

app.get("/",(req,res)=>{
    return res.send("Welcome");
});

const reqHandlerLoader = require('./api');
reqHandlerLoader.loadHandlers(app);
reqHandlerLoader.loadErrorHandlers(app);

const port=process.env.PORT||process.env.SERVER_PORT;
const server=app.listen(port,()=>{
    console.log(`Server is up at port: ${port}`);
});

module.exports=server;
