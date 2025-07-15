'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Drop the old ShotPlan table
    await queryInterface.dropTable('ShotPlans');
  },

  async down(queryInterface, Sequelize) {
    // Recreate the old ShotPlan table for rollback
    await queryInterface.createTable('ShotPlans', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
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
      planes: {
        type: Sequelize.STRING
      },
      time: {
        type: Sequelize.DATE
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
  }
};