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
    await queryInterface.removeColumn('Projects', 'sceneIds')
    await queryInterface.renameColumn('Scenes', 'dialog', 'dialogue')
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.addColumn('Projects', 'sceneIds', {
      type: Sequelize.ARRAY(Sequelize.INTEGER),
      Update: 'CASCADE',
      onDelete: 'SET NULL',
    })
    await queryInterface.renameColumn('Scenes', 'dialogue', 'dialog')
  }
};
