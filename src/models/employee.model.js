//importar sequelize
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../connection/connection');


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
        allowNull: false,
        unique: true
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


module.exports = Employee;