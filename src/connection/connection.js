//importar sequelize
const { Sequelize } = require('sequelize');

//conectar a base de datos
const sequelize = new Sequelize('canteen', 'root', 'Ssystem#32', {
    host: 'localhost',
    dialect: 'mysql',
    timezone: '-06:00'
});

module.exports= sequelize;