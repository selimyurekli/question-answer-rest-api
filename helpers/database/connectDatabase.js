const mongoose = require("mongoose");

const connectDatabase = ()=>{
    mongoose.connect(process.env.MONGO_URI,{
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true,
        useUnifiedTopology: true
    })
    .then((res) => console.log("Succesfully connected to DB"))
    .catch((err)=> console.log(err));

};



module.exports = {
    connectDatabase
}