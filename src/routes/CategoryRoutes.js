// CategoryRoutes.js
// data: 24/05/2025

// Biblioteca express
const express = require('express');

// importa arquivo controller
const CategoryController = require('../controllers/CategoryController');

/* permite userRoutes use o método .Router()
para criar rotas */
const CategoryRoutes = express.Router();

// cria objeto da classe userController
const categoryController = new CategoryController();

// usa o URL para chamar o controller
CategoryRoutes.get("/v1/category/:id", categoryController.consultarPorId);
CategoryRoutes.post("/v1/category", categoryController.criar);
CategoryRoutes.put("/v1/category/:id", categoryController.atualizar);
CategoryRoutes.delete("/v1/category/:id", categoryController.deletar);

// exporta arquivo
module.exports = CategoryRoutes;