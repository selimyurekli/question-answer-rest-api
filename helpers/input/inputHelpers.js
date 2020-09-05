const bcrypt = require('bcryptjs');

const isValidate= (email,password)=>{

    return email && password;
}
const comparePassword= (password, hashedPassword)=>{
    const a = bcrypt.compareSync(password, hashedPassword); // false
    return a;
}



module.exports={
    isValidate,
    comparePassword
}