const router = require('express').Router();
const EmployeeController = require('../controllers/employee.controller');
const check = require("../middlewares/auth");
const upload = require("../middlewares/upload");
const excelController = require("../controllers/excel.controller");

//definir ruta
router.get('/prueba-employee', check.auth(), EmployeeController.prueba);
router.post('/register', [check.auth(), upload.single("file0")], EmployeeController.register);
router.get("/list", check.auth(), EmployeeController.list);

module.exports=router;