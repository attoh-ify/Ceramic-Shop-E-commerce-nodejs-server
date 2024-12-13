'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    static associate(models) {
      // define association here

      // One-to-one association
      Cart.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
      });

      // One-to-many association
      Cart.hasMany(models.CartItem, {
        foreignKey: 'cartId',
        as: 'cartitem',
      });
    }
  }
  Cart.init({
    total_quantity: DataTypes.INTEGER,
    total_price: DataTypes.DECIMAL
  }, {
    sequelize,
    modelName: 'Cart',
  });
  return Cart;
};