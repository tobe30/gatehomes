'use client'

import { useEffect, useMemo, useState } from 'react'
import AdminIcon from '@/components/admin/AdminIcon'
import { useAdminData } from '@/components/admin/AdminDataContext'
import { EmptyState, FilterSelect, formatDate, PageHeading, SearchField, StatusPill } from '@/components/admin/AdminUI'

export default function AdminInquiriesPage() {
  const { inquiries, inquiriesLoading, toggleInquiryRead, notify } = useAdminData()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('All inquiries')
  const [selectedId, setSelectedId] = useState(null)
  useEffect(() => {
    const inquiryId = new URLSearchParams(window.location.search).get('selected')
    if (inquiryId) setSelectedId(inquiryId)
  }, [])
  const filtered = useMemo(() => inquiries.filter((inquiry) => {
    const content = `${inquiry.name} ${inquiry.email} ${inquiry.phone} ${inquiry.property} ${inquiry.message}`.toLowerCase()
    return content.includes(query.trim().toLowerCase()) && (status === 'All inquiries' || (status === 'Unread' ? !inquiry.read : inquiry.read))
  }).sort((a, b) => b.date.localeCompare(a.date)), [inquiries, query, status])
  const selected = filtered.find((inquiry) => inquiry.id === selectedId) || filtered[0]
  const unreadCount = inquiries.filter((inquiry) => !inquiry.read).length
  const replySubject = selected ? `Re: Your Gate Homes inquiry about ${selected.property}` : ''
  const replyBody = selected
    ? `Hello ${selected.name},\n\nThank you for contacting Gate Homes about ${selected.property}. We have received your inquiry and will be happy to assist.\n\nYour message: ${selected.message || 'Property inquiry'}\n\nBest regards,\nGate Homes`
    : ''
  const gmailComposeUrl = selected?.email
    ? `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(selected.email)}&su=${encodeURIComponent(replySubject)}&body=${encodeURIComponent(replyBody)}`
    : ''

  function selectInquiry(inquiry) {
    setSelectedId(inquiry.id)
  }

  async function toggleSelected() {
    if (!selected) return
    const result = await toggleInquiryRead(selected.id)
    if (!result?.success) {
      notify(result?.error || 'Inquiry status could not be updated.', 'error')
      return
    }
    notify(result.read ? 'Inquiry marked as read.' : 'Inquiry marked as unread.')
  }

  return <>
    <PageHeading eyebrow="Client messages" title="Inquiries" description="Keep track of property questions, viewing requests and booking interest." />
    <div className="mb-5 grid grid-cols-2 gap-3 sm:max-w-[440px]"><div className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-[11px] font-medium text-slate-500">All inquiries</p><p className="mt-2 text-2xl font-bold text-slate-900">{inquiriesLoading ? <span aria-label="Loading inquiries" className="inline-block h-7 w-10 animate-pulse rounded bg-slate-100 align-middle" /> : inquiries.length}</p></div><div className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-[11px] font-medium text-slate-500">Unread</p><p className="mt-2 text-2xl font-bold text-emerald-800">{inquiriesLoading ? <span aria-label="Loading unread inquiries" className="inline-block h-7 w-10 animate-pulse rounded bg-emerald-50 align-middle" /> : unreadCount}</p></div></div>

    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,.03)]">
      <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"><SearchField value={query} onChange={setQuery} placeholder="Search name, property or message"/><FilterSelect label="Show" value={status} onChange={setStatus} options={['All inquiries', 'Unread', 'Read'].map((value) => ({ label: value, value }))}/></div>
      {inquiriesLoading ? <div role="status" className="flex min-h-64 items-center justify-center gap-3 p-8 text-sm text-slate-500"><span className="loading loading-spinner loading-sm text-emerald-800" />Loading inquiries…</div> : !selected ? <div className="p-5"><EmptyState icon="inquiries" title="No inquiries found" description="Try adjusting your search or status filter. New customer inquiries will appear here." action={<button type="button" onClick={() => { setQuery(''); setStatus('All inquiries') }} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Clear filters</button>}/></div> : <div className="grid min-h-[560px] lg:grid-cols-[minmax(300px,0.88fr)_minmax(0,1.12fr)]">
        <div className="border-b border-slate-100 lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between px-5 py-4"><p className="text-xs font-bold text-slate-800">Inbox</p><span className="text-[10px] text-slate-400">{filtered.length} messages</span></div>
          <div className="max-h-[640px] overflow-y-auto">
            {filtered.map((inquiry) => <button key={inquiry.id} type="button" onClick={() => selectInquiry(inquiry)} className={`block w-full border-t border-slate-100 px-4 py-4 text-left transition-colors hover:bg-slate-50 ${selected.id === inquiry.id ? 'bg-emerald-50/60' : ''}`}><span className="flex items-start gap-3"><span className="relative flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-900">{inquiry.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}{!inquiry.read && <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full border-2 border-white bg-emerald-600"/>}</span><span className="min-w-0 flex-1"><span className="flex items-center justify-between gap-2"><span className={`truncate text-xs ${inquiry.read ? 'font-semibold text-slate-800' : 'font-bold text-slate-900'}`}>{inquiry.name}</span><span className="shrink-0 text-[10px] text-slate-400">{new Intl.DateTimeFormat('en-NG', { day: 'numeric', month: 'short' }).format(new Date(inquiry.date))}</span></span><span className="mt-1 block truncate text-[10px] font-medium text-slate-500">{inquiry.property}</span><span className="mt-1 block line-clamp-2 text-[11px] leading-5 text-slate-500">{inquiry.message}</span></span></span></button>)}
          </div>
        </div>

        <article className="p-5 sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-5"><div className="flex items-center gap-3"><span className="flex size-12 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-900">{selected.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</span><div><h2 className="text-sm font-bold text-slate-900">{selected.name}</h2><p className="mt-1 text-xs text-slate-500">Received {formatDate(selected.date)}</p></div></div><StatusPill status={selected.read ? 'Read' : 'Unread'}/></div>
          <div className="mt-5 rounded-xl bg-slate-50 p-4"><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">Regarding listing</p><p className="mt-2 text-sm font-semibold text-slate-900">{selected.property}</p>{(selected.propertyCategory === 'Shortlet' || selected.requestType || selected.startDate || selected.endDate || selected.preferredDate) && <><p className="mt-1 text-[11px] text-slate-500">{selected.requestType && <>Booking purpose: {selected.requestType}</>}{selected.requestType && selected.guests && ' · '}{selected.guests ? <>Guests / visitors: {selected.guests}</> : null}</p>{(selected.startDate || selected.endDate || selected.preferredDate) && <p className="mt-1 text-[11px] text-slate-500">Date of booking: {selected.startDate || selected.preferredDate} {selected.endDate && `to ${selected.endDate}`}</p>}</>}</div>
          <div className="mt-6"><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">Message</p><p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-700">{selected.message}</p></div>
          <div className="mt-6 space-y-3 border-t border-slate-100 pt-5"><div className="flex items-center gap-3 text-sm"><span className="flex size-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500"><AdminIcon name="mail" size={15}/></span><span className="text-slate-700">{selected.email || 'Not provided'}</span></div><div className="flex items-center gap-3 text-sm"><span className="flex size-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500"><AdminIcon name="phone" size={15}/></span><span className="text-slate-700">{selected.phone}</span></div></div>
          <div className="mt-7 flex flex-wrap gap-2">{selected.email ? <><a href={gmailComposeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-emerald-800 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-900">Reply in Gmail <AdminIcon name="chevron" size={14}/></a><a href={`mailto:${selected.email}?subject=${encodeURIComponent(replySubject)}&body=${encodeURIComponent(replyBody)}`} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">Open email app</a></> : <button type="button" disabled className="inline-flex min-h-10 cursor-not-allowed items-center gap-2 rounded-xl bg-slate-200 px-4 py-2 text-xs font-semibold text-slate-500">No email provided</button>}<button type="button" onClick={toggleSelected} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">Mark as {selected.read ? 'unread' : 'read'}</button></div>
          <p className="mt-5 rounded-xl border border-emerald-100 bg-emerald-50/70 px-3.5 py-3 text-[11px] leading-5 text-emerald-900">This inquiry was saved from the listing form. Contact the visitor using the details above to follow up.</p>
        </article>
      </div>}
    </section>
  </>
}
