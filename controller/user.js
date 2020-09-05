const userModel = require("../models/user");
const AsyncHandler = require("express-async-handler");

const getUser = AsyncHandler(async(req,res,next)=>{
    const id = req.params.id;
    const user = await userModel.findById(id);
    res.status(200).json({
        success:true, 
        message:"User successfully found",
        data: user
    });
})
const getAllUsers = AsyncHandler(async(req,res,next)=>{
    res.status(200).json(res.queryResults);

});    
module.exports = {
    getUser,
    getAllUsers
}