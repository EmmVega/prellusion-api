"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
   class Scene extends Model {
      /**
       * Helper method for defining associations.
       * This method is not a part of Sequelize lifecycle.
       * The `models/index` file will call this method automatically.
       */
      static associate(models) {
         // define association here
         Scene.belongsTo(models.Project, { foreignKey: "id" });
      }
   }
   Scene.init(
      {
         number: DataTypes.NUMBER,
         shotNumber: DataTypes.NUMBER,
         shot: DataTypes.STRING,
         movement: DataTypes.STRING,
         angulation: DataTypes.STRING,
         action: DataTypes.STRING,
         dialogue: DataTypes.BOOLEAN,
         sound: DataTypes.BOOLEAN,
         transition: DataTypes.STRING,
         notes: DataTypes.STRING,
         script: DataTypes.NUMBER,
         projectId: DataTypes.NUMBER,
      },
      {
         sequelize,
         modelName: "Scene",
      }
   );
   return Scene;
};
