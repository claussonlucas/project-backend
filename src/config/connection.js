// connection.js
// data: 24/05/2025

// importa o sequelize para ser usado em todos os models
const { Sequelize } = require("sequelize");

// cria a conexão com o banco de dados
const connection = new Sequelize({
    // dados do banco criado
    dialect: "mysql",
    database: "projBackend",
    host: "localhost",
    username: "root",
    password: "root",
    port: 3306
});

// exporta
module.exports = connection;

// para uso no terminal
// node src/config/connection.js