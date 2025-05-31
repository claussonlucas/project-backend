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
        const query = request.query;

        // se URL não tem limit, vai ser um NaN, e retorna undefined
        // Number(): converte o query string em número
        let queryLimit = isNaN(Number(query.limit)) ? undefined : Number(query.limit);
        let queryPage = isNaN(Number(query.page)) ? 1 : Number(query.page); // página com 12 itens
        let queryFields = query.fields; // query fields
        let queryUseMenu = query.use_in_menu // query use_in_menu
        let data = []; // lista de obj. que vem do BD
        let standardLimit = 5; // padrão 12
        
        //console.log("queryLimit:", queryLimit);
        //console.log("queryPage:", queryPage);
        //console.log("queryFields:", queryFields);
        //console.log("queryUseMenu:", queryUseMenu);
        console.log(data);

        // verifica se tem query fields
        if (queryFields === undefined) {
            // se query fields não for digitado
            queryFields = ['name', 'slug', 'use_in_menu'];
        } else {
            // se query fields for digitado, será dividido
            queryFields = queryFields.split(',');
        }

        // query limit
        if(queryLimit === undefined) {
            if (queryUseMenu == "true") {
                queryLimit = standardLimit
                data = await CategoryModel.findAll({ limit: queryLimit, where: { use_in_menu: 1 },
                    attributes: queryFields });

            } else {
                queryLimit = standardLimit
                data = await CategoryModel.findAll({ limit: queryLimit, attributes: queryFields });
            }

        } else if(queryLimit == -1) {
            //data = await CategoryModel.findAll();
            if (queryUseMenu == "true") {
                data = await CategoryModel.findAll({ where: { use_in_menu: 1 },
                    attributes: queryFields });

            } else {
                data = await CategoryModel.findAll({ attributes: queryFields });
            }

        } else {
            if (queryUseMenu == "true") {
                // limit = 3 / page = 1 => offset: (3 * 1) - 3 = 0
                let newOffset = ((queryLimit * queryPage) - queryLimit);
                data = await CategoryModel.findAll({ offset: newOffset, limit: queryLimit,
                    where: { use_in_menu: 1 }, attributes: queryFields });

            } else {
                let newOffset = ((queryLimit * queryPage) - queryLimit);
                data = await CategoryModel.findAll({ offset: newOffset, limit: queryLimit,
                    attributes: queryFields });
            }
        }

        console.log("DATA: ", data);
        console.log("DATA.NAME: ", data[0].dataValues.name);
        console.log("DATA TYPE OF: ", typeof data);

        //  mostrar total de linhas do BD
        const datatotal = await CategoryModel.count();

        //console.log("antes do return: ", data);
        const obj = {"data": data, "Total": datatotal, "Limit": queryLimit, "Page": queryPage}

        return response.status(200).send(obj); 
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
