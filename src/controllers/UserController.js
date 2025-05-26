// userController.js
// data: 24/05/2025

// importa arquivos models
const { Sequelize } = require("sequelize");
const UserModel = require("../models/UserModel");

// cria uma classe
class UserController {
    constructor() {
        
    }

    // método get
    async toListById(request, response) {
        const id = request.params.id;
        // try: realiza os códigos
        try {
            // traz dados da tabela
            const data = await UserModel.findByPk(id, {
                attributes: ['id', 'firstname', 'surname', 'email']
            });

            // se no URL tiver id que não tem na tabela retorna 404
            if (data === null) {
                return response.status(404).send("Usuário não existe");
            }

            return response.status(200).json(data);

        } catch (error) {
            // catch: caso ocorra erro no try, envia status 500 (erro no servidor)
            return response.status(500).send("500: ERRO NO SERVIDOR!");
        }
    }

    // método post
    async toCreate(request, response) {
        const body = request.body;

        //console.log(body);
        //console.log(body.firstname);
        
        // try: realiza os códigos
        try {
            // verifica se falta item no corpo da requisição
            if (body.firstname == undefined || body.surname == undefined
                || body.email == undefined || body.password == undefined) {
                return response.status(400).send("Erro 400: Erro na requisição. Falta dados.");
            }

            // se senhas estiverem diferentes
            if (body.password !== body.confirmPassword) {
                return response.status(400).send("400: ERRO NA REQUISIÇÃO - senhas erradas");
            }

            // envia para BD
            await UserModel.create(body);
            
            return response.status(201).json({
                    message: "Usuário criado com sucesso"
                });
            //return response.status(200).send("certo");

        } catch (error) {
            // catch: caso ocorra erro no try, envia status 500 (erro no servidor)
            return response.status(500).send("500: ERRO NO SERVIDOR!");
        }
    }

    // método put
    async toUpdate(request, response) {
        const id = request.params.id;
        const body = request.body;

        try {
            // FAZER 401

            // verifica se falta item no corpo da requisição
            if (body.firstname == undefined || body.surname == undefined
                || body.email == undefined) {
                return response.status(400).send("Erro 400: Erro na requisição. Falta dados.");
            }

            // procura na tabela se existe a linha de acordo com o id
            const search = await UserModel.findOne({ where: {id} });

            // se a linha da tabela não existir
            if (search === null) {
                return response.status(404).send("404: Usuário não existe");
            }

            // atualiza a linha no BD
            await UserModel.update(body, { where: {id} });
            return response.status(204).send("");
            
        } catch (error) {
            // catch: caso ocorra erro no try, envia status 500 (erro no servidor)
            return response.status(500).send("500: ERRO NO SERVIDOR!");
        }
    }

    // método delete
    async toDelete(request, response) {
        const id = request.params.id;
        try {
            // FAZER 401

            const search = await UserModel.findOne({ where: {id} });

            if (search === null) {
                return response.status(404).send("404: Usuário não existe");
            }

            await UserModel.destroy({ where: {id}});
            return response.status(204).send("");
        } catch (error) {
            return response.status(500).send("500: ERRO NO SERVIDOR!");
        }
        
        
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