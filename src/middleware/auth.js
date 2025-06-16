const Auth = (req,res,next)=>{
    const token = true;
    if(token){
        next();
    }
    else{
        res.send("not authorised");
    }
}
module.exports = {
    Auth

};