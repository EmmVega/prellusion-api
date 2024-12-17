'use strict';
import { Model } from "sequelize";
export default (sequelize, DataTypes) => {
  class Scene extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Scene.belongsTo(models.Project, { foreignKey: "projectId" }); // Correct foreign key
      Scene.hasMany(models.Shot, { foreignKey: 'sceneId' })
    }
  }
  Scene.init({
    number: DataTypes.INTEGER,
    projectId: DataTypes.INTEGER,
    space: DataTypes.STRING,
    place: DataTypes.STRING,
    time: DataTypes.STRING,
    description: DataTypes.STRING,
    dialogue: DataTypes.STRING,
    script: DataTypes.INTEGER,
    talent: DataTypes.ARRAY(DataTypes.INTEGER)
  }, {
    sequelize,
    modelName: 'Scene',
  });
  return Scene;
};