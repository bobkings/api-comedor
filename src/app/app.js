const express = require('express');
const morgan = require('morgan');

const UserRoutes = require('../router/user.router');
const EmployeeRoutes = require('../router/employee.router');

const app = express();

const ruta='/api/v1/';

app.use(morgan("dev"));

app.get('/', (req, res) => {
    return res.send('API working correctly!!');
});

//para leer peticiones json
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(ruta+"user", UserRoutes);
app.use(ruta+"employee", EmployeeRoutes);

module.exports = app;
