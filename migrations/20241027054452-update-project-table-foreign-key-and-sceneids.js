'use strict';

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Projects', 'sceneIds');
    await queryInterface.removeColumn('Scenes', 'sceneNumber');
    await queryInterface.addColumn('Scenes', 'number', {
      type: Sequelize.INTEGER,
      allowNull: true, // or false, depending on whether this field is required
      // references: {
      //   model: 'Projects', // name of the target table
      //   key: 'id',         // key in the target table we're referencing
      // },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL', // or 'CASCADE' depending on your requirements
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Scenes', 'sceneNumber', {
      type: Sequelize.INTEGER,
      allowNull: true, // or false, depending on whether this field is required
      references: {
        model: 'Projects', // name of the target table
        key: 'id',         // key in the target table we're referencing
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL', // or 'CASCADE' depending on your requirements
    });
  }
};
