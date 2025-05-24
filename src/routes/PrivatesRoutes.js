// privatesRoutes.js
// // data: 24/05/2025

// Biblioteca express
const express = require('express');

// Importa rotas criadas
const UserRoutes = require("./UserRoutes");
const CategoryRoutes = require('./CategoryRoutes');

/* permite privatesRoutes use o método .Router()
para criar rotas */
const PrivatesRoutes = express.Router();

// permite usar rotas criadas
PrivatesRoutes.use(UserRoutes);
PrivatesRoutes.use(CategoryRoutes);

// exporta arquivo
module.exports = PrivatesRoutes;
