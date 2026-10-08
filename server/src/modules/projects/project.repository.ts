import pool from "../../database/pool.js";

export interface CreateProjectData {
  companyId: string;
  name: string;
  description?: string;
  status?: "planning" | "active" | "on_hold" | "completed" | "cancelled";
  priority?: "low" | "medium" | "high" | "urgent";
  startDate?: string;
  dueDate?: string;
  createdBy?: string;
}

export interface UpdateProjectData {
  name: string;
  description?: string;
  status?: "planning" | "active" | "on_hold" | "completed" | "cancelled";
  priority?: "low" | "medium" | "high" | "urgent";
  startDate?: string;
  dueDate?: string;
}

export const findProjectsByCompany = async (companyId: string) => {
  const result = await pool.query(
    `SELECT
       id,
       name,
       description,
       status,
       priority,
       start_date,
       due_date,
       created_by,
       created_at,
       updated_at
     FROM projects
     WHERE company_id = $1
     ORDER BY created_at DESC`,
    [companyId]
  );

  return result.rows;
};

export const findProjectById = async (
  projectId: string,
  companyId: string
) => {
  const result = await pool.query(
    `SELECT
       id,
       name,
       description,
       status,
       priority,
       start_date,
       due_date,
       created_by,
       created_at,
       updated_at
     FROM projects
     WHERE id = $1 AND company_id = $2`,
    [projectId, companyId]
  );

  return result.rows[0] ?? null;
};

export const createProject = async (data: CreateProjectData) => {
  const result = await pool.query(
    `INSERT INTO projects (
       company_id,
       name,
       description,
       status,
       priority,
       start_date,
       due_date,
       created_by
     )
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING
       id,
       name,
       description,
       status,
       priority,
       start_date,
       due_date,
       created_by,
       created_at,
       updated_at`,
    [
      data.companyId,
      data.name,
      data.description ?? null,
      data.status ?? "planning",
      data.priority ?? "medium",
      data.startDate ?? null,
      data.dueDate ?? null,
      data.createdBy ?? null,
    ]
  );

  return result.rows[0];
};

export const updateProject = async (
  projectId: string,
  companyId: string,
  data: UpdateProjectData
) => {
  const result = await pool.query(
    `UPDATE projects
     SET name = $1,
         description = $2,
         status = COALESCE($3, status),
         priority = COALESCE($4, priority),
         start_date = $5,
         due_date = $6
     WHERE id = $7 AND company_id = $8
     RETURNING
       id,
       name,
       description,
       status,
       priority,
       start_date,
       due_date,
       created_by,
       created_at,
       updated_at`,
    [
      data.name,
      data.description ?? null,
      data.status ?? null,
      data.priority ?? null,
      data.startDate ?? null,
      data.dueDate ?? null,
      projectId,
      companyId,
    ]
  );

  return result.rows[0] ?? null;
};

export const deleteProject = async (
  projectId: string,
  companyId: string
) => {
  const result = await pool.query(
    `DELETE FROM projects
     WHERE id = $1 AND company_id = $2
     RETURNING id`,
    [projectId, companyId]
  );

  return result.rows[0] ?? null;
};