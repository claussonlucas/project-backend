// syncforce.js
// importa o arquivo connection
const connection = require("../config/connection");

// importa os models
require("../models/UserModel");
require("../models/CategoryModel");

// Força a criação de uma nova tabela se ela existir
connection.sync({force: true});