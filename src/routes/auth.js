const express = require('express');
const AuthRouter = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user.js');
const isValidated = require('../utils/validation.js')
const validator = require('validator');

AuthRouter.post('/signup',async (req,res)=>{

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

AuthRouter.post('/login', async (req,res)=>{
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
        const isPasswordCorrect = await user.validatePassword(password);
        if(!isPasswordCorrect){
            throw new Error("Password wrong");
        }
        else{
            const token = await user.getJWT();
            res.cookie("token", token);
            res.send("Login Success")
        }
    }catch(err){
        res.status(400).send(err.message)
    }
    
})

module.exports = AuthRouter;
