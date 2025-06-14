// ProdCategModel.js
// data: 25/05/2025

// importa do sequelize o método DataTypes e o método Model
const { DataTypes, Model } = require('sequelize');

// faz conexão com o banco de dados e permite criar tabelas
const connection = require('../config/connection');

// usada na foreigner key
const ProductModel = require('./ProductModel');
const CategoryModel = require("./CategoryModel");

// cria a classe
class ProdCategModel extends Model {}

//
ProdCategModel.init(
    {
        // coluna product_id
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            // chave estrangeira
            references: {
                model: ProductModel,
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        // coluna category_id
        category_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            // chave estrangeira
            references: {
                model: CategoryModel,
                key: 'id'
            },
            onDelete: 'CASCADE'
        }
    },
    {
        sequelize: connection,
        modelName: "prod_Categ",
        freezeTableName: true,
        //tableName: "prod_categ",
        timestamps: false
    }
);

// exporta
module.exports = ProdCategModel;
