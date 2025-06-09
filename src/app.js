const express = require("express");

const app = express();

app.use("/",(req, res)=>{
    res.send("Hello Developer");
})
app.listen(1777, ()=>{
    console.log("server is up and running on portal 1777");
})
