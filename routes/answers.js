const express = require("express");
const router = express.Router({mergeParams: true});
const {addAnswerToQuestion,getAllAnswers,getSingleAnswer,editAnswer,deleteAnswer,likeAnswer,unlikeAnswer} = require("../controller/answers");
const { getAccessToRoute,getAnswerOwnerAccess} = require("../middlewares/authorization/auth");
const {checkQuestionAndAnswerExists} = require("../middlewares/database/databaseErrorHelpers")
const {AnswerQueryMiddleware} = require("../middlewares/query/AnswerQueryMiddleware")
const answerModel = require("../models/answer");

router.post("/",getAccessToRoute,addAnswerToQuestion);
router.get("/",getAllAnswers);
router.get("/:answer_id",checkQuestionAndAnswerExists,getSingleAnswer);
router.put("/:answer_id/edit",[checkQuestionAndAnswerExists,getAccessToRoute,getAnswerOwnerAccess],editAnswer);
router.delete("/:answer_id/delete",[checkQuestionAndAnswerExists,getAccessToRoute,getAnswerOwnerAccess],deleteAnswer);
router.get("/:answer_id/like",[checkQuestionAndAnswerExists,getAccessToRoute],likeAnswer);
router.get("/:answer_id/unlike",[checkQuestionAndAnswerExists,getAccessToRoute],unlikeAnswer);








module.exports = router;