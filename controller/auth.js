const userModel = require("../models/user");
//POST DATA
const jwt = require('jsonwebtoken');
const {isValidate,comparePassword} = require("../helpers/input/inputHelpers");
const {sendJWTToClient}= require("../helpers/authorization/tokenFunctions");
const AsyncHandler = require("express-async-handler");
const CustomError = require("../helpers/error/CustomError");
const {sendEmail} = require("../helpers/libraries/sendEmail");
const { response } = require("express");

const register = AsyncHandler(async (req,res,next)=>{
            
            //Sürekli try catch yapmak sıkıntı install express-async-handler
            const {name, email, password, role} = req.body; 
            const user123= await userModel.create({
               name,
               email,
               password,
               role
            });
            sendJWTToClient(user123, res);
});

const login =AsyncHandler(async(req,res,next)=>{
    const{ email , password } = req.body;
    if(!isValidate(email,password)){
        return next(new CustomError("Please check your inputs",400));
    }
    //"+" koymazsan sadece paralo, koyarsan emaile ait bilgilerin hepsi gelir,
    
    const user = await userModel.findOne({email}).select("+password");
    if(!comparePassword(password, user.password)){
        return next(new CustomError("Please check your credentials", 400));
    }
    sendJWTToClient(user, res);    

});
const logout= AsyncHandler(async (req,res,next)=>{
    const {JWT_COOKIE_EXPIRE_TIME,NODE_ENV} = process.env;
    return res
    .status(200)
    .cookie("access_token",{
        httpOnly:true,
        expires: new Date(Date.now()),
        //Development ortamında https yok bu yüzden false diycez, fakat normalde true
        secure: NODE_ENV==="development" ? false: true
    })
    .json({
            success: true,
            message:"Logout successfull" 
    });




});


const getUser= (req,res,next)=>{
    const JWT_SECRET_KEY = process.env;
    console.log(req.user.email);
    res
    .status(200)
    .json({
        succes: true,
        data:{
            id: req.user.id,
            name: req.user.name
        }
    });
}
const imageUpload = AsyncHandler(async (req,res,next)=>{
    const user = await userModel.findByIdAndUpdate(req.user.id,{
        profile_image: req.file.filename
    },{
        new:true,
        runValidators: true
    })
    res.status(200)
    .json({
        success : "true",
        message: "Image upload successfull",
        data: {
            id: user.id,
            name: user.name,
            profile: user.profile_image
        }

    })
})

const forgotpassword = AsyncHandler(async(req,res,next)=>{
    const resetEmail = req.body.email;
    const user = await userModel.findOne({"email":resetEmail});
    if(!user){
        return next(new CustomError("There is no user with that email",400));
    }
    const resetPasswordToken = user.getResetPasswordTokenFromUser();
    await user.save();

    const resetPasswordUrl = `http://localhost:5000/api/auth/resetpassword?resetPasswordToken=${resetPasswordToken}`;
    const {SMTP_USER} = process.env;
    
    try{
    let info = await sendEmail({

        from:SMTP_USER, // sender address
        to:resetEmail , // list of receivers
        subject: "Reset Your Password",
        html: `
            <h3>Reset Your Password</h3>
            <p>You can reset your password from <a href='${resetPasswordUrl}' target = '_blank'>this link</a></p>
            `
        });
        res.status(200).json({
            success:true,
            message:"Token sent to "+resetEmail, 
            data: user
        })
    }    
    catch{
        user.resetPasswordToken =undefined;
        user.resetPasswordTokenExpire = undefined;
        user.save();
        return next(new CustomError("Email can not be sent",500));
    }
   
});

const resetPassword = AsyncHandler(async(req,res,next)=>{
    //url/auth/resetpassword?resetpasswordtoken=Token şeklinde gleicek
    //Token ' ı almak için

    const Token = req.query.resetPasswordToken;
    console.log(Token);
    const newPassword =req.body.password;
    if(!Token){
        return next(new CustomError("Please provide a valid token",400));
    }
    const user = await userModel.findOne({
        resetPasswordToken:Token,
        resetPasswordTokenExpire:{$gt:Date.now()}
    })
    console.log("eski: " ,user);

    if(!user){
        return next(new CustomError("Unvalid Token or Session Expired",400));
    }
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpire = undefined;
    await user.save();
    console.log("yeni: ", user);
    res.status(200).json({
        success:true,
        message: "Reset password process successfull"
    });
})
const editProfile =  AsyncHandler(async(req,res,next)=>{
    editInfo = req.body;
    
    if(editInfo.hasOwnProperty("role")){
        console.log("role")
        return next(new CustomError("You are not authorized",400));
    }
    if(editInfo.hasOwnProperty("email")){
        console.log("email")

        return next(new CustomError("You are not authorized",400));
    }if(editInfo.hasOwnProperty("password")){
        console.log("password")

        return next(new CustomError("You are not authorized",400));
    }
    if(editInfo.hasOwnProperty("createdAt")){
        console.log("createdAt")

        return next(new CustomError("You are not authorized",400));
    }
    if(editInfo.hasOwnProperty("resetPasswordTokenExpire")){
        console.log("resetPasswordTokenExpire")

        return next(new CustomError("You are not authorized",400));
    }
    if(editInfo.hasOwnProperty("resetPasswordToken")){
        console.log("resetPasswordToken")

        return next(new CustomError("You are not authorized",400));
    }
    if(editInfo.hasOwnProperty("blocked")){
        console.log("blocked")

        return next(new CustomError("You are not authorized",400));
    }
    
    const user= await userModel.findByIdAndUpdate(req.user.id, editInfo, {
        new: true,
        runValidators: true
    })
    res.status(200).json({
        success: true,
        message: user
    })






});
module.exports = {
    register,
    login,
    logout,
    getUser,
    forgotpassword,
    resetPassword,
    imageUpload,
    editProfile
}