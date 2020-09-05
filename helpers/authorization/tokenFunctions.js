
const jwt = require('jsonwebtoken');

const sendJWTToClient = function(user, response){
    const {JWT_COOKIE_EXPIRE_TIME,NODE_ENV} = process.env;
    
    const token = user.generateJWTFromUser()
    console.log("token:"+token);
    response
    .status(200)
    .cookie("access_token", token, {
        httpOnly:true,
        expires: new Date(Date.now() + parseInt(JWT_COOKIE_EXPIRE_TIME)*1000*60),
        //Development ortamında https yok bu yüzden false diycez, fakat normalde true
        secure: NODE_ENV==="development" ? false: true
    })
    .json({
            success: true,
            message: "Register/Login process is successfully completed!",
            data: {
                name : user.name,
                email: user.email,
                token: token
            },
            
    });

}
const isTokenIncluded = (req)=>{
    return (req.headers.authorization && req.headers.authorization.startsWith("bearer"));


}




module.exports = {
    sendJWTToClient,
    isTokenIncluded
}





