"use strict";

const path=require("path");
const bodyparser=require("body-parser");
const express=require("express");
const app=express();

app.use(bodyparser.json());

app.get("/",(req,res)=>{
    return res.send("Hwelcome");
})

const port=process.env.PORT||5000;
const server=app.listen(port,()=>{
    console.log(`Server is up at port: ${port}`);
});

module.exports=server;