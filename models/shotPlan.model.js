"use strict";
import { Model } from "sequelize";
export default (sequelize, DataTypes) => {
    class ShotPlan extends Model {
        static associate(models) {
            ShotPlan.belongsTo(models.Shot, { foreignKey: "shotId" });
        }
    }
    ShotPlan.init(
        {
            shotId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Shots', // Name of the target table
                    key: 'id',      // Key in the target table
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            planes: DataTypes.STRING,
            time: DataTypes.DATE,
            notes: DataTypes.STRING
        },
        {
            sequelize,
            modelName: "ShotPlan"
        }
    );
    return ShotPlan;
}