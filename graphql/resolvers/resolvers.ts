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
    createSceneMutation: async (_, args) => {
      try {
        // Assuming Sequelize or another ORM is used, create a new Scene
        const newScene = sceneService.createScene(args.scene)

        return newScene;
      } catch (error) {
        throw new Error(`Failed to create scene: ${error.message}`);
      }
    },

    updateSceneMutation: async (_, args) => {
      try {
        return sceneService.updateScene(args.id, args.scene)
      } catch (e) {
        throw new Error(`Failed to update scene: ${e.message}`);
      }
    },
  }
};

export default sceneResolvers;