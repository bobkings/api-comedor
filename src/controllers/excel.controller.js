const Employee = require('../models/employee.model');

const readXlsxFile = require("read-excel-file");
//DEL TUTORIAL DE https://www.bezkoder.com/node-js-upload-excel-file-database/
const upload = async (req, res) => {
  try {
    await Employee.sync();
    if (req.file == undefined) {
      return res.status(400).send("Please upload an excel file!");
    }

    let path =
      __basedir + "/src/uploads/" + req.file.filename;

    readXlsxFile(path).then((rows) => {
      // skip header
      rows.shift();

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
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Could not upload the file: " + req.file.originalname,
    });
  }
};

const getTutorials = (req, res) => {
    Employee.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
      });
    });
};

module.exports = {
  upload,
  getTutorials,
};