import {
  createTask,
  deleteTask,
  findTaskById,
  findTasksByCompany,
  updateTask,
} from "./task.repository.js";

interface CreateTaskInput {
  projectId: string;
  assignedTo?: string;
  title: string;
  description?: string;
  status?: "todo" | "in_progress" | "completed" | "cancelled";
  priority?: "low" | "medium" | "high" | "urgent";
  dueDate?: string;
}

interface UpdateTaskInput {
  assignedTo?: string;
  title: string;
  description?: string;
  status?: "todo" | "in_progress" | "completed" | "cancelled";
  priority?: "low" | "medium" | "high" | "urgent";
  dueDate?: string;
}

const taskStatuses = [
  "todo",
  "in_progress",
  "completed",
  "cancelled",
] as const;

const priorities = [
  "low",
  "medium",
  "high",
  "urgent",
] as const;

export const getTasks = async (companyId: string) => {
  return findTasksByCompany(companyId);
};

export const getTask = async (
  taskId: string,
  companyId: string
) => {
  const task = await findTaskById(taskId, companyId);

  if (!task) {
    throw new Error("Task not found");
  }

  return task;
};

export const addTask = async (
  companyId: string,
  input: CreateTaskInput
) => {
  const title = input.title?.trim();

  if (!title) {
    throw new Error("Task title is required");
  }

  if (!input.projectId?.trim()) {
    throw new Error("Project ID is required");
  }

  if (
    input.status &&
    !taskStatuses.includes(
      input.status as (typeof taskStatuses)[number]
    )
  ) {
    throw new Error("Invalid task status");
  }

  if (
    input.priority &&
    !priorities.includes(
      input.priority as (typeof priorities)[number]
    )
  ) {
    throw new Error("Invalid task priority");
  }

  return createTask({
  companyId,
  projectId: input.projectId,
  assignedTo: input.assignedTo?.trim(),
  title,
  description: input.description?.trim(),
  status: input.status,
  priority: input.priority,
  dueDate: input.dueDate,
});
};

export const editTask = async (
  taskId: string,
  companyId: string,
  input: UpdateTaskInput
) => {
  const title = input.title?.trim();

  if (!title) {
    throw new Error("Task title is required");
  }

  if (
    input.status &&
    !taskStatuses.includes(
      input.status as (typeof taskStatuses)[number]
    )
  ) {
    throw new Error("Invalid task status");
  }

  if (
    input.priority &&
    !priorities.includes(
      input.priority as (typeof priorities)[number]
    )
  ) {
    throw new Error("Invalid task priority");
  }

  const task = await updateTask(taskId, companyId, {
    assignedTo: input.assignedTo?.trim(),
    title,
    description: input.description?.trim(),
    status: input.status,
    priority: input.priority,
    dueDate: input.dueDate,
  });

  if (!task) {
    throw new Error("Task not found");
  }

  return task;
};

export const removeTask = async (
  taskId: string,
  companyId: string
) => {
  const task = await deleteTask(taskId, companyId);

  if (!task) {
    throw new Error("Task not found");
  }

  return task;
};