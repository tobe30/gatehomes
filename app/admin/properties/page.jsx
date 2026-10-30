'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import AdminIcon from '@/components/admin/AdminIcon'
import { useAdminData } from '@/components/admin/AdminDataContext'
import { EmptyState, FilterSelect, formatDate, formatPrice, PageHeading, SearchField, StatusPill } from '@/components/admin/AdminUI'

function PropertyPreview({ property, onClose }) {
  if (!property) return null
  return <div role="dialog" aria-modal="true" aria-labelledby="preview-title" className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/50 p-4" onClick={(event) => { if (event.target === event.currentTarget) onClose() }}>
    <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
      <div className="relative h-56 bg-slate-100"><Image src={property.image} alt={property.title} fill sizes="(max-width: 640px) 100vw, 512px" className="object-cover"/><span className="absolute left-3 top-3"><StatusPill status={property.status} /></span><button type="button" onClick={onClose} aria-label="Close preview" className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-white text-slate-700 shadow">×</button></div>
      <div className="p-5"><p className="text-xs font-medium text-slate-500">{property.id} · {property.location}</p><h2 id="preview-title" className="mt-2 text-xl font-bold text-slate-900">{property.title}</h2><p className="mt-2 text-lg font-bold text-emerald-900">{formatPrice(property.discountPrice || property.price)}</p>{property.discountPrice && <p className="mt-0.5 text-xs text-slate-500 line-through">Regular price {formatPrice(property.price)}</p>}<p className="mt-3 text-sm text-slate-600">{property.beds} beds <span className="px-1.5 text-slate-300">•</span> {property.baths} baths <span className="px-1.5 text-slate-300">•</span> {property.type}</p><div className="mt-5 flex justify-end gap-2"><button type="button" onClick={onClose} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Close</button><Link href={`/admin/properties/${property.id}/edit`} className="inline-flex items-center gap-2 rounded-xl bg-emerald-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-900"><AdminIcon name="edit" size={15}/>Edit listing</Link></div></div>
    </div>
  </div>
}

