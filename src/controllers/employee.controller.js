//importar dependencias y modulos
const Employee = require('../models/employee.model');
const fs = require('fs');

//importar servicios o helpers
//const jwt = require('../services/jwt');
//const { validateUser,validateUserUpdate } = require('../helpers/validate');
const readXlsxFile = require("read-excel-file/node");

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
            return res.status(400).send("Please upload an excel file!");
        }

        let path = "./src/uploads/" + req.file.filename;

        await readXlsxFile(path).then((rows) => {
            // skip header
            rows.shift();

            let employees = [];

            rows.forEach((row) => {
                let employee = {
                    employeeId: null,
                    empNumber: row[0],
                    fullName: row[1],
                };

                employees.push(employee);
            });
            Employee.bulkCreate(employees)
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
        });
    } catch (error) {
        return res.status(500).send({
            message: "Could not upload the file: ",
            errormess: error.message
        });
    }
}

const list = (req, res) => {
    Employee.findAll()
    .then((data) => {
      return res.send(data);
    })
    .catch((err) => {
      return res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving employees.",
      });
    });
};

//exportar acciones
module.exports = {
    prueba,
    register,
    list
}