import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";

import {
  getActivityLogController,
  getActivityLogsController,
} from "./activity-log.controller.js";

const router = Router();

router.use(authenticate);

router.get("/", getActivityLogsController);
router.get("/:id", getActivityLogController);

export default router;