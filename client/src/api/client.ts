const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function api<T>(path:string, options:RequestInit = {}):Promise<T> {
  const token = localStorage.getItem("nexusflow_token");
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const response = await fetch(`${API_URL}${path}`, {...options, headers});
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.message || "Request failed");
  return body as T;
}

export const get = <T,>(path:string) => api<T>(path);
export const post = <T,>(path:string, data:unknown) => api<T>(path,{method:"POST",body:JSON.stringify(data)});
export const put = <T,>(path:string, data:unknown) => api<T>(path,{method:"PUT",body:JSON.stringify(data)});
export const del = <T,>(path:string) => api<T>(path,{method:"DELETE"});
