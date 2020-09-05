const CustomError = require("../../helpers/error/CustomError");

const customErrorHandler = (err,req,res,next)=>{
    
    if(err){
        let  customError = err;
        console.log(err);
        if(customError.code === 11000){

            customError = new CustomError("Duplicate Key error collection",400);
        }        
        if(customError.name ==="SyntaxError"){
            customError = new CustomError("Yazı Dizimi Hatasi", 400)
        }
        else if(customError.name ==="ValidationError"){
            customError = new CustomError("Doğrulama Hatası", 400)
        }
        else if(customError.name ==="CastError"){
            customError = new CustomError("Please provide the id in avaliable format", 400);
        }   
        
        
        
        res
        .status(customError.status|| 500)
        .json({
            success: false,
            message: customError.message ,
            name: customError.name,
            status: customError.status || 500
        })
    }
    else
    {
        next();
    }

            
};

module.exports  = customErrorHandler;