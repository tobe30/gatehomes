'use client'

import Image from 'next/image'
import Link from 'next/link'
import React, { useRef } from 'react'

const destinations = [
  { name: 'Osapa London', image: '/location-osapa-london.jpg', alt: 'Residential home in Osapa London, Lekki, Lagos' },
  { name: 'Victoria Island', image: '/oniru-serviced-apartment.jpg', alt: 'Serviced apartment in Oniru, Victoria Island, Lagos' },
  { name: 'Ikoyi', image: '/location-ikoyi.jpg', alt: 'Residential skyline in Ikoyi, Lagos' },
  { name: 'Lekki Phase 1', image: '/location-lekki-phase-1.jpg', alt: 'Residential street in Lekki Phase 1, Lagos' },
  { name: 'Ajah', image: '/location-ajah.jpg', alt: 'Apartment building in Ajah, Lagos' },
  { name: 'Ikota', image: '/location-ikota.jpg', alt: 'Apartments in Ikota, Lekki, Lagos' },
]

export default function ExploreShortlets() {
  const destinationsRef = useRef(null)

  const showNextDestinations = () => {
    destinationsRef.current?.scrollBy({ left: 375, behavior: 'smooth' })
  }

  return (
    <section id="shortlets" aria-labelledby="shortlets-title" className="bg-white px-6 py-12 sm:px-10 lg:px-8 lg:py-14">
      <div className="mx-auto max-w-[1124px]">
        <h2 id="shortlets-title" className="text-[23px] font-bold leading-tight text-slate-900">Explore Airbnb/shortlet</h2>
        <p className="mt-1 text-[15px] text-slate-600">These popular destinations have a lot to offer</p>

        <div className="relative mt-4">
          <div ref={destinationsRef} className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {destinations.map((destination) => (
              <Link
                key={destination.name}
                href={`/listings?destination=${encodeURIComponent(destination.name)}`}
                className="w-[171px] shrink-0 snap-start rounded-lg text-slate-900 outline-offset-4 focus-visible:outline-2 focus-visible:outline-emerald-800"
                aria-label={`Browse properties in ${destination.name}`}
              >
                <div className="relative h-[137px] overflow-hidden rounded-lg bg-stone-100">
                  <Image src={destination.image} alt={destination.alt} fill sizes="171px" className="object-cover transition-transform duration-300 hover:scale-105" />
                </div>
                <h3 className="mt-3 text-[15px] font-bold leading-tight">{destination.name}</h3>
                <p className="mt-1 text-[13px] text-slate-600">Lagos, Nigeria</p>
              </Link>
            ))}
          </div>
          <button type="button" onClick={showNextDestinations} aria-label="Show more destinations" className="absolute -right-4 top-[51px] flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-800 shadow-md transition hover:scale-105">
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
          </button>
        </div>
      </div>
    </section>
  )
}
