
import concectDB from "../db/index.js";
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.mjs';
import { resolvers } from "../graphql/resolvers/index.js";
import typeDefs from "../graphql/typedefs/index.js";

class App {
   public app: express.Application;
   public port: number;

   constructor() {
      this.app = express();
      this.port = 4000;
   }

   public async listen() {
      const httpServer = http.createServer(this.app);
      const server = new ApolloServer({
         typeDefs,
         resolvers,
         plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
      });
      await server.start();
      this.app.use(
         '/graphql',
         cors<cors.CorsRequest>(),
         graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 1 }),
         expressMiddleware(server, {
            context: async ({ req }) => ({ token: req.headers.token }),
         }),
      );

      await new Promise<void>((resolve) => httpServer.listen({ port: this.port }, resolve));
      console.log(`🚀 Server ready at http://localhost:${this.port}/graphql`);
   }

   public dbConnection() {
      concectDB();
   }
}

export default App;
