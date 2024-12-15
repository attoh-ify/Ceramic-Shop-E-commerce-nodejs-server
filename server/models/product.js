'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      // define association here

      // one-to-many association
      Product.hasMany(models.CartItem, {
        foreignKey: 'productId',
        as: 'cartitem',
      });

      // one-to-many association
      Product.hasMany(models.OrderItem, {
        foreignKey: 'productId',
        as: 'orderitem',
      });

      // Many-to-one association
      Product.belongsTo(models.Category, {
        foreignKey: 'categoryId',
        as: 'category',
      });

      // Many-to-one association
      Product.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
      });
    }
  }
  Product.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    price: DataTypes.FLOAT,
    currency: DataTypes.ENUM('naira', 'dollar', 'pound', 'euro', 'rand', 'yen'),
    color: DataTypes.STRING,
    material: DataTypes.STRING,
    tags: DataTypes.ARRAY(DataTypes.STRING),
    stock: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};