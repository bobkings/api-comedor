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

module.exports = Employee;
/*
const testConnection = async() => {
    try {
        await sequelize.authenticate();
        console.log('All good!!');
    } catch (err) {
        console.error('All bad', err);
    }
}

testConnection();
*/