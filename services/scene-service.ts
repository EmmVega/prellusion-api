import { HttpError } from "routing-controllers";
import { SceneDto } from "../DTOs/scene.dto";
import { db } from "../models";

class SceneService {
   public async createScene(scene: SceneDto) {
      try {
         const response = await db.Scene.create(scene);
         return response.dataValues;
      } catch (e) {
         console.log("ERROR: ", e);
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

   public async updateScene(id: number, scene: SceneDto) {
      try {
         await db.Scene.update(scene, {
            where: {
               id,
            },
         });
         const updatedScene = await db.Scene.findByPk(id);
         if (!updatedScene) {
            throw new HttpError(404, "Scene not found");
         }

         const updatedSceneDataValues = updatedScene.get();
         return updatedSceneDataValues;
      } catch (e) {
         console.log("ERROR: ", e);
         throw e;
      }
   }

   public async deleteScene(id: number) {
      try {
         const deletedScene = await db.Scene.findByPk(id);
         if (!deletedScene) {
            throw new HttpError(404, "Scene not found");
         }
         await db.Scene.destroy({
            where: {
               id,
            },
         });
         return deletedScene;
      } catch (e) {
         console.log("ERROR: ", e);
         throw e;
      }
   }
}

export default SceneService;
