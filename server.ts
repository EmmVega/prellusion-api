import { UserController } from "./controllers/user.controllers";
import App from './index';

const app = new App([UserController])
app.listen();