import AdminIcon from './AdminIcon'

export function PageHeading({ eyebrow, title, description, action }) {
  return <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div>{eyebrow && <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-800">{eyebrow}</p>}<h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-[28px]">{title}</h2>{description && <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{description}</p>}</div>{action}</div>
}

export function StatCard({ label, value, note, icon, accent = 'green' }) {
  const accents = { green: 'bg-emerald-50 text-emerald-800', black: 'bg-slate-100 text-slate-700', amber: 'bg-amber-50 text-amber-700', blue: 'bg-sky-50 text-sky-700' }
  return <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,.03)] transition-shadow hover:shadow-md sm:p-6"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-medium text-slate-500">{label}</p><p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">{value}</p></div><span className={`flex size-11 items-center justify-center rounded-xl ${accents[accent]}`}><AdminIcon name={icon} size={20} /></span></div><p className="mt-4 text-[11px] text-slate-500">{note}</p></article>
}

export function StatusPill({ status }) {
  const styles = { Published: 'bg-emerald-50 text-emerald-800 ring-emerald-700/10', Draft: 'bg-slate-100 text-slate-600 ring-slate-500/10', 'For Sale': 'bg-emerald-50 text-emerald-800 ring-emerald-700/10', 'For Rent': 'bg-blue-50 text-blue-700 ring-blue-600/10', Unread: 'bg-amber-50 text-amber-800 ring-amber-700/10', Read: 'bg-slate-100 text-slate-600 ring-slate-500/10' }
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ring-1 ring-inset ${styles[status] || styles.Draft}`}><span className="size-1.5 rounded-full bg-current" />{status}</span>
}

export function formatPrice(price) {
  if (!price) return 'Contact for price'
  return `₦${new Intl.NumberFormat('en-NG').format(price)}`
}

export function formatDate(date) {
  return new Intl.DateTimeFormat('en-NG', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(date))
}

export function PrimaryButton({ children, className = '', ...props }) {
  return <button {...props} className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-800 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}>{children}</button>
}

export function SecondaryButton({ children, className = '', ...props }) {
  return <button {...props} className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2 ${className}`}>{children}</button>
}

export function SearchField({ value, onChange, placeholder = 'Search…' }) {
  return <label className="flex h-11 w-full items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-3.5 text-slate-400 transition-colors focus-within:border-emerald-700 focus-within:ring-2 focus-within:ring-emerald-700/10 sm:max-w-[320px]"><AdminIcon name="search" size={17} /><span className="sr-only">Search</span><input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="min-w-0 flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400" /></label>
}

export function FilterSelect({ label, value, onChange, options }) {
  return <label className="flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-500"><span className="whitespace-nowrap">{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className="min-w-0 bg-transparent text-xs font-semibold text-slate-700 outline-none">{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
}

export function EmptyState({ icon = 'properties', title, description, action }) {
  return <div className="flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-5 text-center"><span className="flex size-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-800"><AdminIcon name={icon} size={24} /></span><h3 className="mt-4 text-base font-bold text-slate-900">{title}</h3><p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">{description}</p>{action && <div className="mt-5">{action}</div>}</div>
}
