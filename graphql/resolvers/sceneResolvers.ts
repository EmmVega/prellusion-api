import { SceneDto } from "../../DTOs/scene.dto.js";
import SceneService from "../../services/scene-service.js";

const sceneService = new SceneService()

const sceneResolvers = {
  Query: {
    scenes: () => sceneService.getAllScenes(),
    getScenesByProjectId: async (_, args) => {
      try {
        return sceneService.getScenesByProjectId(args.projectId)
      } catch (e) {
        throw new Error(`Failed to get scenes: ${e.message}`);
      }
    }
  },
  Mutation: {
    createScenesMutation: async (_, args) => {
      try {
        // Assuming Sequelize or another ORM is used, create a new Scene
        const newScenes = sceneService.createScenes(args.projectId, args.scenes)

        return newScenes;
      } catch (error) {
        throw new Error(`Failed to create scene: ${error.message}`);
      }
    },

    updateScenesMutation: async (_, args) => {
      try {
        const scenesWithProjectId: SceneDto[] = args.scenes.map(scene => ({ ...scene, projectId: args.projectId }))
        return sceneService.updateScenes(args.projectId, scenesWithProjectId)
      } catch (e) {
        throw new Error(`Failed to update scene: ${e.message}`);
      }
    },

    deleteScenesMutation: async (_, args) => {
      try {
        return sceneService.deleteScenes(args.projectId, args.sceneIds)
      } catch (e) {
        throw new Error(`Failed to delete scenes: ${e.message}`);
      }
    }
  }
};

export default sceneResolvers;