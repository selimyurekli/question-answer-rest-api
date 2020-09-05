const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const questionModel = require("./question");
const answerSchema = new Schema({
    content:{
        type:String,
        required:[true,"Please provide a content for your answer"],
        minlength: [10, "Please provide a content with min 10 length"]
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    question:{
        type: mongoose.SchemaTypes.ObjectId,
        ref:"questions",
        required:true

    },
    user:{
        type: mongoose.SchemaTypes.ObjectId,
        ref:"users",
        required:true
    }



});

answerSchema.pre("save",async function(next){
    if(!(this.isModified("user"))){
        return next()
    }
    try{
        const question_id = this.question;
        const question = await questionModel.findById(question_id);
        question.answers.push(this._id);
        
        await question.save();
        next();
    }
    catch(err){
        return next(err);
    }
});

module.exports = mongoose.model("answers",answerSchema);





