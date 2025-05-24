// CategoryController.js
// data: 24/05/2025

// importa arquivos models
const CategoryModel = require("../models/CategoryModel");

// cria uma classe
class CategoryController {
    constructor() {
        
    }

    // método get
    async consultarPorId(request, response) {
        const id = request.params.id;
        const data = await CategoryModel.findByPk(id, {
            attributes: ["id", "name", "slug", "use_in_menu"]
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

        const newCategory = await CategoryModel.create(body);

        return response.status(201).json({
            message: "Categoria criada com sucesso"
        });

        // FAZER 400
        //return response.status(400).send("400: ERRO NA REQUISIÇÃO - senhas erradas");

        // FAZER 401
    }

    // método put
    async atualizar(request, response) {
        const id = request.params.id;
        const body = request.body;
        const search = await CategoryModel.findOne({ where: {id} });

        if (search !== null) {
            await CategoryModel.update(body, { where: {id} });
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
        const search = await CategoryModel.findOne({ where: {id} });

        if (search !== null) {
            await CategoryModel.destroy({ where: {id}});
            return response.status(204).send("");
        } else {
            return response.status(404).send("404: Usuário não existe");
        }
        
        // FAZER 401
    }
}

// exporta arquivo
module.exports = CategoryController;
