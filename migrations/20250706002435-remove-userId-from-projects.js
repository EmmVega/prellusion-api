'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Projects', 'userId');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn('Projects', 'userId', {
      type: Sequelize.INTEGER
    });
  }
};