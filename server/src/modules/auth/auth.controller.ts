import type { Request, Response } from "express";
import { register, login } from "./auth.service.js";

export const registerController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await register(req.body);

    res.status(201).json({
      success: true,
      message: "Registration successful",
      data: result,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Registration failed";

    res.status(400).json({
      success: false,
      message,
    });
  }
};

export const loginController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await login(req.body);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Login failed";

    res.status(401).json({
      success: false,
      message,
    });
  }
};