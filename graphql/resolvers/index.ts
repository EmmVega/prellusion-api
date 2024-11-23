import  { mergeResolvers }  from '@graphql-tools/merge';
import sceneResolvers from './sceneResolvers';
import projectResolvers from './projectResolvers';
import shotResolvers from './shotResolvers';

export const resolvers = mergeResolvers([sceneResolvers, projectResolvers, shotResolvers]);
