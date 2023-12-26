const jwt = require('jwt-simple');
const moment = require('moment');

//clave secreta
const secret = 'SECRET_KEY_CANTEEN_PROJECT_20231221';

//crear funcion para generar tokens
const createToken = (user) => {
    const payLoad = {
        id: user.userId,
        userName: user.userName,
        fullName: user.fullName,
        level: user.level,
        iat: moment().unix(),
        exp: moment().add(30, 'days').unix()
    }

    return jwt.encode(payLoad, secret);
}

module.exports = {
    secret,
    createToken
}