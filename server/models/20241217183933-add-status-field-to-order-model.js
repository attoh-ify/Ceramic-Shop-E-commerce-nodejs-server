const DataTypes = require('sequelize');

'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Orders', 'status', {
      status: {
        type: DataTypes.ENUM("pending", "processing", "completed", "failed", "canceled", "shipped", "delivered"),
        defaultValue: "pending",
      }
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Orders', 'status')
  }
};
