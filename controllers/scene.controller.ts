import "reflect-metadata";
import { Body, Post, JsonController, Get } from "routing-controllers";
import { OpenAPI, ResponseSchema } from "routing-controllers-openapi";
import { SceneDto } from "../interfaces/scene.dto";
import SceneService from "../services/scene-service";
import { validateOrReject } from "class-validator";

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

  @Post("/scenes")
  @OpenAPI({
    summary: "To post/create a new scene",
  })
  async post(
    @Body({ validate: true })
    scene: SceneDto
  ) {
    try {
      return this.sceneService.createScene(scene);
    } catch (e) {
      console.log("ERROR: ", e);
      throw e;
    }
  }
}
