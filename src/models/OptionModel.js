const { Model, DataTypes } = require('sequelize');
const connection = require('../config/connection');
const ProductModel = require('./ProductModel');

class OptionModel extends Model {}

OptionModel.init (
    {
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: ProductModel,
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        title: {
            type: DataTypes.STRING(45),
            allowNull: false,
            defaultValue: 0
        },
        shape: {
            type: DataTypes.ENUM('square', 'circle'),
            defaultValue: 'square',
            allowNull: true
        },
        radius: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: true
        },
        type: {
            type: DataTypes.ENUM('text', 'color'),
            defaultValue: 'text',
            allowNull: true
        },
        values: {
            type: DataTypes.STRING, // Armazena como STRING no banco (ex: "PP,GG,M")
            allowNull: false,
            get() {
            // Converte a string do banco para array quando lido no JS
            const rawValue = this.getDataValue('values');
            return rawValue ? rawValue.split(',') : [];
            },
            set(value) {
            // Converte o array para string separada por vírgulas antes de salvar
            const stringValue = Array.isArray(value) ? value.join(',') : value;
            this.setDataValue('values', stringValue);
            },
            defaultValue: "" // String vazia como padrão
        }
    },
    {
        tableName: "options",
        sequelize: connection,
        timestamps: false
    }
)


module.exports = OptionModel;