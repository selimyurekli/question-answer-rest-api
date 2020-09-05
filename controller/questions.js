const AsyncHandler = require("express-async-handler");
const CustomError = require("../helpers/error/CustomError");
const questionModel = require("../models/question");


const askNewQuestion = AsyncHandler(async(req,res,next)=>{
    
    information = req.body;
    const question  = await questionModel.create({
        title: information.title, 
        content: information.content,
        user: req.user.id
    });

    if(!question){
        return next(new CustomError("Question can not be created",400));
    }

    res.status(200).json({
        success: true, 
        message: "Question succesfully created",
        data: question

    });
});
const getAllQuestions = AsyncHandler(async(req,res,next)=>{


    res.status(200).json(res.queryResults);


})
const getSelectedQuestion = AsyncHandler(async(req,res,next)=>{
   
    res.status(200).json(res.queryResults);


})
const editQuestion = AsyncHandler(async(req,res,next)=>{
    const information = req.body;
    if(information.hasOwnProperty("slug")){
        return next(new CustomError("You are not authorized",401))
    }
    if(information.hasOwnProperty("createdAt")){
        return next(new CustomError("You are not authorized",401))
        
    }
    if(information.hasOwnProperty("user")){
        return next(new CustomError("You are not authorized",403))
    }
    const questionId = req.params.id
    const question = await questionModel.findById(questionId);
    question.title = information.title;
    question.content = information.content;

    await question.save();
    res.status(200).json({
        success: true,
        data: question
    })

})
const deleteQuestion = AsyncHandler(async(req,res,next)=>{
        const id = req.params.id;

        const question = await questionModel.findByIdAndDelete(id);

        res.status(200).json({
            success:true,
            message:"Delete operation successfull",
            data: question

        })
        

})
const likeQuestion = AsyncHandler(async(req,res,next)=>{

    const questionId = req.params.id;
    const userId = req.user.id;
    const question = await questionModel.findById(questionId);
    if(question.likes.includes(userId)){
        return next(new CustomError("You have already liked this question",400))
    }
    question.likes.push(userId);
    await question.save();
    
    res.status(200).json({
        success: true,
        likes: question.likes
    });

})
const undoLikeQuestion = AsyncHandler(async(req,res,next)=>{

    const questionId = req.params.id;
    const userId = req.user.id;
    const question = await questionModel.findById(questionId);
    if(!question.likes.includes(userId)){
        return next(new CustomError("You have already unliked this question",400))
    }
    question.likes.remove(userId);
    await question.save();
    
    res.status(200).json({
        success: true,
        likes: question.likes
    });

})
module.exports = {
    askNewQuestion,
    getAllQuestions,
    getSelectedQuestion,
    editQuestion,
    deleteQuestion,
    likeQuestion,
    undoLikeQuestion
}