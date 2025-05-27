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

// usa o URL para chamar o controller
//userRoutes.get("/v1/user/:id", userController.toListById);
userRoutes.post("/v1/user", userController.toCreate);
//userRoutes.put("/v1/user/:id", userController.toUpdate);
//userRoutes.delete("/v1/user/:id", userController.toDelete);

// teste
/* userRoutes.get("/v1/user", (request, response) => {
    return response.status(200).send("userRoutes working");
}); */

// exporta arquivo
module.exports = userRoutes;