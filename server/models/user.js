'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define association here
      
      // One-to-many association
      User.hasMany(models.Product, {
        foreignKey: 'userId',
        as: 'products',
      });

      // One-to-many association
      User.hasMany(models.Order, {
        foreignKey: 'userId',
        as: 'order',
      });

      // One-to-one association
      User.hasOne(models.Cart, {
        foreignKey: 'userId',
        as: 'cart',
      });
    }
  }
  User.init({
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.ENUM('user', 'admin', 'vendor'),
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};