import { HttpError } from "routing-controllers";
import { ProjectDto } from "../interfaces/project.dto";
import { db } from "../models";

class ProjectService {
   public async createProject(project: ProjectDto) {
      try {
         const response = await db.Project.create(project);
         return response.dataValues;
      } catch (e) {
         console.log("ERROR: ", e);
      }
   }

   public async getAllProjects() {
      try {
         const projects = await db.Project.findAll();
         const projectsDataValues = projects.map((project) => project.get());
         return projectsDataValues;
      } catch (e) {
         console.log("ERROR: ", e);
         throw e;
      }
   }

   public async getProjectById(id: number) {
      try {
         const project = await db.Project.findByPk(id);
         if (!project) {
            throw new HttpError(404, "Project not found");
         }
         const projectDataValues = project.get();
         return projectDataValues;
      } catch (e) {
         console.log("ERROR: ", e);
         throw e;
      }
   }

   // Add more methods as needed...
}

export default ProjectService;
