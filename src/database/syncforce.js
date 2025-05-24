// syncforce.js
// importa o arquivo connection
const connection = require("../config/connection");

// importa os models
require("../models/UserModel");


connection.sync({force: true});