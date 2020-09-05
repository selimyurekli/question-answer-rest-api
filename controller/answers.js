const AsyncHandler = require("express-async-handler");
const CustomError = require("../helpers/error/CustomError");
const questionModel = require("../models/question");
const answerModel = require("../models/answer");



const addAnswerToQuestion =AsyncHandler(async(req,res,next)=>{
    const question_id = req.params.question_id;
    const user_id = req.user.id;
    const information = req.body;
    const answer =await answerModel.create({
        ...information,
        user : user_id,
        question: question_id
    })


    res.status(200).json({
        success: true,
        message: "Answer created",
        data: answer
    });




});
const getAllAnswers = AsyncHandler(async(req,res,next)=>{
    const question_id = req.params.question_id;
    

    const question = await questionModel.findById(question_id).populate("answers");


    const answers = question.answers;


    res.status(200).json({
        success : true,
        data : answers
    })


});
const getSingleAnswer = AsyncHandler(async(req,res,next)=>{
    const answer_id = req.params.answer_id;

    const answer = await answerModel
    .findById(answer_id)
    .populate({
        path: "question",
        select: "title content"
    })
    .populate({
        path: "user",
        select: "name email"
    })
    res.status(200).json({
        success: true,
        data: answer
    });
    



});
const editAnswer = AsyncHandler(async(req,res,next)=>{
    information = req.body;
    answerId= req.params.answer_id;

    const answer = await answerModel.findById(answerId);
    answer.content = information.content;
    await answer.save();

    res.status(200).json({

        success: true,
        data: answer

    });
});
const deleteAnswer = AsyncHandler(async(req,res,next)=>{
    const answerId = req.params.answerId;
    const questionId = req.params.question_id;

    const answer= await answerModel.findByIdAndRemove(answerId);

    const question   = await questionModel.findById(questionId);
    question.answers.splice(question.answers.indexOf(answerId),1);
    await question.save();


    res.status(200).json({
        success: true,
        message: "Delete operation is successfull"
    });
});
const likeAnswer = AsyncHandler(async(req,res,next)=>{

    const answerId= req.params.answer_id;
    const userId = req.user.id;
    const answer = await answerModel.findById(answerId);
    if(question.likes.includes(userId)){
        return next(new CustomError("You have already liked this question",400))
    }
    answer.likes.push(userId);
    await answer.save();
    
    res.status(200).json({
        success: true,
        likes: answer.likes
    });

})
const unlikeAnswer = AsyncHandler(async(req,res,next)=>{

    const answerId = req.params.answer_id;
    const userId = req.user.id;
    const answer = await questionModel.findById(answerId);
    if(!answer.likes.includes(userId)){
        return next(new CustomError("You have already unliked this question",400))
    }
    answer.likes.remove(userId);
    await answer.save();
    
    res.status(200).json({
        success: true,
        likes: answer.likes
    });
    
})
module.exports  = {
    addAnswerToQuestion,
    getAllAnswers,
    getSingleAnswer,
    editAnswer,
    deleteAnswer,
    likeAnswer,
    unlikeAnswer
}



