// privatesRoutes.js
// // data: 24/05/2025

// Biblioteca express
const express = require('express');

// Importa rotas criadas
const UserRoutes = require("./UserRoutes");

/* permite privatesRoutes use o método .Router()
para criar rotas */
const PrivatesRoutes = express.Router();

// permite usar rotas criadas
PrivatesRoutes.use(UserRoutes);

// exporta arquivo
module.exports = PrivatesRoutes;
