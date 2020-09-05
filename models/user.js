const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const questionModel = require("./question");
const Schema = mongoose.Schema;


const userSchema = new Schema({
    name: {
        type :String, 
        required: [true, "Please provide a name"]
    },
    email:{
        type: String, 
        required: [true, "Please provide an email"],
        //gmail.com gibi olmalı
        unique: [true,"Try different email"],
        //eşleşme yapısı
        match:[
            /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
            "Please provide email with proper format"
        ]
    },
    role: {
        type: String,
        default: "user",
        enum: ["user", "admin"]


    },

    password:{
        type: String,
        minlength:[6,"please provide a password with minimum length: 6"],
        required: [true, "please provide a password"],
        select: false
    },
    createdAt: {
        type: Date,
        default: Date.now,

    },
    title: {
        type: String
    },
    about: {
        type: String
    } ,
    place: {
        type: String
    },
    website: {
        type: String
    },
    profile_image: {
        type:String,
        default: "default.jpg"
    },
    blocked: {
        type: Boolean,
        default :false
    },
    resetPasswordToken:{
        type: String
    },
    resetPasswordTokenExpire:{
        type: Date
    }
});
userSchema.methods.generateJWTFromUser = function(){
    const {JWT_SECRET_KEY, JWT_EXPIRE} = process.env;
    const payload = {
        id : this._id,
        name: this.name


    }
    const token = jwt.sign(payload, JWT_SECRET_KEY,{
        expiresIn: JWT_EXPIRE
    });
    return token;

}
userSchema.methods.getResetPasswordTokenFromUser= function(){
    const randomHexString = crypto.randomBytes(15).toString("hex");
    const {FORGOTPASSWORDTOKENEXPIRE} =process.env; 
    const hashedPasswordToken = crypto.createHash("SHA256").update(randomHexString).digest("hex");
    this.resetPasswordToken = hashedPasswordToken;
    this.resetPasswordTokenExpire = Date.now()+parseInt(FORGOTPASSWORDTOKENEXPIRE);

    return this.resetPasswordToken;   

};
userSchema.pre("save",function(next){
    if(!this.isModified("password")){
        next();
    }

    bcrypt.genSalt(10, (err, salt)=> {
        if(err) next(err);
        bcrypt.hash(this.password, salt, (err, hash)=> {
            if(err) next(err);
            this.password= hash;
            next();

        });
    });
})
userSchema.post("remove",async function(){
    await questionModel.deleteMany({
        user: this._id
    });


})

module.exports= mongoose.model("users", userSchema);  