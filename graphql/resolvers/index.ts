import { mergeResolvers } from '@graphql-tools/merge';
import sceneResolvers from './sceneResolvers.js';
import projectResolvers from './projectResolvers.js';
import shotResolvers from './shotResolvers.js';
import productionPlanResolvers from './productionPlanResolvers.js';

export const resolvers = mergeResolvers([sceneResolvers, projectResolvers, shotResolvers, productionPlanResolvers]);
