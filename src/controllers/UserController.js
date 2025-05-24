// userController.js
// data: 24/05/2025

// importa arquivos models


// cria uma classe
class UserController {
    constructor() {
        
    }

    // método get
    consultarPorId(request, response) {
        const id = request.params.id;
        return response.status(200).send(`UserController working. Id: ${id}`);
    }

}

// exporta arquivo
module.exports = UserController;

/*
    teste
    consultarPorId(request, response) {
        const id = request.params.id;
        return response.status(200).send(`UserController working. Id: ${id}`);
    }
*/