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
export const exampleSchema = new GraphQLSchema({
   query: new GraphQLObjectType({
      name: "Query",
      fields: {
         hello: {
            type: GraphQLString,
            resolve: () => "world",
         },
      },
   }),
});

// export const helloSchema = buildSchema(`

//     type TestData {
//         text: String!
//         views: Int!
//     }

//     type RootQuery {
//         hello: TestData!
//     }

//     schema: {
//         query: RootQuery
//     }
// `);

// const schema = new GraphQLSchema({
//     query: new GraphQLObjectType({
//        name: "Query",
//        fields: {
//           hello: {
//              type: helloSchema,
//              resolve: () => "world",
//           },
//        },
//     }),
//  });
