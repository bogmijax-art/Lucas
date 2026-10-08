export default function StatCard({ label, value, caption, icon: Icon }: { label: string; value: number | string; caption: string; icon: any }) {
  return <div className="stat-card"><div className="stat-icon"><Icon size={16}/></div><h3>{value}</h3><p>{label}</p><small>{caption}</small></div>;
}
