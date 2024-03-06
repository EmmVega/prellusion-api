import "reflect-metadata";
import {
   Body,
   Post,
   JsonController,
   Get,
   Param,
   Patch,
   Delete,
} from "routing-controllers";
import { OpenAPI, ResponseSchema } from "routing-controllers-openapi";
import { ProjectDto } from "../DTOs/project.dto";
import ProjectService from "../services/project-service";
import * as requestExamples from "../models/examples/projectModel.json";

@JsonController()
export class ProjectController {
   public projectService = new ProjectService();

   @Get("/projects")
   @OpenAPI({
      summary: "To get all projects",
   })
   get() {
      return this.projectService.getAllProjects();
   }

   @Get("/projects/:id")
   @OpenAPI({
      summary: "To get a project by id",
   })
   @ResponseSchema(ProjectDto)
   async getById(@Param("id") id: number) {
      try {
         return await this.projectService.getProjectById(id);
      } catch (e) {
         console.log("ERROR: ", e);
         throw e;
      }
   }

   @Post("/projects")
   @OpenAPI({
      summary: "To post/create a new project",
      requestBody: {
         content: {
            "application/json": {
               example: requestExamples.postProject,
            },
         },
      },
   })
   async post(
      @Body({ validate: true })
      project: ProjectDto
   ) {
      try {
         return await this.projectService.createProject(project);
      } catch (e) {
         console.log("ERROR: ", e);
         throw e;
      }
   }

   // Add more methods as needed...
}
