import pool from "../../database/pool.js";

export interface CreateCustomerData {
  companyId: string;
  name: string;
  email?: string;
  phone?: string;
  organizationName?: string;
  notes?: string;
}

export interface UpdateCustomerData {
  name: string;
  email?: string;
  phone?: string;
  organizationName?: string;
  status?: "active" | "inactive";
  notes?: string;
}

export const findCustomersByCompany = async (companyId: string) => {
  const result = await pool.query(
    `
    SELECT
      id,
      name,
      email,
      phone,
      organization_name,
      status,
      notes,
      created_at,
      updated_at
    FROM customers
    WHERE company_id = $1
    ORDER BY created_at DESC
    `,
    [companyId]
  );

  return result.rows;
};

export const findCustomerById = async (
  customerId: string,
  companyId: string
) => {
  const result = await pool.query(
    `
    SELECT
      id,
      name,
      email,
      phone,
      organization_name,
      status,
      notes,
      created_at,
      updated_at
    FROM customers
    WHERE id = $1
      AND company_id = $2
    `,
    [customerId, companyId]
  );

  return result.rows[0] ?? null;
};

export const createCustomer = async (data: CreateCustomerData) => {
  const result = await pool.query(
    `
    INSERT INTO customers (
      company_id,
      name,
      email,
      phone,
      organization_name,
      notes
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING
      id,
      name,
      email,
      phone,
      organization_name,
      status,
      notes,
      created_at,
      updated_at
    `,
    [
      data.companyId,
      data.name,
      data.email ?? null,
      data.phone ?? null,
      data.organizationName ?? null,
      data.notes ?? null,
    ]
  );

  return result.rows[0];
};

export const updateCustomer = async (
  customerId: string,
  companyId: string,
  data: UpdateCustomerData
) => {
  const result = await pool.query(
    `
    UPDATE customers
    SET
      name = $1,
      email = $2,
      phone = $3,
      organization_name = $4,
      status = COALESCE($5, status),
      notes = $6
    WHERE id = $7
      AND company_id = $8
    RETURNING
      id,
      name,
      email,
      phone,
      organization_name,
      status,
      notes,
      created_at,
      updated_at
    `,
    [
      data.name,
      data.email ?? null,
      data.phone ?? null,
      data.organizationName ?? null,
      data.status ?? null,
      data.notes ?? null,
      customerId,
      companyId,
    ]
  );

  return result.rows[0] ?? null;
};

export const deleteCustomer = async (
  customerId: string,
  companyId: string
) => {
  const result = await pool.query(
    `
    DELETE FROM customers
    WHERE id = $1
      AND company_id = $2
    RETURNING id
    `,
    [customerId, companyId]
  );

  return result.rows[0] ?? null;
};