// CategoryModel.js
// data: 24/05/2025

// importa do sequelize o método DataTypes e o método Model
const { DataTypes, Model } = require('sequelize');
const { Sequelize } = require('sequelize');

// faz conexão com o banco de dados e permite criar tabelas
const connection = require('../config/connection');

// cria a classe
class CategoryModel extends Model {

}

//
CategoryModel.init(
    {
        // coluna name
        name: {
            type: DataTypes.STRING(45),
            allowNull: false
        },
        // coluna slug
        slug: {
            type: DataTypes.STRING(45),
            allowNull: false
        },
        // coluna use_in_menu
        use_in_menu: {
            type: DataTypes.BOOLEAN(0),
            allowNull: true
        },
    },
    {
        sequelize: connection,
        tableName: "category",
        timestamps: true
    }
);


// exporta
module.exports = CategoryModel;

