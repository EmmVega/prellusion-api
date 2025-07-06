"use strict";
import { Model } from "sequelize";
export default (sequelize, DataTypes) => {
   class Project extends Model {
      /**
       * Helper method for defining associations.
       * This method is not a part of Sequelize lifecycle.
       * The `models/index` file will call this method automatically.
       */
      static associate(models) {
         Project.hasMany(models.Scene, { foreignKey: "projectId" }); // Correct inverse association
      }
   }
   Project.init(
      {
         name: DataTypes.STRING,
         draft: DataTypes.STRING,
         fileId: DataTypes.STRING,
      },
      {
         sequelize,
         modelName: "Project",
      }
   );
   return Project;
};
