const jwt = require('jsonwebtoken');
const User = require('../models/user.js');
const userAuth = async (req,res,next)=>{
    try{
    const token = req.cookies.token;
    if(!token){
        throw new Error("Please Login");
    }
    const decodedMessage =  jwt.verify(token, 'Pranai123@');
    const { _id } = decodedMessage;
    const user = await User.findById(_id);
    if(!user){
        throw new Error("Please Login again");
    }
    req.user = user;
    next();
    }catch(err){
        res.status(401).send(err.message);
        // console.log(err);
    }
    

}
module.exports = { userAuth };