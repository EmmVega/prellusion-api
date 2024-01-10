import "reflect-metadata";
import { Body, Post, JsonController } from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";
import { SceneDto } from "../interfaces/scene.dto";
import SceneService from "../services/scene-service";

@JsonController()
export class SceneController {
  public sceneService = new SceneService();

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
