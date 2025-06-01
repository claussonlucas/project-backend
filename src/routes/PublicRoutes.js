// PublicRoutes.js
// // data: 29/05/2025

// Biblioteca express
const express = require('express');
// Biblioteca Json Web Token
const jwt = require('jsonwebtoken');
// Biblioteca Dotenv
require('dotenv').config();

// importa AuthController
const AuthController = require('../controllers/AuthController');
// importa UserController
const UserController = require('../controllers/UserController');

/* permite usare o método .Router()
para criar rotas */
const PublicRoutes = express.Router();

// cria objeto da classe userController
const userController = new UserController();

// rota para autenticação
PublicRoutes.post('/v1/user/token', async (request, response) => {
  const { email, password } = request.body;
  console.log("Chave JWT no inicio:", process.env.APP_TOKEN);
  // cria objeto com o método do AuthController
  const auth = new AuthController();

  // salva o retorno do método login
  const data = await auth.login(email, password);
  
  // se o usuário existir no BD
  if(data) {
    //console.log("data Public route:", data);
    
    // salva dados que veio do BD, com um tempo para expirar
    const dataExp = {
      id: data.id,
      email: data.email,
      firstname: data.firstname,
      exp: Math.floor(Date.now() / 1000) + (60 * 60) // expira em 60 min.
    }

    console.log("Chave JWT:", process.env.KEY);

     // converte o objeto token em um JWT com uma chave única
    const token = jwt.sign(dataExp, process.env.KEY);
    console.log("Chave JWT depois do .sign:", process.env.KEY);
    return response.json({
      token: token
    });
  }

  // caso não exista o usuário
  return response.json({
    message: "Erro: login ou senha incorretos"
  });
}
);

// criar usuário
PublicRoutes.post("/v1/user", userController.toCreate);

// exporta arquivo
module.exports = PublicRoutes;
