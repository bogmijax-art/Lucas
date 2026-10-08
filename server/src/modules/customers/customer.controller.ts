import type { Response } from "express";
import type { AuthenticatedRequest } from "../../middleware/auth.middleware.js";

import {
  addCustomer,
  editCustomer,
  getCustomer,
  getCustomers,
  removeCustomer,
} from "./customer.service.js";

export const getCustomersController = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const companyId = req.user!.companyId;

    const customers = await getCustomers(companyId);

    res.json({
      success: true,
      data: customers,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to get customers";

    res.status(500).json({
      success: false,
      message,
    });
  }
};

export const getCustomerController = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const customer = await getCustomer(
      req.params.id,
      req.user!.companyId
    );

    res.json({
      success: true,
      data: customer,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Customer not found";

    res.status(404).json({
      success: false,
      message,
    });
  }
};

export const createCustomerController = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const customer = await addCustomer(
      req.user!.companyId,
      req.body
    );

    res.status(201).json({
      success: true,
      message: "Customer created successfully",
      data: customer,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create customer";

    res.status(400).json({
      success: false,
      message,
    });
  }
};

export const updateCustomerController = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const customer = await editCustomer(
      req.params.id,
      req.user!.companyId,
      req.body
    );

    res.json({
      success: true,
      message: "Customer updated successfully",
      data: customer,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update customer";

    res.status(404).json({
      success: false,
      message,
    });
  }
};

export const deleteCustomerController = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    await removeCustomer(
      req.params.id,
      req.user!.companyId
    );

    res.json({
      success: true,
      message: "Customer deleted successfully",
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete customer";

    res.status(404).json({
      success: false,
      message,
    });
  }
};