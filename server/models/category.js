'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      // define association here

      // one-to-many association
      Category.hasMany(models.Product, {
        foreignKey: 'categoryId',
        as: 'product',
      });
    }
  }
  Category.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    slug: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Category',
  });
  return Category;
};