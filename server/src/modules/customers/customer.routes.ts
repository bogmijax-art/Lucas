import { Router } from "express";

import { authenticate } from "../../middleware/auth.middleware.js";

import {
  createCustomerController,
  deleteCustomerController,
  getCustomerController,
  getCustomersController,
  updateCustomerController,
} from "./customer.controller.js";

const router = Router();

router.use(authenticate);

router.get("/", getCustomersController);
router.get("/:id", getCustomerController);

router.post("/", createCustomerController);

router.put("/:id", updateCustomerController);

router.delete("/:id", deleteCustomerController);

export default router;