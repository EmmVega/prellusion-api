"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
    class ShotPlanUnit extends Model {
        static associate(models) {
            ShotPlanUnit.belongsTo(models.ShotPlanBlock, { foreignKey: "shotPlanBlockId" });
            ShotPlanUnit.belongsTo(models.Shot, { foreignKey: "shotId" });
            // We can get talent through: Shot -> Scene -> talent array
        }
    }
    
    ShotPlanUnit.init(
        {
            shotPlanBlockId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'ShotPlanBlocks',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            shotId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Shots',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            // Denormalized fields for quick access (without joins)
            sceneNumber: DataTypes.INTEGER,
            shotNumber: DataTypes.STRING,
            planeSequence: DataTypes.STRING,
            time: DataTypes.STRING, // Format: "H:MM" (time duration for this shot)
            script: DataTypes.INTEGER, // Script page number (inherited from scene/shot)
            notes: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "ShotPlanUnit"
        }
    );
    
    return ShotPlanUnit;
};