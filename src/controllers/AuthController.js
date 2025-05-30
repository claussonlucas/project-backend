// AuthController.js
// data: 29/05/2025

// importa model
const UserModel = require("../models/UserModel");

// Biblioteca Crypto-js
const MD5 = require('crypto-js/md5');

class AuthController {
    async login(email, password) {
        const data = await UserModel.findAll({
            where: {
                email: email,
                password: MD5(password).toString() // criptografa
            }
        })

        //console.log("AUTH data: ", data);
        //console.log("data.length: ", data.length);
        if(data.length) {
            //console.log("data[0]: ", data[0]);
            return data[0];
        }
        return null;
    }
}

module.exports = AuthController;
