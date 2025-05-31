// ProductController.js
// data: 25/05/2025


// importa arquivos models
const ProductModel = require("../models/ProductModel");
const CategoryModel = require("../models/CategoryModel");
const ProdCategModel = require("../models/ProdCategModel");
const ImagesModel = require("../models/ImagesModel");
const OptionModel = require("../models/OptionModel");

// para usar o Op (usado em condições)
const { Op } = require('sequelize');

// cria uma classe
class ProductController {
    constructor() {
        ProductModel.associate({CategoryModel, ProdCategModel, ImagesModel, OptionModel});
    }

    // método get
    async toListAll(request, response) {
        const query = request.query;
        console.log("QUERY: ", query);
        
        // se URL não tem limit, vai ser um NaN, e retorna undefined
        // Number(): converte o query string em número
        let queryLimit = isNaN(Number(query.limit)) ? undefined : Number(query.limit);
        let queryPage = isNaN(Number(query.page)) ? 1 : Number(query.page); // página com 12 itens
        let queryFields = query.fields; // query fields
        //let queryUseMenu = query.use_in_menu // query use_in_menu
        let queryMatch = query.match // query match
        //const queryCategoryId = query.category_id.split(','); // por ser lista precisa dividir
        //const queryPriceRange = query.price_range.split('-');
        let data = []; // lista de obj. que vem do BD
        let standardLimit = 5; // padrão 12
        
        console.log("queryMatch: ", queryMatch);

        // verifica se tem query fields
        if (queryFields === undefined) {
            // se query fields não for digitado
            queryFields = { exclude: ["use_in_menu", "createdAt", "updatedAt"] };
        } else {
            // se query fields for digitado, será dividido
            queryFields = queryFields.split(',');
        }

        // query limit
        if(queryLimit === undefined) {
            if (queryUseMenu == "true") {
                queryLimit = standardLimit
                data = await ProductModel.findAll({ limit: queryLimit,
                    where: {
                        name: queryMatch,
                        include: {
                            through: ProdCategModel,
                            model: CategoryModel,
                            category_id: queryCategoryId
                        },
                        [Op.between]: queryPriceRange},
                    attributes: queryFields });

            } else {
                queryLimit = standardLimit
                data = await ProductModel.findAll({ limit: queryLimit, attributes: queryFields });
            }

        } else if(queryLimit == -1) {
            //data = await CategoryModel.findAll();
            if (queryMatch !== undefined) {
                data = await ProductModel.findAll({
                    where:  {
                        [Op.or]: [{ name: queryMatch }, { description: queryMatch }]
                    },
                    attributes: queryFields,
                    include: [
                        {
                            model: ProdCategModel, as: 'category_id', attributes: ["category_id"]
                        },
                        {model: ImagesModel, as: 'images', attributes: ["id", ["path", 'content']]},
                        {model: OptionModel, as: 'options'}
                    ]
                });

            } else {
                // AQUI >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
                data = await ProductModel.findAll({
                    attributes: queryFields,
                    include: [
                        {
                            model: ProdCategModel, as: 'category_id', attributes: ["category_id"]
                        }
                    ]
                });
            }

        } else {
            if (queryUseMenu == "true") {
                // limit = 3 / page = 1 => offset: (3 * 1) - 3 = 0
                let newOffset = ((queryLimit * queryPage) - queryLimit);
                data = await ProductModel.findAll({ offset: newOffset, limit: queryLimit,
                    where: { use_in_menu: 1 }, attributes: queryFields,
                    include: [
                        {
                            //model: ProdCategModel , attributes: ["category_id"],
                            //through: ProdCategModel , attributes: ["category_id"],
                            model: CategoryModel, as: 'categories', attributes: ["id"]
                        }
                    ]
                });

            } else {
                let newOffset = ((queryLimit * queryPage) - queryLimit);
                data = await ProductModel.findAll({ offset: newOffset, limit: queryLimit,
                    attributes: queryFields,
                    include: [
                        {
                            model: ProdCategModel, attributes: ["category_id"]
                            //through: ProdCategModel , attributes: ["category_id"],
                            //model: CategoryModel, as: 'categories', attributes: ["id"]
                        }
                    ]
                });
            }
        }

        // PEGA DA TABELA PRODCATEG, APENAS CATEGORY_ID
        const categoryIdTabelaInterm = await  ProdCategModel.findAll();
        console.log("categoryIdTabelaInterm: ", categoryIdTabelaInterm[0].dataValues);

        //console.log("DATA: ", data);
        //console.log("DATA.NAME: ", data[0].dataValues.name);
        //console.log("DATA TYPE OF: ", typeof data);

        //  mostrar total de linhas do BD
        const datatotal = await ProductModel.count();

        //console.log("antes do return: ", data);
        const obj = {"data": data, "Total": datatotal, "Limit": queryLimit, "Page": queryPage}

        return response.status(200).send(obj);
    }

