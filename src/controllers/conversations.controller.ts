import { NextFunction, Response } from "express";
import { logger } from "@/common/winston/winston";
import { CustomRequest } from "@/types/request";
import { BaseController } from "@/controllers/base.controller";
import { createResponse } from "@/utils/create-response";
import { prismaInstance } from "@/config/prisma/prisma";
import _ from "lodash";
import { loggedError } from "@/utils/utils";
import { COLLECTION_NAMES } from "@/constants";
import { Conversations } from "@prisma/client";
import { ConversationsService } from "@/services/conversations.service";
import { CreateConversationsDto, UpdateConversationsDto } from "@/schemas/conversations.dto";

const prisma = prismaInstance();
const IGNORE_FIELDS = {};

export class ConversationsController extends BaseController<Conversations, CreateConversationsDto, UpdateConversationsDto> {
  public collectionName: string;
  public conversationsService: ConversationsService;

  constructor() {
    super(prisma.conversations, COLLECTION_NAMES.conversations, IGNORE_FIELDS);
    this.collectionName = COLLECTION_NAMES.conversations;
    this.conversationsService = new ConversationsService(prisma.conversations, this.collectionName, IGNORE_FIELDS);
  }

  /**
   * Get entity by ID
   * @param req - CustomRequest object
   * @param res - Response object
   * @param next - Next middleware function
   * @returns JSON entity object
   */
  getByUser = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    const { loggedUser } = req;
    try {
      logger.info(`[${this.collectionName} Controller] Fetching ${this.collectionName} by userId`, {
        loggedUser,
        userId,
      });
      const data = await this.conversationsService.getByUser(userId);

      res.json(createResponse({ data }));
    } catch (error) {
      loggedError(error, `[${this.collectionName} Controller] getByUser API error`, {
        userId,
        loggedUser,
      });
      next(error);
    }
  };
}
