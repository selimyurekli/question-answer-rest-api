const userModel = require("../models/user");
const AsyncHandler = require("express-async-handler");
const CustomError = require("../helpers/error/CustomError");

const block =AsyncHandler(async (req,res,next)=>{
    const id  = req.params.id;
    const user = await userModel.findById(id);
    if(user.blocked ===true){
        return next(new CustomError("This user has already been blocked",400));
    }
    user.blocked = true;
    
    await user.save();
    res.status(200).json({
        success: true,
        message : "User "+user.name+ " has been blocked"
    });

});    
const unblock =AsyncHandler(async (req,res,next)=>{
    const id  = req.params.id;
    const user = await userModel.findById(id);
    if(user.blocked ===false){
        return next(new CustomError("This user has already been unblocked",400));
    }
    else{
        user.blocked ===false;
    }
    await user.save();
    res.status(200).json({
        success: true,
        message : "User "+user.name+ " has been unblocked"
    });

});    

const deleteUser =AsyncHandler(async (req,res,next)=>{
    const id = req.params.id;
    const user = await userModel.findById(id);
    
    await user.remove();

    
    res.status(200).json({
        success: true,
        message: "Delete Operation is successfull"
    })


});
module.exports = {
    block,
    unblock,
    deleteUser
}