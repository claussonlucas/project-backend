// userRoutes.js
// data: 24/05/2025

// Biblioteca express
const express = require('express');

// importa arquivo controller
const UserController = require('../controllers/UserController');

/* permite userRoutes use o método .Router()
para criar rotas */
const userRoutes = express.Router();

// cria objeto da classe userController
const userController = new UserController();


// usa o URL para chamar outros
userRoutes.get("/v1/user/:id", userController.consultarPorId);

// teste
/* userRoutes.get("/v1/user", (request, response) => {
    return response.status(200).send("userRoutes working");
}); */

// exporta arquivo
module.exports = userRoutes;