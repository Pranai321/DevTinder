const express = require("express");
const connectDB = require('./config/database.js');
const User = require('./models/user.js');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const authRouter = require('./routes/auth.js');
const profileRouter = require('./routes/profile.js');
const requestRouter = require('./routes/request.js');
const userRouter = require('./routes/user.js');


const app = express();

app.use(cors({
    origin:"http://localhost:5173",
    credentials: true,
}))



app.use(cookieParser()); //express.json() gives the middleware function that parses incoming cookie.
app.use(express.json()); //express.json() gives the middleware function that converts JSON object to a js object


app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);
app.use('/', userRouter);

connectDB()
.then(()=>{
    console.log("App is connected to DB");
    app.listen(1777, ()=>{ console.log("server is up and running on portal 1777"); }) 
})
.catch((err)=>{
    console.log("Database cannot be connected to app")
})

