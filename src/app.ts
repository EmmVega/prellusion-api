// this shim is required
import { getMetadataArgsStorage, useExpressServer } from "routing-controllers";
import { routingControllersToSpec } from "routing-controllers-openapi";
import * as swaggerUi from "swagger-ui-express";
import * as express from "express";
import concectDB from "../db";

class App {
  public app: express.Application;
  public env: string;
  public port: string | number;

  constructor(Controllers: Function[]) {
    this.app = express();
    this.port = 3000;

    // this.initializeMiddlewares();
    this.initializeRoutes(Controllers);
    this.initializeSwagger(Controllers);
  }

  // private initializeMiddlewares() {
  //     this.app
  // }

  public listen() {
    this.app.listen(this.port, () => {
      console.log("============");
      console.log("APP LISTENING ON PORT 3000");
      console.log("============");
    });
  }

  public getServer() {
    return this.app;
  }

  public dbConnection() {
    concectDB();
  }

  private initializeRoutes(controllers: Function[]) {
    useExpressServer(this.app, {
      controllers: controllers,
      defaultErrorHandler: false,
    });
  }

  private initializeSwagger(controllers: Function[]) {
    const routingControllersOptions = {
      controllers: controllers,
    };

    const storage = getMetadataArgsStorage();
    const spec = routingControllersToSpec(storage, routingControllersOptions, {
      components: {
        securitySchemes: {
          basicAuth: {
            scheme: "basic",
            type: "http",
          },
        },
      },
      info: {
        description: "Generated with routing-controllers-openapi",
        title: "Prellusion",
        version: "1.0.0",
      },
    });

    // Serve Swagger UI assets from node_modules/swagger-ui-dist
    this.app.use(
      "/swagger-ui-dist",
      express.static(require("swagger-ui-dist").getAbsoluteFSPath())
    );

    // Serve Swagger JSON spec
    this.app.get("/api-docs/swagger.json", (req, res) => res.json(spec));

    // Configure Swagger UI
    const options = {
      explorer: true,
      customCss: "/swagger-ui.css",
      customJs: "/swagger-ui-bundle.js",
    };

    // Serve Swagger UI interface
    this.app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(spec, options));
  }
}

export default App;
