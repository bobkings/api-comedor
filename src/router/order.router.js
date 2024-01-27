const router = require('express').Router();
const OrderController = require('../controllers/order.controller');
const check = require("../middlewares/auth");

//definir ruta
router.get('/prueba', check.auth(), OrderController.prueba);
router.post('/register', check.auth(), OrderController.register);
router.put('/update/:id', check.auth(), OrderController.update);
router.get('/list/:page?', check.auth(), OrderController.list);

module.exports=router;