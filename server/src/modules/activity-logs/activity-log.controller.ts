import type { Response } from "express";
import type { AuthenticatedRequest } from "../../middleware/auth.middleware.js";

import {
  getActivityLog,
  getActivityLogs,
} from "./activity-log.service.js";

export const getActivityLogsController = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const logs = await getActivityLogs(
      req.user!.companyId
    );

    res.json({
      success: true,
      data: logs,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to get activity logs";

    res.status(500).json({
      success: false,
      message,
    });
  }
};

export const getActivityLogController = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const activityLogId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const log = await getActivityLog(
      activityLogId,
      req.user!.companyId
    );

    res.json({
      success: true,
      data: log,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Activity log not found";

    res.status(404).json({
      success: false,
      message,
    });
  }
};