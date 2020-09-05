const mongoose = require("mongoose");
const slugify = require('slugify');
const { schema } = require("./user");

const Schema = mongoose.Schema;



const questionSchema = new Schema({
    title: {
        type: String,
        required: [true,"Please provide a title"],
        minlength: [10, "Please provide title at least 10 character"],
        unique: true
    },
    content: {
        type: String,
        required: [true, "Please provide a content"]

    },
    slug: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: "users"

    },
    likes:[
        {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "users"
        }
          ],

    answers:[{
        type: mongoose.SchemaTypes.ObjectId,
        ref: "answers"



    }]     

});


questionSchema.pre("save",function(next){
    if(!(this.isModified("title"))){
        next();
    }
    this.slug = this.makeSlug();
    next();
})


questionSchema.methods.makeSlug = function(){
    return slugify(this.title,{
        replacement: '-',  // replace spaces with replacement character, defaults to `-`
        remove: /[*+~.()'"!:@]?/g, // remove characters that match regex, defaults to `undefined`
        lower: true,      // convert to lower case, defaults to `false`
        strict: false,     // strip special characters except replacement, defaults to `false`
    })

}


module.exports= mongoose.model("questions", questionSchema);  
