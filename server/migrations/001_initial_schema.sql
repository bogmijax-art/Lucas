BEGIN;

-- ============================================================
-- Extensions
-- ============================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;


-- ============================================================
-- ENUM TYPES
-- ============================================================

CREATE TYPE user_role AS ENUM (
    'owner',
    'admin',
    'manager',
    'employee'
);

CREATE TYPE company_member_status AS ENUM (
    'active',
    'invited',
    'suspended'
);

CREATE TYPE customer_status AS ENUM (
    'active',
    'inactive'
);

CREATE TYPE project_status AS ENUM (
    'planning',
    'active',
    'on_hold',
    'completed',
    'cancelled'
);

CREATE TYPE priority_level AS ENUM (
    'low',
    'medium',
    'high',
    'urgent'
);

CREATE TYPE task_status AS ENUM (
    'todo',
    'in_progress',
    'completed',
    'cancelled'
);

CREATE TYPE appointment_status AS ENUM (
    'scheduled',
    'completed',
    'cancelled',
    'no_show'
);


-- ============================================================
-- 1. COMPANIES
-- ============================================================

CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name VARCHAR(150) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,

    email VARCHAR(255),
    phone VARCHAR(50),
    website VARCHAR(255),
    address TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ============================================================
-- 2. USERS
-- ============================================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_login_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ============================================================
-- 3. COMPANY MEMBERS
-- ============================================================

CREATE TABLE company_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    company_id UUID NOT NULL,
    user_id UUID NOT NULL,

    role user_role NOT NULL DEFAULT 'employee',
    status company_member_status NOT NULL DEFAULT 'active',

    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_company_members_company
        FOREIGN KEY (company_id)
        REFERENCES companies(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_company_members_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT uq_company_members
        UNIQUE (company_id, user_id)
);


-- ============================================================
-- 4. CUSTOMERS
-- ============================================================

CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    company_id UUID NOT NULL,

    name VARCHAR(150) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    organization_name VARCHAR(150),

    status customer_status NOT NULL DEFAULT 'active',

    notes TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_customers_company
        FOREIGN KEY (company_id)
        REFERENCES companies(id)
        ON DELETE CASCADE
);


-- ============================================================
-- 5. PROJECTS
-- ============================================================

CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    company_id UUID NOT NULL,

    name VARCHAR(200) NOT NULL,
    description TEXT,

    status project_status NOT NULL DEFAULT 'planning',
    priority priority_level NOT NULL DEFAULT 'medium',

    start_date DATE,
    due_date DATE,

    created_by UUID,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_projects_company
        FOREIGN KEY (company_id)
        REFERENCES companies(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_projects_created_by
        FOREIGN KEY (created_by)
        REFERENCES users(id)
        ON DELETE SET NULL,

    CONSTRAINT chk_project_dates
        CHECK (
            due_date IS NULL
            OR start_date IS NULL
            OR due_date >= start_date
        )
);


-- ============================================================
-- 6. TASKS
-- ============================================================

CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    project_id UUID NOT NULL,
    assigned_to UUID,

    title VARCHAR(200) NOT NULL,
    description TEXT,

    status task_status NOT NULL DEFAULT 'todo',
    priority priority_level NOT NULL DEFAULT 'medium',

    due_date DATE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_tasks_project
        FOREIGN KEY (project_id)
        REFERENCES projects(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_tasks_assigned_user
        FOREIGN KEY (assigned_to)
        REFERENCES users(id)
        ON DELETE SET NULL
);


-- ============================================================
-- 7. APPOINTMENTS
-- ============================================================

CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    company_id UUID NOT NULL,

    customer_id UUID,
    created_by UUID,

    title VARCHAR(200) NOT NULL,
    description TEXT,

    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,

    status appointment_status NOT NULL DEFAULT 'scheduled',

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_appointments_company
        FOREIGN KEY (company_id)
        REFERENCES companies(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_appointments_customer
        FOREIGN KEY (customer_id)
        REFERENCES customers(id)
        ON DELETE SET NULL,

    CONSTRAINT fk_appointments_created_by
        FOREIGN KEY (created_by)
        REFERENCES users(id)
        ON DELETE SET NULL,

    CONSTRAINT chk_appointment_time
        CHECK (end_time > start_time)
);


-- ============================================================
-- 8. NOTIFICATIONS
-- ============================================================

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL,

    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,

    is_read BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_notifications_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);


-- ============================================================
-- 9. ACTIVITY LOGS
-- ============================================================

CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    company_id UUID NOT NULL,
    user_id UUID,

    action VARCHAR(100) NOT NULL,

    entity_type VARCHAR(100),
    entity_id UUID,

    metadata JSONB,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_activity_logs_company
        FOREIGN KEY (company_id)
        REFERENCES companies(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_activity_logs_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE SET NULL
);


-- ============================================================
-- INDEXES
-- ============================================================

-- Company members
CREATE INDEX idx_company_members_company_id
    ON company_members(company_id);

CREATE INDEX idx_company_members_user_id
    ON company_members(user_id);

CREATE INDEX idx_company_members_role
    ON company_members(role);


-- Customers
CREATE INDEX idx_customers_company_id
    ON customers(company_id);

CREATE INDEX idx_customers_company_status
    ON customers(company_id, status);

CREATE INDEX idx_customers_email
    ON customers(email);


-- Projects
CREATE INDEX idx_projects_company_id
    ON projects(company_id);

CREATE INDEX idx_projects_company_status
    ON projects(company_id, status);

CREATE INDEX idx_projects_created_by
    ON projects(created_by);


-- Tasks
CREATE INDEX idx_tasks_project_id
    ON tasks(project_id);

CREATE INDEX idx_tasks_assigned_to
    ON tasks(assigned_to);

CREATE INDEX idx_tasks_status
    ON tasks(status);

CREATE INDEX idx_tasks_due_date
    ON tasks(due_date);


-- Appointments
CREATE INDEX idx_appointments_company_id
    ON appointments(company_id);

CREATE INDEX idx_appointments_customer_id
    ON appointments(customer_id);

CREATE INDEX idx_appointments_start_time
    ON appointments(start_time);

CREATE INDEX idx_appointments_company_start_time
    ON appointments(company_id, start_time);


-- Notifications
CREATE INDEX idx_notifications_user_id
    ON notifications(user_id);

CREATE INDEX idx_notifications_unread
    ON notifications(user_id, is_read)
    WHERE is_read = FALSE;


-- Activity logs
CREATE INDEX idx_activity_logs_company_id
    ON activity_logs(company_id);

CREATE INDEX idx_activity_logs_user_id
    ON activity_logs(user_id);

CREATE INDEX idx_activity_logs_entity
    ON activity_logs(entity_type, entity_id);

CREATE INDEX idx_activity_logs_created_at
    ON activity_logs(created_at);


-- ============================================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- ============================================================
-- UPDATED_AT TRIGGERS
-- ============================================================

CREATE TRIGGER companies_updated_at
BEFORE UPDATE ON companies
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER company_members_updated_at
BEFORE UPDATE ON company_members
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER customers_updated_at
BEFORE UPDATE ON customers
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER projects_updated_at
BEFORE UPDATE ON projects
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tasks_updated_at
BEFORE UPDATE ON tasks
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER appointments_updated_at
BEFORE UPDATE ON appointments
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();


-- ============================================================
-- COMPLETE
-- ============================================================

COMMIT;