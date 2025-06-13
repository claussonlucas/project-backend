// privatesRoutes.js
// // data: 24/05/2025

// Biblioteca Dotenv
require('dotenv').config();
// Biblioteca express
const express = require('express');
// Biblioteca Json Web Token
const jwt = require('jsonwebtoken');

// Importa rotas criadas
const UserRoutes = require("./UserRoutes");
const CategoryRoutes = require('./CategoryRoutes');
const ProductRoutes = require('./ProductRoutes');

/* permite privatesRoutes use o método .Router()
para criar rotas */
const PrivatesRoutes = express.Router();

// Middleware
PrivatesRoutes.use((request, response, next) => {
    const authHeader = request.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]; // Pega só o token após "Bearer"
    
    let logged = false;
    // process.env.APP_KEY_TOKEN
    try {
        jwt.verify(token, process.env.KEY);
        logged = true;
    } catch (error) {
        logged = false;
    }

    if (logged === false) {
        return response.status(403).send("Não autorizado");
    }
    
    next();
});

// permite usar rotas criadas
PrivatesRoutes.use(UserRoutes);
PrivatesRoutes.use(CategoryRoutes);
PrivatesRoutes.use(ProductRoutes);

// exporta arquivo
module.exports = PrivatesRoutes;
