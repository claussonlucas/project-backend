// syncforce.js
// importa o arquivo connection
const connection = require("../config/connection");

// importa os models
require("../models/UserModel");
require("../models/CategoryModel");
require("../models/ProdCategModel");
require("../models/ProductModel");
require("../models/ImagesModel");
require('../models/OptionModel');

// Força a criação de uma nova tabela se ela existir
//connection.sync({force: true});

// cria uma nova tabela sem apagar as que existem
connection.sync({alter: true});

// para uso no terminal
//node src/database/syncforce.js