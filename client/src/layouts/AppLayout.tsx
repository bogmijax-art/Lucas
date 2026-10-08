import { useState } from "react";
import { Activity, Bell, CalendarDays, CheckSquare, ChevronLeft, ChevronRight, CircleUserRound, FolderKanban, LayoutDashboard, LogOut, Menu, UsersRound, X } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const nav = [
  { to: "/workspace", label: "Overview", icon: LayoutDashboard },
  { to: "/workspace/customers", label: "Customers", icon: UsersRound },
  { to: "/workspace/projects", label: "Projects", icon: FolderKanban },
  { to: "/workspace/tasks", label: "Tasks", icon: CheckSquare },
  { to: "/workspace/appointments", label: "Appointments", icon: CalendarDays },
  { to: "/workspace/notifications", label: "Notifications", icon: Bell },
  { to: "/workspace/activity", label: "Activity", icon: Activity },
];

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobile, setMobile] = useState(false);
  const { session, logout } = useAuth();
  return <div className="workspace-shell">
    <aside className={`workspace-sidebar ${collapsed ? "collapsed" : ""} ${mobile ? "mobile-open" : ""}`}>
      <div className="workspace-brand"><div className="workspace-mark">N</div>{!collapsed && <div><b>NexusFlow</b><small>{session?.company.name}</small></div>}<button className="mobile-close" onClick={() => setMobile(false)}><X/></button></div>
      <div className="workspace-label">WORKSPACE</div>
      <nav>{nav.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} end={to === "/workspace"} onClick={() => setMobile(false)}><Icon size={18}/><span>{label}</span></NavLink>)}</nav>
      <div className="workspace-bottom"><div className="workspace-user"><CircleUserRound/><div><b>{session?.user.name}</b><small>{session?.role}</small></div></div><button className="workspace-logout" onClick={logout}><LogOut size={17}/>{!collapsed && "Sign out"}</button></div>
      <button className="collapse" onClick={() => setCollapsed(v => !v)}>{collapsed ? <ChevronRight/> : <ChevronLeft/>}</button>
    </aside>
    <main className="workspace-main"><header className="workspace-topbar"><button className="menu-btn" onClick={() => setMobile(true)}><Menu/></button><div><span>INFINITY LABS / NEXUSFLOW</span><b>{session?.company.name}</b></div><div className="top-actions"><NavLink to="/workspace/notifications" className="top-icon"><Bell size={18}/></NavLink><div className="avatar">{session?.user.name?.charAt(0)}</div></div></header><div className="workspace-content"><Outlet/></div></main>
  </div>;
}
