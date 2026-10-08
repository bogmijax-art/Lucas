import { addActivityLog } from "../activity-logs/activity-log.service.js";

import {
  createProject,
  deleteProject,
  findProjectById,
  findProjectsByCompany,
  updateProject,
} from "./project.repository.js";

interface CreateProjectInput {
  name: string;
  description?: string;
  status?: "planning" | "active" | "on_hold" | "completed" | "cancelled";
  priority?: "low" | "medium" | "high" | "urgent";
  startDate?: string;
  dueDate?: string;
}

interface UpdateProjectInput {
  name: string;
  description?: string;
  status?: "planning" | "active" | "on_hold" | "completed" | "cancelled";
  priority?: "low" | "medium" | "high" | "urgent";
  startDate?: string;
  dueDate?: string;
}

export const getProjects = async (companyId: string) => {
  return findProjectsByCompany(companyId);
};

export const getProject = async (
  projectId: string,
  companyId: string
) => {
  const project = await findProjectById(projectId, companyId);

  if (!project) {
    throw new Error("Project not found");
  }

  return project;
};

export const addProject = async (
  companyId: string,
  userId: string,
  input: CreateProjectInput
) => {
  const name = input.name?.trim();

  if (!name) {
    throw new Error("Project name is required");
  }

  if (
    input.status &&
    !["planning", "active", "on_hold", "completed", "cancelled"].includes(
      input.status
    )
  ) {
    throw new Error("Invalid project status");
  }

  if (
    input.priority &&
    !["low", "medium", "high", "urgent"].includes(input.priority)
  ) {
    throw new Error("Invalid project priority");
  }

  if (
    input.startDate &&
    input.dueDate &&
    input.dueDate < input.startDate
  ) {
    throw new Error("Due date cannot be before start date");
  }

  const project = await createProject({
    companyId,
    name,
    description: input.description?.trim(),
    status: input.status,
    priority: input.priority,
    startDate: input.startDate,
    dueDate: input.dueDate,
    createdBy: userId,
  });

  await addActivityLog(companyId, {
    userId,
    action: "project.created",
    entityType: "project",
    entityId: project.id,
    metadata: {
      projectName: project.name,
    },
  });

  return project;
};

export const editProject = async (
  projectId: string,
  companyId: string,
  userId: string,
  input: UpdateProjectInput
) => {
  const name = input.name?.trim();

  if (!name) {
    throw new Error("Project name is required");
  }

  if (
    input.status &&
    !["planning", "active", "on_hold", "completed", "cancelled"].includes(
      input.status
    )
  ) {
    throw new Error("Invalid project status");
  }

  if (
    input.priority &&
    !["low", "medium", "high", "urgent"].includes(input.priority)
  ) {
    throw new Error("Invalid project priority");
  }

  if (
    input.startDate &&
    input.dueDate &&
    input.dueDate < input.startDate
  ) {
    throw new Error("Due date cannot be before start date");
  }

  const project = await updateProject(projectId, companyId, {
    name,
    description: input.description?.trim(),
    status: input.status,
    priority: input.priority,
    startDate: input.startDate,
    dueDate: input.dueDate,
  });

  if (!project) {
    throw new Error("Project not found");
  }

  await addActivityLog(companyId, {
    userId,
    action: "project.updated",
    entityType: "project",
    entityId: project.id,
    metadata: {
      projectName: project.name,
    },
  });

  return project;
};

export const removeProject = async (
  projectId: string,
  companyId: string,
  userId: string
) => {
  const project = await deleteProject(projectId, companyId);

  if (!project) {
    throw new Error("Project not found");
  }

  await addActivityLog(companyId, {
    userId,
    action: "project.deleted",
    entityType: "project",
    entityId: projectId,
    metadata: {
      projectName: project.name,
    },
  });

  return project;
};