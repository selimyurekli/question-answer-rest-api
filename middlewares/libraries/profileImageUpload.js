var multer  = require('multer')
const path = require("path");
const CustomError = require('../../helpers/error/CustomError');
//Storage and file filtreleme
const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        const rootDir = path.dirname(require.main.filename);
        cb(null, rootDir+"/public/uploads");
    },
    filename:  (req, file, cb)=> {
        //mimetype is like "image/png"
        const extension = file.mimetype.split("/")[1];
        if(!(req.user.id===undefined)){
            cb(null, "image"+"-"+req.user.id+"."+extension);
        }
        else{
            cb(new CustomError("Undefined-id",400),false);
        }
    }
});


const fileFilter = (req, file, cb )=>{
    const extension = file.mimetype.split("/")[1];
    if(extension === "jpeg" ||extension === "jpg"||extension === "gif"||extension === "png" ){

        cb(null, true);
    }
    else{
        return cb(new CustomError("Please enter a valid image file",400),false);
    }

}

const profileImageUpload = multer({storage,fileFilter});

module.exports = profileImageUpload;







