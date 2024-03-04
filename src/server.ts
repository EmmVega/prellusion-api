import { SceneController } from "../controllers/scene.controller";
import { UserController } from "../controllers/user.controller";
import App from "./app";

const app = new App([SceneController]);
app.dbConnection();
app.listen();
