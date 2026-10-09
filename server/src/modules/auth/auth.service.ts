import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../../database/pool.js";

import {
  findUserByEmail,
  findUserForLogin,
  createUser,
  createCompany,
  createCompanyMember,
} from "./auth.repository.js";

interface RegisterInput {
  name: string;
  email: string;
  password: string;
  companyName: string;
}

const generateSlug = (value: string): string => {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export const register = async (input: RegisterInput) => {
  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();
  const companyName = input.companyName.trim();
  const secret = process.env.JWT_SECRET;

  if (!name || !email || !input.password || !companyName) {
    throw new Error("All fields are required");
  }
  if (input.password.length < 8) {
    throw new Error("Password must be at least 8 characters long");
  }
  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }

  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new Error("Email is already registered");
  }

  const passwordHash = await bcrypt.hash(input.password, 12);
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    // All three writes must use the same connection so the transaction is real.
    const user = await createUser({ name, email, passwordHash }, client);
    const company = await createCompany(
      { name: companyName, slug: generateSlug(companyName) || `company-${Date.now()}` },
      client
    );
    const membership = await createCompanyMember(user.id, company.id, client);
    await client.query("COMMIT");

    const token = jwt.sign(
      { userId: user.id, companyId: company.id, role: membership.role },
      secret,
      { expiresIn: "1h" }
    );

    // Keep the registration response identical to the login Session contract.
    return {
      user: { id: user.id, name: user.name, email: user.email },
      company: { id: company.id, name: company.name, slug: company.slug },
      role: membership.role,
      token,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

interface LoginInput {
  email: string;
  password: string;
}

export const login = async (input: LoginInput) => {
  const email = input.email.trim().toLowerCase();

  const user = await findUserForLogin(email);

  if (!user) {
    throw new Error("Invalid email or password");
  }

  if (!user.is_active) {
    throw new Error("User account is inactive");
  }

  const passwordValid = await bcrypt.compare(
    input.password,
    user.password_hash
  );

  if (!passwordValid) {
    throw new Error("Invalid email or password");
  }

  const membershipResult = await pool.query(
    `
    SELECT
      cm.company_id,
      cm.role,
      cm.status,
      c.name AS company_name,
      c.slug AS company_slug
    FROM company_members cm
    INNER JOIN companies c
      ON c.id = cm.company_id
    WHERE cm.user_id = $1
      AND cm.status = 'active'
    ORDER BY cm.joined_at ASC
    `,
    [user.id]
  );

  const memberships = membershipResult.rows;

  if (memberships.length === 0) {
    throw new Error("User has no active company membership");
  }

  const primaryMembership = memberships[0];

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }

  const token = jwt.sign(
    {
      userId: user.id,
      companyId: primaryMembership.company_id,
      role: primaryMembership.role,
    },
    secret,
    {
      expiresIn: "1h",
    }
  );

  await pool.query(
    `
    UPDATE users
    SET last_login_at = NOW()
    WHERE id = $1
    `,
    [user.id]
  );

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    company: {
      id: primaryMembership.company_id,
      name: primaryMembership.company_name,
      slug: primaryMembership.company_slug,
    },
    role: primaryMembership.role,
    token,
  };
};