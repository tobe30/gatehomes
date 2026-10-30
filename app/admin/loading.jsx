export default function AdminLoading() {
  return <div aria-label="Loading admin dashboard" className="animate-pulse space-y-7">
    <div className="h-24 rounded-2xl bg-emerald-950/10" />
    <div className="grid gap-4 min-[520px]:grid-cols-2 xl:grid-cols-4">{[1, 2, 3, 4].map((item) => <div key={item} className="h-32 rounded-2xl border border-slate-200 bg-white" />)}</div>
    <div className="grid gap-6 xl:grid-cols-[1.45fr_0.85fr]"><div className="h-[380px] rounded-2xl border border-slate-200 bg-white"/><div className="h-[380px] rounded-2xl border border-slate-200 bg-white"/></div>
  </div>
}
