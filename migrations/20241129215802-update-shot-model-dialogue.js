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
    await queryInterface.changeColumn('Shots', 'dialogue', {
      type: Sequelize.STRING,
      allowNull: true
    })
  },

  async down(queryInterface, Sequelize) {
    // Convert column 'dialogue' from STRING to BOOLEAN
    await queryInterface.sequelize.query(`
      ALTER TABLE "Shots"
      ALTER COLUMN "dialogue" TYPE BOOLEAN USING 
        CASE 
          WHEN "dialogue" = 'true' THEN true
          WHEN "dialogue" = 'false' THEN false
          ELSE NULL
        END
    `);
  }
};
