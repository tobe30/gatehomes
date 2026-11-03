'use client'

import { useRef } from 'react'
import Link from 'next/link'

function ReviewCard({ review }) {
  const initials = review.name.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase()

  return <article className="flex w-[min(88vw,390px)] shrink-0 snap-start flex-col rounded-2xl border border-stone-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)] transition duration-300 hover:-translate-y-1 hover:border-emerald-900/20 hover:shadow-[0_16px_36px_rgba(15,23,42,0.09)] sm:w-[calc(50%-10px)] sm:p-6 lg:w-[calc(33.333%-11px)]">
    <div className="flex items-center justify-between">
      <span aria-label={`${review.rating} out of 5 stars`} className="text-[15px] tracking-[0.13em] text-emerald-700">{'★'.repeat(review.rating)}<span className="text-stone-300">{'★'.repeat(5 - review.rating)}</span></span>
      <svg aria-hidden="true" width="31" height="27" viewBox="0 0 31 27" fill="none" className="text-emerald-100"><path d="M12.5 1C5 3.5 1 8 1 15.5V26h11V14H6c.4-3.6 2.8-6.4 7.4-8.5L12.5 1Zm16 0C21 3.5 17 8 17 15.5V26h11V14h-6c.4-3.6 2.8-6.4 7.4-8.5L28.5 1Z" fill="currentColor"/></svg>
    </div>
    <p className="mt-4 flex-1 text-[14px] leading-7 text-slate-700">“{review.comment}”</p>
    <div className="mt-6 flex items-center gap-3 border-t border-stone-100 pt-4">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold tracking-wide text-emerald-900">{initials}</span>
      <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-slate-900">{review.name}</p><p className="mt-1 truncate text-xs text-slate-500">{review.propertyTitle}</p></div>
      <Link href={`/properties/${review.propertySlug}`} aria-label={`View ${review.propertyTitle}`} className="shrink-0 text-xs font-semibold text-emerald-800 transition-colors hover:text-emerald-950">View listing <span aria-hidden="true">→</span></Link>
    </div>
  </article>
}

export default function TestimonialsCarousel({ reviews = [] }) {
  const trackRef = useRef(null)

  function move(direction) {
    const track = trackRef.current
    if (!track) return
    const cardWidth = track.querySelector('article')?.getBoundingClientRect().width || 350
    track.scrollBy({ left: direction * (cardWidth + 16), behavior: 'smooth' })
  }

  return <section id="testimonials" aria-labelledby="testimonials-title" className="bg-[#f6f6f0] px-5 py-14 sm:px-8 sm:py-16 lg:py-20">
    <div className="mx-auto max-w-[1116px]">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-900">Testimonials</p>
          <h2 id="testimonials-title" className="max-w-[720px] font-serif text-[30px] font-bold leading-tight tracking-[-0.035em] text-slate-900 sm:text-[38px]">What our satisfied clients are saying.</h2>
        </div>
        {reviews.length > 3 && <div className="hidden gap-2 sm:flex">
          <button type="button" onClick={() => move(-1)} aria-label="Previous testimonials" className="flex size-10 items-center justify-center rounded-full border border-stone-300 bg-white text-slate-700 transition hover:border-emerald-800 hover:text-emerald-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800"><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg></button>
          <button type="button" onClick={() => move(1)} aria-label="Next testimonials" className="flex size-10 items-center justify-center rounded-full border border-stone-300 bg-white text-slate-700 transition hover:border-emerald-800 hover:text-emerald-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800"><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg></button>
        </div>}
      </div>

      {reviews.length === 0 ? <div className="mt-7 rounded-2xl border border-dashed border-stone-300 bg-white px-5 py-9 text-center sm:py-11">
        <p className="font-serif text-lg font-semibold text-slate-900">Client stories are coming soon</p>
        <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-600">Approved reviews from Gate Homes clients will appear here.</p>
      </div> : <div ref={trackRef} tabIndex={0} role="region" aria-label="Client testimonials. Swipe or scroll horizontally to browse." className="mt-7 flex touch-pan-x snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain scroll-smooth pb-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-800 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden motion-reduce:scroll-auto">
        {reviews.map((review) => <ReviewCard key={review.id} review={review} />)}
      </div>}
      {reviews.length > 1 && <p className="mt-2 text-[11px] text-slate-500 sm:hidden">Swipe to read more client reviews.</p>}
    </div>
  </section>
}
