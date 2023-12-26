//importar sequelize
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../connection/connection');

//declarar clase extendiendo de model
class User extends Model {}

//inicializar modelo (mi estandar sera camelcase ej. userId)
User.init({
    userId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fullName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    level: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
},
{
    sequelize,
    modelName: "User"
});

module.exports = User;
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