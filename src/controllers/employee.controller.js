//importar dependencias y modulos
const Employee = require('../models/employee.model');
const fs = require('fs');
const {readExcel} = require('../helpers/readExcel');
const QRCode = require('qrcode');
const { validateNumber } = require('../helpers/validate');

//importar servicios o helpers
//const jwt = require('../services/jwt');
//const { validateUser,validateUserUpdate } = require('../helpers/validate');


const prueba = (req, res) => {
    return res.status(200).json({
        ok: true,
        message: "Test method, employeeController"
    })
}

//registrar usuario
const register = async (req, res) => {
    try {
        await Employee.sync();
        if (req.file == undefined) {
            return res.status(400).send({
                message: "Please upload an excel file!"
            });
        }

        let path = "./src/uploads/" + req.file.filename;
        
        const employees=await readExcel(path);

        //bulkcreate para meter multiples registros a la bd
        //con la option updateOnDuplicate, se pueden seleccionar campos que se actualizan en caso de que se repita un campo unique (en este caso campo empNumber)
        //en este ejemplo, se requiere sustituir el nombre completo y el campo de fecha de actualizacion
        Employee.bulkCreate(employees, {
            updateOnDuplicate: ['fullName','updatedAt']
        })
            .then(() => {
                fs.unlinkSync(path);
                res.status(200).send({
                    message: "Uploaded the file successfully: " + req.file.originalname,
                });
            })
            .catch((error) => {
                res.status(500).send({
                    message: "Fail to import data into database!",
                    error: error.message,
                });
            });

    } catch (error) {
        return res.status(500).send({
            message: "Could not upload the file: ",
            errormess: error.message
        });
    }
}


const deleteEmp = async (req, res) => {
    try {
        let {idsToDelete}= req.body;
        
        const employees = await Employee.destroy({
            where:{ employeeId: idsToDelete}            
        });
        
        return res.status(200).json({
            ok: true,
            body: employees
        })        
    } catch (error) {
        return res.status(500).send({
            ok: false,
            message: error.message
        });           
    }
}

//listar usuarios
const list = async (req, res) => {
    try {
        let page=req.params.page ? req.params.page : 1;
        let limit = req.body.limit;
        let offset = 0 + (page - 1) * limit;
        const employees = await Employee.findAndCountAll({
            limit,
            offset
        });
        return res.status(200).json({
            ok: true,
            body: employees
        })
        
    } catch (error) {
        return res.status(500).send({
            ok: false,
            message: error.message
        });        
    }
};

const generateQR = (req, res) => {
    try {
        /* para mostrar en svg */
        /*
        let options = { errorCorrectionLevel: 'H',
        type: 'svg' };        
        QRCode.toString('I am a pony!', options, function (err, data) {
            return res.sendFile(data);
        });
        */
        let {empNumber}=req.body;

        //que lleguen los parametros
        const validate = validateNumber(empNumber);
        
        if(!validate) throw new Error("Invalid data type")

        let opts = {
            errorCorrectionLevel: 'H',
            type: 'image/png',
            width: '512',
            height: '512'
        }
          
        QRCode.toDataURL(empNumber, opts, function (err, url) {
            if (err) throw err

            return res.send(url) 
        })

    } catch (error) {
        return res.status(500).send({
            ok: false,
            message: error.message
        });                
    }
}
//exportar acciones
module.exports = {
    prueba,
    register,
    deleteEmp,
    list,
    generateQR
}