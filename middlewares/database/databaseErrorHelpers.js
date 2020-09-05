const userModel = require("../../models/user");
const AsyncHandler = require("express-async-handler");
const CustomError = require("../../helpers/error/CustomError");
const questionModel =  require("../../models/question");
const answerModel =  require("../../models/answer");




const checkUserExists = AsyncHandler(async(req,res,next)=>{
    const id = req.params.id;
    const user = await userModel.findById(id);
    if(!user){
        return next(new CustomError("User Not found with that id",404));
    }
    next();
});
const checkQuestionExists = AsyncHandler(async(req,res,next)=>{
    const question_id= req.params.id || req.params.question_id;
    const user = await questionModel.findById( question_id);
    if(!user){
        return next(new CustomError("Question Not found with that id",404));
    }
    next();
});
const checkQuestionAndAnswerExists = AsyncHandler(async(req,res,next)=>{
    const question_id  = req.params.question_id || req.params.id
    const answer_id = req.params.answer_id;

    const answer =await answerModel.findOne({
        _id: answer_id,
        question: question_id
    });
    if(!answer){
        return next(new CustomError("There is no such an answer associated with that question",404));
    }
    next();
});
module.exports = {
    checkUserExists,
    checkQuestionExists,
    checkQuestionAndAnswerExists
};