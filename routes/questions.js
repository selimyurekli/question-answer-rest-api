const express  = require("express");
const {getAccessToRoute,getOwnerAccess} = require("../middlewares/authorization/auth");
const { askNewQuestion,getAllQuestions,getSelectedQuestion,editQuestion ,deleteQuestion,likeQuestion,undoLikeQuestion} = require("../controller/questions");
const { checkQuestionExists } = require("../middlewares/database/databaseErrorHelpers");
const answers = require("./answers");
const questionModel = require("../models/question");
const {QuestionQueryMiddleware} = require("../middlewares/query/QuestionQueryMiddleware");
const {AnswerQueryMiddleware} = require("../middlewares/query/AnswerQueryMiddleware");
const router = express.Router();

router.get("/",QuestionQueryMiddleware(questionModel,{
    population:{
        path : "user",
        select: "name profile_image"
    }
}),getAllQuestions);
router.post("/ask",getAccessToRoute,askNewQuestion);
router.get("/:id",checkQuestionExists,AnswerQueryMiddleware(questionModel,{
    pagination: [{
        path:"user",
        select: "name profile_image"
    },

    {
        path: "answers",
        select: "content"
    }
]
}),getSelectedQuestion)
router.put("/edit/:id", [getAccessToRoute,checkQuestionExists,getOwnerAccess],editQuestion);
router.delete("/delete/:id",[getAccessToRoute,checkQuestionExists,getOwnerAccess],deleteQuestion);
router.get("/:id/like",[getAccessToRoute,checkQuestionExists],likeQuestion);
router.get("/:id/unlike",[getAccessToRoute,checkQuestionExists],undoLikeQuestion);
router.use("/:question_id/answers",checkQuestionExists,answers);

module.exports = router;

