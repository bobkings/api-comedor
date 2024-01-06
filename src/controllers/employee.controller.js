//importar dependencias y modulos
const Employee = require('../models/employee.model');

//importar servicios o helpers
//const jwt = require('../services/jwt');
//const { validateUser,validateUserUpdate } = require('../helpers/validate');
const readXlsxFile = require('read-excel-file');

const prueba = (req, res) => {
    return res.status(200).json({
        ok: true,
        message: "Test method, employeeController"
    })
}

//registrar usuario
const register = async (req, res) => {
    await Employee.sync();
    return res.status(200).json({
        ok: true,
        message: "Test method, employeeController"
    })
    /*
    
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
                ok: false,
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
    */
}



//exportar acciones
module.exports = {
    prueba,
    register
}