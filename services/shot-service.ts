import { db } from "../models/index.js";
import { CRUDService } from "./CRUD-service.js";
import { Transaction } from "sequelize";

class ShotService extends CRUDService<typeof db.Shot> {
    constructor() {
        super('Shot', db.Shot, 'Scene', db.Scene);
    }

    // Patch shots by projectId instead of sceneId - handles create, update, delete with transactions
    async patchAllByProject(projectId: number, shots: any[]) {
        return await db.Shot.sequelize.transaction(async (transaction: Transaction) => {
            // Get all existing shots for the project
            const existingShots = await db.Shot.findAll({
                include: [{
                    model: db.Scene,
                    where: { projectId: projectId }
                }],
                transaction
            });

            // Create maps for comparison
            const incomingShotMap = new Map(shots.map((shot: any) => [shot.id, shot]));
            const existingShotMap = new Map(existingShots.map((shot: any) => [shot.id, shot]));

            // Determine which shots to create, update, or delete
            const shotsToCreate = shots.filter((shot: any) => !shot.id);
            const shotsToUpdate = shots.filter((shot: any) => existingShotMap.has(shot.id));
            const shotsToDelete = existingShots.filter((shot: any) => !incomingShotMap.has(shot.id));

            // Create new shots
            if (shotsToCreate.length > 0) {
                await db.Shot.bulkCreate(shotsToCreate, { transaction });
            }

            // Update existing shots
            for (const shot of shotsToUpdate) {
                await db.Shot.update(shot, {
                    where: { id: shot.id },
                    transaction
                });
            }

            // Delete shots that aren't in the incoming array
            if (shotsToDelete.length > 0) {
                await db.Shot.destroy({
                    where: { 
                        id: { [db.Sequelize.Op.in]: shotsToDelete.map((shot: any) => shot.id) }
                    },
                    transaction
                });
            }

            // Return all remaining shots for the project
            // Transaction will auto-commit when this function returns successfully
            // Transaction will auto-rollback if any error is thrown
            return await db.Shot.findAll({
                include: [{
                    model: db.Scene,
                    where: { projectId: projectId }
                }],
                transaction
            });
        });
    }
}

export const shotService = new ShotService();