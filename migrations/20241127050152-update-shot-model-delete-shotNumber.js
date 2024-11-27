'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Shots', 'shotNumber');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('Shots', 'shotNumber', {
      type: Sequelize.INTEGER,
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL', // adjust based on your requirements});
    })
  }
};
