import { db } from "../models/index.js";
import { Transaction, Op } from "sequelize";

class ProductionPlanService {
    
    async generateProductionPlan(projectId: number) {
        return await db.ShotPlanDay.sequelize.transaction(async (transaction: Transaction) => {
            // Get all shots with their scenes for the project
            const shots = await db.Shot.findAll({
                include: [{
                    model: db.Scene,
                    where: { projectId: projectId }
                }],
                transaction
            });

            if (shots.length === 0) {
                throw new Error(`No shots found for project ${projectId}`);
            }

            // Create ShotPlanDay (single day for now, using current date)
            const shotPlanDay = await db.ShotPlanDay.create({
                projectId: projectId,
                date: new Date().toISOString().split('T')[0], // Today's date
                location: "Studio Location", // Default location
                generalArrival: "08:00:00",
                photoArrival: "07:30:00", 
                soundArrival: "07:45:00",
                makeupArrival: "07:00:00",
                artArrival: "07:15:00",
                caterings: ["12:00:00", "18:00:00"], // Lunch and dinner
                ends: "20:00:00",
                duration: "12:00" // 12 hours
            }, { transaction });

            // Group shots by location (space + place)
            const shotsByLocation = new Map();
            for (const shot of shots) {
                const locationKey = `${shot.Scene.space}-${shot.Scene.place}`;
                if (!shotsByLocation.has(locationKey)) {
                    shotsByLocation.set(locationKey, []);
                }
                shotsByLocation.get(locationKey).push(shot);
            }

            // Create ShotPlanBlocks for each location
            const shotPlanBlocks = [];
            let blockStartTime = "09:00:00";
            
            for (const [locationKey, locationShots] of shotsByLocation) {
                const firstShot = locationShots[0];
                const estimatedDuration = this.calculateBlockDuration(locationShots.length);
                
                const shotPlanBlock = await db.ShotPlanBlock.create({
                    shotPlanDayId: shotPlanDay.id,
                    day: shotPlanDay.date,
                    readyToShot: blockStartTime,
                    space: firstShot.Scene.space,
                    place: firstShot.Scene.place, 
                    time: firstShot.Scene.time,
                    ends: this.addTimeToTime(blockStartTime, estimatedDuration),
                    totalSequences: locationShots.length,
                    totalTimeSequence: estimatedDuration
                }, { transaction });

                shotPlanBlocks.push(shotPlanBlock);

                // Create ShotPlanUnits for each shot in this location
                for (const shot of locationShots) {
                    await db.ShotPlanUnit.create({
                        shotPlanBlockId: shotPlanBlock.id,
                        shotId: shot.id,
                        sceneNumber: shot.Scene.number,
                        shotNumber: shot.number,
                        planeSequence: `Scene ${shot.Scene.number} - Shot ${shot.number}`,
                        time: "0:15", // 15 minutes per shot default
                        script: shot.Scene.script,
                        notes: `${shot.action} - ${shot.shot} shot`
                    }, { transaction });
                }

                // Update start time for next block
                blockStartTime = this.addTimeToTime(blockStartTime, estimatedDuration, "0:30"); // 30 min break
            }

            // Return the complete production plan with all relationships
            return await db.ShotPlanDay.findByPk(shotPlanDay.id, {
                include: [{
                    model: db.ShotPlanBlock,
                    include: [db.ShotPlanUnit]
                }],
                transaction
            });
        });
    }

    async getProductionPlan(projectId: number) {
        return await db.ShotPlanDay.findOne({
            where: { projectId: projectId },
            include: [{
                model: db.ShotPlanBlock,
                include: [db.ShotPlanUnit]
            }]
        });
    }

