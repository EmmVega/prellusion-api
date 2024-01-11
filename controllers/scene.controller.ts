import "reflect-metadata";
import { Body, Post, JsonController, Get } from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";
import { SceneDto } from "../interfaces/scene.dto";
import SceneService from "../services/scene-service";

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
    summary: "TESTING SUMMARY",
  })
  post(
    @Body()
    scene: SceneDto
  ) {
    return this.sceneService.createScene(scene);
  }
}
