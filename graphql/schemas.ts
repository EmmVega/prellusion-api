import { buildSchema } from "graphql";

import { GraphQLSchema, GraphQLObjectType, GraphQLString } from "graphql";

export var schema = buildSchema(`
  type Query {
    hello: String
  }
`);

export var root = {
   hello() {
      return "Hello world!";
   },
};
