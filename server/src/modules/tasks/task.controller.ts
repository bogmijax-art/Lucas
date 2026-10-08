import type { Response } from "express";
import type { AuthenticatedRequest } from "../../middleware/auth.middleware.js";

import {
    addTask,
    editTask,
    getTask,
    getTasks,
    removeTask,
} from "./task.service.js";

export const getTasksController = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    try {
        const tasks = await getTasks(req.user!.companyId);

        res.json({
            success: true,
            data: tasks,
        });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Failed to get tasks";

        res.status(500).json({
            success: false,
            message,
        });
    }
};

export const getTaskController = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    try {
        const taskId = Array.isArray(req.params.id)
            ? req.params.id[0]
            : req.params.id;

        const task = await getTask(
            taskId,
            req.user!.companyId
        );

        res.json({
            success: true,
            data: task,
        });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Task not found";

        res.status(404).json({
            success: false,
            message,
        });
    }
};

export const createTaskController = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    try {
        const task = await addTask(
            req.user!.companyId,
            req.body
        );

        res.status(201).json({
            success: true,
            message: "Task created successfully",
            data: task,
        });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Failed to create task";

        res.status(400).json({
            success: false,
            message,
        });
    }
};

export const updateTaskController = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    try {
        const taskId = Array.isArray(req.params.id)
            ? req.params.id[0]
            : req.params.id;

        const task = await editTask(
            taskId,
            req.user!.companyId,
            req.body
        );

        res.json({
            success: true,
            message: "Task updated successfully",
            data: task,
        });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Failed to update task";

        res.status(404).json({
            success: false,
            message,
        });
    }
};

export const deleteTaskController = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    try {
        const taskId = Array.isArray(req.params.id)
            ? req.params.id[0]
            : req.params.id;

        await removeTask(
            taskId,
            req.user!.companyId
        );

        res.json({
            success: true,
            message: "Task deleted successfully",
        });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Failed to delete task";

        res.status(404).json({
            success: false,
            message,
        });
    }
};