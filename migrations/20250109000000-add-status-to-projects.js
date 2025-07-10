'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Projects', 'status', {
      type: Sequelize.ENUM('pending', 'processing', 'completed', 'error'),
      allowNull: false,
      defaultValue: 'pending'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Projects', 'status');
    // Also need to drop the ENUM type
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Projects_status";');
  }
};