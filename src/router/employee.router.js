const router = require('express').Router();
const EmployeeController = require('../controllers/employee.controller');
const check = require("../middlewares/auth");
const upload = require("../middlewares/upload");

//definir ruta
router.get('/prueba-employee', check.auth(), EmployeeController.prueba);
router.post('/register', [check.auth(), upload.single("file0")], EmployeeController.register);
router.get("/list/:page?", check.auth(), EmployeeController.list);
router.delete("/delete", check.auth(), EmployeeController.deleteEmp);
router.post("/generate-qr", check.auth(), EmployeeController.generateQR);
router.get('/list-one/:id', check.auth(), EmployeeController.listOne);

module.exports=router;