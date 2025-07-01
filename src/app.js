const {userAuth} = require('./middlewares/auth.js');
const express = require("express");
const connectDB = require('./config/database.js');
const User = require('./models/user.js');
const isValidated = require('./utils/validation.js');
const bcrypt = require('bcrypt');
const validator = require('validator');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');




const app = express(); 

app.use(cookieParser()); //express.json() gives the middleware function parses incoming cookie.
app.use(express.json()); //express.json() gives the middleware function that converts JSON object to a js object

app.post('/signup',async (req,res)=>{

    try{
        // encrypting the password using bcrypt package
        const hashedPassword = await bcrypt.hash(req.body.password,10);
        isValidated(req);
        const user = new User({
            firstName: req.body.firstName, 
            lastName: req.body.lastName, 
            password: hashedPassword, 
            emailId: req.body.emailId
        });
        await user.save()
        res.send("User signed-up")

    }catch(err){
        res.status(404).send(err.message)
    }
    //creating a new instance of a userModel
    
})
app.post('/login', async (req,res)=>{
    try{
        const emailId = req.body.emailId;
        const password = req.body.password;
        if(!emailId || !validator.isEmail(emailId)){
            throw new Error("Email Invalid");
        }
        const user = await User.findOne({emailId, emailId}); 
        if(!user){
            throw new Error("Email wrong");
        }
        const isPasswordCorrect = await bcrypt.compare(password,user.password);
        if(!isPasswordCorrect){
            throw new Error("Password wrong");
        }
        else{
            const token = await jwt.sign({_id: user._id}, 'Pranai123@', {expiresIn:60}) ;
            res.cookie("token", token);
            res.send("Login Success")
        }
    }catch(err){
        res.status(400).send(err.message)
    }
    
})

//gets all the details of the User using Id after Authentication using userAuth middleware
app.get('/profile', userAuth, async (req,res)=>{
    try{
        res.send(req.user);
    }catch(err){
        res.status(400).send("err " +err.message);
    }
    
})

//sending connection request after authenticating the useer using userAuth middleware
app.post('/sendConnectionRequest', userAuth, (req,res)=>{
    try{
        res.send(req.user.firstName+" sent a connection request");
    }catch(err){
        res.status(400).send(err.message);
    }
    
})
//gets all the details of a user based on the given field
app.get('/user', async (req,res)=>{

    try{
        const mail = req.body.emailId;
        const user = await User.find({emailId: mail});
        if(user.length===0){
            res.send("User not found");
        }else{
            res.send(user);
        }
        
    }catch(err){
        res.status(404).send("Something went wrong");
        
    }

})
//gets all the documents in a the User Collection for the Feed
app.get('/feed', async (req, res)=>{

    try{
        const users = await User.find({ });
        if(users.length ===0){
            res.send("No users found");
        }else{
            res.send(users);
        }
    }catch(err){
        res.send("Something went wrong");
    }
    
})

//Delete a user(document) from User Collection
app.delete('/user', async (req,res)=>{
    // const userId = req.body.userId;
    const mail = req.body.mail;
    try{
        // await User.findByIdAndDelete(userId);
        await User.findOneAndDelete({emailId:mail});
        res.send("User Deleted");
    }catch(err){
        res.send("Something went wrong");
    }
})

//Update a a user(document)
app.patch('/user/:userId', async(req,res)=>{
    const userId = req?.params.userId;
    const data = req.body;
    try{
        const ALLOWED_UPDATES =["password", "age", "photoUrl", "skills", "gender", "about"];
        const isUpdateAllowed = Object.keys(data).every((key)=>{
            return ALLOWED_UPDATES.includes(key);
        })
        if(!isUpdateAllowed){
            throw new Error("Update not allowed");
        }
        const updatedUser = await User.findByIdAndUpdate(userId,req.body, {runValidators:true}, {new:true} ); //new= true returns the document after updated

        if(updatedUser === null){
            return res.status(404).send("Usernotfound");
        }
        res.send("User Updated");
    }catch(err){
        res.send(err.message);
    }
})
connectDB()
.then(()=>{
    console.log("App is connected to DB");
    app.listen(1777, ()=>{ console.log("server is up and running on portal 1777"); })
})
.catch((err)=>{
    console.log("Database cannot be connected to app")
})

