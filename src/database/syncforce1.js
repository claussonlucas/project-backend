const connection = require("../config/connection");

require('../models/UserModel');
require('../models/CategoryModel');
require('../models/ProductModel');
require('../models/ImageModel');
require('../models/OptionModel');

connection.sync({ alter: true });