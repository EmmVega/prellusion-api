import ProjectService from "../../services/project-service.js";

const projectService = new ProjectService();

const resolverWrapper = (resolver) => async (...args) => {
    try {
        return await resolver(...args);
    } catch (error) {
        console.error("Resolver Error:", error);
        throw new Error(error.message);
    }
};

const projectResolvers = {
    Query: {
        getShotsByProjectIdMutation: resolverWrapper((_, args) => {
            return projectService.getProjectShots(args.projectId);
        })
    },
    Mutation: {
        createProjectMutation: resolverWrapper((_, args) => {
            return projectService.createProject(args.project);
        }),
        deleteProjectsMutation: resolverWrapper((_, args) => {
            return projectService.deleteProjectsByIds(args.projectIds)
        })
    }
};

export default projectResolvers;
