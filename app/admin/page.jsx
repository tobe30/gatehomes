'use client'

import Image from 'next/image'
import Link from 'next/link'
import AdminIcon from '@/components/admin/AdminIcon'
import { useAdminData } from '@/components/admin/AdminDataContext'
import { formatDate, formatPrice, StatCard, StatusPill } from '@/components/admin/AdminUI'

export default function AdminDashboardPage() {
  const { properties, inquiries } = useAdminData()
  const published = properties.filter((property) => property.status === 'Published').length
  const drafts = properties.filter((property) => property.status === 'Draft').length
  const unread = inquiries.filter((inquiry) => !inquiry.read).length
  const recentProperties = [...properties].sort((a, b) => b.added.localeCompare(a.added)).slice(0, 4)
  const recentInquiries = [...inquiries].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4)

  return (
    <div className="space-y-7">
      <section className="relative isolate overflow-hidden rounded-2xl bg-[#102b20] px-6 py-7 text-white shadow-sm sm:px-8 sm:py-8">
        <div aria-hidden="true" className="absolute -right-12 -top-24 -z-10 size-72 rounded-full border-[42px] border-white/[0.04]" />
        <div className="relative flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div><p className="text-xs font-medium text-emerald-100/70">Your property workspace</p><h2 className="mt-2 font-serif text-2xl font-semibold sm:text-[30px]">Welcome back, Gate Homes 👋</h2><p className="mt-2 max-w-xl text-sm leading-6 text-white/65">Here’s what’s happening with your properties and customer inquiries.</p></div>
          <Link href="/admin/properties/new" className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-[#102b20] transition-colors hover:bg-emerald-50 sm:self-center"><AdminIcon name="plus" size={17} />Add a property</Link>
        </div>
      </section>

      <section aria-label="Dashboard statistics" className="grid grid-cols-1 gap-4 min-[520px]:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total properties" value={properties.length} note="In your current inventory" icon="properties" />
        <StatCard label="Published listings" value={published} note="Visible to prospective clients" icon="eye" />
        <StatCard label="Draft properties" value={drafts} note="Not yet published" icon="edit" accent="amber" />
        <StatCard label="Total inquiries" value={inquiries.length} note={`${unread} unread inquiries`} icon="inquiries" accent="blue" />
      </section>

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.85fr)]">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,.03)]">
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">
            <div><h2 className="text-sm font-bold text-slate-900">Recent properties</h2><p className="mt-1 text-xs text-slate-500">Your latest listing updates</p></div>
            <Link href="/admin/properties" className="text-xs font-semibold text-emerald-800 hover:text-emerald-950">View all <span aria-hidden="true">→</span></Link>
          </div>
          <div className="divide-y divide-slate-100">
            {recentProperties.map((property) => (
              <div key={property.id} className="flex items-center gap-3 px-5 py-3.5 sm:px-6">
                <div className="relative size-12 shrink-0 overflow-hidden rounded-xl bg-slate-100"><Image src={property.image} alt="" fill sizes="48px" className="object-cover" /></div>
                <div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold text-slate-900">{property.title}</p><p className="mt-1 truncate text-[11px] text-slate-500">{property.location}</p></div>
                <div className="hidden text-right sm:block"><p className="text-xs font-semibold text-slate-800">{formatPrice(property.price)}</p><p className="mt-1 text-[10px] text-slate-400">{formatDate(property.added)}</p></div>
                <StatusPill status={property.status} />
              </div>
            ))}
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,.03)]">
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">
            <div><h2 className="text-sm font-bold text-slate-900">Recent inquiries</h2><p className="mt-1 text-xs text-slate-500">Latest messages from clients</p></div>
            <Link href="/admin/inquiries" className="text-xs font-semibold text-emerald-800 hover:text-emerald-950">View all <span aria-hidden="true">→</span></Link>
          </div>
          <div className="divide-y divide-slate-100">
            {recentInquiries.map((inquiry) => (
              <Link key={inquiry.id} href={`/admin/inquiries?selected=${inquiry.id}`} className="flex items-start gap-3 px-5 py-4 transition-colors hover:bg-slate-50 sm:px-6">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-xs font-bold text-emerald-900">{inquiry.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</span>
                <span className="min-w-0 flex-1"><span className="flex items-center justify-between gap-2"><span className="truncate text-xs font-semibold text-slate-900">{inquiry.name}</span><span className={`size-2 shrink-0 rounded-full ${inquiry.read ? 'bg-slate-200' : 'bg-emerald-600'}`} /></span><span className="mt-1 block truncate text-[11px] text-slate-500">{inquiry.message}</span><span className="mt-1.5 block truncate text-[10px] text-slate-400">{inquiry.property}</span></span>
              </Link>
            ))}
          </div>
          <div className="border-t border-slate-100 px-5 py-3.5 sm:px-6"><Link href="/admin/inquiries" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-emerald-800">Open inquiry inbox <AdminIcon name="chevron" size={14} /></Link></div>
        </section>
      </div>
    </div>
  )
}