    async updateProductionPlan(input: any) {
        return await db.ShotPlanDay.sequelize.transaction(async (transaction: Transaction) => {
            const { projectId, days, blocks, units } = input;

            // Validate project exists
            const project = await db.Project.findByPk(projectId, { transaction });
            if (!project) {
                throw new Error(`Project ${projectId} not found`);
            }

            const results = { createdDays: [], updatedDays: [], deletedDays: [], replacedBlocks: [] };

            // HARD DELETE: Remove days that exist in DB but not in input
            const existingDays = await db.ShotPlanDay.findAll({
                where: { projectId },
                transaction
            });
            
            const inputDayIds = days.filter(d => d.id && d.id > 0).map(d => d.id);
            const daysToDelete = existingDays.filter(d => !inputDayIds.includes(d.id));
            
            for (const dayToDelete of daysToDelete) {
                await db.ShotPlanDay.destroy({
                    where: { id: dayToDelete.id },
                    transaction
                });
                results.deletedDays.push(dayToDelete);
            }

            // Process Days - upsert (create or update)
            for (const dayInput of days) {
                const dayData = {
                    projectId: dayInput.projectId,
                    date: dayInput.date,
                    location: dayInput.location,
                    generalArrival: dayInput.generalArrival,
                    photoArrival: dayInput.photoArrival,
                    soundArrival: dayInput.soundArrival,
                    makeupArrival: dayInput.makeupArrival,
                    artArrival: dayInput.artArrival,
                    caterings: dayInput.caterings || [],
                    ends: dayInput.ends,
                    duration: dayInput.duration
                };

                let day;
                if (dayInput.id && dayInput.id > 0) {
                    // Update existing day
                    day = await db.ShotPlanDay.findByPk(dayInput.id, { transaction });
                    if (day) {
                        await day.update(dayData, { transaction });
                        results.updatedDays.push(day);
                    } else {
                        throw new Error(`Day with ID ${dayInput.id} not found`);
                    }
                } else {
                    // Create new day (ignore temporary ID)
                    day = await db.ShotPlanDay.create(dayData, { transaction });
                    results.createdDays.push(day);
                }

                // HARD DELETE: Replace all blocks for this day
                // Delete existing blocks (units will be reassigned, not deleted)
                await db.ShotPlanBlock.destroy({
                    where: { shotPlanDayId: day.id },
                    transaction
                });

                // Create new blocks from input (without creating units)
                const dayBlocks = blocks.filter(b => b.shotPlanDayId === day.id);
                for (const blockInput of dayBlocks) {
                    const blockData = {
                        shotPlanDayId: day.id,
                        readyToShot: blockInput.readyToShot,
                        space: blockInput.space,
                        place: blockInput.place,
                        time: blockInput.time,
                        ends: blockInput.ends,
                        totalSequences: blockInput.totalSequences || 0,
                        totalTimeSequence: blockInput.totalTimeSequence || "0:00"
                    };

                    const newBlock = await db.ShotPlanBlock.create(blockData, { transaction });
                    results.replacedBlocks.push(newBlock);

                    // UPDATE existing units to point to new block and update their scheduling info
                    const blockUnits = units.filter(u => u.shotPlanBlockId === blockInput.id);
                    for (const unitInput of blockUnits) {
                        if (unitInput.id) {
                            await db.ShotPlanUnit.update(
                                { 
                                    shotPlanBlockId: newBlock.id,
                                    // Only update editable scheduling fields, not content fields
                                    time: unitInput.time,
                                    notes: unitInput.notes
                                    // DON'T update: sceneNumber, shotNumber, planeSequence, script, shotId
                                },
                                { 
                                    where: { id: unitInput.id },
                                    transaction 
                                }
                            );
                        }
                    }
                }
            }

            // Return the first day with all relationships for compatibility
            const resultDay = await db.ShotPlanDay.findByPk(results.updatedDays[0]?.id || results.createdDays[0]?.id, {
                include: [{
                    model: db.ShotPlanBlock,
                    include: [db.ShotPlanUnit]
                }],
                transaction
            });

            return {
                success: true,
                message: `Production plan updated successfully. ${results.deletedDays.length} days deleted, ${results.replacedBlocks.length} blocks replaced. Units reassigned to new blocks.`,
                data: resultDay
            };
        });
    }

    // Helper methods
    private calculateBlockDuration(shotCount: number): string {
        const minutesPerShot = 15;
        const setupTime = 30; // 30 minutes setup per location
        const totalMinutes = (shotCount * minutesPerShot) + setupTime;
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return `${hours}:${minutes.toString().padStart(2, '0')}`;
    }

    private addTimeToTime(baseTime: string, addTime: string, breakTime: string = "0:00"): string {
        const parseTime = (time: string) => {
            const [hours, minutes] = time.split(':').map(Number);
            return hours * 60 + minutes;
        };

        const formatTime = (totalMinutes: number) => {
            const hours = Math.floor(totalMinutes / 60);
            const minutes = totalMinutes % 60;
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
        };

        const baseMinutes = parseTime(baseTime);
        const addMinutes = parseTime(addTime);
        const breakMinutes = parseTime(breakTime);
        
        return formatTime(baseMinutes + addMinutes + breakMinutes);
    }
}

export const productionPlanService = new ProductionPlanService();