    // método get
    async toListById(request, response) {
        const id = request.params.id;
        try {
                const data = await ProductModel.findByPk(id, {
                attributes: ["id", "enabled", "name", "slug", "stock", "description", "price", "price_with_discount"],
                // inclui dados da outra tabela
                include: [
                    {model: ProdCategModel, as: 'category_id', attributes: ["category_id"]},
                    {model: ImagesModel, as: 'images', attributes: ["id", ["path", 'content']]},
                    {model: OptionModel, as: 'options'}
/*
                        {
                            through: ProdCategModel,
                        model: ProdCategModel, attributes: ['category_id']
                    },
                    {model: ImagesModel, as: 'images', attributes: ["id", "path"]},
                    {model: OptionModel, as: 'options', attributes: ["id", "product_id", "title", "shape", "radius", "type", "values"]} */
                ]
            });

            // se no URL tiver id que não tem na tabela retorna 404
            if (data === null) {
                return response.status(404).send("Produto não existe");
            }

            return response.status(200).json(data);
            
        } catch (error) {
            // catch: caso ocorra erro no try, envia status 500 (erro no servidor)
            return response.status(500).send("500: ERRO NO SERVIDOR!");
        }
    }

    // método post
    async toCreate(request, response) {
        const {category_id, ...body} = request.body;
        
                    // verifica se falta item no corpo da requisição
            if (body.name == undefined || body.slug == undefined ||
                body.price == undefined || body.price_with_discount == undefined) {
                return response.status(400).send("Erro 400: Erro na requisição. Falta dados.");
            }

            // envia para BD
            //await ImagesModel.create();
            let post = await ProductModel.create(body, {
                include: [
                    {
                        through: ProdCategModel,
                        model: CategoryModel, as: 'categories'
                    },
                    {model: ImagesModel, as: 'images'},
                    {model: OptionModel, as: 'options'}
                ]
            });

            post.setCategories(category_id);
             // Se precisar associar categorias (many-to-many)
        /* if (body.category_id && body.category_id.length) {
            const product = await ProductModel.findOne({
                where: { name: body.name },
                attributes: ['id']
            });
            await product.setCategories(body.category_id); */
        //}

                        
            return response.status(201).json({
                    message: "Produto criado com sucesso"
                });
        // try: realiza os códigos
        //try {
            // FAZER 401

            // verifica se falta item no corpo da requisição
//            if (body.name == undefined || body.slug == undefined ||
//                body.price == undefined || body.price_with_discount == undefined) {
//                return response.status(400).send("Erro 400: Erro na requisição. Falta dados.");
//            }

            // envia para BD
//            await ProductModel.create(body, {include: ImagesModel});
            
//            return response.status(201).json({
//                    message: "Produto criado com sucesso"
//                });
//        } catch (error) {
            // catch: caso ocorra erro no try, envia status 500 (erro no servidor)
            //return response.status(500).send("500: ERRO NO SERVIDOR!");
//        }
    }

    // método put
    async toUpdate(request, response) {
        const id = request.params.id;
        const body = request.body;
        try {
            // FAZER 401

            // verifica se falta item no corpo da requisição
            if (body.name == undefined || body.slug == undefined ||
                body.price == undefined || body.price_with_discount == undefined) {
                return response.status(400).send("Erro 400: Erro na requisição. Falta dados.");
            }

            // procura na tabela se existe a linha de acordo com o id
            const search = await ProductModel.findOne({ where: {id} });

            // se a linha da tabela não existir
            if (search === null) {
                return response.status(404).send("404: Categoria não existe");
            }

            // atualiza a linha no BD
            await ProductModel.update(body, { where: {id} });
            return response.status(204).send("");
            
        } catch (error) {
            // catch: caso ocorra erro no try, envia status 500 (erro no servidor)
            return response.status(500).send("500: ERRO NO SERVIDOR!");
        }
    }

    // método delete
    async toDelete(request, response) {
        const id = request.params.id;
        const search = await ProductModel.findOne({ where: {id} });

        if (search === null) {
            return response.status(404).send("404: Categoria não existe");
        }

        await ProductModel.destroy({ where: {id}});
        return response.status(204).send("");
        //try {
            // FAZER 401

/*             const search = await ProductModel.findOne({ where: {id} });

            if (search === null) {
                return response.status(404).send("404: Categoria não existe");
            }

            await ProductModel.destroy({ where: {id}});
            return response.status(204).send("");
        } catch (error) {
            return response.status(500).send("500: ERRO NO SERVIDOR!");
        } */
    }
}

// exporta arquivo
module.exports = ProductController;
