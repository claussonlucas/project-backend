// server.js
// data: 24/05/2025

//console.log("Server working...");

// Biblioteca Dotenv
require('dotenv').config();
// biblioteca express
const express = require('express');


// Importa rotas criadas
const PrivatesRoutes = require('./src/routes/PrivatesRoutes');
const PublicRoutes = require('./src/routes/PublicRoutes');

// host e port
const host = "localhost";
const port = 3000;

// app (aplicativo) recebe métodos de express
const app = express();
app.use(express.json()); // permite app usar json()

// rota homePage
app.get("/", (request, response) => {
    return response.status(200).send("HomePage");
});

/* app.get("*", (request, response) => {
    return response.status(404).send("Página não encontrada");
}); */

// rotas publicas
app.use(PublicRoutes);
// rotas privadas
app.use(PrivatesRoutes);

// Escuta eventos
app.listen(port, host, () => {
    console.log(`Server working in: http://${host}:${port}`);
    
});

