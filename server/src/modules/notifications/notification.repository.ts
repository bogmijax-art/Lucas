import pool from "../../database/pool.js";

export interface CreateNotificationData {
  userId: string;
  title: string;
  message: string;
}

export const findNotificationsByUser = async (userId: string) => {
  const result = await pool.query(
    `
    SELECT
      id,
      user_id,
      title,
      message,
      is_read,
      created_at
    FROM notifications
    WHERE user_id = $1
    ORDER BY created_at DESC
    `,
    [userId]
  );

  return result.rows;
};

export const findNotificationById = async (
  notificationId: string,
  userId: string
) => {
  const result = await pool.query(
    `
    SELECT
      id,
      user_id,
      title,
      message,
      is_read,
      created_at
    FROM notifications
    WHERE id = $1
      AND user_id = $2
    `,
    [notificationId, userId]
  );

  return result.rows[0] ?? null;
};

export const createNotification = async (
  data: CreateNotificationData
) => {
  const result = await pool.query(
    `
    INSERT INTO notifications (
      user_id,
      title,
      message
    )
    VALUES ($1, $2, $3)
    RETURNING
      id,
      user_id,
      title,
      message,
      is_read,
      created_at
    `,
    [data.userId, data.title, data.message]
  );

  return result.rows[0];
};

export const markNotificationAsRead = async (
  notificationId: string,
  userId: string
) => {
  const result = await pool.query(
    `
    UPDATE notifications
    SET is_read = TRUE
    WHERE id = $1
      AND user_id = $2
    RETURNING
      id,
      user_id,
      title,
      message,
      is_read,
      created_at
    `,
    [notificationId, userId]
  );

  return result.rows[0] ?? null;
};

export const deleteNotification = async (
  notificationId: string,
  userId: string
) => {
  const result = await pool.query(
    `
    DELETE FROM notifications
    WHERE id = $1
      AND user_id = $2
    RETURNING id
    `,
    [notificationId, userId]
  );

  return result.rows[0] ?? null;
};