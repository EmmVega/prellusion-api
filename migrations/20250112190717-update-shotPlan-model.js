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
    await queryInterface.renameColumn('ShotPlans', 'planes', 'planeSequence')
    await queryInterface.removeColumn('ShotPlans', 'schedule')
    await queryInterface.addColumn('ShotPlans', 'time', {
      type: Sequelize.INTEGER,
      allowNull: false
    })
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.renameColumn('ShotPlans', 'planeSequence', 'planes')
    await queryInterface.removeColumn('ShotPlans', 'time')
    await queryInterface.addColumn('ShotPlans', 'schedule', {
      type: Sequelize.DATE,
      allowNull: false
    })
  }
};
