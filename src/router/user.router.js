const router = require('express').Router();
const UserController = require('../controllers/user.controller');
const check = require("../middlewares/auth");

//definir ruta
router.get('/prueba-user', check.auth(), UserController.prueba);
router.post('/register', check.auth('0'), UserController.register);
router.get('/list', check.auth('0'), UserController.list);
router.post("/login", UserController.login);

module.exports=router;