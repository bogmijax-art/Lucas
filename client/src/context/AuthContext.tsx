import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { post } from "../api/client";
import type { Session } from "../types";

interface AuthContextValue { session:Session|null; loading:boolean; login:(email:string,password:string)=>Promise<void>; register:(data:Record<string,string>)=>Promise<void>; logout:()=>void; }
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({children}:{children:ReactNode}) {
  const [session,setSession]=useState<Session|null>(null); const [loading,setLoading]=useState(true);
  useEffect(()=>{
    try {
      const raw=localStorage.getItem("nexusflow_session");
      const token=localStorage.getItem("nexusflow_token");
      if(raw && token) {
        const parsed=JSON.parse(raw) as Session;
        if(parsed?.token===token && parsed?.user?.id && parsed?.company?.id) setSession(parsed);
        else { localStorage.removeItem("nexusflow_session"); localStorage.removeItem("nexusflow_token"); }
      } else {
        localStorage.removeItem("nexusflow_session");
        localStorage.removeItem("nexusflow_token");
      }
    } catch {
      localStorage.removeItem("nexusflow_session");
      localStorage.removeItem("nexusflow_token");
    } finally { setLoading(false); }
    const onUnauthorized=()=>{setSession(null)};
    window.addEventListener("nexusflow:unauthorized",onUnauthorized);
    return ()=>window.removeEventListener("nexusflow:unauthorized",onUnauthorized);
  },[]);
  const save=(s:Session)=>{setSession(s);localStorage.setItem("nexusflow_session",JSON.stringify(s));localStorage.setItem("nexusflow_token",s.token)};
  const login=async(email:string,password:string)=>{const r=await post<{data:Session}>("/auth/login",{email,password});save(r.data)};
  const register=async(data:Record<string,string>)=>{const r=await post<{data:Session}>("/auth/register",data);save(r.data)};
  const logout=()=>{setSession(null);localStorage.removeItem("nexusflow_session");localStorage.removeItem("nexusflow_token")};
  const value=useMemo(()=>({session,loading,login,register,logout}),[session,loading]); return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export const useAuth=()=>{const c=useContext(AuthContext);if(!c)throw new Error("useAuth must be used inside AuthProvider");return c};
