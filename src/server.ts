import { ProjectController } from "../controllers/project.controller";
import { SceneController } from "../controllers/scene.controller";
import { UserController } from "../controllers/user.controller";
import App from "./app";

const app = new App([SceneController, ProjectController]);
app.dbConnection();
app.listen();
