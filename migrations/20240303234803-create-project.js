"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.createTable("Projects", {
         id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
         },
         userId: {
            type: Sequelize.INTEGER,
         },
         name: {
            type: Sequelize.STRING,
         },
         notes: {
            type: Sequelize.STRING,
         },
         sceneIds: {
            type: Sequelize.ARRAY(Sequelize.INTEGER),
         },
         createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
         },
         updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
         },
      });
   },
   async down(queryInterface, Sequelize) {
      await queryInterface.dropTable("Projects");
   },
};
