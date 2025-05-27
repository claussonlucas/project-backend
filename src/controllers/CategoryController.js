// CategoryController.js
// data: 24/05/2025

// importa arquivos models
const CategoryModel = require("../models/CategoryModel");

// cria uma classe
class CategoryController {
    constructor() {
        
    }

    // método get
    async toListAll(request, response) {
        let query = request.query;
        let data = {};
        console.log('inicio');
        console.log(query);

        console.log(query.fields);
        console.log(query.use_in_menu);

        if (query.fields === undefined) {
            query = ['name', 'slug', 'use_in_menu'];

            data = await CategoryModel.findAll({
                attributes: query
            });
        } else {
            query = query.fields.split(',');
            
            data = await CategoryModel.findAll({
                attributes: query
            });
        }
        console.log(query.fields);
        console.log(query.use_in_menu);
        // use_in_menu
        if (query.use_in_menu !== undefined) {
            
            data = await CategoryModel.findAll({ where: {use_in_menu: 1} }, {
                attributes: query
            });
            
        }

        return response.status(200).send(data);
        
    }

    // método get
    async toListById(request, response) {
        const id = request.params.id;

        try {
            const data = await CategoryModel.findByPk(id, {
                attributes: ["id", "name", "slug", "use_in_menu"]
            });

            // se no URL tiver id que não tem na tabela retorna 404
            if (data === null) {
                return response.status(404).send("Categoria não existe");
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

        // try: realiza os códigos
        try {
            // FAZER 401

            // verifica se falta item no corpo da requisição
            if (body.name == undefined || body.slug == undefined) {
                return response.status(400).send("Erro 400: Erro na requisição. Falta dados.");
            }

            // envia para BD
            await CategoryModel.create(body);
            
            return response.status(201).json({
                    message: "Categoria criada com sucesso"
                });
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
            if (body.name == undefined || body.slug == undefined ||
                body.use_in_menu == undefined) {
                return response.status(400).send("Erro 400: Erro na requisição. Falta dados.");
            }

            // procura na tabela se existe a linha de acordo com o id
            const search = await CategoryModel.findOne({ where: {id} });

            // se a linha da tabela não existir
            if (search === null) {
                return response.status(404).send("404: Categoria não existe");
            }

            // atualiza a linha no BD
            await CategoryModel.update(body, { where: {id} });
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

            const search = await CategoryModel.findOne({ where: {id} });

            if (search === null) {
                return response.status(404).send("404: Categoria não existe");
            }

            await CategoryModel.destroy({ where: {id}});
            return response.status(204).send("");
        } catch (error) {
            return response.status(500).send("500: ERRO NO SERVIDOR!");
        }
    }
}

// exporta arquivo
module.exports = CategoryController;
