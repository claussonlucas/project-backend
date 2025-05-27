// ProductController.js
// data: 25/05/2025


// importa arquivos models
const ProductModel = require("../models/ProductModel");
const CategoryModel = require("../models/CategoryModel");
const ProdCategModel = require("../models/ProdCategModel");
const ImagesModel = require("../models/ImagesModel");
const OptionModel = require("../models/OptionModel");

// cria uma classe
class ProductController {
    constructor() {
        ProductModel.associate({CategoryModel, ProdCategModel,ImagesModel, OptionModel});
    }

    // método get
    async toListAll(request, response) {
        const query = request.query;
        
        let fulldata = "";
        
        let dados = query;
        console.log(dados);

        let limite = query.limit;
        console.log(limite);

        //if (limite === "-1") {
            //limite = 0;
            /* console.log("certo");
            fulldata += `{ limit: ${limite} }`;
            console.log(fulldata); */
        //}
        
        
        const data = await ProductModel.findAll({ limit: 2 });

        return response.status(200).send(data);
    }

    // método get
    async toListById(request, response) {
        const id = request.params.id;
        try {
            const data = await ProductModel.findByPk(id, {
                attributes: ["id", "enabled", "name", "slug", "stock", "description", "price", "price_with_discount"]//,
                // inclui dados da outra tabela
                //include: {
                    // define qual o model
                /*     model: ImagesModel,
                    attributes: ["id", "product_id"]
                } */
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