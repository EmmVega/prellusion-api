import { SceneDto } from "../interfaces/scene.dto";
import { db } from "../models";

class SceneService {
  public async createScene(scene: SceneDto) {
    try {
      const response = await db.Scene.create(scene);
      return response.dataValues;
    } catch (e) {
      console.log("ERROR: ", e);
    }
  }

  public async getAllScenes() {
    try {
      const scenes = await db.Scene.findAll();
      const scenesDataValues = scenes.map((scene) => scene.get());
      return scenesDataValues;
    } catch (e) {
      console.log("ERROR: ", e);
      throw e;
    }
  }
}

export default SceneService;
