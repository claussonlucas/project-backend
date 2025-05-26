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
CategoryRoutes.get("/v1/category/search", categoryController.toListAll);
CategoryRoutes.get("/v1/category/:id", categoryController.toListById);
CategoryRoutes.post("/v1/category", categoryController.toCreate);
CategoryRoutes.put("/v1/category/:id", categoryController.toUpdate);
CategoryRoutes.delete("/v1/category/:id", categoryController.toDelete);

// exporta arquivo
module.exports = CategoryRoutes;