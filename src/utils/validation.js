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

module.exports = isValidated;