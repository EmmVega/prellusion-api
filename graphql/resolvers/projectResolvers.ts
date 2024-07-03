import ProjectService from "../../services/project-service"


const projectService = new ProjectService()

const projectResolvers = {
    Query: {

    },
    Mutation: {
        createProjectMutation: async (_, args)=> {
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