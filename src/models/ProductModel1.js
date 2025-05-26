const { Model, DataTypes } = require("sequelize");
const connection = require("../config/connection");

class ProductModel extends Model {
    static associate({ImageModel, OptionModel}) {
        ProductModel.hasMany(ImageModel, {
            foreignKey: 'product_id',
            as: 'images'
        });
        ProductModel.hasMany(OptionModel, {
            foreignKey: 'product_id',
            as: 'options'
        });
    }
}

ProductModel.init(
    {
        enabled: {
            type: DataTypes.BOOLEAN,
            defaultValue: 0,
            allowNull: true
        },
        name: {
            type: DataTypes.STRING(45),
            allowNull: false
        },
        slug: {
            type: DataTypes.STRING(45),
            allowNull: false
        },
        use_in_menu: {
            type: DataTypes.BOOLEAN,
            defaultValue: 0,
            allowNull: true
        },
        stock: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: true
        },
        description: {
            type: DataTypes.STRING(45),
            allowNull: true
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        price_with_discount: {
            type: DataTypes.FLOAT,
            allowNull: false
        }
    },
    {
        tableName: "products",
        sequelize: connection,
        timestamps: true
    }  
)

module.exports = ProductModel;