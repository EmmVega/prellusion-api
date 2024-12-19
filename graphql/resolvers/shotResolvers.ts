import { shotService } from "../../services/shot-service.js";

const shotResolvers = {
    Query: {
        getShotsBySceneId: async (_, args) => {
            try {
                console.log(args)
                return shotService.readAll(args.sceneId)
            } catch (e) {
                throw new Error(`Failed to get shots: ${e.message}`);
            }
        }
    },
    Mutation: {
        createShotsMutation: async (_, args) => {
            return shotService.bulkCreate(args.sceneId, args.shots)
        },
        updateShotsMutation: async (_, args) => {
            return shotService.updateItems(args.shots)
        },
        deleteShotsMutation: async (_, args) => {
            return shotService.deleteAll(args.sceneId, args.shotIds);
        }
    }

}

export default shotResolvers;