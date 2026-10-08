import { Router } from "express";
import {
  authenticate,
  type AuthenticatedRequest,
} from "../middleware/auth.middleware.js";

const router = Router();

router.get(
  "/protected",
  authenticate,
  (req: AuthenticatedRequest, res) => {
    res.json({
      success: true,
      message: "You have access to this protected route",
      user: req.user,
    });
  }
);

export default router;