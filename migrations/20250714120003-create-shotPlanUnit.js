'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ShotPlanUnits', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      shotPlanBlockId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'ShotPlanBlocks',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      shotId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Shots',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      sceneNumber: {
        type: Sequelize.INTEGER
      },
      shotNumber: {
        type: Sequelize.STRING
      },
      planeSequence: {
        type: Sequelize.STRING
      },
      time: {
        type: Sequelize.STRING
      },
      script: {
        type: Sequelize.INTEGER
      },
      notes: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('ShotPlanUnits');
  }
};