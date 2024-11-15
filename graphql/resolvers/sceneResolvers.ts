import SceneService from "../../services/scene-service";

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
        return sceneService.updateScenes(args.projectId, args.scenes)
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