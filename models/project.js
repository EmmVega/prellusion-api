"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
   class Project extends Model {
      /**
       * Helper method for defining associations.
       * This method is not a part of Sequelize lifecycle.
       * The `models/index` file will call this method automatically.
       */
      static associate(models) {
         // define association here
         Project.belongsTo(models.User, { foreignKey: "userId" });
         Project.hasMany(models.Scene, { foreignKey: "script" });
      }
   }
   Project.init(
      {
         userId: DataTypes.INTEGER,
         name: DataTypes.STRING,
         notes: DataTypes.STRING,
         sceneIds: DataTypes.ARRAY(DataTypes.INTEGER),
      },
      {
         sequelize,
         modelName: "Project",
      }
   );
   return Project;
};
