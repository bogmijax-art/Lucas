import {
  createNotification,
  deleteNotification,
  findNotificationById,
  findNotificationsByUser,
  markNotificationAsRead,
} from "./notification.repository.js";

interface CreateNotificationInput {
  title: string;
  message: string;
}

export const getNotifications = async (userId: string) => {
  return findNotificationsByUser(userId);
};

export const getNotification = async (
  notificationId: string,
  userId: string
) => {
  const notification = await findNotificationById(
    notificationId,
    userId
  );

  if (!notification) {
    throw new Error("Notification not found");
  }

  return notification;
};

export const addNotification = async (
  userId: string,
  input: CreateNotificationInput
) => {
  const title = input.title?.trim();
  const message = input.message?.trim();

  if (!title) {
    throw new Error("Notification title is required");
  }

  if (!message) {
    throw new Error("Notification message is required");
  }

  return createNotification({
    userId,
    title,
    message,
  });
};

export const readNotification = async (
  notificationId: string,
  userId: string
) => {
  const notification = await markNotificationAsRead(
    notificationId,
    userId
  );

  if (!notification) {
    throw new Error("Notification not found");
  }

  return notification;
};

export const removeNotification = async (
  notificationId: string,
  userId: string
) => {
  const notification = await deleteNotification(
    notificationId,
    userId
  );

  if (!notification) {
    throw new Error("Notification not found");
  }

  return notification;
};