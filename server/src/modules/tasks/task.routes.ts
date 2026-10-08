import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";

import {
  createTaskController,
  deleteTaskController,
  getTaskController,
  getTasksController,
  updateTaskController,
} from "./task.controller.js";

const router = Router();

router.use(authenticate);

router.get("/", getTasksController);
router.get("/:id", getTaskController);
router.post("/", createTaskController);
router.put("/:id", updateTaskController);
router.delete("/:id", deleteTaskController);

export default router;