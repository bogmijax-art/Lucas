import type { Response } from "express";
import type { AuthenticatedRequest } from "../../middleware/auth.middleware.js";

import {
  addAppointment,
  editAppointment,
  getAppointment,
  getAppointments,
  removeAppointment,
} from "./appointment.service.js";

export const getAppointmentsController = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const appointments = await getAppointments(
      req.user!.companyId
    );

    res.json({
      success: true,
      data: appointments,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to get appointments";

    res.status(500).json({
      success: false,
      message,
    });
  }
};

export const getAppointmentController = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const appointmentId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const appointment = await getAppointment(
      appointmentId,
      req.user!.companyId
    );

    res.json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Appointment not found";

    res.status(404).json({
      success: false,
      message,
    });
  }
};

export const createAppointmentController = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const appointment = await addAppointment(
      req.user!.companyId,
      req.user!.userId,
      req.body
    );

    res.status(201).json({
      success: true,
      message: "Appointment created successfully",
      data: appointment,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to create appointment";

    res.status(400).json({
      success: false,
      message,
    });
  }
};

export const updateAppointmentController = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const appointmentId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const appointment = await editAppointment(
      appointmentId,
      req.user!.companyId,
      req.body
    );

    res.json({
      success: true,
      message: "Appointment updated successfully",
      data: appointment,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to update appointment";

    res.status(404).json({
      success: false,
      message,
    });
  }
};

export const deleteAppointmentController = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const appointmentId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    await removeAppointment(
      appointmentId,
      req.user!.companyId
    );

    res.json({
      success: true,
      message: "Appointment deleted successfully",
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to delete appointment";

    res.status(404).json({
      success: false,
      message,
    });
  }
};