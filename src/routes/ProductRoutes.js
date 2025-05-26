// ProductRoutes.js
// data: 25/05/2025

// Biblioteca express
const express = require('express');

// importa arquivo controller
const ProductController = require('../controllers/ProductController');

/* permite userRoutes use o método .Router()
para criar rotas */
const ProductRoutes = express.Router();

// cria objeto da classe userController
const productController = new ProductController();

// usa o URL para chamar o controller
ProductRoutes.get("/v1/product/search", productController.toListAll);
ProductRoutes.get("/v1/product/:id", productController.toListById);
ProductRoutes.post("/v1/product", productController.toCreate);
ProductRoutes.put("/v1/product/:id", productController.toUpdate);
ProductRoutes.delete("/v1/product/:id", productController.toDelete);

// exporta arquivo
module.exports = ProductRoutes;