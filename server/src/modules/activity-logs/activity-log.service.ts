import {
  createActivityLog,
  findActivityLogById,
  findActivityLogsByCompany,
} from "./activity-log.repository.js";

interface CreateActivityLogInput {
  userId?: string;
  action: string;
  entityType?: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
}

export const getActivityLogs = async (companyId: string) => {
  return findActivityLogsByCompany(companyId);
};

export const getActivityLog = async (
  activityLogId: string,
  companyId: string
) => {
  const log = await findActivityLogById(
    activityLogId,
    companyId
  );

  if (!log) {
    throw new Error("Activity log not found");
  }

  return log;
};

export const addActivityLog = async (
  companyId: string,
  input: CreateActivityLogInput
) => {
  const action = input.action?.trim();

  if (!action) {
    throw new Error("Activity action is required");
  }

  return createActivityLog({
    companyId,
    userId: input.userId,
    action,
    entityType: input.entityType?.trim(),
    entityId: input.entityId,
    metadata: input.metadata,
  });
};