import { SceneDto } from "../interfaces/scene.dto";
const db = require("../models/");

class SceneService {
  public scenes = [];
  public async createScene(scene: SceneDto) {
    try {
      const newScene = await db.Scene.create(scene);
      this.scenes.push(newScene);
      return this.scenes;
    } catch (e) {
      console.log("ERROR: ", e);
    }
  }
}

export default SceneService;
