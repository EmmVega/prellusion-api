// this shim is required
import { getMetadataArgsStorage, useExpressServer } from "routing-controllers";
import { routingControllersToSpec } from "routing-controllers-openapi";
import * as swaggerUi from "swagger-ui-express";
import * as express from "express";
import concectDB from "../db";
import { GlobalErrorHandler } from "../middlewares/Error-middleware";
import { CorsMiddleware } from "../middlewares/cors-middleware";
import { createHandler } from "graphql-http/lib/use/express";
import { schema, root } from "../graphql/schemas";
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { resolvers } from "../graphql/resolvers";
import typeDefs from "../graphql/typedefs";

class App {
   public server
   // public app: express.Application;
   public env: string;
   public port:  number;

   constructor() {
      // this.app = express();
      this.port = 4000;

      // this.initializeMiddlewares();
      this.initializeApolloServer(); // Add this line
   }

   // private initializeMiddlewares() {
   //     this.app
   // }

   public async listen() {
      //   Passing an ApolloServer instance to the `startStandaloneServer` function:
      //    1. creates an Express app
      //    2. installs your ApolloServer instance as middleware
      //    3. prepares your app to handle incoming requests
      const { url } = await startStandaloneServer(this.server, {
         listen: { port: this.port },
      });
      
      console.log(`🚀  Server ready at: ${url}`);
   }

   public dbConnection() {
      concectDB();
   }

   private initializeApolloServer() {
      //   The ApolloServer constructor requires two parameters: your schema
      // definition and your set of resolvers.
      this.server = new ApolloServer({
         typeDefs,
         resolvers,
      });
    }
}

export default App;
