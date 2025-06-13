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
        
        // se URL não tem limit, vai ser um NaN, e retorna undefined
        // Number(): converte o query string em número
        let queryLimit = isNaN(Number(query.limit)) ? undefined : Number(query.limit);
        let queryPage = isNaN(Number(query.page)) ? 1 : Number(query.page); // página com 12 itens
        let queryFields = query.fields; // query fields
        let colProduct = [];
        let colTab = [];
        let includeTab = {};
        let queryMatch = query.match // query match
        let queryCategoryIds = query.category_ids; // por ser lista precisa dividir
        let queryPriceRange = query.price_range;
        let queryOption = query.option;
        let data = []; // lista de obj. que vem do BD
        let standardLimit = 5; // padrão 12
        let newOffset = 0; // usado no offset
        let whereMatch = []; // usado no where (para queryMatch)
        
        console.log("query:", query);
        console.log("queryOption", queryOption);
        

        // se query fields não for digitado
        whereMatch = {where:  {}};

        // verifica se tem queryLimit
        if (queryLimit === undefined) {
            // se query fields não for digitado
            queryLimit = standardLimit;
        } else if (queryLimit == -1) {
            // número alto para mostrar todos
            queryLimit = 1000;
        } else {
            // limit = 3 / page = 1 => offset: (3 * 1) - 3 = 0
            newOffset = ((queryLimit * queryPage) - queryLimit);
        }

        // verifica se tem query fields
        if (queryFields === undefined) {
            // se query fields não for digitado
            colProduct = { exclude: ["use_in_menu", "createdAt", "updatedAt"] };

            includeTab = {x: []};
        } else {
            // se query fields for digitado, será dividido
            queryFields = queryFields.split(',');
            // colunas da tabela produtos
            colProduct = queryFields.filter(check);

            function check(field) {
                return (field !== 'images' &&  field !== 'options');
            }

            // colunas de outras tabelas
            colTab = queryFields.filter(checkTab);

            function checkTab(field) {
                return (field === 'images' || field === 'options');
            }

            if (colTab.length == 0) {
                
                includeTab = {x: []}; // cria uma chave com uma array vazia
            } else {
                includeTab = {x: []};
                
                if (colTab.includes('images')) {
                    includeTab.x.push({model: ImagesModel, as: 'images', attributes: ["id", ["path", 'content']]},);
                }

                if (colTab.includes('options')) {
                    includeTab.x.push({model: OptionModel, as: 'options'},);
                }
            }
            
        }

        // verifica se tem query match
        if (queryMatch !== undefined) {
            whereMatch.where = {[Op.or] :[{ name: queryMatch },
                { description: queryMatch }],};
        }

        // verifica se tem query category_ids
        if (queryCategoryIds !== undefined) {
            queryCategoryIds = queryCategoryIds.split(',');
            
            includeTab.x.unshift({model: ProdCategModel, as: 'category_ids',
                where: {category_id: queryCategoryIds},
                attributes: ["category_id"]}
            );
        }

        // verifica se tem query queryPriceRange
        if (queryPriceRange !== undefined) {
            queryPriceRange = queryPriceRange.split('-');
            whereMatch.where.price = {[Op.between]: [queryPriceRange[0], queryPriceRange[1]]}
        }

        // verifica se tem query queryOption
        if (queryOption !== undefined) {
            queryOption = queryOption.split(',');
            console.log("queryOption", queryOption);
            queryOption = queryOption.toString();
            console.log("queryOption", queryOption);
            
            includeTab.x.push({model: OptionModel, as: 'options',
                where: {values: queryOption},},);

        }

        //console.log("whereMatch.where", whereMatch.where);

        data = await ProductModel.findAll({
            offset: newOffset,
            limit: queryLimit,
            where:  whereMatch.where,
            attributes: colProduct,
            include: includeTab.x
            
        });

        //console.log("DATA: ", data);

        //  mostrar total de linhas do BD
        const datatotal = await ProductModel.count();

        // altera o valor 1000 do queryLimit
        if (queryLimit == 1000) {
            queryLimit = -1;
        }

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
                    {model: ProdCategModel, as: 'category_ids', attributes: ["category_id"]},
                    {model: ImagesModel, as: 'images', attributes: ["id", ["path", 'content']]},
                    {model: OptionModel, as: 'options'}
                ]
            });

            // se no URL tiver id que não tem na tabela retorna 404
            if (data === null) {
                return response.status(404).send("Produto não existe");
            }

            return response.status(200).json(data);
            
        } catch (error) {
            // catch: caso ocorra erro no try, envia status 500 (erro no servidor)
            return response.status(500).send(`500: ERRO NO SERVIDOR! Erro: ${error}`);
        }
    }

    // método post
    async toCreate(request, response) {
        const {category_id, ...body} = request.body;
            
        // try: realiza os códigos
        try {
            // verifica se falta item no corpo da requisição
            if (body.name == undefined || body.slug == undefined ||
                body.price == undefined || body.price_with_discount == undefined) {
                return response.status(400).send("Erro 400: Erro na requisição. Falta dados.");
            }

            // envia para BD
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
                        
            return response.status(201).json({
                    message: "Produto criado com sucesso"
                });
        } catch (error) {
            return response.status(500).send(`500: ERRO NO SERVIDOR! Erro: ${error}`);
        }
    }

    // método put
    async toUpdate(request, response) {
        const id = request.params.id;
        const body = request.body;
        const { category_id, images, options,} = request.body;
        try {
            // verifica se falta item no corpo da requisição
            if (body.name == undefined || body.slug == undefined ||
                body.price == undefined || body.price_with_discount == undefined) {
                return response.status(400).send("Erro 400: Erro na requisição. Falta dados.");
            }

            // procura na tabela se existe a linha de acordo com o id
            const search = await ProductModel.findOne({ where: {id} });

            // se a linha da tabela não existir
            if (search === null) {
                return response.status(404).send("404: Produto não existe");
            }

            // atualiza a linha no BD
            await search.update(body, { where: {id} });

            // Altera imagens
            await ImagesModel.destroy({ where: { product_id: id } });
            const newImages = images.map(img => ({ ...img, product_id: id }));
            await ImagesModel.bulkCreate(newImages);

            // Altera categorias
            await search.setCategories(category_id);

            // Altera options
            await OptionModel.destroy({ where: { product_id: id } });
            const newOptions = options.map(opt => ({ ...opt, product_id: id }));
            await OptionModel.bulkCreate(newOptions);

            //await ProductModel.save();
            return response.status(204).send("");
            
        } catch (error) {
            // catch: caso ocorra erro no try, envia status 500 (erro no servidor)
            return response.status(500).send(`500: ERRO NO SERVIDOR! Erro: ${error}`);
        }
    }

    // método delete
    async toDelete(request, response) {
        const id = request.params.id;
        try {
        const search = await ProductModel.findOne({ where: {id} });

        if (search === null) {
            return response.status(404).send("404: Produto não existe");
        }

        await ProductModel.destroy({ where: {id}});
        return response.status(204).send("");

        } catch (error) {
            return response.status(500).send(`500: ERRO NO SERVIDOR! Erro: ${error}`);
        }
    }
}


// exporta arquivo
module.exports = ProductController;
