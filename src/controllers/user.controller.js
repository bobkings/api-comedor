//importar dependencias y modulos
const User = require('../models/user.model');
const bcrypt = require('bcrypt');

//importar servicios o helpers
const jwt = require('../services/jwt');
const { validateUser } = require('../helpers/validate');

const prueba = (req, res) => {
    return res.status(200).json({
        message: "Metodo de prueba, userController",
        usuario: req.user
    })
}

//registrar usuario
const register = async (req, res) => {
    //recoger datos
    const dataUser = req.body;
    //para que se cree la tabla en caso de que no exista
    await User.sync();

    //que lleguen los parametros
    const validate = validateUser(dataUser);

    if(validate){
        return res.status(400).json({
            ok: false,
            message: "Validation failed",
            validate
        })
    }
    User.findOne({
        where: {
            userName: dataUser.userName
        }
    }).then(user => {
        if(user){
            return res.status(400).json({
                ok: true,
                message: "User already exists",
                user
            })
        }

        //cifrar contraseña
        bcrypt.hash(dataUser.password, 10, async (error, pwd) => {
            dataUser.password=pwd;

            const saveUser = await User.create({
                userName: dataUser.userName,
                fullName: dataUser.fullName,
                level: dataUser.level,
                password: dataUser.password
            })

            return res.status(201).json({
                ok: true,
                status: "success",
                message: "User created succesfully",
                user
            })
        })

    }).catch(error => {
        return res.status(400).json({
            ok: false,
            message: error.message
        })        
    })
    
}

const login = (req, res) => {
    //recoger parametros de body
    let dataUser = req.body;

    if(!dataUser.userName || !dataUser.password){
        return res.status(400).send({
            status: "error",
            message: "faltan datos por enviar"
        })
    }

    //buscar en la bd si existe
    User.findOne({        
        where: {
            userName: dataUser.userName
        }
    })
    .then(user => {
        if(!user){
            return res.status(404).json({
                status: "error",
                message: "No se encontro usuario"
            })            
        }

        //comprobar su contraseña
        const pwd = bcrypt.compareSync(dataUser.password, user.password);

        if(!pwd){
            return res.status(400).json({
                status: "error",
                message: "No te has identificado correctamente"
            })
        }

        //conseguir token
        const token = jwt.createToken(user);
    

        //devolver datos del usuario    
        return res.status(200).json({
            status: "success",
            message: "Te identificaste correctamente",
            user: {
                userName: user.userName,
                fullName: user.fullName
            },
            token
        })

    }) 
    .catch(error => {
        return res.status(404).json({
            status: "error",
            message: error.message
        })
    })

}


const update = (req, res) => {
    //recogemos info de lo que se va a actualizar
    let userToUpdate = req.body;

    //eliminar campos sobrantes de lo que se va a actualizar
    //delete userToUpdate.iat;
    //delete userToUpdate.exp;            

    //comprobar si el usuario ya existe
    //buscar en la bd si existe
    /* 
    User.findOne({        
        where: {
            userName: userToUpdate.userName
        }
    })
    .then
    */
    
    User.find({ $or: [
        {email:userToUpdate.email.toLowerCase()},
        {nick:userToUpdate.nick.toLowerCase()},
    ]}).exec()
    .then(async (users) => {
        //en caso de que el usuario quiera usar un nombre de otro usuario no permite avanzar, solo si es el mismo
        let userIsset = false;
        users.forEach(user => {
            if(user && user._id != userIdentity.id) userIsset = true;
        })
         
        if(userIsset){
            return res.status(200).send({
                status: "success",
                message: "El usuario ya existe"
            })
        }
        


        //si me llega la paswrd cifrarla
        //cifrar la contraseña
        if(userToUpdate.password){
            let pwd = await bcrypt.hash(userToUpdate.password, 10); 
            userToUpdate.password = pwd;
            console.log(pwd);
            

        }else{
            delete userToUpdate.password;
        }

        //buscar y actualizar con promises
        /*
        User.findByIdAndUpdate(userIdentity.id, userToUpdate, {new:true})
        .then(userUpdate => {
            return res.status(200).json({
                status: "success",
                message: "Metodo de actualizar usuario",
                user: userUpdate
            })        

        })
        .catch(error => {
            return res.status(500).json({status: "error", message: error.message});
        })
        */

        //buscar y actualizar con await       
        try {
            let userUpdated = await User.findByIdAndUpdate(userIdentity.id, userToUpdate, {new:true});
            
            if(!userUpdated){
                return res.status(404).json({status: "error", message: error.message});
            }
            
            //devolver respuesta
            return res.status(200).json({
                status: "success",
                message: "Metodo de actualizar usuario",
                user: userUpdated
            });
        } catch (error) {
            return res.status(500).json({
                status: "error",
                message: "Error al actualizar",
                error: error.message
            });
        } 
        
    })
    .catch(error => {
        return res.status(500).json({status: "error", message: error.message});

    })



}


//listar usuarios
const list = async (req, res) => {
    const users = await User.findAll();
    return res.status(200).json({
        ok: true,
        status: "success",
        body: users
    })
};

//exportar acciones
module.exports = {
    prueba,
    register,
    list,
    login
}