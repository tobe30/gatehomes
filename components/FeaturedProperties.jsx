import Image from 'next/image'
import React from 'react'
import Link from 'next/link'
import { properties } from '@/data/properties'

function Feature({ icon, children }) {
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
      <span aria-hidden="true" className="text-[12px] text-slate-500">{icon}</span>
      {children}
    </span>
  )
}

export default function FeaturedProperties() {
  return (
    <section id="listings" className="bg-[#fffefa] px-6 py-12 sm:px-10 sm:py-14 lg:px-8">
      <div className="mx-auto max-w-[1116px]">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-950">Featured</p>
            <h2 className="font-serif text-[32px] font-bold leading-tight tracking-[-0.035em] text-slate-900 sm:text-[40px]">Find the perfect property</h2>
          </div>
          <div className="mb-1 flex shrink-0 items-center gap-4">
            <p className="text-[12px] text-slate-500">6 listings</p>
            <Link href="/listings" className="text-[12px] font-semibold text-emerald-900 hover:text-emerald-700">View all listings →</Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <article key={property.title} className="card overflow-hidden rounded-xl border border-stone-200 bg-white shadow-none">
              <Link href={`/properties/${property.slug}`} aria-label={`View ${property.title}`} className="relative block h-[220px]">
                <Image src={property.image} alt={property.alt} fill sizes="(min-width: 1024px) 356px, (min-width: 768px) 50vw, 100vw" className="object-cover" />
                <span className="badge absolute left-3.5 top-3.5 h-7 rounded-md border-0 bg-white px-3 text-[9px] font-bold uppercase tracking-[0.1em] text-slate-900 shadow-sm">
                  {property.status}
                </span>
              </Link>

              <div className="p-[18px] pt-4">
                <h3 className="font-serif text-[19px] font-bold leading-snug text-slate-900"><Link href={`/properties/${property.slug}`} className="hover:text-emerald-900">{property.title}</Link></h3>
                <p className="mt-2 flex items-center gap-2 text-[12px] text-slate-500">
                  <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s7-6.1 7-12a7 7 0 1 0-14 0c0 5.9 7 12 7 12Z"/><circle cx="12" cy="9" r="2"/></svg>
                  {property.location}
                </p>
                <p className="mt-5 flex items-baseline gap-1.5 text-[16px] font-extrabold text-slate-900">
                  {property.price}<span className="text-[12px] font-normal text-slate-500">{property.period}</span>
                </p>
                <div className="mt-4 flex items-center gap-3 border-t border-stone-200 pt-3 text-[11px] text-slate-600">
                  {property.features.map((feature, index) => (
                    <Feature key={feature} icon={['▱', '♧', '⊞'][index]}>{feature}</Feature>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
