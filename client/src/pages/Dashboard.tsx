import { useEffect, useState } from "react";
import { Activity, ArrowRight, CheckCircle2, Clock3, FolderKanban, UsersRound } from "lucide-react";
import { get } from "../api/client";
import { useAuth } from "../context/AuthContext";
import type { ActivityLog, Customer, Project, Task } from "../types";
import StatCard from "../components/StatCard";

export default function Dashboard() {
  const { session } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]), [projects, setProjects] = useState<Project[]>([]), [tasks, setTasks] = useState<Task[]>([]), [logs, setLogs] = useState<ActivityLog[]>([]);
  useEffect(() => { Promise.all([get<{ data: Customer[] }>("/customers"), get<{ data: Project[] }>("/projects"), get<{ data: Task[] }>("/tasks"), get<{ data: ActivityLog[] }>("/activity-logs")]).then(([a,b,c,d]) => { setCustomers(a.data); setProjects(b.data); setTasks(c.data); setLogs(d.data.slice(0,5)); }).catch(() => {}); }, []);
  const active = projects.filter(p => p.status === "active").length, done = tasks.filter(t => t.status === "completed").length;
  return <>
    <div className="workspace-page-head"><div><span className="workspace-kicker">OVERVIEW</span><h1>Good to see you, {session?.user.name?.split(" ")[0]}.</h1><p>Here is the pulse of your business workspace.</p></div><a className="workspace-button" href="/workspace/projects">New project <ArrowRight size={16}/></a></div>
    <section className="workspace-purpose"><div><span>THE NEXUSFLOW PROMISE</span><h2>Less switching. More momentum.</h2><p>Customers, projects, tasks, and appointments live together so your team can focus on moving meaningful work forward.</p></div><div className="purpose-grid-mark">N<span>×</span>F</div></section>
    <div className="workspace-stats"><StatCard label="Customers" value={customers.length} caption="Relationships" icon={UsersRound}/><StatCard label="Active projects" value={active} caption={`${projects.length} total`} icon={FolderKanban}/><StatCard label="Completed tasks" value={done} caption={`${tasks.length} total`} icon={CheckCircle2}/><StatCard label="Recent activity" value={logs.length} caption="Latest events" icon={Activity}/></div>
    <div className="workspace-grid"><section className="workspace-panel"><div className="panel-title"><div><span>PROJECT PULSE</span><h2>Current projects</h2></div><a href="/workspace/projects">View all <ArrowRight size={14}/></a></div>{projects.slice(0,5).map(p => <div className="workspace-row" key={p.id}><div className="row-symbol"><FolderKanban size={16}/></div><div><b>{p.name}</b><small>{p.description || "No description"}</small></div><span className={`status ${p.status}`}>{p.status.replaceAll("_"," ")}</span><span className={`priority ${p.priority}`}><Clock3 size={12}/>{p.priority}</span></div>)}{!projects.length && <div className="workspace-empty">Your project story starts here. Create the first one.</div>}</section>
    <section className="workspace-panel"><div className="panel-title"><div><span>ACTIVITY</span><h2>What is happening</h2></div><a href="/workspace/activity">View log <ArrowRight size={14}/></a></div>{logs.map(l => <div className="workspace-activity" key={l.id}><div className="activity-line"/><div><b>{l.action.replaceAll("."," ")}</b><small>{l.user_name || "Workspace user"} · {new Date(l.created_at).toLocaleString()}</small></div></div>)}{!logs.length && <div className="workspace-empty">Activity will appear as your team works.</div>}</section></div>
  </>;
}
