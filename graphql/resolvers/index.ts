import  { mergeResolvers }  from '@graphql-tools/merge';
import sceneResolvers from './resolvers';

export const resolvers = mergeResolvers([sceneResolvers]);
