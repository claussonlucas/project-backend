// ProductModel.js
// data: 25/05/2025

// importa do sequelize o método DataTypes e o método Model
const { DataTypes, Model } = require('sequelize');
const { Sequelize } = require('sequelize');

// faz conexão com o banco de dados e permite criar tabelas
const connection = require('../config/connection');

// cria a classe
class ProductModel extends Model {
    // associa a tabela products com a images
    static associate({CategoryModel, ProdCategModel, ImagesModel, OptionModel}) {
        ProductModel.hasMany(ProdCategModel, {
            foreignKey: 'product_id', as: 'category_id'
        });
        ProductModel.belongsToMany(CategoryModel, {
            through: ProdCategModel,
            foreignKey: 'product_id',
            otherKey: 'category_id',
            as: 'categories'
        });
        ProductModel.hasMany(ImagesModel, {
            foreignKey: 'product_id', as: 'images'
        });
        ProductModel.hasMany(OptionModel, {
            foreignKey: 'product_id', as: 'options'
        });
    }
}

// cria as colunas
ProductModel.init(
    {
        // coluna enabled
        enabled: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: 0
        },
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
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: 0
        },
        // coluna stock
        stock: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0
        },
        // coluna description
        description: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        // coluna price
        price: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        // coluna price_with_discount
        price_with_discount: {
            type: DataTypes.FLOAT,
            allowNull: false
        }
    },
    {
        sequelize: connection,
        tableName: "product",
        timestamps: true
    }
);

// exporta
module.exports = ProductModel;

