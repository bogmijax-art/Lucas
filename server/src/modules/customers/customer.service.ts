import {
  createCustomer,
  deleteCustomer,
  findCustomerById,
  findCustomersByCompany,
  updateCustomer,
} from "./customer.repository.js";

interface CreateCustomerInput {
  name: string;
  email?: string;
  phone?: string;
  organizationName?: string;
  notes?: string;
}

interface UpdateCustomerInput {
  name: string;
  email?: string;
  phone?: string;
  organizationName?: string;
  status?: "active" | "inactive";
  notes?: string;
}

export const getCustomers = async (companyId: string) => {
  return findCustomersByCompany(companyId);
};

export const getCustomer = async (
  customerId: string,
  companyId: string
) => {
  const customer = await findCustomerById(customerId, companyId);

  if (!customer) {
    throw new Error("Customer not found");
  }

  return customer;
};

export const addCustomer = async (
  companyId: string,
  input: CreateCustomerInput
) => {
  const name = input.name?.trim();

  if (!name) {
    throw new Error("Customer name is required");
  }

  return createCustomer({
    companyId,
    name,
    email: input.email?.trim().toLowerCase(),
    phone: input.phone?.trim(),
    organizationName: input.organizationName?.trim(),
    notes: input.notes?.trim(),
  });
};

export const editCustomer = async (
  customerId: string,
  companyId: string,
  input: UpdateCustomerInput
) => {
  const name = input.name?.trim();

  if (!name) {
    throw new Error("Customer name is required");
  }

  const customer = await updateCustomer(
    customerId,
    companyId,
    {
      name,
      email: input.email?.trim().toLowerCase(),
      phone: input.phone?.trim(),
      organizationName: input.organizationName?.trim(),
      status: input.status,
      notes: input.notes?.trim(),
    }
  );

  if (!customer) {
    throw new Error("Customer not found");
  }

  return customer;
};

export const removeCustomer = async (
  customerId: string,
  companyId: string
) => {
  const customer = await deleteCustomer(customerId, companyId);

  if (!customer) {
    throw new Error("Customer not found");
  }

  return customer;
};