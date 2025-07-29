"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
    class ShotPlanDay extends Model {
        static associate(models) {
            ShotPlanDay.belongsTo(models.Project, { foreignKey: "projectId" });
            ShotPlanDay.hasMany(models.ShotPlanBlock, { foreignKey: "shotPlanDayId" });
        }
    }
    
    ShotPlanDay.init(
        {
            projectId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Projects',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            date: {
                type: DataTypes.DATEONLY,
                allowNull: false
            },
            location: {
                type: DataTypes.STRING,
                allowNull: false
            },
            // Separate arrival times for each department
            generalArrival: DataTypes.TIME,
            photoArrival: DataTypes.TIME,
            soundArrival: DataTypes.TIME,
            makeupArrival: DataTypes.TIME,
            artArrival: DataTypes.TIME,
            // Catering times as array
            caterings: DataTypes.ARRAY(DataTypes.TIME),
            ends: DataTypes.TIME,
            duration: DataTypes.STRING // Format: "HH:MM"
        },
        {
            sequelize,
            modelName: "ShotPlanDay",
            timestamps: true
        }
    );
    
    return ShotPlanDay;
};