import { SceneController } from "./controllers/scene.controller";
import { UserController } from "./controllers/user.controller";
import App from "./index";

const app = new App([UserController, SceneController]);
app.dbConnection();
app.listen();
