const router = require('express').Router();
const OrderController = require('../controllers/order.controller');
const check = require("../middlewares/auth");

//definir ruta
router.get('/prueba', check.auth(), OrderController.prueba);
router.post('/register', check.auth(), OrderController.register);
router.put('/update/:id', check.auth(), OrderController.update);
router.get('/list/:page?', check.auth(), OrderController.list);
router.get('/list-one/:id', check.auth(), OrderController.listOne);
router.delete('/delete/:id', check.auth(), OrderController.deleteOrder);

module.exports=router;