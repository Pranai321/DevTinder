const validator = require ('validator');

const isValidated= (req)=>{
    const {firstName, lastName, password, emailId} =req.body;
    if(!firstName || !lastName){
        throw new Error("Name is not valid");
    }
    else if( !password || !validator.isStrongPassword(password) ) {
        throw new Error("Password is invalid");
    }
}

// This function needs more validations
const editValidator = (req)=>{
    // console.log(req.body); 
    const ALLOWED_UPDATES = ["firstName", "lastName", "age", "gender", "skills", "photoUrl", "about"];
    const isValid = Object.keys(req.body).every((key)=>{
        return ALLOWED_UPDATES.includes(key);
    });
    if(!isValid){
        return false;
    }
    return true;
}

module.exports = {isValidated,
                  editValidator
                }