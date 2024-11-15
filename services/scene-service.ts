import { HttpError } from "routing-controllers";
import { SceneDto } from "../DTOs/scene.dto";
import { db } from "../models";

class SceneService {
   public async createScenes(projectId: number, scenes: SceneDto[]) {
      try {
         const existingProject = await db.Project.findByPk(projectId)

         if(!existingProject) {
            throw new HttpError(404, "Project not found");
         }

         const response = await db.Scene.bulkCreate(scenes);
         return response.map((scene) => scene.get());;
      } catch (e) {
         console.log("ERROR: ", e);
         throw e;
      }
   }

   public async getAllScenes() {
      try {
         const scenes = await db.Scene.findAll();
         const scenesDataValues = scenes.map((scene) => scene.get());
         return scenesDataValues;
      } catch (e) {
         console.log("ERROR: ", e);
         throw e;
      }
   }

   public async getSceneById(id: number) {
      try {
         const scene = await db.Scene.findByPk(id);
         if (!scene) {
            throw new HttpError(404, "Scene not found");
         }
         const sceneDataValues = scene.get();
         return sceneDataValues;
      } catch (e) {
         console.log("ERROR: ", e);
         throw e;
      }
   }

   public async getScenesByProjectId(projectId: number) {
      try {
         const scenes = await db.Scene.findAll({
            where: {
               projectId,
            },
         });
         if (!scenes) {
            throw new HttpError(404, "Project not found");
         }
         const sceneDataValues = scenes.map(scene => scene.get());
         return sceneDataValues;
      } catch (e) {
         console.log("ERROR: ", e);
         throw e;
      }
   }

   public async updateScenes(projectId: number, sceneUpdates: SceneDto[]) {
      try {
         const updatepromises = sceneUpdates.map(async (scene: SceneDto) => {
            const {id, ...updateData} = scene;
            await db.Scene.update(updateData, {
               where: {
                  id,
                  projectId
               }
            })
            const updatedScene = await db.Scene.findByPk(id);
            if (!updatedScene) {
               throw new HttpError(404, "Scene not found");
            }
            const updatedSceneDataValues = updatedScene.get();
            return updatedSceneDataValues;
         })
         const updatedScenes = await Promise.all(updatepromises);
         return updatedScenes
      } catch (e) {
         console.log("ERROR: ", e);
         throw e;
      }
   }

   public async deleteScenes(projectId: number, sceneIds: number[]) {
      try {
         const project = await db.Project.findByPk(projectId);
         if (!project) {
            throw new HttpError(404, "Project not found");
         }

         const deletePromises = sceneIds.map(async (sceneId: Number) => {
            const scene = await db.Scene.findByPk(sceneId);
            if (!scene) {
               throw new HttpError(404, "Scene not found");
            }
            await db.Scene.destroy({
               where: {
                  id: sceneId,
               },
            });
         })
         await Promise.all(deletePromises)
         return this.getScenesByProjectId(projectId);
         
      } catch (e) {
         console.log("ERROR: ", e);
         throw e;
      }
   }
}

export default SceneService;
