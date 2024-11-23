'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.removeColumn('Shots', 'projectId');
    await queryInterface.addColumn('Shots', 'sceneId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Scenes', // name of the target table
        key: 'id',         // key in the target table being referenced
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL', // adjust based on your requirements
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.addColumn('Shots', 'projectId', {      
      type: Sequelize.INTEGER,
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL', // adjust based on your requirements});
    })
    await queryInterface.removeColumn('Shots', 'sceneId')
  }
};
