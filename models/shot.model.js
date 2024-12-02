"use strict";
import { Model } from "sequelize";
export default (sequelize, DataTypes) => {
   class Shot extends Model {
      /**
       * Helper method for defining associations.
       * This method is not a part of Sequelize lifecycle.
       * The `models/index` file will call this method automatically.
       */
      static associate(models) {
         // define association here
         Shot.belongsTo(models.ShotPlan, { foreignKey: "id" });
         Shot.belongsTo(models.Scene, { foreignKey: "sceneId" })
      }
   }
   Shot.init(
      {
         number: DataTypes.STRING,
         shot: DataTypes.STRING,
         movement: DataTypes.STRING,
         angulation: DataTypes.STRING,
         action: DataTypes.STRING,
         dialogue: DataTypes.STRING,
         sound: DataTypes.BOOLEAN,
         transition: DataTypes.STRING,
         notes: DataTypes.STRING,
         script: DataTypes.NUMBER,
         sceneId: DataTypes.NUMBER,
      },
      {
         sequelize,
         modelName: "Shot",
      }
   );
   return Shot;
};
