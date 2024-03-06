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
import { SceneDto } from "../DTOs/scene.dto";
import SceneService from "../services/scene-service";
import * as requestExamples from "../models/examples/sceneModel.json";

@JsonController()
export class SceneController {
   public sceneService = new SceneService();

   @Get("/scenes")
   @OpenAPI({
      summary: "To get all scenes",
   })
   get() {
      return this.sceneService.getAllScenes();
   }

   @Get("/scenes/:id")
   @OpenAPI({
      summary: "To get a scene by id",
   })
   @ResponseSchema(SceneDto)
   async getById(@Param("id") id: number) {
      try {
         return await this.sceneService.getSceneById(id);
      } catch (e) {
         console.log("ERROR: ", e);
         throw e;
      }
   }

   @Post("/scenes")
   @OpenAPI({
      summary: "To post/create a new scene",
      requestBody: {
         content: {
            "application/json": {
               example: requestExamples.postScene,
            },
         },
      },
   })
   async post(
      @Body({ validate: true })
      scene: SceneDto
   ) {
      try {
         return await this.sceneService.createScene(scene);
      } catch (e) {
         console.log("ERROR: ", e);
         throw e;
      }
   }

   @Patch("/scenes/:id")
   @OpenAPI({
      summary: "To update a scene by id",
      requestBody: {
         content: {
            "application/json": {
               example: requestExamples.patchScene,
            },
         },
      },
   })
   async patchById(
      @Param("id") id: number,
      @Body({ validate: true })
      scene: SceneDto
   ) {
      try {
         return await this.sceneService.updateScene(id, scene);
      } catch (e) {
         console.log("ERROR: ", e);
         throw e;
      }
   }

   @Delete("/scenes/:id")
   @OpenAPI({
      summary: "To delete a scene by id",
   })
   async deleteById(@Param("id") id: number) {
      try {
         return await this.sceneService.deleteScene(id);
      } catch (e) {
         console.log("ERROR: ", e);
         throw e;
      }
   }
}
