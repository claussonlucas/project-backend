const { Model, DataTypes } = require('sequelize');
const connection = require('../config/connection');
const ProductModel = require('./ProductModel');

class ImageModel extends Model {}

ImageModel.init(
    {
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: ProductModel,
                key: 'id'
            }
        },
        enabled: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: 0
        },
        path: {
            type: DataTypes.STRING(255),
            allowNull: false
        }
    },
    {
        tableName: "images",
        sequelize: connection,
        timestamps: true
    }
);

module.exports = ImageModel;

