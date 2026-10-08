export type Role = "owner" | "admin" | "manager" | "employee";
export type ProjectStatus = "planning" | "active" | "on_hold" | "completed" | "cancelled";
export type Priority = "low" | "medium" | "high" | "urgent";
export type TaskStatus = "todo" | "in_progress" | "completed" | "cancelled";

export interface User { id:string; name:string; email:string; }
export interface Company { id:string; name:string; slug:string; email?:string; phone?:string; website?:string; }
export interface Session { token:string; user:User; company:Company; role:Role; }
export interface Customer { id:string; name:string; email?:string; phone?:string; organization_name?:string; status:"active"|"inactive"; notes?:string; created_at:string; }
export interface Project { id:string; name:string; description?:string; status:ProjectStatus; priority:Priority; start_date?:string; due_date?:string; created_by?:string; created_at:string; updated_at:string; }
export interface Task { id:string; project_id:string; project_name?:string; assigned_to?:string; title:string; description?:string; status:TaskStatus; priority:Priority; due_date?:string; created_at:string; }
export interface Appointment { id:string; customer_id?:string; customer_name?:string; title:string; description?:string; start_time:string; end_time:string; status:string; }
export interface Notification { id:string; title:string; message:string; is_read:boolean; created_at:string; }
export interface ActivityLog { id:string; user_id?:string; user_name?:string; action:string; entity_type?:string; entity_id?:string; metadata?:Record<string,unknown>; created_at:string; }
