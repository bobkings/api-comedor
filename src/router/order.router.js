const router = require('express').Router();
const OrderController = require('../controllers/order.controller');
const check = require("../middlewares/auth");

//definir ruta
router.get('/prueba', check.auth(), OrderController.prueba);
router.post('/register', check.auth(), OrderController.register);

module.exports=router;