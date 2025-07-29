"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
    class ShotPlanBlock extends Model {
        static associate(models) {
            ShotPlanBlock.belongsTo(models.ShotPlanDay, { foreignKey: "shotPlanDayId" });
            ShotPlanBlock.hasMany(models.ShotPlanUnit, { foreignKey: "shotPlanBlockId" });
        }
    }
    
    ShotPlanBlock.init(
        {
            shotPlanDayId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'ShotPlanDays',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            day: DataTypes.DATEONLY,
            readyToShot: DataTypes.TIME,
            space: DataTypes.STRING, // INT/EXT
            place: DataTypes.STRING, // Location name
            time: DataTypes.STRING,  // Day/Night/Morning etc
            ends: DataTypes.TIME,
            totalSequences: DataTypes.INTEGER,
            totalTimeSequence: DataTypes.STRING // Format: "H:MM"
        },
        {
            sequelize,
            modelName: "ShotPlanBlock",
            timestamps: true
        }
    );
    
    return ShotPlanBlock;
};