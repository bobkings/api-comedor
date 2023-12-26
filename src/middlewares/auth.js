//importar modulos
const jwt = require("jwt-simple");
const moment = require("moment");

//importar clave secreta
const libjwt = require("../services/jwt");
const secret = libjwt.secret;

//middleware de autenticacion
exports.auth = (levelcheck='') => {

    return (req, res, next) => {
        //*comprobar si llega cabecera de autenticacion
        if(!req.headers.authorization){
            return res.status(403).json({
                status: "error",
                message: "La peticion no tiene la cabecera de autenticacion",
                levelcheck
            })
        }
    
        //limpiar el token
        let token = req.headers.authorization.replace(/['"]+/g,'');
        
        //decodificar el token
        try {
            let payload = jwt.decode(token, secret);
    
            //comprobar expiracion del token
            if(payload.exp <= moment().unix()){
                return res.status(401).json({
                    status: "error",
                    message: "token expirado"
                }) 
            }

            if(levelcheck && payload.level!=levelcheck){
                return res.status(401).json({
                    status: "error",
                    message: "Petición no autorizada"
                })                
            }
            //agregar datos de usuario a request
            req.user=payload;
        } catch (error) {
            return res.status(404).json({
                status: "error",
                message: "token invalida"
            })
        }
    
    
        //pasar a ejecucion de accion
        next();
    }

}