export default function AdminPropertiesPage() {
  const { properties, deleteProperty, notify } = useAdminData()
  const [query, setQuery] = useState('')
  const [type, setType] = useState('All types')
  const [status, setStatus] = useState('All statuses')
  const [page, setPage] = useState(1)
  const [preview, setPreview] = useState(null)
  const pageSize = 5
  const filtered = useMemo(() => properties.filter((property) => {
    const matchQuery = `${property.title} ${property.location} ${property.id}`.toLowerCase().includes(query.trim().toLowerCase())
    return matchQuery && (type === 'All types' || property.type === type) && (status === 'All statuses' || property.status === status)
  }), [properties, query, type, status])
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const safePage = Math.min(page, pageCount)
  const visible = filtered.slice((safePage - 1) * pageSize, safePage * pageSize)

  function removeProperty(property) {
    if (!window.confirm(`Delete “${property.title}” from this demo inventory?`)) return
    deleteProperty(property.id)
    notify('Property removed from the demo inventory.')
  }

  return <>
    <PageHeading eyebrow="Inventory" title="Properties" description="Review, organize and update your current property listings." action={<Link href="/admin/properties/new" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-800 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-900"><AdminIcon name="plus" size={17}/>Add property</Link>} />

    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,.03)]">
      <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
        <SearchField value={query} onChange={(value) => { setQuery(value); setPage(1) }} placeholder="Search by title, location or ID" />
        <div className="grid grid-cols-2 gap-2 sm:flex">
          <FilterSelect label="Type" value={type} onChange={(value) => { setType(value); setPage(1) }} options={['All types', 'Apartment', 'House', 'Duplex', 'Terrace'].map((value) => ({ label: value, value }))} />
          <FilterSelect label="Status" value={status} onChange={(value) => { setStatus(value); setPage(1) }} options={['All statuses', 'Published', 'Draft'].map((value) => ({ label: value, value }))} />
        </div>
      </div>

      {visible.length === 0 ? <div className="p-5"><EmptyState icon="search" title="No properties found" description="Try another search or clear your filters to see the full inventory." action={<button type="button" onClick={() => { setQuery(''); setType('All types'); setStatus('All statuses') }} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Clear filters</button>} /></div> : <>
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[880px] text-left">
            <thead className="bg-slate-50/80 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500"><tr><th className="px-5 py-3.5">Property</th><th className="px-4 py-3.5">Type / purpose</th><th className="px-4 py-3.5">Price</th><th className="px-4 py-3.5">Status</th><th className="px-4 py-3.5">Date added</th><th className="px-4 py-3.5 text-right">Actions</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {visible.map((property) => <tr key={property.id} className="transition-colors hover:bg-slate-50/70">
                <td className="px-5 py-4"><div className="flex items-center gap-3"><div className="relative size-12 shrink-0 overflow-hidden rounded-xl bg-slate-100"><Image src={property.image} alt="" fill sizes="48px" className="object-cover"/></div><div className="min-w-0"><p className="max-w-[260px] truncate text-xs font-semibold text-slate-900">{property.title}</p><p className="mt-1 text-[10px] text-slate-500">{property.id} · {property.location}</p></div></div></td>
                <td className="px-4 py-4"><p className="text-xs font-medium text-slate-800">{property.type}</p><p className="mt-1 text-[10px] text-slate-500">{property.purpose}</p></td>
                <td className="whitespace-nowrap px-4 py-4 text-xs font-semibold text-slate-800"><span>{formatPrice(property.discountPrice || property.price)}</span>{property.discountPrice && <span className="mt-1 block font-normal text-slate-400 line-through">{formatPrice(property.price)}</span>}</td>
                <td className="px-4 py-4"><StatusPill status={property.status}/></td>
                <td className="whitespace-nowrap px-4 py-4 text-xs text-slate-500">{formatDate(property.added)}</td>
                <td className="px-4 py-4"><div className="flex justify-end gap-1"><button type="button" title="View property" onClick={() => setPreview(property)} className="flex size-9 items-center justify-center rounded-lg text-slate-500 hover:bg-emerald-50 hover:text-emerald-800"><AdminIcon name="eye" size={16}/></button><Link title="Edit property" href={`/admin/properties/${property.id}/edit`} className="flex size-9 items-center justify-center rounded-lg text-slate-500 hover:bg-emerald-50 hover:text-emerald-800"><AdminIcon name="edit" size={16}/></Link><button type="button" title="Delete property" onClick={() => removeProperty(property)} className="flex size-9 items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-700"><AdminIcon name="trash" size={16}/></button></div></td>
              </tr>)}
            </tbody>
          </table>
        </div>

        <div className="divide-y divide-slate-100 md:hidden">
          {visible.map((property) => <article key={property.id} className="p-4"><div className="flex gap-3"><div className="relative h-24 w-28 shrink-0 overflow-hidden rounded-xl bg-slate-100"><Image src={property.image} alt="" fill sizes="112px" className="object-cover"/></div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><StatusPill status={property.status}/><span className="text-[10px] text-slate-400">{property.id}</span></div><h3 className="mt-2 text-xs font-bold leading-5 text-slate-900">{property.title}</h3><p className="mt-1 truncate text-[10px] text-slate-500">{property.location}</p><p className="mt-2 text-xs font-semibold text-slate-800">{formatPrice(property.discountPrice || property.price)}</p>{property.discountPrice && <p className="text-[10px] text-slate-400 line-through">Regular {formatPrice(property.price)}</p>}</div></div><div className="mt-3 flex items-center justify-between"><p className="text-[10px] text-slate-500">{property.type} · {property.purpose} · {formatDate(property.added)}</p><div className="flex gap-1"><button type="button" aria-label={`View ${property.title}`} onClick={() => setPreview(property)} className="flex size-9 items-center justify-center rounded-lg text-slate-500 hover:bg-emerald-50 hover:text-emerald-800"><AdminIcon name="eye" size={16}/></button><Link aria-label={`Edit ${property.title}`} href={`/admin/properties/${property.id}/edit`} className="flex size-9 items-center justify-center rounded-lg text-slate-500 hover:bg-emerald-50 hover:text-emerald-800"><AdminIcon name="edit" size={16}/></Link><button type="button" aria-label={`Delete ${property.title}`} onClick={() => removeProperty(property)} className="flex size-9 items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-700"><AdminIcon name="trash" size={16}/></button></div></div></article>)}
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-5"><p>Showing {Math.min(filtered.length, (safePage - 1) * pageSize + 1)}–{Math.min(filtered.length, safePage * pageSize)} of {filtered.length} properties</p><div className="flex items-center gap-2"><button type="button" disabled={safePage === 1} onClick={() => setPage(safePage - 1)} className="rounded-lg border border-slate-200 px-3 py-2 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40">Previous</button><span className="px-1 font-semibold text-slate-700">{safePage} / {pageCount}</span><button type="button" disabled={safePage === pageCount} onClick={() => setPage(safePage + 1)} className="rounded-lg border border-slate-200 px-3 py-2 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40">Next</button></div></div>
      </>}
    </section>
    <PropertyPreview property={preview} onClose={() => setPreview(null)} />
  </>
}
