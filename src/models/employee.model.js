//importar sequelize
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../connection/connection');
const Order = require('./order.model');

//declarar clase extendiendo de model
class Employee extends Model {}

//inicializar modelo (mi estandar sera camelcase ej. userId)
Employee.init({
    employeeId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    empNumber: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fullName: {
        type: DataTypes.STRING,
        allowNull: false
    }    
},
{
    sequelize,
    modelName: "Employee"
});

// Definir la relación hasMany
Employee.hasMany(Order, {
    foreignKey: 'employeeId'
  });
Order.belongsTo(Employee);

module.exports = Employee;