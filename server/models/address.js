'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Address extends Model {
    static associate(models) {
      // define association here

      // One-to-one association
      Address.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
      });
    }
  }
  Address.init({
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    phonenumber1: DataTypes.STRING,
    phonenumber2: DataTypes.STRING,
    address: DataTypes.STRING,
    additional_information: DataTypes.STRING,
    region: DataTypes.STRING,
    city: DataTypes.STRING,
    defaultaddress: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Address',
  });
  return Address;
};