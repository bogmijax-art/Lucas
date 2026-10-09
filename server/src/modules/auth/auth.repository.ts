import type { PoolClient } from "pg";
import pool from "../../database/pool.js";

type QueryExecutor = Pick<PoolClient, "query">;

export interface CreateUserData {
  name: string;
  email: string;
  passwordHash: string;
}

export interface CreateCompanyData {
  name: string;
  slug: string;
}

export const findUserByEmail = async (email: string) => {
  const result = await pool.query(
    `
    SELECT id, name, email, password_hash, is_active
    FROM users
    WHERE email = $1
    `,
    [email]
  );

  return result.rows[0] ?? null;
};

export const createUser = async (data: CreateUserData, client: QueryExecutor = pool) => {
  const result = await client.query(
    `
    INSERT INTO users (name, email, password_hash)
    VALUES ($1, $2, $3)
    RETURNING id, name, email, is_active, created_at
    `,
    [data.name, data.email, data.passwordHash]
  );

  return result.rows[0];
};

export const createCompany = async (
  data: CreateCompanyData,
  client: QueryExecutor = pool
) => {
  const result = await client.query(
    `
    INSERT INTO companies (name, slug)
    VALUES ($1, $2)
    RETURNING id, name, slug
    `,
    [data.name, data.slug]
  );

  return result.rows[0];
};

export const createCompanyMember = async (
  userId: string,
  companyId: string,
  client: QueryExecutor = pool
) => {
  const result = await client.query(
    `
    INSERT INTO company_members (
      company_id,
      user_id,
      role,
      status
    )
    VALUES ($1, $2, 'owner', 'active')
    RETURNING id, company_id, user_id, role, status
    `,
    [companyId, userId]
  );

  return result.rows[0];
};

export const findUserForLogin = async (email: string) => {
  const result = await pool.query(
    `
    SELECT
      id,
      name,
      email,
      password_hash,
      is_active
    FROM users
    WHERE email = $1
    `,
    [email]
  );

  return result.rows[0] ?? null;
};