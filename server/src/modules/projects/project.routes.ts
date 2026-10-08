import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";

import {
  createProjectController,
  deleteProjectController,
  getProjectController,
  getProjectsController,
  updateProjectController,
} from "./project.controller.js";

const router = Router();

router.use(authenticate);

router.get("/", getProjectsController);
router.get("/:id", getProjectController);
router.post("/", createProjectController);
router.put("/:id", updateProjectController);
router.delete("/:id", deleteProjectController);

export default router;