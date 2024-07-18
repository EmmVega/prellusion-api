'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Scenes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      sceneNumber: {
        type: Sequelize.INTEGER
      },
      space: {
        type: Sequelize.STRING
      },
      place: {
        type: Sequelize.STRING
      },
      time: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      dialog: {
        type: Sequelize.STRING
      },
      script: {
        type: Sequelize.INTEGER
      },
      talent: {
        type: Sequelize.ARRAY(Sequelize.INTEGER)
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Scenes');
  }
};