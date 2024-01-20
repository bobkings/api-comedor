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

const validateUserUpdate = (params) => {

    let userName = !validator.isEmpty(params.userName) && 
    validator.isLength(params.userName, {min: 3, max: 50});
    let fullName = !validator.isEmpty(params.fullName);
    let level = !validator.isEmpty(params.level);

    let password = !validator.isEmpty(params.password) ? validator.isLength(params.password, {min: 8, max: 20}) : true;  
    console.log(params.password);
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

const validateOrder = (params) => {

    let employeeId = !validator.isEmpty(params.employeeId) && 
    validator.isInt(params.employeeId);
    let special = !validator.isEmpty(params.special) && 
    validator.isBoolean(params.special);
    let toGo = !validator.isEmpty(params.toGo) && 
    validator.isBoolean(params.toGo);
    let soda = !validator.isEmpty(params.soda) && 
    validator.isBoolean(params.soda);

    if(!employeeId || !special || !toGo || !soda){
        return {
            employeeId,
            special,
            toGo,
            soda
        }        
    }else{
        return false;
    }
   
}

const validateNumber = (empNumber) => {
    let isInteger = validator.isInt(empNumber);

    return isInteger;
}

module.exports = {
    validateUser,
    validateUserUpdate,
    validateNumber,
    validateOrder
}