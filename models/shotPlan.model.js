"use strict";
import { Model } from "sequelize";
export default (sequelize, DataTypes) => {
    class ShotPlan extends Model {
        static associate(models) {
            ShotPlan.belongsTo(models.Shot, { foreignKey: "id" });
        }
    }
    ShotPlan.init(
        {
            sceneId: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            planes: DataTypes.STRING,
            schedule: DataTypes.DATE,
            notes: DataTypes.STRING
        },
        {
            sequelize,
            modelName: "ShotPlan"
        }
    );
    return ShotPlan;
}