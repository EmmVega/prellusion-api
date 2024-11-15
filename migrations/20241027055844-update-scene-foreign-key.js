'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add the new projectId column as a foreign key
    // await queryInterface.removeColumn('Scenes', 'projectId');
    await queryInterface.addColumn('Scenes', 'projectId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Projects', // name of the target table
        key: 'id',         // key in the target table being referenced
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL', // adjust based on your requirements
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the projectId column in the rollback
    await queryInterface.removeColumn('Scenes', 'projectId');
  }
};
