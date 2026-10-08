import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";

import {
  createNotificationController,
  deleteNotificationController,
  getNotificationController,
  getNotificationsController,
  markNotificationAsReadController,
} from "./notification.controller.js";

const router = Router();

router.use(authenticate);

router.get("/", getNotificationsController);
router.get("/:id", getNotificationController);
router.post("/", createNotificationController);
router.put("/:id/read", markNotificationAsReadController);
router.delete("/:id", deleteNotificationController);

export default router;