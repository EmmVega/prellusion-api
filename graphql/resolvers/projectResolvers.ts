import ProjectService from "../../services/project-service.js";
import StorageService from "../../services/storage-service.js";
import path from "path";
import { v4 as uuidv4 } from "uuid";

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
        createProject: resolverWrapper(async (_, args) => {
            const { file, name, draft } = args.project;
            const { createReadStream, filename } = await file.file;
            
            // 1. Get the file stream
            const stream = createReadStream();
            
            // 2. Generate a unique fileId
            const fileId = uuidv4() + path.extname(filename);

            // 3. Save the file using the StorageService
            const filePath = await StorageService.saveFile(stream, fileId);

            // 4. Prepare data for the ProjectService
            const projectData = { name, draft, fileId };
            const fileData = { path: filePath };

            // 5. Call the service to create the project and publish the message
            return projectService.createProject(projectData, fileData);
        }),
        deleteProjectsMutation: resolverWrapper((_, args) => {
            return projectService.deleteProjectsByIds(args.projectIds)
        })
    }
};

export default projectResolvers;
