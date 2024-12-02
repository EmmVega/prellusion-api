import ProjectService from "../../services/project-service.js"


const projectService = new ProjectService()

const projectResolvers = {
    Query: {
        getShotsByProjectIdMutation: async (_, args) => {
            try {
                return projectService.getProjectShots(args.projectId)
            } catch (e) {
                throw new Error(`Failed to get project shots ${e.message}`)
            }
        }
    },
    Mutation: {
        createProjectMutation: async (_, args) => {
            try {
                const newProject = await projectService.createProject(args.project);
                return newProject
            } catch (e) {
                throw new Error(`Failed to create project ${e.message}`)
            }
        }
    }
}

export default projectResolvers;