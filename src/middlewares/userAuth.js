const jwt = require('jsonwebtoken');
const User = require('../models/user.js');
const userAuth = async (req,res,next)=>{
    try{
    const token = req.cookies.token;
    if(!token){
        throw new Error("Invalid token");
    }
    const decodedMessage =  jwt.verify(token, 'Pranai123@');
    const { _id } = decodedMessage;
    const user = await User.findById(_id);
    if(!user){
        throw new Error("Invalid user");
    }
    req.user = user;
    next();
    }catch(err){
        res.status(400).send(err.message);
    }
    

}
module.exports = { userAuth };