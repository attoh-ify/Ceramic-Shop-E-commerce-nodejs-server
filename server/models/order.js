'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      // define association here

      // Many-to-one association
      Order.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
      });

      // one-to-many association
      Order.hasMany(models.OrderItem, {
        foreignKey: 'ordertId',
        as: 'orderitem',
      });
    }
  }
  Order.init({
    status: DataTypes.ENUM('pending', 'paid', 'shipped', 'cancelled'),
    total_price: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};