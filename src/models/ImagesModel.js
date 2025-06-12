// ImagesModel.js
// data: 25/05/2025

// importa do sequelize o método DataTypes e o método Model
const { DataTypes, Model } = require('sequelize');
const { Sequelize } = require('sequelize');

// faz conexão com o banco de dados e permite criar tabelas
const connection = require('../config/connection');

// usada na foreigner key
const ProductModel = require('./ProductModel');

// cria a classe
class ImagesModel extends Model {
/*     static associate() {
        ImagesModel.belongsTo(ProductModel, {foreignKey: "product_id"});
    }; */
}

//
ImagesModel.init(
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
            onUpdate: 'CASCADE',
            //onDelete: 'CASCADE',
        },
        // coluna enabled
        enabled: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: 0
        },
        // coluna path
        path: {
            type: DataTypes.STRING(255),
            allowNull: false
        }
    },
    {
        sequelize: connection,
        tableName: "images",
        timestamps: true
    }
);

// exporta
module.exports = ImagesModel;

