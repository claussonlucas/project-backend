// userModel.js
// data: 24/05/2025

// importa do sequelize o método DataTypes e o método Model
const { DataTypes, Model } = require('sequelize');

const { Sequelize } = require('sequelize');
// faz conexão com o banco de dados e permite criar tabelas
const connection = require('../config/connection');

// cria a classe
class UserModel extends Model {

}

//
UserModel.init(
    {
        // coluna firstname
        firstname: {
            type: DataTypes.STRING(45),
            allowNull: false
        },
        // coluna surname
        surname: {
            type: DataTypes.STRING(45),
            allowNull: false
        },
        // coluna email
        email: {
            type: DataTypes.STRING(45),
            allowNull: false
        },
        // coluna password
        password: {
            type: DataTypes.STRING(45),
            allowNull: false
        }
    },
    {
        sequelize: connection,
        tableName: "users",
        timestamps: true
    }
);


// exporta
module.exports = UserModel;

