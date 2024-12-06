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
    await queryInterface.changeColumn('Shots', 'sound', {
      type: Sequelize.STRING,
      allowNull: true
    })
  },

  async down(queryInterface, Sequelize) {
    // Convert column 'dialogue' from STRING to BOOLEAN
    await queryInterface.sequelize.query(`
      ALTER TABLE "Shots"
      ALTER COLUMN "sound" TYPE BOOLEAN USING 
        CASE 
          WHEN "sound" = 'true' THEN true
          WHEN "sound" = 'false' THEN false
          ELSE NULL
        END
    `);
  }
};
