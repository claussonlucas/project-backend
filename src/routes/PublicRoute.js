// PublicRoute.js
// // data: 29/05/2025

// Biblioteca express
const express = require('express');
// Biblioteca Json Web Token
const jwt = require('jsonwebtoken');

// importa AuthController
const AuthController = require('../controllers/AuthController');

/* permite usare o método .Router()
para criar rotas */
const PublicRoute = express.Router();

// rota para autenticação
PublicRoute.post('/v1/login', async (request, response) => {
  const { username, password } = request.body;
  // cria objeto com o método do AuthController
  const auth = new AuthController();

  // salva o retorno do método login
  const data = await auth.login(username, password);
  
  // se o usuário existir no BD
  if(data) {
    // salva dados que veio do BD, com um tempo para expirar
    const dataExp = {
      id: data.id,
      email: data.email,
      username: data.username,
      exp: Math.floor((Date.now() / 1000) + (60 * 5); // expira em 5 min.
    }

     // converte o objeto token em um JWT com uma chave única
     const token = jwt.sign(dataExp, 'ch#ave');

    return response.json({
      token: token;
    });
  }

  // caso não exista o usuário
  return response.json({
    message: "Erro: login ou senha incorretos"
  });
}            
);


// exporta arquivo
module.exports = PublicRoute;
