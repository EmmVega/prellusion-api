import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { loadSchemaSync } from "@graphql-tools/load";
import path from "path";

const __dirname = path.dirname(new URL(import.meta.url).pathname)
const typeDefs = loadSchemaSync(path.join(__dirname, '../**/*.gql'), {
  loaders: [new GraphQLFileLoader()]
});

export default typeDefs;