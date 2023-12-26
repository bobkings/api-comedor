const validator = require("validator");

const validateUser = (params) => {

    let userName = !validator.isEmpty(params.userName) && 
    validator.isLength(params.userName, {min: 3, max: 50});
    let fullName = !validator.isEmpty(params.fullName);
    let level = !validator.isEmpty(params.level);
    let password = !validator.isEmpty(params.password) && 
    validator.isLength(params.password, {min: 8, max: 20});  

    if(!userName || !fullName || !level || !password){
        return {
            userName,
            fullName,
            level,
            password
        }        
    }else{
        return false;
    }
   
}

module.exports = {
    validateUser
}