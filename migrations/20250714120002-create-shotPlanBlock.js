'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ShotPlanBlocks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      shotPlanDayId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'ShotPlanDays',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      day: {
        type: Sequelize.DATEONLY
      },
      readyToShot: {
        type: Sequelize.TIME
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
      ends: {
        type: Sequelize.TIME
      },
      totalSequences: {
        type: Sequelize.INTEGER
      },
      totalTimeSequence: {
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
    await queryInterface.dropTable('ShotPlanBlocks');
  }
};