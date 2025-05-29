// AuthController.js
// data: 29/05/2025

// importa model
const UserModel = require("../models/UserModel");

class AuthController {
    async login(username, password) {
        const data = await UserModel.findAll({
            where: {
                username: username,
                password: password
            }
        })

        if(dados.length) {
            return dados[0];
        }
        return null;
    }
}

module.exports = AuthController;
