const UserModel = require('../models/UserModel');
// const ProfileModel = require('../models/ProfileModel');

async function execute() {

    let user = await UserModel.create({
        firstname: "Maria",
        surname: "Chagas",
        email: "marie@mail.com",
        password: "1234"
    });

    console.log(user);

}

execute();