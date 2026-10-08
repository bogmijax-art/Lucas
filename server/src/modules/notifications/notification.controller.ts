import type { Response } from "express";
import type { AuthenticatedRequest } from "../../middleware/auth.middleware.js";

import {
  addNotification,
  getNotification,
  getNotifications,
  readNotification,
  removeNotification,
} from "./notification.service.js";

export const getNotificationsController = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const notifications = await getNotifications(
      req.user!.userId
    );

    res.json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to get notifications";

    res.status(500).json({
      success: false,
      message,
    });
  }
};

export const getNotificationController = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const notificationId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const notification = await getNotification(
      notificationId,
      req.user!.userId
    );

    res.json({
      success: true,
      data: notification,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Notification not found";

    res.status(404).json({
      success: false,
      message,
    });
  }
};

export const createNotificationController = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const notification = await addNotification(
      req.user!.userId,
      req.body
    );

    res.status(201).json({
      success: true,
      message: "Notification created successfully",
      data: notification,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to create notification";

    res.status(400).json({
      success: false,
      message,
    });
  }
};

export const markNotificationAsReadController = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const notificationId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const notification = await readNotification(
      notificationId,
      req.user!.userId
    );

    res.json({
      success: true,
      message: "Notification marked as read",
      data: notification,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Notification not found";

    res.status(404).json({
      success: false,
      message,
    });
  }
};

export const deleteNotificationController = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const notificationId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    await removeNotification(
      notificationId,
      req.user!.userId
    );

    res.json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Notification not found";

    res.status(404).json({
      success: false,
      message,
    });
  }
};