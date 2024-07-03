import  { mergeResolvers }  from '@graphql-tools/merge';
import sceneResolvers from './sceneResolvers';
import projectResolvers from './projectResolvers';

export const resolvers = mergeResolvers([sceneResolvers, projectResolvers]);
