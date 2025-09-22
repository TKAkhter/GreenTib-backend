import { logger } from "@/common/winston/winston";
import { BaseService } from "@/services/base.services";
import { Conversations } from "@prisma/client";
import { loggedError } from "@/utils/utils";
import { CreateConversationsDto, UpdateConversationsDto } from "@/schemas/conversations.dto";

export class ConversationsService extends BaseService<Conversations, CreateConversationsDto, UpdateConversationsDto> {
  private collectionNameService: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(model: any, collectionName: string, ignoreFields?: Record<string, boolean>) {
    super(model, collectionName, ignoreFields);
    this.collectionNameService = collectionName;
  }

  /**
   * Fetches a entity by their userId.
   * @param userId - entity's userId
   * @returns entity data or null if not found
   */
  getByUser = async (userId: string): Promise<Conversations | Conversations[] | null> => {
    try {
      logger.info(
        `[${this.collectionNameService} Service] Fetching ${this.collectionNameService} with userId: ${userId}`,
      );
      const data = await this.baseRepository.getByUser(userId);

      if (!data) {
        logger.warn(
          `[${this.collectionNameService} Service] ${this.collectionNameService} with userId ${userId} not found`,
        );
        return null;
      }

      return data;
    } catch (error) {
      loggedError(error, `[${this.collectionNameService} Service] getByUser service error`, {
        userId,
      });
      throw error;
    }
  };
}
