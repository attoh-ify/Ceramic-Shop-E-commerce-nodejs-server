'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js' && file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;


// const User = require('./user');
// const Category = require('./category');
// const Product = require('./product');

// // Define relationship between User and Product models
// User.hasMany(Product, {
//   foreignKey: 'userId', // Adds a `userId` column in the Product table
//   as: 'products', // Alias for related queries
// });

// Product.belongsTo(User, {
//   foreignKey: 'userId', // Links Product to User
//   as: 'user', // Alias for related queries
// });


// // Define relationship between Category and Product models
// Category.hasMany(Product, {
//   foreignKey: 'categoryId', // Adds a `categoryId` column in the Product table
//   as: 'products', // Alias for related queries
// });

// Product.belongsTo(Category, {
//   foreignKey: 'categoryId', // Links Product to Category
//   as: 'category', // Alias for related queries
// });

// module.exports = { User, Category, Product };