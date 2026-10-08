import pool from "../../database/pool.js";

export interface CreateActivityLogData {
  companyId: string;
  userId?: string;
  action: string;
  entityType?: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
}

export const findActivityLogsByCompany = async (
  companyId: string
) => {
  const result = await pool.query(
    `
    SELECT
      al.id,
      al.company_id,
      al.user_id,
      u.name AS user_name,
      al.action,
      al.entity_type,
      al.entity_id,
      al.metadata,
      al.created_at
    FROM activity_logs al
    LEFT JOIN users u
      ON u.id = al.user_id
    WHERE al.company_id = $1
    ORDER BY al.created_at DESC
    `,
    [companyId]
  );

  return result.rows;
};

export const findActivityLogById = async (
  activityLogId: string,
  companyId: string
) => {
  const result = await pool.query(
    `
    SELECT
      al.id,
      al.company_id,
      al.user_id,
      u.name AS user_name,
      al.action,
      al.entity_type,
      al.entity_id,
      al.metadata,
      al.created_at
    FROM activity_logs al
    LEFT JOIN users u
      ON u.id = al.user_id
    WHERE al.id = $1
      AND al.company_id = $2
    `,
    [activityLogId, companyId]
  );

  return result.rows[0] ?? null;
};

export const createActivityLog = async (
  data: CreateActivityLogData
) => {
  const result = await pool.query(
    `
    INSERT INTO activity_logs (
      company_id,
      user_id,
      action,
      entity_type,
      entity_id,
      metadata
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING
      id,
      company_id,
      user_id,
      action,
      entity_type,
      entity_id,
      metadata,
      created_at
    `,
    [
      data.companyId,
      data.userId ?? null,
      data.action,
      data.entityType ?? null,
      data.entityId ?? null,
      data.metadata ?? null,
    ]
  );

  return result.rows[0];
};