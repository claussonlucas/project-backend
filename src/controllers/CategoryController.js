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
        const queryLimit = query.limit;
        const queryPage = query.page; // página com 12 itens
        let queryFields = query.fields; // query fields
        let queryUseMenu = query.use_in_menu // query use_in_menu
        let data = []; // lista de obj. que vem do BD
        let standardLimit = 12; // certo 12
        

        // query limit
        if(queryLimit === undefined) {
            data = await CategoryModel.findAll({ limit: standardLimit });
        } else if(queryLimit == -1) {
            data = await CategoryModel.findAll();
        } else {
            // limit = 8 / page = 1 => offset: (8 * 1) - 8 = 0
            data = await CategoryModel.findAll({ offset: (queryLimit * queryPage) - queryLimit
                                                , limit: queryLimit });
        }
        //console.log('data: ');
        //console.log(data);

        //  mostrar data do BD + total + limit + page
        data.total = await CategoryModel.count();
        data.limit = queryLimit;
        data.page = queryPage;

        //console.log('data: ');
        //console.log(data);
        
        //return response.status(200).send(data);  
        // fim da lógica limit e page
        
        //console.log('inicio: ');
        //console.log(query);
        //console.log(query.fields);
        //console.log(query.use_in_menu);

        console.log('inicio');
        console.log(query);

        //console.log('Depois de guardar em variveis: ');
        //console.log(queryFields);
        //console.log(queryUseMenu);

        if (queryFields === undefined) {
            // se query fields não for digitado
            queryFields = ['name', 'slug', 'use_in_menu'];
        } else {
            // se query fields for digitado, será dividido
            queryFields = queryFields.split(',');    
        }
        
        //console.log(queryFields);
        //console.log(queryUseMenu);
        
        if (queryUseMenu === undefined) {
            // os dados que vem do BD vão para a lista data
            data = await CategoryModel.findAll({
                attributes: queryFields
            });      
        } else {
            // se tiver use_in_menu no URL, vem apenas os dados que use_in_menu = 1
            data = await CategoryModel.findAll({ where: {use_in_menu: 1} }, {
                attributes: queryFields // continua usando o queryFields
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
