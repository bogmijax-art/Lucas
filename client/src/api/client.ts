const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/+$/, "");

export async function api<T>(path:string, options:RequestInit = {}):Promise<T> {
  const isAuthEndpoint = path.startsWith("/auth/");
  const token = isAuthEndpoint ? null : localStorage.getItem("nexusflow_token");
  const headers = new Headers(options.headers);
  if (options.body !== undefined && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  headers.set("Accept", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {...options, headers});
  } catch (cause) {
    const detail = cause instanceof Error ? cause.message : String(cause);
    throw new Error(`Cannot reach the NexusFlow API at ${API_URL}. Make sure the server is running and VITE_API_URL is correct. (${detail})`);
  }

  const raw = await response.text();
  let body: any = {};
  if (raw) {
    try { body = JSON.parse(raw); }
    catch { body = { message: raw.slice(0, 240) }; }
  }
  if (!response.ok) {
    if (response.status === 401 && !isAuthEndpoint) {
      localStorage.removeItem("nexusflow_session");
      localStorage.removeItem("nexusflow_token");
      window.dispatchEvent(new Event("nexusflow:unauthorized"));
    }
    const message = typeof body?.message === "string" ? body.message : `HTTP ${response.status} ${response.statusText}`;
    throw new Error(`${message} (API ${path}, status ${response.status})`);
  }
  return body as T;
}

export const get = <T,>(path:string) => api<T>(path);
export const post = <T,>(path:string, data:unknown) => api<T>(path,{method:"POST",body:JSON.stringify(data)});
export const put = <T,>(path:string, data:unknown) => api<T>(path,{method:"PUT",body:JSON.stringify(data)});
export const del = <T,>(path:string) => api<T>(path,{method:"DELETE"});
