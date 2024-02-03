//importar sequelize
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../connection/connection');
const Employee = require('./employee.model');

//declarar clase extendiendo de model
class Order extends Model {}

//inicializar modelo (mi estandar sera camelcase ej. userId)
Order.init({
    orderId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    employeeId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    special: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    toGo: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    soda: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
},
{
    sequelize,
    modelName: "Order"
});

Order.belongsTo(Employee, { foreignKey: 'employeeId' });
module.exports = Order;