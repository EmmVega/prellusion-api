'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ShotPlanDays', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      projectId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Projects',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      location: {
        type: Sequelize.STRING,
        allowNull: false
      },
      generalArrival: {
        type: Sequelize.TIME
      },
      photoArrival: {
        type: Sequelize.TIME
      },
      soundArrival: {
        type: Sequelize.TIME
      },
      makeupArrival: {
        type: Sequelize.TIME
      },
      artArrival: {
        type: Sequelize.TIME
      },
      caterings: {
        type: Sequelize.ARRAY(Sequelize.TIME)
      },
      ends: {
        type: Sequelize.TIME
      },
      duration: {
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
    await queryInterface.dropTable('ShotPlanDays');
  }
};