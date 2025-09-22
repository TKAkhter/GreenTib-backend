
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { zodValidation } from "@/middlewares/zod-validation";
import { authMiddleware } from "@/middlewares/auth-middleware";
import { createApiResponse } from "@/common/swagger/swagger-response-builder";
import { z } from "zod";
import { findByQuerySchema } from "@/schemas/find-by-query";
import { Router } from "express";
import { importFileSchema } from "@/schemas/import-file";
import { uploadImportMiddleware } from "@/common/multer/multer";
import { ConversationsSchema } from "@/generated/zod";
import { COLLECTION_NAMES } from "@/constants";
import { ConversationsController } from "@/controllers/conversations.controller";
import { createConversationsSchema, updateConversationsSchema } from "@/schemas/conversations.dto";

const conversationsRouter = Router();
conversationsRouter.use(authMiddleware);

const TAG = COLLECTION_NAMES.conversations;
const ROUTE = `/${TAG.toLowerCase()}`;

export const conversationsRegistry = new OpenAPIRegistry();
const conversationsController = new ConversationsController();

conversationsRegistry.register(TAG, ConversationsSchema);

conversationsRegistry.registerPath({
    method: "get",
    path: ROUTE,
    summary: `Get all ${TAG}`,
    tags: [TAG],
    responses: createApiResponse(z.array(ConversationsSchema), "Success"),
});
conversationsRouter.get("/", conversationsController.getAll);

//====================================================================================================

conversationsRegistry.registerPath({
    method: "post",
    path: `${ROUTE}/import`,
    tags: [TAG],
    summary: `Import ${TAG}`,
    request: {
        body: {
            content: { "multipart/form-data": { schema: importFileSchema } },
        },
    },
    responses: createApiResponse(z.null(), `${TAG}s Imported Successfully`),
});
conversationsRouter.post("/import", uploadImportMiddleware, conversationsController.import);

//====================================================================================================

conversationsRegistry.registerPath({
    method: "get",
    path: `${ROUTE}/export`,
    summary: `Export ${TAG}`,
    tags: [TAG],
    responses: createApiResponse(z.null(), `${TAG}s Exported Successfully`),
});
conversationsRouter.get("/export", conversationsController.export);

//====================================================================================================

conversationsRegistry.registerPath({
    method: "get",
    path: `${ROUTE}/{id}`,
    tags: [TAG],
    summary: `Get ${TAG} by id`,
    request: {
        params: z.object({ id: z.string() }),
    },
    responses: createApiResponse(ConversationsSchema, "Success"),
});
conversationsRouter.get("/:id", conversationsController.getById);

//====================================================================================================

conversationsRegistry.registerPath({
    method: "get",
    path: `${ROUTE}/user/{userId}`,
    tags: [TAG],
    summary: `Get ${TAG} by userId`,
    request: {
        params: z.object({ userId: z.string() }),
    },
    responses: createApiResponse(z.array(ConversationsSchema), "Success"),
});
conversationsRouter.get("/user/:userId", conversationsController.getByUser);

//====================================================================================================

conversationsRegistry.registerPath({
    method: "post",
    path: `${ROUTE}/find`,
    tags: [TAG],
    summary: `Find ${TAG} by query`,
    request: {
        body: {
            content: { "application/json": { schema: findByQuerySchema } },
        },
    },
    responses: createApiResponse(z.array(findByQuerySchema), "Success"),
});
conversationsRouter.post("/find", zodValidation(findByQuerySchema), conversationsController.findByQuery);

//====================================================================================================

conversationsRegistry.registerPath({
    method: "post",
    path: ROUTE,
    tags: [TAG],
    summary: `Create ${TAG}`,
    request: {
        body: {
            content: { "application/json": { schema: createConversationsSchema } },
        },
    },
    responses: createApiResponse(createConversationsSchema, `${TAG} Created Successfully`),
});
conversationsRouter.post("/", zodValidation(createConversationsSchema), conversationsController.create);

//====================================================================================================

conversationsRegistry.registerPath({
    method: "put",
    path: `${ROUTE}/{id}`,
    tags: [TAG],
    summary: `Update ${TAG}`,
    request: {
        params: z.object({ id: z.string() }),
        body: {
            content: { "application/json": { schema: updateConversationsSchema } },
        },
    },
    responses: createApiResponse(ConversationsSchema, `${TAG} Updated Successfully`),
});
conversationsRouter.put("/:id", zodValidation(updateConversationsSchema), conversationsController.update);

//====================================================================================================

conversationsRegistry.registerPath({
    method: "delete",
    path: `${ROUTE}/bulk`,
    tags: [TAG],
    summary: `Delete ${TAG} in bulk`,
    request: {
        body: {
            content: { "application/json": { schema: z.object({ ids: z.array(z.string()) }) } },
        },
    },
    responses: createApiResponse(z.null(), `${TAG}s Deleted Successfully`),
});
conversationsRouter.delete(
    "/bulk",
    zodValidation(z.object({ ids: z.array(z.string()) })),
    conversationsController.deleteMany,
);

//====================================================================================================

conversationsRegistry.registerPath({
    method: "delete",
    path: `${ROUTE}/{id}`,
    tags: [TAG],
    summary: `Delete ${TAG}`,
    request: {
        params: z.object({ id: z.string() }),
    },
    responses: createApiResponse(z.null(), `${TAG} Deleted Successfully`),
});
conversationsRouter.delete("/:id", conversationsController.delete);

export default conversationsRouter;
