'use client'

import Image from 'next/image'
import Link from 'next/link'
import React, { useRef } from 'react'

export default function WeekendDeals({ deals = [] }) {
  const dealsRef = useRef(null)

  const moveDeals = (direction) => {
    const carousel = dealsRef.current
    if (!carousel) return
    const cardWidth = carousel.querySelector('article')?.getBoundingClientRect().width || 266
    carousel.scrollBy({ left: direction * (cardWidth + 16), behavior: 'smooth' })
  }

  return (
    <section aria-labelledby="weekend-deals-title" className="bg-white px-6 py-12 sm:px-10 lg:px-8 lg:py-14">
      <div className="mx-auto max-w-[1124px]">
        <h2 id="weekend-deals-title" className="text-[23px] font-bold leading-tight text-slate-900">Deals of the week</h2>
        <p className="mt-1 text-[15px] text-slate-600">Special prices on selected Gate Homes listings.</p>

        <div className="relative mt-4">
          <div ref={dealsRef} tabIndex={0} role="region" aria-label="Weekly property deals. Swipe or scroll horizontally to browse." className="flex touch-pan-x snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain scroll-smooth pb-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {deals.length === 0 ? <div className="w-full rounded-xl border border-dashed border-stone-300 bg-stone-50 px-5 py-10 text-center text-sm text-slate-600">No active weekly deals at the moment. Check back soon.</div> : deals.map((deal) => {
              const discountPercent = deal.originalPriceValue && deal.priceValue
                ? Math.round((1 - deal.priceValue / deal.originalPriceValue) * 100)
                : null

              return (
                <article key={deal.slug} className="card w-[266px] shrink-0 snap-start overflow-hidden rounded-xl border border-stone-200 bg-white shadow-none transition-shadow hover:shadow-md">
                  <Link href={`/properties/${deal.slug}`} aria-label={`View deal: ${deal.title}`} className="relative block h-[220px] bg-stone-100">
                    <Image src={deal.image} alt={deal.alt} fill sizes="266px" className="object-cover" />
                    {discountPercent > 0 && <span className="badge absolute left-3.5 top-3.5 h-7 rounded-md border-0 bg-emerald-900 px-3 text-[9px] font-bold uppercase tracking-[0.1em] text-white shadow-sm">{discountPercent}% OFF</span>}
                  </Link>
                  <div className="flex min-h-[190px] flex-col p-[18px] pt-4">
                    <h3 className="line-clamp-2 min-h-[44px] font-serif text-[19px] font-bold leading-snug text-slate-900"><Link href={`/properties/${deal.slug}`} className="hover:text-emerald-900">{deal.title}</Link></h3>
                    <p className="mt-2 flex items-center gap-2 text-[12px] text-slate-500">
                      <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s7-6.1 7-12a7 7 0 1 0-14 0c0 5.9 7 12 7 12Z"/><circle cx="12" cy="9" r="2"/></svg>
                      {deal.location}
                    </p>
                    <div className="mt-auto border-t border-stone-200 pt-3 text-right">
                      {deal.originalPrice && <p className="text-[11px] text-slate-400 line-through">{deal.originalPrice}</p>}
                      <p className="mt-1 text-[16px] font-extrabold text-slate-900">{deal.price}<span className="ml-1 text-[11px] font-normal text-slate-500">{deal.period}</span></p>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
          {deals.length > 1 && <button type="button" onClick={() => moveDeals(-1)} aria-label="Show previous weekly deals" className="absolute -left-4 top-[90px] flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-800 shadow-md transition hover:scale-105"><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg></button>}
          {deals.length > 1 && <button type="button" onClick={() => moveDeals(1)} aria-label="Show more weekly deals" className="absolute -right-4 top-[90px] flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-800 shadow-md transition hover:scale-105"><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg></button>}
        </div>
        {deals.length > 1 && <p className="mt-2 text-[11px] text-slate-400 md:hidden">Swipe left or use the arrows to browse more deals.</p>}
      </div>
    </section>
  )
}
