const CustomError = require("../../helpers/error/CustomError");
const {isTokenIncluded} = require("../../helpers/authorization/tokenFunctions");
const jwt = require("jsonwebtoken");
const userModel = require("../../models/user");
const questionModel = require("../../models/question");
const answerModel = require("../../models/answer");

const AsyncHandler = require("express-async-handler");



const getAccessToRoute = function(req,res,next){
    //token Controll
    if(!isTokenIncluded(req)){
        return next(new CustomError("You are not authorized to access this route", 401));
    }

    const access_token = req.headers.authorization.split(" ")[1];
    const {JWT_SECRET_KEY} = process.env;

    jwt.verify(access_token,JWT_SECRET_KEY,(err, decoded)=>{
        if(err){
            return next(new CustomError("You are not authorized",401));
        }
        req.user ={ 
            id: decoded.id,
            name: decoded.name,
        }   
        next();
    })
};
const getAdminAccess = async function(req,res,next){
        const id = req.user.id;
        const user = await userModel.findById(id);
        if(user.role !== "admin"){
            return next(new CustomError("Only admin can access to this route",403));
        }
        next();

}
const getOwnerAccess = async function(req,res,next){
    const userId = req.user.id;
    const questionId = req.params.id;
    
    const question = await questionModel.findById(questionId); 
    if(userId != question.user){
        return next(new CustomError("Only owner can handle this question",403));
    }

    next();

}

const getQuestionOwnerAccess = AsyncHandler(async (req,res,next)=>{
    userId= req.user.id;
    questionId = req.params.id;
    const question = await questionModel.findById(questionId);

    if(question.user != userId){
        return next(new CustomError("Only question owner can handle this question",403));
    }
    next()
});

const getAnswerOwnerAccess = AsyncHandler(async (req,res,next)=>{
    userId= req.user.id;
    questionId = req.params.question_id;
    answerId = req.params.answer_id;
    const answer = await answerModel.findById(answerId);

    if(answer.user != userId){
        return next(new CustomError("Only answer owner can handle this question",403));
    }
    next()
});


module.exports ={
    getAccessToRoute,
    getAdminAccess,    
    getOwnerAccess,
    getQuestionOwnerAccess,
    getAnswerOwnerAccess
}