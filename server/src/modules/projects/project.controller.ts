import type { Response } from "express";
import type { AuthenticatedRequest } from "../../middleware/auth.middleware.js";

import {
  addProject,
  editProject,
  getProject,
  getProjects,
  removeProject,
} from "./project.service.js";

export const getProjectsController = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const projects = await getProjects(
      req.user!.companyId
    );

    res.json({
      success: true,
      data: projects,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to get projects";

    res.status(500).json({
      success: false,
      message,
    });
  }
};

export const getProjectController = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const project = await getProject(
      req.params.id,
      req.user!.companyId
    );

    res.json({
      success: true,
      data: project,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Project not found";

    res.status(404).json({
      success: false,
      message,
    });
  }
};

export const createProjectController = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const project = await addProject(
      req.user!.companyId,
      req.user!.userId,
      req.body
    );

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create project";

    res.status(400).json({
      success: false,
      message,
    });
  }
};

export const updateProjectController = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const project = await editProject(
      req.params.id,
      req.user!.companyId,
      req.user!.userId,
      req.body
    );

    res.json({
      success: true,
      message: "Project updated successfully",
      data: project,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update project";

    res.status(404).json({
      success: false,
      message,
    });
  }
};

export const deleteProjectController = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    await removeProject(
      req.params.id,
      req.user!.companyId,
      req.user!.userId,
    );

    res.json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete project";

    res.status(404).json({
      success: false,
      message,
    });
  }
};