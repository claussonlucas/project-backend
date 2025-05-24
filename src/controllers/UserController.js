// userController.js
// data: 24/05/2025

// importa arquivos models
const UserModel = require("../models/UserModel");

// cria uma classe
class UserController {
    constructor() {
        
    }

    // método get
    async consultarPorId(request, response) {
        const id = request.params.id;
        const data = await UserModel.findByPk(id, {
            attributes: ['firstname', 'email']
        });

        // se no URL tiver id que não tem na tabela retorna 404
        if (data !== null) {
            return response.status(200).json(data);
        } else {
            return response.status(404).send("Usuário não existe");
        }
    }

    // método post
    async criar(request, response) {
        const body = request.body;

        //console.log(body);
        //console.log(body.password);

        // se senhas estiverem iguais, envia para BD
        if (body.password === body.confirmPassword) {
            const newUser = await UserModel.create(body);

            return response.status(201).json({
                message: "Usuário criado com sucesso"
            });
            //return response.status(200).send("certo");
        } else {
            return response.status(400).send("400: ERRO NA REQUISIÇÃO - senhas erradas");
        }
    }

    // método put
    async atualizar(request, response) {
        const id = request.params.id;
        const body = request.body;
        const search = await UserModel.findOne({ where: {id} });

        if (search !== null) {
            await UserModel.update(body, { where: {id} });
                return response.status(204).send("");
        } else {
            return response.status(404).send("404: Usuário não existe");
        }
        
        // FAZER 400

        // FAZER 401
    }

    // método delete
    async deletar(request, response) {
        const id = request.params.id;
        const search = await UserModel.findOne({ where: {id} });

        if (search !== null) {
            await UserModel.destroy({ where: {id}});
            return response.status(204).send("");
        } else {
            return response.status(404).send("404: Usuário não existe");
        }
        
        // FAZER 401
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