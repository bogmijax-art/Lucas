import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";

import {
  createAppointmentController,
  deleteAppointmentController,
  getAppointmentController,
  getAppointmentsController,
  updateAppointmentController,
} from "./appointment.controller.js";

const router = Router();

router.use(authenticate);

router.get("/", getAppointmentsController);
router.get("/:id", getAppointmentController);
router.post("/", createAppointmentController);
router.put("/:id", updateAppointmentController);
router.delete("/:id", deleteAppointmentController);

export default router;