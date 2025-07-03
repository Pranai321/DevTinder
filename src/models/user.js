
const validator = require('validator');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
    firstName :{
        type: String,
        required: true,
        minLength:4
    },
    lastName:{
        type: String
    },
     emailId:{
        type: String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
               throw new Error("Email not valid");
            }
        }
     },
     password:{
        type:String,
        minLength:8,
        requires:true,
        validate(value){
         if(!validator.isStrongPassword(value)){
            throw new Error("The password is not strong");
         }
        }
     },
     age:{
        type:Number,
        min:18
     },
     gender:{
        type:String,
        validate(value){
            if(value!= 'male' && value!= 'female' && value !='others' ){
               throw new Error("Invalid Gender");
            }
        }
     },
     skills:{
      type:[String],
      default:[]
     },
     photoUrl:{
      type:String
     },
     about:{
      type:String,
      default:"Placeholder"
     }
},{timestamps:true})

userSchema.methods.getJWT = function(){
   const token = jwt.sign({_id :this._id}, "Pranai123@", {expiresIn:'1h'});
   return token;
}
userSchema.methods.validatePassword = async function(password){
   const originalPassword = password;
   const hashedPassword = this.password;
   const isPasswordCorrect = await bcrypt.compare(originalPassword , hashedPassword);
   return isPasswordCorrect;
} 
const userModel = mongoose.model("user",userSchema); 

module.exports = userModel;