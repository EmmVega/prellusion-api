"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.createTable("Scenes", {
         id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
         },
         number: {
            type: Sequelize.INTEGER,
         },
         shotNumber: {
            type: Sequelize.INTEGER,
         },
         shot: {
            type: Sequelize.STRING,
         },
         movement: {
            type: Sequelize.STRING,
         },
         angulation: {
            type: Sequelize.STRING,
         },
         action: {
            type: Sequelize.STRING,
         },
         dialogue: {
            type: Sequelize.BOOLEAN,
         },
         sound: {
            type: Sequelize.BOOLEAN,
         },
         transition: {
            type: Sequelize.STRING,
         },
         notes: {
            type: Sequelize.STRING,
         },
         script: {
            type: Sequelize.INTEGER,
         },
         projectId: {
            type: Sequelize.INTEGER,
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
      await queryInterface.dropTable("Scenes");
   },
};
