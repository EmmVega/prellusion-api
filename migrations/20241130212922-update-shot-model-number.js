'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.changeColumn('Shots', 'number', {
      type: Sequelize.STRING,
      allowNull: false
    })
  },

  async down(queryInterface, Sequelize) {
    // Step 1: Revert the column type from STRING back to INTEGER or NUMBER
    await queryInterface.sequelize.query(`
      ALTER TABLE "Shots"
      ALTER COLUMN "number" TYPE INTEGER USING "number"::INTEGER
    `);
  }
};
