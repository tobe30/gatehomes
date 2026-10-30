'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { properties } from '@/data/properties'

function PropertyCard({ property }) {
  return (
    <article className="card overflow-hidden rounded-xl border border-stone-200 bg-white shadow-none transition-shadow hover:shadow-md">
      <Link href={`/properties/${property.slug}`} aria-label={`View ${property.title}`} className="relative block h-[220px]">
        <Image src={property.image} alt={property.alt} fill sizes="(min-width: 1024px) 356px, (min-width: 640px) 50vw, 100vw" className="object-cover" />
        <span className="badge absolute left-3.5 top-3.5 h-7 rounded-md border-0 bg-white px-3 text-[9px] font-bold uppercase tracking-[0.1em] text-slate-900 shadow-sm">
          {property.status}
        </span>
      </Link>
      <div className="p-[18px] pt-4">
        <h2 className="font-serif text-[19px] font-bold leading-snug text-slate-900"><Link href={`/properties/${property.slug}`} className="hover:text-emerald-900">{property.title}</Link></h2>
        <p className="mt-2 flex items-center gap-2 text-[12px] text-slate-500">
          <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s7-6.1 7-12a7 7 0 1 0-14 0c0 5.9 7 12 7 12Z"/><circle cx="12" cy="9" r="2"/></svg>
          {property.location}
        </p>
        <p className="mt-5 flex items-baseline gap-1.5 text-[16px] font-extrabold text-slate-900">
          {property.price}<span className="text-[12px] font-normal text-slate-500">{property.period}</span>
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-stone-200 pt-3 text-[11px] text-slate-600">
          {property.features.map((feature, index) => (
            <span key={feature} className="inline-flex items-center gap-1.5 whitespace-nowrap">
              <span aria-hidden="true" className="text-[12px] text-slate-500">{['▱', '♧', '⊞'][index]}</span>{feature}
            </span>
          ))}
        </div>
        <Link href={`/properties/${property.slug}`} className="mt-5 inline-flex w-full items-center justify-center rounded-lg bg-emerald-800 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-900">
          Enquire about this property
        </Link>
      </div>
    </article>
  )
}

export default function ListingsCatalog({ initialQuery = '' }) {
  const [query, setQuery] = useState(initialQuery)
  const [status, setStatus] = useState('all')
  const [area, setArea] = useState('all')
  const [sort, setSort] = useState('featured')

  const filteredProperties = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    const results = properties.filter((property) => {
      const matchesQuery = !normalizedQuery || `${property.title} ${property.location}`.toLowerCase().includes(normalizedQuery)
      const matchesStatus = status === 'all' || property.status.toLowerCase() === status
      const matchesArea = area === 'all' || property.location.toLowerCase().includes(area)
      return matchesQuery && matchesStatus && matchesArea
    })

    if (sort === 'price-low') results.sort((a, b) => (a.priceValue ?? Infinity) - (b.priceValue ?? Infinity))
    if (sort === 'price-high') results.sort((a, b) => (b.priceValue ?? -Infinity) - (a.priceValue ?? -Infinity))
    return results
  }, [query, status, area, sort])

  function clearFilters() {
    setQuery('')
    setStatus('all')
    setArea('all')
    setSort('featured')
  }

  return (
    <main className="flex-1 bg-[#fffefa]">
      <section className="border-b border-stone-200 bg-[#f6f6f0] px-5 py-12 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-[1116px]">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-900">Gate Homes listings</p>
          <h1 className="font-serif text-[34px] font-bold leading-tight tracking-[-0.035em] text-slate-900 sm:text-[44px]">Find the perfect property</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Browse homes, apartments, and investment properties in Lagos. Filter by location and listing type to find the right fit.
          </p>

          <div className="mt-8 grid gap-3 rounded-xl border border-stone-200 bg-white p-3 shadow-sm sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_auto]">
            <label className="flex min-h-12 items-center gap-3 rounded-lg border border-stone-200 bg-stone-50 px-3.5 focus-within:border-emerald-800">
              <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>
              <span className="sr-only">Search location or property</span>
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search location or property" className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-500" />
            </label>
            <label className="flex min-h-12 items-center rounded-lg border border-stone-200 bg-stone-50 px-3.5">
              <span className="sr-only">Listing type</span>
              <select value={status} onChange={(event) => setStatus(event.target.value)} className="w-full bg-transparent text-sm text-slate-700 outline-none">
                <option value="all">Buy or rent</option><option value="for sale">For sale</option><option value="for rent">For rent</option>
              </select>
            </label>
            <label className="flex min-h-12 items-center rounded-lg border border-stone-200 bg-stone-50 px-3.5">
              <span className="sr-only">Location</span>
              <select value={area} onChange={(event) => setArea(event.target.value)} className="w-full bg-transparent text-sm text-slate-700 outline-none">
                <option value="all">All Lagos locations</option><option value="lekki">Lekki</option><option value="ikoyi">Ikoyi</option><option value="ajah">Ajah</option><option value="oniru">Oniru</option><option value="ologolo">Ologolo</option>
              </select>
            </label>
            <button type="button" onClick={clearFilters} className="min-h-12 rounded-lg bg-emerald-800 px-5 text-sm font-semibold text-white transition-colors hover:bg-emerald-900">Clear filters</button>
          </div>
        </div>
      </section>

      <section className="px-5 py-10 sm:px-8 sm:py-12">
        <div className="mx-auto max-w-[1116px]">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-serif text-2xl font-bold text-slate-900">Available properties</h2>
              <p className="mt-1 text-sm text-slate-500">{filteredProperties.length} {filteredProperties.length === 1 ? 'property' : 'properties'} found</p>
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-600">
              Sort by
              <select value={sort} onChange={(event) => setSort(event.target.value)} className="select select-bordered select-sm rounded-lg border-stone-300 bg-white text-slate-800">
                <option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option>
              </select>
            </label>
          </div>

          {filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProperties.map((property) => <PropertyCard key={property.title} property={property} />)}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-stone-300 bg-white px-5 py-14 text-center">
              <h3 className="font-serif text-xl font-semibold text-slate-900">No matching properties yet</h3>
              <p className="mt-2 text-sm text-slate-600">Try another location or clear the filters to see all available listings.</p>
              <button type="button" onClick={clearFilters} className="mt-5 rounded-lg bg-emerald-800 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-900">Show all properties</button>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
