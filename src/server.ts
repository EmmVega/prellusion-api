import { createHandler } from "graphql-http";
import { ProjectController } from "../controllers/project.controller";
import { SceneController } from "../controllers/scene.controller";
import { UserController } from "../controllers/user.controller";
import App from "./app";
import { root, schema, exampleSchema } from "../graphql/schemas";

const app = new App([SceneController, ProjectController]);
app.dbConnection();
app.listen();
// app.app.use(
//    "/graphql",
//    createHandler({
//       schema: schema,
//       rootValue: root,
//    })
// );
app.app.use("/graphql", createHandler({ schema: exampleSchema }));
