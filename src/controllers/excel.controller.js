const Employee = require('../models/employee.model');

const readXlsxFile = require("read-excel-file/node");
//DEL TUTORIAL DE https://www.bezkoder.com/node-js-upload-excel-file-database/
const upload = async (req, res) => {
  try {
    let path = "./src/uploads/1704758087929-rreyes-empleados.xlsx";
    let texto="";
    
    await readXlsxFile(path).then((rows) => {
      texto = rows;
    });
    
    
    
    

    return res.status(200).json({
      message: "Esto es upload",
      path,
      texto
    });
  } catch (error) {
    return res.status(500).send({
      message: "Could not upload the file: ",
      errormess: error.message
    });
  }
};

/*
    await Employee.sync();
    if (req.file == undefined) {
      return res.status(400).send("Please upload an excel file!");
    }

    let path = "../src/uploads/" + req.file.filename;

    readXlsxFile(path).then((rows) => {
      // skip header
      rows.shift();
      console.log(rows, "+++++++++");
      let tutorials = [];

      rows.forEach((row) => {
        let tutorial = {
          employeeId: row[0],
          empNumber: row[1],
          fullName: row[2],
        };

        tutorials.push(tutorial);
      });
      Employee.bulkCreate(tutorials)
        .then(() => {
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

*/

const getTutorials = (req, res) => {
    Employee.findAll()
    .then((data) => {
      return res.send(data);
    })
    .catch((err) => {
      return res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
      });
    });
};

module.exports = {
  upload,
  getTutorials,
};