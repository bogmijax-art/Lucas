import pool from "../../database/pool.js";

export interface CreateAppointmentData {
  companyId: string;
  customerId?: string;
  createdBy?: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  status?: "scheduled" | "completed" | "cancelled" | "no_show";
}

export interface UpdateAppointmentData {
  customerId?: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  status?: "scheduled" | "completed" | "cancelled" | "no_show";
}

export const findAppointmentsByCompany = async (companyId: string) => {
  const result = await pool.query(
    `
    SELECT
      a.id,
      a.company_id,
      a.customer_id,
      a.created_by,
      a.title,
      a.description,
      a.start_time,
      a.end_time,
      a.status,
      a.created_at,
      a.updated_at,
      c.name AS customer_name
    FROM appointments a
    LEFT JOIN customers c
      ON c.id = a.customer_id
      AND c.company_id = a.company_id
    WHERE a.company_id = $1
    ORDER BY a.start_time ASC
    `,
    [companyId]
  );

  return result.rows;
};

export const findAppointmentById = async (
  appointmentId: string,
  companyId: string
) => {
  const result = await pool.query(
    `
    SELECT
      a.id,
      a.company_id,
      a.customer_id,
      a.created_by,
      a.title,
      a.description,
      a.start_time,
      a.end_time,
      a.status,
      a.created_at,
      a.updated_at,
      c.name AS customer_name
    FROM appointments a
    LEFT JOIN customers c
      ON c.id = a.customer_id
      AND c.company_id = a.company_id
    WHERE a.id = $1
      AND a.company_id = $2
    `,
    [appointmentId, companyId]
  );

  return result.rows[0] ?? null;
};

export const createAppointment = async (
  data: CreateAppointmentData
) => {
  const result = await pool.query(
    `
    INSERT INTO appointments (
      company_id,
      customer_id,
      created_by,
      title,
      description,
      start_time,
      end_time,
      status
    )
    SELECT
      $1,
      c.id,
      $3,
      $4,
      $5,
      $6,
      $7,
      COALESCE($8, 'scheduled')
    FROM customers c
    WHERE c.id = $2
      AND c.company_id = $1
    RETURNING
      id,
      company_id,
      customer_id,
      created_by,
      title,
      description,
      start_time,
      end_time,
      status,
      created_at,
      updated_at
    `,
    [
      data.companyId,
      data.customerId ?? null,
      data.createdBy ?? null,
      data.title,
      data.description ?? null,
      data.startTime,
      data.endTime,
      data.status ?? null,
    ]
  );

  return result.rows[0] ?? null;
};

export const updateAppointment = async (
  appointmentId: string,
  companyId: string,
  data: UpdateAppointmentData
) => {
  const result = await pool.query(
    `
    UPDATE appointments a
    SET
      customer_id = $1,
      title = $2,
      description = $3,
      start_time = $4,
      end_time = $5,
      status = COALESCE($6, a.status)
    WHERE a.id = $7
      AND a.company_id = $8
      AND (
        $1 IS NULL
        OR EXISTS (
          SELECT 1
          FROM customers c
          WHERE c.id = $1
            AND c.company_id = $8
        )
      )
    RETURNING
      a.id,
      a.company_id,
      a.customer_id,
      a.created_by,
      a.title,
      a.description,
      a.start_time,
      a.end_time,
      a.status,
      a.created_at,
      a.updated_at
    `,
    [
      data.customerId ?? null,
      data.title,
      data.description ?? null,
      data.startTime,
      data.endTime,
      data.status ?? null,
      appointmentId,
      companyId,
    ]
  );

  return result.rows[0] ?? null;
};

export const deleteAppointment = async (
  appointmentId: string,
  companyId: string
) => {
  const result = await pool.query(
    `
    DELETE FROM appointments
    WHERE id = $1
      AND company_id = $2
    RETURNING id
    `,
    [appointmentId, companyId]
  );

  return result.rows[0] ?? null;
};