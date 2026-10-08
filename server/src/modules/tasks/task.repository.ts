import pool from "../../database/pool.js";

export interface CreateTaskData {
  companyId: string;
  projectId: string;
  assignedTo?: string;
  title: string;
  description?: string;
  status?: "todo" | "in_progress" | "completed" | "cancelled";
  priority?: "low" | "medium" | "high" | "urgent";
  dueDate?: string;
}

export interface UpdateTaskData {
  assignedTo?: string;
  title: string;
  description?: string;
  status?: "todo" | "in_progress" | "completed" | "cancelled";
  priority?: "low" | "medium" | "high" | "urgent";
  dueDate?: string;
}

export const findTasksByCompany = async (companyId: string) => {
  const result = await pool.query(
    `SELECT
       t.id,
       t.project_id,
       t.assigned_to,
       t.title,
       t.description,
       t.status,
       t.priority,
       t.due_date,
       t.created_at,
       t.updated_at
     FROM tasks t
     INNER JOIN projects p
       ON p.id = t.project_id
     WHERE p.company_id = $1
     ORDER BY t.created_at DESC`,
    [companyId]
  );

  return result.rows;
};

export const findTaskById = async (
  taskId: string,
  companyId: string
) => {
  const result = await pool.query(
    `SELECT
       t.id,
       t.project_id,
       t.assigned_to,
       t.title,
       t.description,
       t.status,
       t.priority,
       t.due_date,
       t.created_at,
       t.updated_at
     FROM tasks t
     INNER JOIN projects p
       ON p.id = t.project_id
     WHERE t.id = $1
       AND p.company_id = $2`,
    [taskId, companyId]
  );

  return result.rows[0] ?? null;
};

export const createTask = async (data: CreateTaskData) => {
  const result = await pool.query(
    `
    INSERT INTO tasks (
      project_id,
      assigned_to,
      title,
      description,
      status,
      priority,
      due_date
    )
    SELECT
      p.id,
      $3,
      $4,
      $5,
      COALESCE($6, 'todo'),
      COALESCE($7, 'medium'),
      $8
    FROM projects p
    WHERE p.id = $1
      AND p.company_id = $2
    RETURNING
      id,
      project_id,
      assigned_to,
      title,
      description,
      status,
      priority,
      due_date,
      created_at,
      updated_at
    `,
    [
      data.projectId,
      data.companyId,
      data.assignedTo ?? null,
      data.title,
      data.description ?? null,
      data.status ?? null,
      data.priority ?? null,
      data.dueDate ?? null,
    ]
  );

  return result.rows[0] ?? null;
};

export const updateTask = async (
  taskId: string,
  companyId: string,
  data: UpdateTaskData
) => {
  const result = await pool.query(
    `UPDATE tasks t
     SET assigned_to = $1,
         title = $2,
         description = $3,
         status = COALESCE($4, t.status),
         priority = COALESCE($5, t.priority),
         due_date = $6
     FROM projects p
     WHERE t.project_id = p.id
       AND t.id = $7
       AND p.company_id = $8
     RETURNING
       t.id,
       t.project_id,
       t.assigned_to,
       t.title,
       t.description,
       t.status,
       t.priority,
       t.due_date,
       t.created_at,
       t.updated_at`,
    [
      data.assignedTo ?? null,
      data.title,
      data.description ?? null,
      data.status ?? null,
      data.priority ?? null,
      data.dueDate ?? null,
      taskId,
      companyId,
    ]
  );

  return result.rows[0] ?? null;
};

export const deleteTask = async (
  taskId: string,
  companyId: string
) => {
  const result = await pool.query(
    `DELETE FROM tasks t
     USING projects p
     WHERE t.project_id = p.id
       AND t.id = $1
       AND p.company_id = $2
     RETURNING t.id`,
    [taskId, companyId]
  );

  return result.rows[0] ?? null;
};