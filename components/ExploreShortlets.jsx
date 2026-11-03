'use client'

import Image from 'next/image'
import Link from 'next/link'
import React, { useRef } from 'react'

export default function ExploreShortlets({ properties = [] }) {
  const cardsRef = useRef(null)

  function moveCards(direction) {
    const carousel = cardsRef.current
    if (!carousel) return

    const cardWidth = carousel.querySelector('article')?.getBoundingClientRect().width || 300
    carousel.scrollBy({ left: direction * (cardWidth + 16), behavior: 'smooth' })
  }

  return (
    <section id="shortlets" aria-labelledby="shortlets-title" className="bg-white px-6 py-12 sm:px-10 lg:px-8 lg:py-14">
      <div className="mx-auto max-w-[1124px]">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 id="shortlets-title" className="text-[23px] font-bold leading-tight text-slate-900">Explore Airbnb/shortlet</h2>
            <p className="mt-1 text-[15px] text-slate-600">Browse homes and apartments across Lagos.</p>
          </div>
        </div>

        <div className="relative mt-5">
          <div ref={cardsRef} tabIndex={0} role="region" aria-label="Property listings. Swipe or scroll horizontally to browse." className="flex touch-pan-x snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain scroll-smooth pb-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {properties.length === 0 ? <div className="w-full rounded-xl border border-dashed border-stone-300 bg-stone-50 px-5 py-10 text-center text-sm text-slate-600">No shortlets are currently published. Please check back soon.</div> : properties.map((property) => (
              <article key={property.slug} className="card w-[280px] shrink-0 snap-start overflow-hidden rounded-xl border border-stone-200 bg-white shadow-none transition-shadow hover:shadow-md sm:w-[310px]">
                <Link href={`/properties/${property.slug}`} aria-label={`View ${property.title}`} className="relative block h-[190px] bg-stone-100">
                  <Image src={property.image} alt={property.alt} fill sizes="310px" className="object-cover transition-transform duration-300 hover:scale-[1.03]" />
                  <span className="badge absolute left-3.5 top-3.5 h-7 rounded-md border-0 bg-white px-3 text-[9px] font-bold uppercase tracking-[0.1em] text-slate-900 shadow-sm">{property.status}</span>
                </Link>

                <div className="flex min-h-[190px] flex-col p-[18px] pt-4">
                  <h3 className="line-clamp-2 min-h-[48px] font-serif text-[19px] font-bold leading-snug text-slate-900">
                    <Link href={`/properties/${property.slug}`} className="transition-colors hover:text-emerald-900">{property.title}</Link>
                  </h3>
                  <p className="mt-2 flex items-center gap-2 text-[12px] text-slate-500">
                    <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s7-6.1 7-12a7 7 0 1 0-14 0c0 5.9 7 12 7 12Z"/><circle cx="12" cy="9" r="2"/></svg>
                    {property.location}
                  </p>
                  <p className="mt-4 text-[16px] font-extrabold text-slate-900">
                    {property.price}<span className="ml-1 text-[12px] font-normal text-slate-500">{property.period}</span>
                  </p>
                  <div className="mt-auto flex flex-wrap gap-x-3 gap-y-2 border-t border-stone-200 pt-3 text-[11px] text-slate-600">
                    {property.features.slice(0, 3).map((feature) => <span key={feature}>{feature}</span>)}
                  </div>
                </div>
              </article>
            ))}
          </div>

          {properties.length > 1 && <button type="button" onClick={() => moveCards(-1)} aria-label="Show previous properties" className="absolute -left-4 top-[78px] flex size-10 items-center justify-center rounded-full bg-white text-slate-800 shadow-md transition hover:scale-105 focus-visible:outline-2 focus-visible:outline-emerald-800">
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>}
          {properties.length > 1 && <button type="button" onClick={() => moveCards(1)} aria-label="Show more properties" className="absolute -right-4 top-[78px] flex size-10 items-center justify-center rounded-full bg-white text-slate-800 shadow-md transition hover:scale-105 focus-visible:outline-2 focus-visible:outline-emerald-800">
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </button>}
        </div>
        {properties.length > 1 && <p className="mt-2 text-[11px] text-slate-400 md:hidden">Swipe or scroll to browse more listings.</p>}
        <div className="mt-5 text-center">
          <Link href="/listings" className="inline-flex min-h-11 items-center justify-center rounded-lg border border-emerald-900 px-5 py-2.5 text-sm font-semibold text-emerald-900 transition-colors hover:bg-emerald-900 hover:text-white">View all listings <span aria-hidden="true" className="ml-2">→</span></Link>
        </div>
      </div>
    </section>
  )
}
