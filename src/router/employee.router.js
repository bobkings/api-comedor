const router = require('express').Router();
const EmployeeController = require('../controllers/employee.controller');
const check = require("../middlewares/auth");
const upload = require("../middlewares/upload");
const excelController = require("../controllers/excel.controller");

//definir ruta
router.get('/prueba-employee', check.auth(), EmployeeController.prueba);
router.get('/register', check.auth(), EmployeeController.register);
router.post("/upload", upload.single("file0"), excelController.upload);
router.get("/tutorials", excelController.getTutorials);

module.exports=router;