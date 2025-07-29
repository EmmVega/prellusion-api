import { productionPlanService } from "../../services/production-plan-service.js";

const resolverWrapper = (resolver) => async (...args) => {
    try {
        return await resolver(...args);
    } catch (error) {
        console.error("Production Plan Resolver Error:", error);
        throw new Error(error.message);
    }
};

const productionPlanResolvers = {
    Query: {
        getProductionPlan: resolverWrapper((_, args) => {
            return productionPlanService.getProductionPlan(args.projectId);
        }),
    },
    Mutation: {
        generateProductionPlan: resolverWrapper(async (_, args) => {
            return productionPlanService.generateProductionPlan(args.projectId);
        }),
        updateProductionPlan: resolverWrapper(async (_, args) => {
            return productionPlanService.updateProductionPlan(args.input);
        })
    }
};

export default productionPlanResolvers;