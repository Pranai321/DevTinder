
const validator = require('validator');
const mongoose = require('mongoose');

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
     skils:{
      type:[String],
      default:[]
     },
     photoUrl:{
      type:String
     },
     About:{
      type:String,
      default:"Placeholder"
     }
},{timestamps:true})

const userModel = mongoose.model("user",userSchema);

module.exports = userModel;