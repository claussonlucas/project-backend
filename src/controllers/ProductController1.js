const ImageModel = require("../models/ImageModel");
const OptionModel = require("../models/OptionModel");
const ProductModel = require("../models/ProductModel");

class ProductController {
    constructor() {
        ProductModel.associate({ImageModel, OptionModel});
    }

    async getAll(request, response) {
        try {
            const dados = await ProductModel.findAll({
                attributes: {
                    exclude: ['id', 'use_in_menu', 'createdAt', 'updatedAt']
                }
            });
            return response.status(200).json(dados);
        } catch (error) {
            return response.status(500).send("Erro no servidor!");
        }
    }

    async getById(request, response) {
        const id = request.params.id;
        try {
            const dados = await ProductModel.findByPk(id, {
                attributes: {
                    exclude: ['id', 'use_in_menu', 'createdAt', 'updatedAt']
                }
            })
            if (dados !== null) {
                return response.status(200).json(dados);
            } else {
                return response.status(404).send("Produto não encontrado!");
            }
        } catch (error) {
            return response.status(500).send("Erro no servidor!");
        }
    }

    async create(request, response) {
        const body = request.body; 
        // Validação para campos obrigatórios
        if (!body.name || !body.slug || !body.price || !body.price_with_discount) {
            return response.status(400).send("Os campos 'name', 'slug', 'price' e 'price_with_discount' são obrigatórios!");        
        }
        try {
            await ProductModel.create(body, {
                include: [
                    {
                        model: ImageModel,
                        as: 'images'
                    },
                    {
                        model: OptionModel,
                        as: 'options'
                    }
                ]
            });
            return response.status(201).send("Produto cadastrado com sucesso!");
        } catch (error) {
            console.error("Erro ao criar produto:", error);
            return response.status(500).send("Erro no servidor!");
        }
    }

    async update(request, response) {
        const id = request.params.id;
        const body = request.body;
        // Validação para campos obrigatórios
        if (!body.name || !body.slug || !body.price || !body.price_with_discount) {
            return response.status(400).send("Os campos 'name', 'slug', 'price' e 'price_with_discount' são obrigatórios!");        
        }
        try {
            const product = await ProductModel.findOne({ where: { id } });
            if (product) {
               await ProductModel.update(body, { where: { id } }); 
               return response.status(204).send("Produto atualizado com sucesso!");
            } else {
                return response.status(404).send("Produto não encontrado!");
            }
        } catch (error) {
            return response.status(500).send("Erro no servidor!");
        }
    }

    async delete(request, response) {
        const id = request.params.id;
        try {
            // Primeiro verifica se o produto existe
            const product = await ProductModel.findOne({ where: { id } });
            if (product) {
                // Se existir, deleta o produto
                await ProductModel.destroy({ where: { id } });
                return response.status(204).send("Produto deletado com sucesso!");
            } else {
                return response.status(404).send("Produto não encontrado!");
            }
        } catch (error) {
            return response.status(500).send("Erro no servidor!");
        }
    }
}

module.exports = ProductController;