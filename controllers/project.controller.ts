import "reflect-metadata";
import {
   Body,
   Post,
   JsonController,
   Get,
   Param,
   Patch,
   Delete,
   UseBefore,
} from "routing-controllers";
import { OpenAPI, ResponseSchema } from "routing-controllers-openapi";
import { ProjectDto } from "../DTOs/project.dto.js";
import ProjectService from "../services/project-service.js";
import requestExamples from "../models/examples/projectModel.json" assert { type: "json" };
import { fileUpload } from "../middlewares/scriptProject-middleware.js";

@JsonController()
export class ProjectController {
   public projectService = new ProjectService();

   @Get("/projects")
   @OpenAPI({
      summary: "To get all projects",
   })
   get() {
      //TODO: it seems this endpoint will not be used, since we never get all user projects
      //(as user with single project, maybe if UI shows all projects)
      // return this.projectService.getAllProjects();

      //this service is here as example, it will live on POST /projects
      return this.projectService.scriptParser();
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
   @UseBefore(fileUpload.single("script"))
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
         console.log("CONTROLLER: ", project);
         return await this.projectService.createProject(project);
      } catch (e) {
         console.log("ERROR: ", e);
         throw e;
      }
   }

   // Add more methods as needed...
}
